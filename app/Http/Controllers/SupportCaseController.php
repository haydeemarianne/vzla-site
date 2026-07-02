<?php
namespace App\Http\Controllers;

use App\Models\SupportCase;
use App\Models\CaseTask;
use App\Models\CaseUpdate;
use App\Models\CaseAdoption;
use Illuminate\Http\Request;
use Inertia\Inertia;

const NEED_TASK_TITLES = [
    'food'         => 'Llevar alimentos',
    'water'        => 'Proveer agua potable',
    'medicine'     => 'Conseguir medicamentos',
    'medical_care' => 'Gestionar atención médica',
    'shelter'      => 'Apoyo con refugio',
    'clothing'     => 'Llevar ropa y calzado',
    'hygiene'      => 'Proveer artículos de higiene',
    'baby'         => 'Artículos para bebé',
    'construction' => 'Conseguir materiales de construcción',
    'cleaning'     => 'Apoyar con limpieza y desinfección',
    'transport'    => 'Gestionar transporte',
    'electricity'  => 'Apoyo con electricidad o planta',
    'tools'        => 'Conseguir herramientas',
    'documents'    => 'Apoyo con documentos',
    'furniture'    => 'Conseguir mobiliario',
    'emotional'    => 'Brindar apoyo emocional',
    'other'        => 'Apoyo adicional',
];

class SupportCaseController extends Controller
{
    public function index(Request $request)
    {
        $base = SupportCase::approved()->with('tasks')->latest();

        return Inertia::render('Casos/Index', [
            'by_status' => [
                'open'      => (clone $base)->open()->get(),
                'in_review' => (clone $base)->inReview()->get(),
                'adopted'   => (clone $base)->adopted()->get(),
                'resolved'  => (clone $base)->resolved()->get(),
                'rejected'  => (clone $base)->rejected()->get(),
            ],
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
            'city'          => 'nullable|string|max:100',
            'state'         => 'required|string|max:100',
            'people_count'  => 'required|integer|min:1|max:50',
            'has_children'  => 'boolean',
            'has_elderly'   => 'boolean',
            'has_risk'      => 'boolean',
            'contact_phone' => 'required|string|max:30',
            'photo'         => 'nullable|image|max:5120',
        ]);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('cases', 'public');
        }

        $case = SupportCase::create([
            'family_name'       => $request->family_name,
            'description'       => $request->description,
            'needs'             => $request->needs,
            'zone'              => $request->zone,
            'city'              => $request->city,
            'state'             => $request->state,
            'people_count'      => $request->people_count,
            'has_children'      => $request->boolean('has_children'),
            'has_elderly'       => $request->boolean('has_elderly'),
            'has_risk'          => $request->boolean('has_risk'),
            'contact_phone'     => $request->contact_phone,
            'photo_path'        => $photoPath,
            'validation_status' => 'pending',
            'status'            => 'open',
            'is_anonymous'      => false,
        ]);

        // Auto-create one task per need
        foreach ($request->needs as $need) {
            $case->tasks()->create([
                'need_key' => $need,
                'title'    => NEED_TASK_TITLES[$need] ?? 'Apoyo adicional',
                'status'   => 'pending',
            ]);
        }

        return redirect("/casos/{$case->id}")->with('success', '¡Caso recibido! El equipo lo revisará pronto.');
    }

    public function show(SupportCase $supportCase)
    {
        $supportCase->load(['updates' => fn($q) => $q->oldest(), 'tasks', 'adoption.volunteer']);

        $caseData = $supportCase->toArray();
        unset($caseData['contact_phone']);

        $adoption = $supportCase->adoption;

        $hasActiveSponsor = CaseAdoption::where('support_case_id', $supportCase->id)
            ->where('status', 'active')
            ->exists();

        return Inertia::render('Casos/Show', [
            'supportCase'      => $caseData,
            'tasks'            => $supportCase->tasks()->orderBy('id')->get(),
            'hasActiveSponsor' => $hasActiveSponsor,
            'adoption'         => $adoption ? [
                'id'             => $adoption->id,
                'status'         => $adoption->status,
                'volunteer_name' => $adoption->volunteer?->name,
                'volunteer_phone'=> $adoption->volunteer?->phone,
            ] : null,
        ]);
    }

    public function claimTask(Request $request, SupportCase $supportCase, CaseTask $task)
    {
        if ($task->status !== 'pending') {
            return back()->withErrors(['task' => 'Esta tarea ya fue tomada.']);
        }

        $hasActiveSponsor = CaseAdoption::where('support_case_id', $supportCase->id)
            ->where('status', 'active')
            ->exists();

        if (!$hasActiveSponsor) {
            return back()->withErrors(['task' => 'Este caso necesita al menos un padrino aprobado antes de poder tomar tareas.']);
        }

        $request->validate([
            'volunteer_name'  => 'required|string|max:100',
            'volunteer_phone' => 'required|string|max:30',
        ]);

        $task->update([
            'status'          => 'claimed',
            'volunteer_name'  => $request->volunteer_name,
            'volunteer_phone' => $request->volunteer_phone,
        ]);

        $supportCase->syncStatusFromTasks();

        return back()->with('success', "¡Listo! Quedaste encargado de: {$task->title}");
    }

    public function addTask(Request $request, SupportCase $supportCase)
    {
        if (! session('is_admin')) {
            abort(403);
        }

        $request->validate([
            'title'       => 'required|string|max:200',
            'description' => 'nullable|string|max:500',
        ]);

        $supportCase->tasks()->create([
            'need_key'    => 'custom',
            'title'       => $request->title,
            'description' => $request->description,
            'status'      => 'pending',
        ]);

        return back()->with('success', 'Tarea agregada al caso.');
    }

    public function completeTask(Request $request, SupportCase $supportCase, CaseTask $task)
    {
        $task->update([
            'status'       => 'done',
            'completed_at' => now(),
        ]);

        $supportCase->syncStatusFromTasks();

        return back()->with('success', '¡Tarea completada! Gracias por tu ayuda.');
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
            'content'         => $request->input('content'),
        ]);

        return back()->with('success', 'Actualización publicada.');
    }
}
