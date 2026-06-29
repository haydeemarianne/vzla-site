<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class UnattendedZone extends Model
{
    protected $fillable = [
        'zone_name','state','city','coordinates','description','needs',
        'urgency_level','estimated_people','reporter_name','reporter_phone',
        'reporter_role','status','validation_status','validated_at','resolved_at',
    ];

    protected $casts = [
        'needs'        => 'array',
        'validated_at' => 'datetime',
        'resolved_at'  => 'datetime',
    ];

    public function scopeActive($query) { return $query->where('status', 'active'); }
    public function scopeApproved($query) { return $query->where('validation_status', 'approved'); }
}
