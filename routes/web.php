<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PersonController;
use App\Http\Controllers\HospitalListController;
use App\Http\Controllers\UnattendedZoneController;
use App\Http\Controllers\PrintableMaterialController;
use App\Http\Controllers\DonorCompanyController;
use App\Http\Controllers\VolunteerEngineerController;
use App\Http\Controllers\CleaningPointController;
use App\Http\Controllers\TransportController;
use App\Http\Controllers\ValidatorController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\SupportCaseController;
use App\Http\Controllers\CaseVolunteerController;
use App\Http\Controllers\CaseSponsorshipController;
use Illuminate\Support\Facades\Route;

Route::get('/', [DashboardController::class, 'index']);

Route::get('/estadisticas', [DashboardController::class, 'estadisticas'])->name('estadisticas');

// ── Admin / Panel validador ──────────────────────────────────────────────────
Route::get('/admin/login',  [AdminController::class, 'login']);
Route::post('/admin/login', [AdminController::class, 'authenticate']);
Route::post('/admin/logout',[AdminController::class, 'logout']);

Route::prefix('validar')->group(function () {
    Route::get('/',          [ValidatorController::class, 'dashboard']);
    Route::post('/approve',  [ValidatorController::class, 'approve']);
    Route::post('/reject',   [ValidatorController::class, 'reject']);
    Route::post('/avanzar',  [ValidatorController::class, 'avanzar']);
    Route::post('/corregir', [ValidatorController::class, 'corregir']);
    Route::post('/padrinos/{adoption}/aprobar',  [CaseSponsorshipController::class, 'approve']);
    Route::post('/padrinos/{adoption}/rechazar', [CaseSponsorshipController::class, 'reject']);

    // Gestión de usuarios del panel
    Route::get('/usuarios',                              [AdminUserController::class, 'index']);
    Route::post('/usuarios',                             [AdminUserController::class, 'store']);
    Route::post('/usuarios/{adminUser}/toggle',          [AdminUserController::class, 'toggleActive']);
    Route::delete('/usuarios/{adminUser}',               [AdminUserController::class, 'destroy']);
});

// ── Personas ─────────────────────────────────────────────────────────────────
Route::prefix('personas')->group(function () {
    Route::get('/', [PersonController::class, 'index']);
    Route::get('/salvo', [PersonController::class, 'safeCreate']);
    Route::post('/salvo', [PersonController::class, 'safeStore']);
    Route::get('/registrar', [PersonController::class, 'create']);
    Route::post('/', [PersonController::class, 'store']);
    Route::get('/{person}', [PersonController::class, 'show']);
});

Route::redirect('/ninos', '/personas?type=child');
Route::redirect('/ninos/reportar', '/personas/registrar?type=child');

Route::prefix('hospitales')->group(function () {
    Route::get('/', [HospitalListController::class, 'index']);
    Route::get('/subir', [HospitalListController::class, 'create']);
    Route::post('/', [HospitalListController::class, 'store']);
    Route::get('/{hospitalList}', [HospitalListController::class, 'show']);
});

Route::prefix('zonas')->group(function () {
    Route::get('/', [UnattendedZoneController::class, 'index']);
    Route::get('/reportar', [UnattendedZoneController::class, 'create']);
    Route::post('/', [UnattendedZoneController::class, 'store']);
});

Route::prefix('materiales')->group(function () {
    Route::get('/', [PrintableMaterialController::class, 'index']);
    Route::get('/subir', [PrintableMaterialController::class, 'create']);
    Route::post('/', [PrintableMaterialController::class, 'store']);
    Route::get('/{material}', [PrintableMaterialController::class, 'show']);
    Route::post('/{material}/votar', [PrintableMaterialController::class, 'vote']);
    Route::get('/{material}/descargar', [PrintableMaterialController::class, 'download']);
});

Route::prefix('donantes')->group(function () {
    Route::get('/', [DonorCompanyController::class, 'index']);
    Route::get('/registrar', [DonorCompanyController::class, 'create']);
    Route::post('/', [DonorCompanyController::class, 'store']);
});

Route::prefix('ingenieros')->group(function () {
    Route::get('/', [VolunteerEngineerController::class, 'index']);
    Route::get('/registrar', [VolunteerEngineerController::class, 'create']);
    Route::post('/', [VolunteerEngineerController::class, 'store']);
    Route::get('/solicitar', [VolunteerEngineerController::class, 'requestCreate']);
    Route::post('/solicitar', [VolunteerEngineerController::class, 'requestStore']);
    Route::get('/solicitud/{inspectionRequest}', [VolunteerEngineerController::class, 'showRequest']);
    Route::post('/solicitud/{inspectionRequest}/postular', [VolunteerEngineerController::class, 'postulate']);
});

Route::prefix('limpieza')->group(function () {
    Route::get('/', [CleaningPointController::class, 'index']);
    Route::get('/reportar', [CleaningPointController::class, 'create']);
    Route::post('/', [CleaningPointController::class, 'store']);
    Route::get('/{cleaningPoint}', [CleaningPointController::class, 'show']);
    Route::post('/{cleaningPoint}/voluntario', [CleaningPointController::class, 'volunteer']);
    Route::patch('/{cleaningPoint}/voluntario/{volunteer}/status', [CleaningPointController::class, 'volunteerStatus']);
    Route::post('/{cleaningPoint}/resolver', [CleaningPointController::class, 'resolve']);
});

Route::prefix('transporte')->group(function () {
    Route::get('/', [TransportController::class, 'index']);
    Route::get('/solicitar', [TransportController::class, 'requestCreate']);
    Route::post('/solicitar', [TransportController::class, 'requestStore']);
    Route::get('/registrar', [TransportController::class, 'driverCreate']);
    Route::post('/registrar', [TransportController::class, 'driverStore']);
    Route::get('/solicitudes/{transportRequest}', [TransportController::class, 'show']);
    Route::post('/solicitudes/{transportRequest}/tomar', [TransportController::class, 'take']);
    Route::post('/solicitudes/{transportRequest}/completar', [TransportController::class, 'complete']);
});

Route::prefix('casos')->group(function () {
    Route::get('/', [SupportCaseController::class, 'index']);
    Route::get('/publicar', [SupportCaseController::class, 'create']);
    Route::post('/', [SupportCaseController::class, 'store']);
    Route::get('/{supportCase}', [SupportCaseController::class, 'show']);
    Route::get('/{supportCase}/apadrinar', [CaseSponsorshipController::class, 'create']);
    Route::post('/{supportCase}/apadrinar', [CaseSponsorshipController::class, 'store']);
    Route::post('/{supportCase}/actualizar', [SupportCaseController::class, 'addUpdate']);
    Route::post('/{supportCase}/tareas', [SupportCaseController::class, 'addTask']);
    Route::post('/{supportCase}/tareas/{task}/tomar', [SupportCaseController::class, 'claimTask']);
    Route::patch('/{supportCase}/tareas/{task}/completar', [SupportCaseController::class, 'completeTask']);
});

Route::prefix('voluntarios')->group(function () {
    Route::get('/registrar', [CaseVolunteerController::class, 'create']);
    Route::post('/registrar', [CaseVolunteerController::class, 'store']);
});
