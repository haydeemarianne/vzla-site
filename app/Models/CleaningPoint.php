<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CleaningPoint extends Model
{
    protected $fillable = [
        'zone_name', 'city', 'state', 'address', 'type', 'volume',
        'photo_path', 'resolved_photo_path', 'status', 'helpers_count',
        'reporter_name', 'reporter_phone', 'notes', 'resolved_at',
    ];

    protected $casts = [
        'resolved_at' => 'datetime',
    ];

    public function scopePending($query)    { return $query->where('status', 'pending'); }
    public function scopeInProcess($query)  { return $query->where('status', 'in_process'); }
    public function scopeResolved($query)   { return $query->where('status', 'resolved'); }
}
