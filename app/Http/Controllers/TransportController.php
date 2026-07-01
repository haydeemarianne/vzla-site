<?php

namespace App\Http\Controllers;

use App\Models\TransportDriver;
use App\Models\TransportRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransportController extends Controller
{
    public function index()
    {
        return Inertia::render('Transporte/Index', [
            'by_status' => [
                'open'      => TransportRequest::where('status', 'open')->orderByRaw("FIELD(urgency,'urgent','normal')")->latest()->get(),
                'taken'     => TransportRequest::where('status', 'taken')->latest()->get(),
                'completed' => TransportRequest::where('status', 'completed')->latest()->get(),
            ],
            'drivers' => [
                'available' => TransportDriver::where('availability', 'available')->latest()->get(),
                'busy'      => TransportDriver::where('availability', 'busy')->latest()->get(),
            ],
        ]);
    }

    public function requestCreate()
    {
        return Inertia::render('Transporte/Solicitar');
    }

    public function requestStore(Request $request)
    {
        $request->validate([
            'cargo_type'        => 'required|in:supplies,debris,people',
            'description'       => 'required|string|max:500',
            'origin_zone'       => 'required|string|max:200',
            'origin_state'      => 'nullable|string|max:100',
            'destination_zone'  => 'required|string|max:200',
            'destination_state' => 'nullable|string|max:100',
            'urgency'           => 'required|in:normal,urgent',
            'requester_name'    => 'required|string|max:200',
            'requester_phone'   => 'required|string|max:30',
            'notes'             => 'nullable|string|max:500',
        ]);

        TransportRequest::create($request->only([
            'cargo_type', 'description', 'origin_zone', 'origin_state',
            'destination_zone', 'destination_state', 'urgency',
            'requester_name', 'requester_phone', 'notes',
        ]));

        return redirect('/transporte')->with('success', 'Solicitud publicada. Un conductor se pondra en contacto.');
    }

    public function driverCreate()
    {
        return Inertia::render('Transporte/Registrar');
    }

    public function driverStore(Request $request)
    {
        $request->validate([
            'name'         => 'required|string|max:200',
            'phone'        => 'required|string|max:30',
            'vehicle_type' => 'required|in:moto,car,pickup,truck',
            'capacity'     => 'nullable|string|max:100',
            'zones'        => 'nullable|array',
            'state'        => 'nullable|string|max:100',
            'notes'        => 'nullable|string|max:500',
        ]);

        TransportDriver::create($request->only([
            'name', 'phone', 'vehicle_type', 'capacity', 'zones', 'state', 'notes',
        ]));

        return redirect('/transporte?tab=drivers')->with('success', 'Registrado como conductor voluntario. Gracias.');
    }

    public function take(TransportRequest $transportRequest)
    {
        if ($transportRequest->status !== 'open') {
            return back()->with('error', 'Este viaje ya fue tomado.');
        }

        $transportRequest->update([
            'status'   => 'taken',
            'taken_at' => now(),
        ]);

        return back()->with('success', 'Viaje tomado. Contacta al solicitante lo antes posible.');
    }

    public function complete(TransportRequest $transportRequest)
    {
        $transportRequest->update([
            'status'       => 'completed',
            'completed_at' => now(),
        ]);

        return back()->with('success', '¡Viaje completado! Gracias por tu ayuda.');
    }
}
