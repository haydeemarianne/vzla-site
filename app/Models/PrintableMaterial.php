<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class PrintableMaterial extends Model
{
    protected $fillable = [
        'title','description','file_path','file_type','category','subcategory','is_3d',
        'print_instructions','uploaded_by','organization','contact',
        'contributor_instagram','contributor_phone',
        'download_count','helpful_count','validation_status','validation_stage','price_estimate',
    ];

    protected $casts = [
        'print_instructions' => 'array',
        'is_3d'              => 'boolean',
    ];

    public function scopeApproved($query) { return $query->where('validation_status', 'approved'); }
    public function incrementDownload(): void { $this->increment('download_count'); }
}
