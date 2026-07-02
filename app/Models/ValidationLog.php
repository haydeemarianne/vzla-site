<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ValidationLog extends Model
{
    protected $fillable = [
        'validatable_type', 'validatable_id', 'stage', 'action',
        'admin_id', 'admin_name', 'note', 'photo_path',
    ];

    public static function record(string $type, int $id, string $action, ?string $stage = null, ?string $note = null, ?string $photoPath = null): self
    {
        return static::create([
            'validatable_type' => $type,
            'validatable_id'   => $id,
            'stage'            => $stage,
            'action'           => $action,
            'admin_id'         => session('admin_id'),
            'admin_name'       => session('admin_name'),
            'note'             => $note,
            'photo_path'       => $photoPath,
        ]);
    }
}
