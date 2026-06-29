<?php
namespace App\Http\Controllers;

use App\Models\UnattendedZone;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UnattendedZoneController extends Controller
{
    public function index(Request $request)
    {
        $query = UnattendedZone::where('status', 'active')
            ->where('validation_status', 'approved')
            ->when($request->urgency, fn($q) => $q->where('urgency_level', $request->urgency))
            ->when($request->zone, fn($q) => $q->where('zone_name', 'like', "%{$request->zone}%"))
            ->orderByRaw("FIELD(urgency_level,'critical','high','normal')")
            ->latest();

        return Inertia::render('Zonas/Index', [
            'zones'  => $query->paginate(20)->withQueryString(),
            'filters'=> $request->only(['urgency','zone']),
            'counts' => [
                'critical' => UnattendedZone::active()->approved()->where('urgency_level','critical')->count(),
                'high'     => UnattendedZone::active()->approved()->where('urgency_level','high')->count(),
                'normal'   => UnattendedZone::active()->approved()->where('urgency_level','normal')->count(),
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Zonas/Reportar');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'zone_name'        => 'required|string|max:200',
            'state'            => 'nullable|string|max:100',
            'city'             => 'nullable|string|max:100',
            'description'      => 'required|string|max:1000',
            'needs'            => 'required|array|min:1',
            'urgency_level'    => 'required|in:normal,high,critical',
            'estimated_people' => 'nullable|integer|min:1',
            'reporter_name'    => 'required|string|max:200',
            'reporter_phone'   => 'required|string|max:30',
            'reporter_role'    => 'nullable|string|max:100',
        ]);

        UnattendedZone::create(array_merge($data, ['validation_status' => 'approved']));

        return redirect('/zonas')->with('success', 'Zona reportada. Gracias por informar.');
    }
}
