<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CaseAdoption extends Model
{
    protected $fillable = [
        'support_case_id', 'case_volunteer_id', 'message', 'status', 'completed_at',
    ];

    protected $casts = [
        'completed_at' => 'datetime',
    ];

    public function supportCase()
    {
        return $this->belongsTo(SupportCase::class, 'support_case_id');
    }

    public function volunteer()
    {
        return $this->belongsTo(CaseVolunteer::class, 'case_volunteer_id');
    }
}
