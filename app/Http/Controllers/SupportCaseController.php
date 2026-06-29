<?php
namespace App\Http\Controllers;

use App\Models\SupportCase;
use App\Models\CaseVolunteer;
use App\Models\CaseAdoption;
use App\Models\CaseUpdate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupportCaseController extends Controller
{
    public function index(Request $request)
    {
        $query = SupportCase::approved()
            ->whereIn('status', ['open', 'adopted'])
            ->when($request->need, fn($q) => $q->whereJsonContains('needs', $request->need))
            ->latest();

        $counts = [
            'open'     => SupportCase::approved()->open()->count(),
            'adopted'  => SupportCase::approved()->adopted()->count(),
            'resolved' => SupportCase::approved()->resolved()->count(),
        ];

        return Inertia::render('Casos/Index', [
            'cases'   => $query->paginate(12)->withQueryString(),
            'filters' => $request->only(['need']),
            'counts'  => $counts,
        ]);
    }

    public function create()
    {
        return Inertia::render('Casos/Publicar');
    }

    public function store(Request $request)
    {
        $request->validate([
            'family_name'   => 'required|string|max:200',
            'description'   => 'required|string|max:2000',
            'needs'         => 'required|array|min:1',
            'needs.*'       => 'string|max:100',
            'zone'          => 'required|string|max:200',
            'state'         => 'required|string|max:100',
            'people_count'  => 'required|integer|min:1|max:50',
            'has_children'  => 'boolean',
            'has_elderly'   => 'boolean',
            'contact_phone' => 'required|string|max:30',
            'is_anonymous'  => 'boolean',
            'photo_path'    => 'nullable|string|max:500',
        ]);

        SupportCase::create(array_merge($request->all(), [
            'validation_status' => 'approved',
            'status'            => 'open',
        ]));

        return redirect('/casos')->with('success', '¡Caso publicado! Ya está visible para los voluntarios.');
    }

    public function show(SupportCase $supportCase)
    {
        $supportCase->load(['updates' => fn($q) => $q->oldest(), 'adoption.volunteer']);

        // contact_phone es privado: solo se revela en la sesion flash tras adoptar
        $caseData = $supportCase->toArray();
        unset($caseData['contact_phone']);

        return Inertia::render('Casos/Show', [
            'supportCase' => $caseData,
        ]);
    }

    public function adopt(Request $request, SupportCase $supportCase)
    {
        $request->validate([
            'volunteer_phone' => 'required|string|max:30',
            'message'         => 'nullable|string|max:1000',
        ]);

        $volunteer = CaseVolunteer::where('phone', $request->volunteer_phone)
            ->where('validation_status', 'approved')
            ->first();

        if (! $volunteer) {
            return back()->withErrors(['volunteer_phone' => 'No se encontro un voluntario aprobado con ese numero de telefono. Registrate primero en la seccion de voluntarios.']);
        }

        if ($supportCase->status !== 'open') {
            return back()->withErrors(['supportCase' => 'Este caso ya fue adoptado por otro voluntario.']);
        }

        CaseAdoption::create([
            'support_case_id'   => $supportCase->id,
            'case_volunteer_id' => $volunteer->id,
            'message'           => $request->message,
            'status'            => 'active',
        ]);

        $supportCase->update([
            'status'     => 'adopted',
            'adopted_at' => now(),
        ]);

        return back()->with('contact_phone', $supportCase->contact_phone);
    }

    public function addUpdate(Request $request, SupportCase $supportCase)
    {
        $request->validate([
            'author_name' => 'required|string|max:200',
            'content'     => 'required|string|max:2000',
        ]);

        CaseUpdate::create([
            'support_case_id' => $supportCase->id,
            'author_name'     => $request->author_name,
            'author_type'     => 'family',
            'content'         => $request->content,
        ]);

        return back()->with('success', 'Actualizacion publicada.');
    }
}
