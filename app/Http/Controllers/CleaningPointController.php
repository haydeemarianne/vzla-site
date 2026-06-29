<?php

namespace App\Http\Controllers;

use App\Models\CleaningPoint;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CleaningPointController extends Controller
{
    public function index(Request $request)
    {
        $status = in_array($request->status, ['pending', 'in_process', 'resolved']) ? $request->status : null;

        $points = CleaningPoint::when($status, fn($q) => $q->where('status', $status))
            ->when($request->search, fn($q) => $q->where(function ($q) use ($request) {
                $q->where('zone_name', 'like', "%{$request->search}%")
                  ->orWhere('city', 'like', "%{$request->search}%")
                  ->orWhere('state', 'like', "%{$request->search}%");
            }))
            ->orderByRaw("FIELD(status,'pending','in_process','resolved')")
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Limpieza/Index', [
            'points'  => $points,
            'filters' => $request->only(['status', 'search']),
            'counts'  => [
                'pending'    => CleaningPoint::pending()->count(),
                'in_process' => CleaningPoint::inProcess()->count(),
                'resolved'   => CleaningPoint::resolved()->count(),
            ],
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

    public function volunteer(CleaningPoint $cleaningPoint)
    {
        if ($cleaningPoint->status === 'resolved') {
            return back()->with('error', 'Este punto ya fue resuelto.');
        }

        $cleaningPoint->increment('helpers_count');

        if ($cleaningPoint->status === 'pending') {
            $cleaningPoint->update(['status' => 'in_process']);
        }

        return back()->with('success', '¡Gracias! Tu ayuda queda registrada.');
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
