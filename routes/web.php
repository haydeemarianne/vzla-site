<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MissingChildController;
use App\Http\Controllers\PersonController;
use App\Http\Controllers\HospitalListController;
use App\Http\Controllers\UnattendedZoneController;
use App\Http\Controllers\PrintableMaterialController;
use App\Http\Controllers\DonorCompanyController;
use App\Http\Controllers\VolunteerEngineerController;
use App\Http\Controllers\CleaningPointController;
use App\Http\Controllers\TransportController;
use App\Http\Controllers\ValidatorController;
use Illuminate\Support\Facades\Route;

Route::get('/', [DashboardController::class, 'index']);

Route::prefix('personas')->group(function () {
    Route::get('/', [PersonController::class, 'index']);
    Route::get('/salvo', [PersonController::class, 'safeCreate']);
    Route::post('/salvo', [PersonController::class, 'safeStore']);
    Route::get('/registrar', [PersonController::class, 'create']);
    Route::post('/', [PersonController::class, 'store']);
    Route::get('/{person}', [PersonController::class, 'show']);
});

// Redirects de rutas anteriores
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
});

Route::prefix('limpieza')->group(function () {
    Route::get('/', [CleaningPointController::class, 'index']);
    Route::get('/reportar', [CleaningPointController::class, 'create']);
    Route::post('/', [CleaningPointController::class, 'store']);
    Route::post('/{cleaningPoint}/voluntario', [CleaningPointController::class, 'volunteer']);
    Route::post('/{cleaningPoint}/resolver', [CleaningPointController::class, 'resolve']);
});

Route::prefix('transporte')->group(function () {
    Route::get('/', [TransportController::class, 'index']);
    Route::get('/solicitar', [TransportController::class, 'requestCreate']);
    Route::post('/solicitar', [TransportController::class, 'requestStore']);
    Route::get('/registrar', [TransportController::class, 'driverCreate']);
    Route::post('/registrar', [TransportController::class, 'driverStore']);
    Route::post('/solicitudes/{transportRequest}/tomar', [TransportController::class, 'take']);
    Route::post('/solicitudes/{transportRequest}/completar', [TransportController::class, 'complete']);
});

Route::prefix('validar')->group(function () {
    Route::get('/{token}', [ValidatorController::class, 'dashboard']);
    Route::post('/{token}/approve', [ValidatorController::class, 'approve']);
    Route::post('/{token}/reject', [ValidatorController::class, 'reject']);
    Route::post('/{token}/duplicate', [ValidatorController::class, 'markDuplicate']);
});
