<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class CaseTask extends Model
{
    protected $fillable = [
        'support_case_id', 'need_key', 'title', 'description',
        'status', 'volunteer_name', 'volunteer_phone', 'token', 'completed_at',
    ];

    protected $casts = [
        'completed_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function ($model) {
            $model->token ??= Str::random(32);
        });
    }

    public function supportCase()
    {
        return $this->belongsTo(SupportCase::class);
    }
}
