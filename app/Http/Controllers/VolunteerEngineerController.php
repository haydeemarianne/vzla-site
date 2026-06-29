<?php
namespace App\Http\Controllers;

use App\Models\VolunteerEngineer;
use App\Models\InspectionRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VolunteerEngineerController extends Controller
{
    public function index(Request $request)
    {
        $query = VolunteerEngineer::where('validation_status', 'approved')
            ->when($request->zone, fn($q) => $q->whereJsonContains('zones_available', $request->zone))
            ->latest();

        return Inertia::render('Ingenieros/Index', [
            'engineers' => $query->paginate(20)->withQueryString(),
            'filters'   => $request->only(['zone']),
            'total'     => VolunteerEngineer::approved()->count(),
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
            'structure_type'  => 'nullable|string|max:100',
            'urgency'         => 'required|in:normal,urgent,critical',
        ]);

        InspectionRequest::create($request->all());

        return redirect('/ingenieros')->with('success', 'Solicitud enviada. Un ingeniero se pondra en contacto.');
    }
}
