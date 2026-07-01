<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

class AdminUser extends Model
{
    protected $fillable = ['name', 'email', 'password', 'role', 'active'];
    protected $hidden   = ['password'];

    public function checkPassword(string $plain): bool
    {
        return Hash::check($plain, $this->password);
    }

    public function isSuperAdmin(): bool { return $this->role === 'super_admin'; }
    public function isAdmin(): bool      { return in_array($this->role, ['super_admin', 'admin']); }
}
