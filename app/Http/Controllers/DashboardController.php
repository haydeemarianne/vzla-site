<?php

namespace App\Http\Controllers;

use App\Models\SupportCase;
use App\Models\CaseVolunteer;
use App\Models\CleaningPoint;
use App\Models\DonorCompany;
use App\Models\VolunteerEngineer;
use App\Models\PrintableMaterial;
use App\Models\InspectionRequest;
use App\Models\TransportRequest;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function estadisticas()
    {
        return Inertia::render('Estadisticas/Index', [
            'stats_today' => [
                'cases_new'       => SupportCase::approved()->whereDate('created_at', today())->count(),
                'cases_adopted'   => SupportCase::approved()->adopted()->whereDate('updated_at', today())->count(),
                'cleaning_active' => CleaningPoint::whereIn('status', ['pending', 'in_process'])->count(),
                'engineers'       => VolunteerEngineer::where('validation_status', 'approved')->count(),
                'materials_dl'    => PrintableMaterial::approved()->whereDate('updated_at', today())->sum('download_count'),
                'transport_open'  => TransportRequest::where('status', 'open')->count(),
                'inspections_open'=> InspectionRequest::where('status', 'open')->count(),
            ],
            'stats_yesterday' => [
                'cases_new'       => SupportCase::approved()->whereDate('created_at', today()->subDay())->count(),
                'cases_adopted'   => SupportCase::approved()->adopted()->whereDate('updated_at', today()->subDay())->count(),
            ],
        ]);
    }

    public function index()
    {
        return Inertia::render('Dashboard', [
            'stats' => [
                'cases_open'      => SupportCase::approved()->open()->count(),
                'cases_adopted'   => SupportCase::approved()->adopted()->count(),
                'cases_resolved'  => SupportCase::approved()->resolved()->count(),
                'volunteers'      => CaseVolunteer::where('validation_status', 'approved')->count(),
                'cleaning_points' => CleaningPoint::whereIn('status', ['pending', 'in_process'])->count(),
                'engineers'       => VolunteerEngineer::where('validation_status', 'approved')->count(),
                'donors'          => DonorCompany::where('validation_status', 'approved')->count(),
                'materials'       => PrintableMaterial::where('validation_status', 'approved')->count(),
            ],
            'recent_cases' => SupportCase::approved()
                ->whereIn('status', ['open', 'adopted'])
                ->latest()
                ->limit(6)
                ->get(['id', 'family_name', 'is_anonymous', 'needs', 'zone', 'state', 'people_count', 'status', 'has_children', 'has_elderly']),
            'recent_cleaning' => CleaningPoint::whereIn('status', ['pending', 'in_process'])
                ->latest()
                ->limit(4)
                ->get(['id', 'zone_name', 'state', 'helpers_count', 'created_at']),
            'top_materials' => PrintableMaterial::approved()
                ->orderByDesc('download_count')
                ->limit(5)
                ->get(['id', 'title', 'description', 'category', 'file_type', 'download_count']),
            'recent_inspections' => InspectionRequest::where('status', 'open')
                ->latest()
                ->limit(4)
                ->get(['id', 'zone', 'state', 'urgency', 'structure_type']),
            'recent_transport' => TransportRequest::where('status', 'open')
                ->latest()
                ->limit(4)
                ->get(['id', 'cargo_type', 'origin_state', 'destination_state', 'urgency']),
        ]);
    }
}
