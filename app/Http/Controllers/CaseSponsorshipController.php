<?php

namespace App\Http\Controllers;

use App\Models\CaseAdoption;
use App\Models\CaseVolunteer;
use App\Models\SupportCase;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CaseSponsorshipController extends Controller
{
    public function create(SupportCase $supportCase)
    {
        return Inertia::render('Casos/Apadrinar', [
            'supportCase' => $supportCase->only([
                'id', 'family_name', 'is_anonymous', 'zone', 'state',
                'needs', 'people_count', 'status', 'description',
            ]),
        ]);
    }

    public function store(Request $request, SupportCase $supportCase)
    {
        if ($supportCase->validation_status !== 'approved') {
            abort(403, 'Este caso aún no ha sido validado.');
        }

        $request->validate([
            'name'       => 'required|string|max:200',
            'cedula'     => 'required|string|max:30',
            'phone'      => 'required|string|max:30',
            'email'      => 'nullable|email|max:200',
            'city'       => 'required|string|max:100',
            'state'      => 'required|string|max:100',
            'motivation' => 'required|string|max:1000',
        ]);

        // Evitar duplicados por teléfono en el mismo caso
        $duplicate = CaseAdoption::where('support_case_id', $supportCase->id)
            ->whereHas('volunteer', fn($q) => $q->where('phone', $request->phone))
            ->whereIn('status', ['pending', 'active'])
            ->exists();

        if ($duplicate) {
            return back()->withErrors(['phone' => 'Ya tienes una solicitud activa para este caso.']);
        }

        $volunteer = CaseVolunteer::create([
            'name'              => $request->name,
            'cedula'            => $request->cedula,
            'phone'             => $request->phone,
            'email'             => $request->email ?? '',
            'city'              => $request->city,
            'state'             => $request->state,
            'motivation'        => $request->motivation,
            'validation_status' => 'pending',
        ]);

        CaseAdoption::create([
            'support_case_id'   => $supportCase->id,
            'case_volunteer_id' => $volunteer->id,
            'message'           => $request->motivation,
            'status'            => 'pending',
        ]);

        $supportCase->update(['status' => 'in_review']);

        return redirect("/casos/{$supportCase->id}")
            ->with('success', '¡Solicitud enviada! El equipo la revisará y te contactará pronto.');
    }

    public function approve(CaseAdoption $adoption)
    {
        $adoption->volunteer->update(['validation_status' => 'approved']);
        $adoption->update(['status' => 'active']);
        $adoption->supportCase->update(['status' => 'adopted', 'adopted_at' => now()]);

        return back()->with('success', 'Padrino aprobado. El caso pasa a "Apadrinado".');
    }

    public function reject(CaseAdoption $adoption)
    {
        $adoption->volunteer->update(['validation_status' => 'rejected']);
        $adoption->update(['status' => 'rejected']);
        $adoption->supportCase->update(['status' => 'open']);

        return back()->with('success', 'Solicitud rechazada. El caso vuelve a "Sin apadrinar".');
    }
}
