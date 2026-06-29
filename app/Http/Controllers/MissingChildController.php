<?php
namespace App\Http\Controllers;

use App\Models\MissingChild;
use App\Services\DuplicateDetectionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MissingChildController extends Controller
{
    public function __construct(private DuplicateDetectionService $duplicateService) {}

    public function index(Request $request)
    {
        $query = MissingChild::where('validation_status', 'approved')
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->zone, fn($q) => $q->where('zone', 'like', "%{$request->zone}%"))
            ->when($request->search, fn($q) => $q->where('name', 'like', "%{$request->search}%"))
            ->latest();

        return Inertia::render('Ninos/Index', [
            'children' => $query->paginate(20)->withQueryString(),
            'filters'  => $request->only(['status', 'zone', 'search']),
            'stats'    => [
                'missing' => MissingChild::approved()->missing()->count(),
                'found'   => MissingChild::approved()->found()->count(),
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Ninos/Reportar');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'             => 'required|string|max:200',
            'age'              => 'nullable|integer|min:0|max:17',
            'gender'           => 'nullable|in:male,female,unknown',
            'description'      => 'nullable|string|max:1000',
            'photo'            => 'nullable|image|max:5120',
            'zone'             => 'required|string|max:200',
            'state'            => 'nullable|string|max:100',
            'last_seen_place'  => 'nullable|string|max:300',
            'reporter_name'    => 'required|string|max:200',
            'reporter_phone'   => 'required|string|max:30',
            'reporter_relation'=> 'nullable|string|max:100',
        ]);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('children', 'public');
        }

        $child = MissingChild::create(array_merge($data, [
            'photo_path' => $photoPath,
            'status'     => 'missing',
        ]));

        $duplicate = $this->duplicateService->checkMissingChild($child);

        if ($duplicate['score'] >= 80) {
            $child->update([
                'validation_status'    => 'duplicate',
                'duplicate_score'      => $duplicate['score'],
                'possible_duplicate_of'=> $duplicate['id'] ?? null,
            ]);
        } elseif ($duplicate['score'] >= 50) {
            $child->update([
                'validation_status' => 'pending',
                'duplicate_score'   => $duplicate['score'],
                'possible_duplicate_of' => $duplicate['id'] ?? null,
            ]);
        } else {
            $child->update(['validation_status' => 'approved']);
        }

        return redirect('/ninos')->with('success', 'Reporte recibido. Gracias por ayudar.');
    }

    public function foundCreate()
    {
        return Inertia::render('Ninos/Encontrado');
    }

    public function foundStore(Request $request)
    {
        $data = $request->validate([
            'name'          => 'required|string|max:200',
            'age'           => 'nullable|integer|min:0|max:17',
            'gender'        => 'nullable|in:male,female,unknown',
            'description'   => 'required|string|max:1000',
            'photo'         => 'nullable|image|max:5120',
            'zone'          => 'required|string|max:200',
            'reporter_name' => 'required|string|max:200',
            'reporter_phone'=> 'required|string|max:30',
        ]);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('children', 'public');
        }

        $child = MissingChild::create(array_merge($data, [
            'photo_path'       => $photoPath,
            'status'           => 'found',
            'validation_status'=> 'approved',
        ]));

        return redirect('/ninos?status=found')->with('success', 'Niño/a encontrado registrado. Gracias.');
    }

    public function show(MissingChild $child)
    {
        abort_if($child->validation_status === 'rejected', 404);
        return Inertia::render('Ninos/Show', ['child' => $child]);
    }
}
