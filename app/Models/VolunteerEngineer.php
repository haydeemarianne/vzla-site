<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class VolunteerEngineer extends Model
{
    protected $fillable = [
        'name','email','phone','license_number','specialty',
        'zones_available','available_until','notes','validation_status','validation_stage','validated_at',
    ];

    protected $casts = [
        'zones_available' => 'array',
        'available_until' => 'date',
        'validated_at'    => 'datetime',
    ];

    public function scopeApproved($query) { return $query->where('validation_status', 'approved'); }
    public function inspectionRequests() { return $this->hasMany(InspectionRequest::class, 'assigned_engineer_id'); }
}
