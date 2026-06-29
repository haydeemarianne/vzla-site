<?php
namespace App\Http\Controllers;

use App\Models\MissingChild;
use App\Models\UnattendedZone;
use App\Models\VolunteerEngineer;
use App\Models\SupportCase;
use App\Models\CaseVolunteer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ValidatorController extends Controller
{
    private function requireAdmin(): void
    {
        if (! session('is_admin')) {
            throw new \Illuminate\Http\Exceptions\HttpResponseException(
                redirect('/admin/login')
            );
        }
    }

    public function dashboard()
    {
        $this->requireAdmin();

        return Inertia::render('Validar/Dashboard', [
            'admin_email'        => session('admin_email'),
            'pending_children'   => MissingChild::where('validation_status', 'pending')->latest()->limit(30)->get(),
            'pending_engineers'  => VolunteerEngineer::where('validation_status', 'pending')->latest()->limit(30)->get(),
            'pending_zones'      => UnattendedZone::where('validation_status', 'pending')->latest()->limit(30)->get(),
            'pending_cases'      => SupportCase::where('validation_status', 'pending')->latest()->limit(30)->get(),
            'pending_volunteers' => CaseVolunteer::where('validation_status', 'pending')->latest()->limit(30)->get(),
        ]);
    }

    public function approve(Request $request)
    {
        $this->requireAdmin();
        $this->resolveModel($request->type, $request->id)
            ->update(['validation_status' => 'approved', 'validated_at' => now()]);
        return back()->with('success', 'Aprobado.');
    }

    public function reject(Request $request)
    {
        $this->requireAdmin();
        $this->resolveModel($request->type, $request->id)
            ->update(['validation_status' => 'rejected']);
        return back()->with('success', 'Rechazado.');
    }

    private function resolveModel(string $type, int $id)
    {
        return match ($type) {
            'child'          => MissingChild::findOrFail($id),
            'engineer'       => VolunteerEngineer::findOrFail($id),
            'zone'           => UnattendedZone::findOrFail($id),
            'support_case'   => SupportCase::findOrFail($id),
            'case_volunteer' => CaseVolunteer::findOrFail($id),
            default          => abort(400),
        };
    }
}
