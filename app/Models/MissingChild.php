<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class MissingChild extends Model
{
    protected $fillable = [
        'type','name','cedula','age','gender','description','photo_path','zone','state',
        'last_seen_place','cause_of_death','found_location','status',
        'reporter_name','reporter_phone','reporter_relation','contact_phone',
        'validation_status','duplicate_score','possible_duplicate_of','validated_at','notes',
    ];

    protected $casts = ['validated_at' => 'datetime'];

    public function scopeApproved($query)  { return $query->where('validation_status', 'approved'); }
    public function scopeMissing($query)   { return $query->where('status', 'missing'); }
    public function scopeFound($query)     { return $query->where('status', 'found'); }
    public function scopeOfType($query, string $type) { return $query->where('type', $type); }
}
