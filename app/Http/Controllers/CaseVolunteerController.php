<?php
namespace App\Http\Controllers;

use App\Models\CaseVolunteer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CaseVolunteerController extends Controller
{
    public function create()
    {
        return Inertia::render('Voluntarios/Registrar');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'       => 'required|string|max:200',
            'cedula'     => 'nullable|string|max:30',
            'phone'      => 'required|string|max:30|unique:case_volunteers,phone',
            'email'      => 'nullable|email|max:200',
            'city'       => 'nullable|string|max:100',
            'state'      => 'nullable|string|max:100',
            'motivation' => 'nullable|string|max:1000',
        ]);

        CaseVolunteer::create(array_merge($request->all(), ['validation_status' => 'pending']));

        return redirect('/')->with('success', 'Tu registro esta en revision. Te contactaremos cuando sea aprobado.');
    }
}
