<?php
namespace App\Http\Controllers;

use App\Models\SupportCase;
use App\Models\CaseTask;
use App\Models\CaseUpdate;
use Illuminate\Http\Request;
use Inertia\Inertia;

const NEED_TASK_TITLES = [
    'food'      => 'Llevar alimentos',
    'water'     => 'Proveer agua potable',
    'medicine'  => 'Conseguir medicamentos',
    'shelter'   => 'Apoyo con refugio',
    'clothing'  => 'Llevar ropa y calzado',
    'baby'      => 'Artículos para bebé',
    'tools'     => 'Conseguir herramientas',
    'documents' => 'Apoyo con documentos',
    'furniture' => 'Conseguir mobiliario',
    'other'     => 'Apoyo adicional',
];

class SupportCaseController extends Controller
{
    public function index(Request $request)
    {
        $base = SupportCase::approved()->with('tasks')->latest();

        return Inertia::render('Casos/Index', [
            'by_status' => [
                'open'     => (clone $base)->open()->get(),
                'adopted'  => (clone $base)->adopted()->get(),
                'resolved' => (clone $base)->resolved()->get(),
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
            'state'         => 'required|string|max:100',
            'people_count'  => 'required|integer|min:1|max:50',
            'has_children'  => 'boolean',
            'has_elderly'   => 'boolean',
            'contact_phone' => 'required|string|max:30',
            'photo_path'    => 'nullable|string|max:500',
        ]);

        $case = SupportCase::create(array_merge($request->all(), [
            'validation_status' => 'approved',
            'status'            => 'open',
            'is_anonymous'      => false,
        ]));

        // Auto-create one task per need
        foreach ($request->needs as $need) {
            $case->tasks()->create([
                'need_key' => $need,
                'title'    => NEED_TASK_TITLES[$need] ?? 'Apoyo adicional',
                'status'   => 'pending',
            ]);
        }

        return redirect('/casos')->with('success', '¡Caso publicado! Ya está visible para los voluntarios.');
    }

    public function show(SupportCase $supportCase)
    {
        $supportCase->load(['updates' => fn($q) => $q->oldest(), 'tasks']);

        $caseData = $supportCase->toArray();
        unset($caseData['contact_phone']);

        return Inertia::render('Casos/Show', [
            'supportCase' => $caseData,
            'tasks'       => $supportCase->tasks()->orderBy('id')->get(),
        ]);
    }

    public function claimTask(Request $request, SupportCase $supportCase, CaseTask $task)
    {
        if ($task->status !== 'pending') {
            return back()->withErrors(['task' => 'Esta tarea ya fue tomada.']);
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
            'content'         => $request->content,
        ]);

        return back()->with('success', 'Actualización publicada.');
    }
}
