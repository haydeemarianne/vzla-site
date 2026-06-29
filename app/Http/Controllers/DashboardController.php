<?php

namespace App\Http\Controllers;

use App\Models\MissingChild;
use App\Models\HospitalList;
use App\Models\UnattendedZone;
use App\Models\DonorCompany;
use App\Models\VolunteerEngineer;
use App\Models\PrintableMaterial;
use App\Models\InspectionRequest;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard', [
            'stats' => [
                'missing_children'    => MissingChild::where('type', 'child')->where('status', 'missing')->where('validation_status', 'approved')->count(),
                'missing_adults'      => MissingChild::where('type', 'adult')->where('status', 'missing')->where('validation_status', 'approved')->count(),
                'deceased'            => MissingChild::where('type', 'deceased')->where('validation_status', 'approved')->count(),
                'found'               => MissingChild::whereIn('type', ['child', 'adult'])->where('status', 'found')->where('validation_status', 'approved')->count(),
                'critical_zones'      => UnattendedZone::where('status', 'active')->where('urgency_level', 'critical')->where('validation_status', 'approved')->count(),
                'unattended_zones'    => UnattendedZone::where('status', 'active')->where('validation_status', 'approved')->count(),
                'hospital_lists'      => HospitalList::where('validation_status', 'approved')->count(),
                'volunteer_engineers' => VolunteerEngineer::where('validation_status', 'approved')->count(),
                'donor_companies'     => DonorCompany::where('validation_status', 'approved')->count(),
                'materials'           => PrintableMaterial::where('validation_status', 'approved')->count(),
            ],
            'critical_zones' => UnattendedZone::where('status', 'active')
                ->where('validation_status', 'approved')
                ->orderByRaw("FIELD(urgency_level,'critical','high','normal')")
                ->limit(5)
                ->get(['id','zone_name','state','needs','urgency_level','estimated_people']),
            'recent_missing' => MissingChild::whereIn('type', ['child', 'adult'])
                ->where('status', 'missing')
                ->where('validation_status', 'approved')
                ->latest()
                ->limit(6)
                ->get(['id','name','age','type','zone','photo_path','created_at']),
            'recent_hospitals' => HospitalList::where('validation_status', 'approved')
                ->latest()
                ->limit(4)
                ->get(['id','hospital_name','zone','patient_count_approx','created_at']),
        ]);
    }
}
