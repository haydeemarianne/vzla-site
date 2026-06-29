<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SupportCase extends Model
{
    protected $fillable = [
        'family_name', 'description', 'needs', 'zone', 'state',
        'people_count', 'has_children', 'has_elderly', 'contact_phone',
        'photo_path', 'validation_status', 'status', 'adopted_at', 'resolved_at',
    ];

    protected $casts = [
        'needs'       => 'array',
        'adopted_at'  => 'datetime',
        'resolved_at' => 'datetime',
    ];

    public function scopeOpen($query)     { return $query->where('status', 'open'); }
    public function scopeAdopted($query)  { return $query->where('status', 'adopted'); }
    public function scopeResolved($query) { return $query->where('status', 'resolved'); }
    public function scopeApproved($query) { return $query->where('validation_status', 'approved'); }

    public function adoption()
    {
        return $this->hasOne(CaseAdoption::class, 'support_case_id');
    }

    public function updates()
    {
        return $this->hasMany(CaseUpdate::class, 'support_case_id');
    }
}
