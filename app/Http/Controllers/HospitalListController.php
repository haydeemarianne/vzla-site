<?php
namespace App\Http\Controllers;

use App\Models\HospitalList;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HospitalListController extends Controller
{
    public function index(Request $request)
    {
        $query = HospitalList::where('validation_status', 'approved')
            ->when($request->hospital, fn($q) => $q->where('hospital_name', 'like', "%{$request->hospital}%"))
            ->when($request->zone, fn($q) => $q->where('zone', 'like', "%{$request->zone}%"))
            ->latest();

        return Inertia::render('Hospitales/Index', [
            'lists'   => $query->paginate(12)->withQueryString(),
            'filters' => $request->only(['hospital', 'zone']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Hospitales/Subir');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'hospital_name'       => 'required|string|max:200',
            'zone'                => 'required|string|max:200',
            'state'               => 'nullable|string|max:100',
            'address'             => 'nullable|string|max:300',
            'description'         => 'nullable|string|max:500',
            'photos'              => 'required|array|min:1|max:10',
            'photos.*'            => 'image|max:10240',
            'patient_count_approx'=> 'nullable|integer|min:1',
            'uploaded_by'         => 'required|string|max:200',
            'uploader_phone'      => 'nullable|string|max:30',
            'list_date'           => 'nullable|date',
        ]);

        $photoPaths = [];
        foreach ($request->file('photos') as $photo) {
            $photoPaths[] = $photo->store('hospitals', 'public');
        }

        HospitalList::create(array_merge($data, [
            'photo_paths'      => $photoPaths,
            'validation_status'=> 'approved',
        ]));

        return redirect('/hospitales')->with('success', 'Lista subida correctamente. Gracias.');
    }

    public function show(HospitalList $hospitalList)
    {
        abort_if($hospitalList->validation_status === 'rejected', 404);
        return Inertia::render('Hospitales/Show', ['list' => $hospitalList]);
    }
}
