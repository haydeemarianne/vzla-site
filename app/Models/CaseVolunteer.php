<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CaseVolunteer extends Model
{
    protected $fillable = [
        'name', 'cedula', 'phone', 'email', 'city', 'state',
        'motivation', 'validation_status',
    ];

    public function scopeApproved($query) { return $query->where('validation_status', 'approved'); }
}
