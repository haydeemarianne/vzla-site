<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class InspectionRequest extends Model
{
    protected $fillable = [
        'address','zone','state','requester_name','requester_phone',
        'description','structure_type','urgency','assigned_engineer_id',
        'status','assigned_at','completed_at',
    ];

    protected $casts = [
        'assigned_at'  => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function engineer() { return $this->belongsTo(VolunteerEngineer::class, 'assigned_engineer_id'); }
}
