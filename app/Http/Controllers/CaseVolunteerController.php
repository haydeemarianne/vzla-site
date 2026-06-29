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
            'name'         => 'required|string|max:200',
            'cedula'       => 'required|string|max:30',
            'phone'        => 'required|string|max:30|unique:case_volunteers,phone',
            'email'        => 'required|email|max:200',
            'city'         => 'required|string|max:100',
            'state'        => 'required|string|max:100',
            'motivation'   => 'required|string|max:1000',
            'social_media' => 'nullable|string|max:200',
        ]);

        CaseVolunteer::create(array_merge($request->all(), ['validation_status' => 'pending']));

        return redirect('/')->with('success', 'Tu registro esta en revision. Te contactaremos cuando sea aprobado.');
    }
}
