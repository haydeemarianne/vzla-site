<?php
namespace App\Http\Controllers;

use App\Models\Validator;
use App\Models\MissingChild;
use App\Models\UnattendedZone;
use App\Models\VolunteerEngineer;
use App\Models\SupportCase;
use App\Models\CaseVolunteer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ValidatorController extends Controller
{
    private function findValidator(string $token): Validator
    {
        $validator = Validator::where('token', $token)->where('active', true)->firstOrFail();
        $validator->update(['last_active_at' => now()]);
        return $validator;
    }

    public function dashboard(string $token)
    {
        $validator = $this->findValidator($token);

        return Inertia::render('Validar/Dashboard', [
            'validator'           => $validator,
            'token'               => $token,
            'pending_children'    => MissingChild::where('validation_status', 'pending')->latest()->limit(30)->get(),
            'pending_engineers'   => VolunteerEngineer::where('validation_status', 'pending')->latest()->limit(30)->get(),
            'pending_zones'       => UnattendedZone::where('validation_status', 'pending')->latest()->limit(30)->get(),
            'pending_cases'       => SupportCase::where('validation_status', 'pending')->latest()->limit(30)->get(),
            'pending_volunteers'  => CaseVolunteer::where('validation_status', 'pending')->latest()->limit(30)->get(),
        ]);
    }

    public function approve(Request $request, string $token)
    {
        $this->findValidator($token);
        $this->resolveModel($request->type, $request->id)
            ->update(['validation_status' => 'approved', 'validated_at' => now()]);
        return back()->with('success', 'Aprobado.');
    }

    public function reject(Request $request, string $token)
    {
        $this->findValidator($token);
        $this->resolveModel($request->type, $request->id)
            ->update(['validation_status' => 'rejected']);
        return back()->with('success', 'Rechazado.');
    }

    public function markDuplicate(Request $request, string $token)
    {
        $this->findValidator($token);
        $this->resolveModel($request->type, $request->id)
            ->update(['validation_status' => 'duplicate', 'possible_duplicate_of' => $request->duplicate_of]);
        return back()->with('success', 'Marcado como duplicado.');
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
