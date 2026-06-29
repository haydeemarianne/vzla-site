<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class DonorCompany extends Model
{
    protected $fillable = [
        'company_name','contact_person','email','phone','donation_types',
        'description','country','zones_available','website','validation_status',
    ];

    protected $casts = ['donation_types' => 'array'];

    public function scopeApproved($query) { return $query->where('validation_status', 'approved'); }
}
