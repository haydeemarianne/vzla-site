<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SupportCase extends Model
{
    protected $fillable = [
        'family_name', 'description', 'needs', 'zone', 'city', 'state',
        'people_count', 'has_children', 'has_elderly', 'has_risk', 'case_type',
        'contact_phone', 'is_anonymous',
        'photo_path', 'validation_status', 'validation_stage', 'status', 'adopted_at', 'resolved_at',
    ];

    protected $casts = [
        'needs'       => 'array',
        'adopted_at'  => 'datetime',
        'resolved_at' => 'datetime',
    ];

    public function scopeOpen($query)     { return $query->where('status', 'open'); }
    public function scopeInReview($query) { return $query->where('status', 'in_review'); }
    public function scopeAdopted($query)  { return $query->where('status', 'adopted'); }
    public function scopeResolved($query) { return $query->where('status', 'resolved'); }
    public function scopeRejected($query) { return $query->where('status', 'rejected'); }
    public function scopeApproved($query) { return $query->where('validation_status', 'approved'); }

    public function adoption()
    {
        return $this->hasOne(CaseAdoption::class, 'support_case_id');
    }

    public function updates()
    {
        return $this->hasMany(CaseUpdate::class, 'support_case_id');
    }

    public function tasks()
    {
        return $this->hasMany(CaseTask::class, 'support_case_id');
    }

    public function syncStatusFromTasks(): void
    {
        $tasks = $this->tasks()->get();
        if ($tasks->isEmpty()) return;

        if ($tasks->every(fn($t) => $t->status === 'done')) {
            $this->update(['status' => 'resolved', 'resolved_at' => now()]);
        } elseif ($tasks->every(fn($t) => in_array($t->status, ['claimed', 'done']))) {
            $this->update(['status' => 'adopted', 'adopted_at' => $this->adopted_at ?? now()]);
        } else {
            $this->update(['status' => 'open']);
        }
    }
}
