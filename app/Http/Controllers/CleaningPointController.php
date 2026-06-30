<?php

namespace App\Http\Controllers;

use App\Models\CleaningPoint;
use App\Models\CleaningPointVolunteer;
use Illuminate\Http\Request;
use Inertia\Inertia;

// Tareas predefinidas por tipo de punto
const CLEANING_TASKS = [
    'domestic' => [
        'Identificar zonas de acumulación',
        'Reunir bolsas y herramientas',
        'Recolectar desechos',
        'Transportar a punto de recolección',
        'Limpiar y desinfectar área',
        'Verificar y cerrar jornada',
    ],
    'debris' => [
        'Evaluar seguridad estructural',
        'Separar materiales reutilizables',
        'Retirar escombros pesados',
        'Limpiar perímetro',
        'Verificar acceso seguro',
        'Fotografiar resultado y cerrar',
    ],
    'both' => [
        'Evaluar área y dividir equipo',
        'Equipo A: retirar escombros',
        'Equipo B: recolectar desechos',
        'Transporte de material',
        'Limpieza y desinfección',
        'Verificar y cerrar jornada',
    ],
];

class CleaningPointController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Limpieza/Index', [
            'by_status' => [
                'pending'    => CleaningPoint::pending()->latest()->get(),
                'in_process' => CleaningPoint::inProcess()->latest()->get(),
                'resolved'   => CleaningPoint::resolved()->latest()->get(),
            ],
        ]);
    }

    public function show(CleaningPoint $cleaningPoint)
    {
        $cleaningPoint->load('volunteers');
        $tasks = CLEANING_TASKS[$cleaningPoint->type] ?? CLEANING_TASKS['domestic'];

        return Inertia::render('Limpieza/Show', [
            'point'      => $cleaningPoint,
            'volunteers' => $cleaningPoint->volunteers()->latest()->get(),
            'tasks'      => $tasks,
        ]);
    }

    public function create()
    {
        return Inertia::render('Limpieza/Reportar');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'zone_name'      => 'required|string|max:200',
            'city'           => 'nullable|string|max:100',
            'state'          => 'nullable|string|max:100',
            'address'        => 'nullable|string|max:300',
            'type'           => 'required|in:domestic,debris,both',
            'volume'         => 'required|in:low,medium,high',
            'photo'          => 'required|image|max:10240',
            'reporter_name'  => 'required|string|max:200',
            'reporter_phone' => 'required|string|max:30',
            'notes'          => 'nullable|string|max:1000',
        ]);

        $photoPath = $request->file('photo')->store('cleaning', 'public');

        CleaningPoint::create(array_merge($data, ['photo_path' => $photoPath]));

        return redirect('/limpieza')->with('success', 'Punto de limpieza reportado. Gracias.');
    }

    public function volunteer(Request $request, CleaningPoint $cleaningPoint)
    {
        if ($cleaningPoint->status === 'resolved') {
            return back()->with('error', 'Este punto ya fue resuelto.');
        }

        $data = $request->validate([
            'name'    => 'required|string|max:100',
            'phone'   => 'required|string|max:30',
            'address' => 'nullable|string|max:200',
        ]);

        $volunteer = $cleaningPoint->volunteers()->create($data);
        $cleaningPoint->increment('helpers_count');

        if ($cleaningPoint->status === 'pending') {
            $cleaningPoint->update(['status' => 'in_process']);
        }

        return redirect("/limpieza/{$cleaningPoint->id}")
            ->with('success', "¡Apuntado! Tu token: {$volunteer->token}");
    }

    public function volunteerStatus(Request $request, CleaningPoint $cleaningPoint, CleaningPointVolunteer $volunteer)
    {
        $request->validate([
            'status' => 'required|in:confirmed,on_the_way,arrived,done',
        ]);

        $volunteer->update(['status' => $request->status]);

        return redirect("/limpieza/{$cleaningPoint->id}")->with('success', 'Estado actualizado.');
    }

    public function resolve(Request $request, CleaningPoint $cleaningPoint)
    {
        $request->validate([
            'photo' => 'nullable|image|max:10240',
        ]);

        $resolvedPhoto = null;
        if ($request->hasFile('photo')) {
            $resolvedPhoto = $request->file('photo')->store('cleaning/resolved', 'public');
        }

        $cleaningPoint->update([
            'status'              => 'resolved',
            'resolved_photo_path' => $resolvedPhoto,
            'resolved_at'         => now(),
        ]);

        return back()->with('success', 'Punto marcado como resuelto. ¡Excelente trabajo!');
    }
}
