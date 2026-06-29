<?php
namespace App\Http\Controllers;

use App\Models\DonorCompany;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DonorCompanyController extends Controller
{
    public function index(Request $request)
    {
        $query = DonorCompany::where('validation_status', 'approved')
            ->when($request->search, fn($q) => $q->where('company_name', 'like', "%{$request->search}%"))
            ->latest();

        return Inertia::render('Donantes/Index', [
            'donors' => $query->paginate(20)->withQueryString(),
            'filters'=> $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Donantes/Registrar');
    }

    public function store(Request $request)
    {
        $request->validate([
            'company_name'   => 'required|string|max:200',
            'contact_person' => 'required|string|max:200',
            'email'          => 'required|email|max:200',
            'phone'          => 'required|string|max:30',
            'donation_types' => 'required|array|min:1',
            'description'    => 'nullable|string|max:500',
            'country'        => 'nullable|string|max:100',
            'zones_available'=> 'nullable|string|max:300',
            'website'        => 'nullable|url|max:300',
        ]);

        DonorCompany::create($request->all());

        return redirect('/donantes')->with('success', 'Empresa registrada. Gracias por su apoyo.');
    }
}
