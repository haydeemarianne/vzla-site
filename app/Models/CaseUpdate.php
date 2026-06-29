<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CaseUpdate extends Model
{
    protected $fillable = [
        'support_case_id', 'author_name', 'author_type', 'content',
    ];

    public function supportCase()
    {
        return $this->belongsTo(SupportCase::class, 'support_case_id');
    }
}
