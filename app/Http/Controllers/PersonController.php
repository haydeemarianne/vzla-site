<?php

namespace App\Http\Controllers;

use App\Models\MissingChild;
use App\Services\DuplicateDetectionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PersonController extends Controller
{
    public function __construct(private DuplicateDetectionService $duplicateService) {}

    public function index(Request $request)
    {
        $type = in_array($request->type, ['child', 'adult', 'deceased']) ? $request->type : 'child';

        $query = MissingChild::where('validation_status', 'approved')
            ->where('type', $type)
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->search, fn($q) => $q->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('zone', 'like', "%{$request->search}%")
                  ->orWhere('state', 'like', "%{$request->search}%")
                  ->orWhere('cedula', 'like', "%{$request->search}%");
            }))
            ->latest();

        return Inertia::render('Personas/Index', [
            'persons' => $query->paginate(20)->withQueryString(),
            'filters' => $request->only(['type', 'status', 'search']),
            'stats'   => [
                'children'  => MissingChild::approved()->where('type', 'child')->where('status', 'missing')->count(),
                'adults'    => MissingChild::approved()->where('type', 'adult')->where('status', 'missing')->count(),
                'deceased'  => MissingChild::approved()->where('type', 'deceased')->count(),
                'found'     => MissingChild::approved()->whereIn('type', ['child', 'adult'])->where('status', 'found')->count(),
            ],
        ]);
    }

    public function create(Request $request)
    {
        $type = in_array($request->type, ['child', 'adult', 'deceased']) ? $request->type : 'child';
        return Inertia::render('Personas/Registrar', ['defaultType' => $type]);
    }

    public function store(Request $request)
    {
        $type = $request->input('type', 'child');
        $isDeceased = $type === 'deceased';

        $data = $request->validate([
            'type'             => 'required|in:child,adult,deceased',
            'name'             => 'required|string|max:200',
            'cedula'           => 'nullable|string|max:20',
            'age'              => $type === 'child'
                ? 'nullable|integer|min:0|max:17'
                : 'nullable|integer|min:0|max:120',
            'gender'           => 'nullable|in:male,female,unknown',
            'description'      => 'nullable|string|max:1000',
            'photo'            => 'nullable|image|max:5120',
            'zone'             => 'required|string|max:200',
            'state'            => 'nullable|string|max:100',
            'last_seen_place'  => 'nullable|string|max:300',
            'found_location'   => 'nullable|string|max:300',
            'cause_of_death'   => 'nullable|string|max:300',
            'reporter_name'    => 'required|string|max:200',
            'reporter_phone'   => 'required|string|max:30',
            'reporter_relation'=> 'nullable|string|max:100',
        ]);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('persons', 'public');
        }

        $person = MissingChild::create(array_merge($data, [
            'photo_path' => $photoPath,
            'status'     => $isDeceased ? 'deceased' : 'missing',
        ]));

        if ($isDeceased) {
            $person->update(['validation_status' => 'approved']);
        } else {
            $duplicate = $this->duplicateService->checkMissingChild($person);

            if ($duplicate['score'] >= 80) {
                $person->update([
                    'validation_status'     => 'duplicate',
                    'duplicate_score'       => $duplicate['score'],
                    'possible_duplicate_of' => $duplicate['id'] ?? null,
                ]);
            } elseif ($duplicate['score'] >= 50) {
                $person->update([
                    'validation_status'     => 'pending',
                    'duplicate_score'       => $duplicate['score'],
                    'possible_duplicate_of' => $duplicate['id'] ?? null,
                ]);
            } else {
                $person->update(['validation_status' => 'approved']);
            }
        }

        $redirect = match($type) {
            'adult'    => '/personas?type=adult',
            'deceased' => '/personas?type=deceased',
            default    => '/personas?type=child',
        };

        return redirect($redirect)->with('success', 'Reporte recibido. Gracias por ayudar.');
    }

    public function show(MissingChild $person)
    {
        abort_if($person->validation_status === 'rejected', 404);
        return Inertia::render('Personas/Show', ['person' => $person]);
    }

    public function safeCreate()
    {
        return Inertia::render('Personas/Salvo');
    }

    public function safeStore(Request $request)
    {
        $data = $request->validate([
            'name'          => 'required|string|max:200',
            'cedula'        => 'nullable|string|max:20',
            'age'           => 'nullable|integer|min:0|max:120',
            'state'         => 'nullable|string|max:100',
            'zone'          => 'required|string|max:200',
            'contact_phone' => 'nullable|string|max:30',
            'photo'         => 'nullable|image|max:5120',
        ]);

        // 1. Buscar por cedula exacta
        $match = null;
        if (!empty($data['cedula'])) {
            $match = MissingChild::approved()
                ->where('status', 'missing')
                ->where('cedula', $data['cedula'])
                ->first();
        }

        // 2. Buscar por nombre similar si no hay cedula
        if (!$match) {
            $candidates = MissingChild::approved()
                ->where('status', 'missing')
                ->whereIn('type', ['child', 'adult'])
                ->get(['id', 'name']);

            $bestScore = 0;
            $bestId    = null;

            foreach ($candidates as $candidate) {
                similar_text(
                    mb_strtolower($data['name']),
                    mb_strtolower($candidate->name),
                    $percent
                );
                if ($percent > $bestScore) {
                    $bestScore = $percent;
                    $bestId    = $candidate->id;
                }
            }

            if ($bestScore >= 80) {
                $match = MissingChild::find($bestId);
            }
        }

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('persons', 'public');
        }

        if ($match) {
            $match->update(array_filter([
                'status'         => 'found',
                'found_location' => $data['zone'],
                'contact_phone'  => $data['contact_phone'] ?? null,
                'photo_path'     => $photoPath ?? $match->photo_path,
                'notes'          => 'A salvo — confirmado por la persona o su familia. ' . ($match->notes ?? ''),
            ]));

            return redirect('/personas?type=' . $match->type . '&status=found')
                ->with('success', '¡Registro actualizado! La familia puede ver que esta a salvo.');
        }

        // Sin coincidencia — crear registro nuevo como "a salvo"
        $type = isset($data['age']) && $data['age'] < 18 ? 'child' : 'adult';

        MissingChild::create([
            'type'              => $type,
            'name'              => $data['name'],
            'cedula'            => $data['cedula'] ?? null,
            'age'               => $data['age'] ?? null,
            'zone'              => $data['zone'],
            'state'             => $data['state'] ?? 'La Guaira (Vargas)',
            'found_location'    => $data['zone'],
            'contact_phone'     => $data['contact_phone'] ?? null,
            'photo_path'        => $photoPath,
            'status'            => 'found',
            'reporter_name'     => $data['name'],
            'reporter_phone'    => $data['contact_phone'] ?? 'No proporcionado',
            'validation_status' => 'approved',
            'notes'             => 'Persona a salvo — registrada directamente por ella misma o un familiar.',
        ]);

        return redirect('/personas?type=' . $type . '&status=found')
            ->with('success', 'Registrado como a salvo. Tu familia puede encontrarte buscando tu nombre.');
    }
}
