<?php
namespace App\Http\Controllers;

use App\Models\CaseAdoption;
use App\Models\MissingChild;
use App\Models\UnattendedZone;
use App\Models\VolunteerEngineer;
use App\Models\SupportCase;
use App\Models\CaseVolunteer;
use App\Models\CleaningPoint;
use App\Models\TransportRequest;
use App\Models\TransportDriver;
use App\Models\PrintableMaterial;
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
            'admin_name'         => session('admin_name'),
            'admin_role'         => session('admin_role'),

            // ── Cola de validación (pendientes) ──
            'pending_children'          => MissingChild::where('validation_status', 'pending')->latest()->limit(30)->get(),
            'pending_engineers'         => VolunteerEngineer::where('validation_status', 'pending')->latest()->limit(30)->get(),
            'pending_zones'             => UnattendedZone::where('validation_status', 'pending')->latest()->limit(30)->get(),
            'pending_cases'             => SupportCase::whereIn('validation_status', ['pending', 'approved'])->latest()->limit(50)->get(),
            'pending_volunteers'        => CaseVolunteer::where('validation_status', 'pending')->latest()->limit(30)->get(),
            'pending_adoptions'         => CaseAdoption::where('status', 'pending')
                ->with(['volunteer', 'supportCase:id,family_name,is_anonymous,zone,state,needs'])
                ->latest()->limit(30)->get(),
            'pending_materials'         => PrintableMaterial::where('validation_status', 'pending')->latest()->limit(30)->get(),
            'pending_cleaning'          => CleaningPoint::where('validation_status', 'pending')->latest()->limit(30)->get(),
            'pending_transport_req'     => TransportRequest::where('validation_status', 'pending')->latest()->limit(30)->get(),
            'pending_transport_drivers' => TransportDriver::where('validation_status', 'pending')->latest()->limit(30)->get(),

            // ── Recorrido del caso (items en proceso de validación por stage) ──
            'staged_cases'     => SupportCase::whereNotNull('validation_stage')->latest()->limit(100)->get(),
            'staged_engineers' => VolunteerEngineer::whereNotNull('validation_stage')->latest()->limit(50)->get(),
            'staged_materials' => PrintableMaterial::whereNotNull('validation_stage')->latest()->limit(50)->get(),
            'staged_cleaning'  => CleaningPoint::whereNotNull('validation_stage')->latest()->limit(50)->get(),
            'staged_transport' => TransportRequest::whereNotNull('validation_stage')->latest()->limit(50)->get(),
            'staged_drivers'   => TransportDriver::whereNotNull('validation_stage')->latest()->limit(50)->get(),
        ]);
    }

    public function approve(Request $request)
    {
        $this->requireAdmin();
        $this->resolveModel($request->type, $request->id)
            ->update([
                'validation_status' => 'approved',
                'validation_stage'  => 'recepcion',
                'validated_at'      => now(),
            ]);
        return back()->with('success', 'Aprobado y en Recepción.');
    }

    public function reject(Request $request)
    {
        $this->requireAdmin();
        $this->resolveModel($request->type, $request->id)
            ->update(['validation_status' => 'rejected', 'validation_stage' => null]);
        return back()->with('success', 'Rechazado.');
    }

    public function corregir(Request $request)
    {
        $this->requireAdmin();
        $request->validate([
            'type' => 'required|string',
            'id'   => 'required|integer',
            'data' => 'required|array',
        ]);

        $allowed = $this->allowedEditFields($request->type);
        $data    = array_intersect_key($request->data, array_flip($allowed));
        $this->resolveModel($request->type, $request->id)->update($data);

        return back()->with('success', 'Datos actualizados.');
    }

    private function allowedEditFields(string $type): array
    {
        return match ($type) {
            'support_case'      => ['family_name','zone','city','state','contact_phone','people_count','description'],
            'engineer'          => ['name','phone','email','license_number','specialty','notes'],
            'material'          => ['title','category','subcategory','uploaded_by','organization','contact','description'],
            'cleaning'          => ['zone_name','city','state','address','reporter_name','reporter_phone','notes'],
            'transport_request' => ['requester_name','requester_phone','origin_zone','origin_state','destination_zone','destination_state','description','notes'],
            'transport_driver'  => ['name','phone','vehicle_type','capacity','state','notes'],
            default             => [],
        };
    }

    public function avanzar(Request $request)
    {
        $this->requireAdmin();
        $request->validate([
            'type' => 'required|string',
            'id'   => 'required|integer',
        ]);

        $stages  = ['recepcion', 'verificacion', 'asignacion', 'seguimiento'];
        $item    = $this->resolveModel($request->type, $request->id);
        $current = array_search($item->validation_stage, $stages, true);

        if ($current === false) {
            $newStage = 'recepcion';
        } elseif ($current < count($stages) - 1) {
            $newStage = $stages[$current + 1];
        } else {
            return back()->with('success', 'Ya está en la etapa final.');
        }

        $update = ['validation_stage' => $newStage];

        // Sincronizar status público según módulo y etapa
        $update = array_merge($update, $this->publicStatusForStage($request->type, $newStage, $item));

        $item->update($update);

        return back()->with('success', 'Etapa avanzada.');
    }

    private function publicStatusForStage(string $type, string $stage, $item): array
    {
        if ($type === 'support_case') {
            $map = [
                'recepcion'    => ['status' => 'open'],
                'verificacion' => ['status' => 'open'],
                'asignacion'   => ['status' => 'in_review'],
                'seguimiento'  => ['status' => 'adopted', 'adopted_at' => $item->adopted_at ?? now()],
            ];
            return $map[$stage] ?? [];
        }

        if ($type === 'cleaning') {
            $map = [
                'recepcion'    => ['status' => 'pending'],
                'verificacion' => ['status' => 'pending'],
                'asignacion'   => ['status' => 'in_process'],
                'seguimiento'  => ['status' => 'in_process'],
            ];
            return $map[$stage] ?? [];
        }

        if ($type === 'transport_request') {
            $map = [
                'recepcion'    => ['status' => 'open'],
                'verificacion' => ['status' => 'open'],
                'asignacion'   => ['status' => 'open'],
                'seguimiento'  => ['status' => 'taken', 'taken_at' => now()],
            ];
            return $map[$stage] ?? [];
        }

        return [];
    }

    private function resolveModel(string $type, int $id)
    {
        return match ($type) {
            'child'              => MissingChild::findOrFail($id),
            'engineer'           => VolunteerEngineer::findOrFail($id),
            'zone'               => UnattendedZone::findOrFail($id),
            'support_case'       => SupportCase::findOrFail($id),
            'case_volunteer'     => CaseVolunteer::findOrFail($id),
            'material'           => PrintableMaterial::findOrFail($id),
            'cleaning'           => CleaningPoint::findOrFail($id),
            'transport_request'  => TransportRequest::findOrFail($id),
            'transport_driver'   => TransportDriver::findOrFail($id),
            default              => abort(400),
        };
    }
}
