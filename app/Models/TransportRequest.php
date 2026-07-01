<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransportRequest extends Model
{
    protected $fillable = [
        'cargo_type', 'description', 'origin_zone', 'origin_state',
        'destination_zone', 'destination_state', 'urgency', 'status',
        'driver_id', 'requester_name', 'requester_phone', 'notes',
        'taken_at', 'completed_at', 'validation_status', 'validation_stage', 'validated_at',
    ];

    protected $casts = [
        'taken_at'     => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function scopeOpen($query)      { return $query->where('status', 'open'); }
    public function scopeTaken($query)     { return $query->where('status', 'taken'); }
    public function scopeCompleted($query) { return $query->where('status', 'completed'); }
}
