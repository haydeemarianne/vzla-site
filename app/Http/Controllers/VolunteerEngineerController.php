<?php
namespace App\Http\Controllers;

use App\Models\VolunteerEngineer;
use App\Models\InspectionRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VolunteerEngineerController extends Controller
{
    public function index()
    {
        return Inertia::render('Ingenieros/Index', [
            'requests' => [
                'pending'   => InspectionRequest::where('status', 'pending')->latest()->get(),
                'assigned'  => InspectionRequest::with('engineer')->where('status', 'assigned')->latest()->get(),
                'completed' => InspectionRequest::with('engineer')->where('status', 'completed')->latest()->get(),
            ],
            'engineers' => [
                'pending'  => VolunteerEngineer::where('validation_status', 'pending')->withCount('inspectionRequests')->latest()->get(),
                'approved' => VolunteerEngineer::approved()->withCount('inspectionRequests')->latest()->get(),
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Ingenieros/Registrar');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'            => 'required|string|max:200',
            'email'           => 'required|email|max:200',
            'phone'           => 'required|string|max:30',
            'license_number'  => 'nullable|string|max:50',
            'specialty'       => 'required|string|max:200',
            'zones_available' => 'required|array|min:1',
            'available_until' => 'nullable|date',
            'notes'           => 'nullable|string|max:500',
        ]);

        VolunteerEngineer::create(array_merge($request->all(), ['validation_status' => 'pending']));

        return redirect('/ingenieros')->with('success', 'Registrado correctamente. En breve sera verificado.');
    }

    public function requestCreate()
    {
        return Inertia::render('Ingenieros/SolicitarInspeccion');
    }

    public function requestStore(Request $request)
    {
        $request->validate([
            'address'         => 'required|string|max:300',
            'zone'            => 'required|string|max:200',
            'requester_name'  => 'required|string|max:200',
            'requester_phone' => 'required|string|max:30',
            'description'     => 'nullable|string|max:500',
            'structure_type'  => 'required|string|in:house,apartment,building,commercial,other',
            'urgency'         => 'required|in:normal,urgent,critical',
        ]);

        InspectionRequest::create($request->all());

        return redirect('/ingenieros')->with('success', 'Solicitud enviada. Un ingeniero se pondra en contacto.');
    }

    public function showRequest(InspectionRequest $inspectionRequest)
    {
        $inspectionRequest->load('engineer');

        return Inertia::render('Ingenieros/Show', [
            'inspectionRequest' => $inspectionRequest,
        ]);
    }

    public function postulate(Request $request, InspectionRequest $inspectionRequest)
    {
        if ($inspectionRequest->status !== 'pending') {
            return back()->withErrors(['general' => 'Esta solicitud ya fue asignada a otro ingeniero.']);
        }

        $request->validate([
            'phone' => 'required|string|max:30',
        ]);

        $engineer = VolunteerEngineer::where('phone', $request->phone)->first();

        if (!$engineer) {
            return back()->withErrors(['phone' => 'No encontramos un registro con ese teléfono. Debes registrarte primero como ingeniero voluntario.']);
        }

        if ($engineer->validation_status !== 'approved') {
            return back()->withErrors(['phone' => 'Tu registro aún está pendiente de validación por el equipo coordinador.']);
        }

        $inspectionRequest->update([
            'status'               => 'assigned',
            'assigned_engineer_id' => $engineer->id,
            'assigned_at'          => now(),
        ]);

        return redirect("/ingenieros/solicitud/{$inspectionRequest->id}")
            ->with('success', '¡Solicitud tomada! Ya puedes contactar al solicitante.')
            ->with('contact_phone', $inspectionRequest->requester_phone);
    }
}
