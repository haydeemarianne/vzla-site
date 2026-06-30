<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class CleaningPointVolunteer extends Model
{
    protected $fillable = ['cleaning_point_id', 'name', 'phone', 'address', 'status', 'token'];

    protected static function booted(): void
    {
        static::creating(function ($model) {
            $model->token = Str::random(32);
        });
    }

    public function cleaningPoint()
    {
        return $this->belongsTo(CleaningPoint::class);
    }
}
