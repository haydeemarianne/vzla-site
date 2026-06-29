<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Validator extends Model
{
    protected $fillable = ['name','email','token','modules','active','last_active_at'];

    protected $casts = [
        'modules'        => 'array',
        'last_active_at' => 'datetime',
    ];

    public static function generateToken(): string { return Str::random(64); }
    public function scopeActive($query) { return $query->where('active', true); }
}
