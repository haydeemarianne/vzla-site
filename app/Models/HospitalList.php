<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class HospitalList extends Model
{
    protected $fillable = [
        'hospital_name','zone','state','address','description',
        'photo_paths','patient_count_approx','uploaded_by',
        'uploader_phone','uploader_contact','validation_status',
        'validated_at','list_date',
    ];

    protected $casts = [
        'photo_paths'  => 'array',
        'validated_at' => 'datetime',
        'list_date'    => 'datetime',
    ];

    public function scopeApproved($query) { return $query->where('validation_status', 'approved'); }
}
