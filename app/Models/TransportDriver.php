<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransportDriver extends Model
{
    protected $fillable = [
        'name', 'phone', 'vehicle_type', 'capacity',
        'zones', 'state', 'availability', 'notes',
        'validation_status', 'validation_stage', 'validated_at',
    ];

    protected $casts = ['zones' => 'array'];

    public function scopeAvailable($query) { return $query->where('availability', 'available'); }
}
