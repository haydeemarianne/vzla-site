<?php
namespace App\Http\Controllers;

use App\Models\AdminUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    private function requireAdmin(): void
    {
        if (! session('is_admin')) {
            throw new \Illuminate\Http\Exceptions\HttpResponseException(redirect('/admin/login'));
        }
    }

    private function requireSuperOrAdmin(): void
    {
        $this->requireAdmin();
        if (! in_array(session('admin_role'), ['super_admin', 'admin'])) {
            abort(403);
        }
    }

    public function index()
    {
        $this->requireSuperOrAdmin();

        $role  = session('admin_role');
        $query = AdminUser::orderBy('role')->orderBy('name');

        // Admin solo ve validadores (no puede ver otros admins ni super_admin)
        if ($role === 'admin') {
            $query->where('role', 'validator');
        }

        return Inertia::render('Validar/Usuarios', [
            'users'      => $query->get(),
            'admin_role' => $role,
            'admin_name' => session('admin_name'),
        ]);
    }

    public function store(Request $request)
    {
        $this->requireSuperOrAdmin();

        $role        = session('admin_role');
        $allowedRoles = $role === 'super_admin' ? ['admin', 'validator'] : ['validator'];

        $request->validate([
            'name'     => 'required|string|max:80',
            'email'    => 'required|email|unique:admin_users,email',
            'password' => 'required|string|min:6',
            'role'     => 'required|in:' . implode(',', $allowedRoles),
        ]);

        AdminUser::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => $request->role,
            'active'   => true,
        ]);

        return back()->with('success', 'Usuario creado.');
    }

    public function toggleActive(AdminUser $adminUser)
    {
        $this->requireSuperOrAdmin();

        // Solo super_admin puede tocar a otros admins/super_admins
        if ($adminUser->role !== 'validator' && session('admin_role') !== 'super_admin') {
            abort(403);
        }

        $adminUser->update(['active' => ! $adminUser->active]);
        return back()->with('success', 'Estado actualizado.');
    }

    public function destroy(AdminUser $adminUser)
    {
        $this->requireAdmin();

        if (session('admin_role') !== 'super_admin') {
            abort(403);
        }

        // No puede borrarse a sí mismo
        if ($adminUser->id === session('admin_id')) {
            return back()->withErrors(['error' => 'No puedes eliminarte a ti mismo.']);
        }

        $adminUser->delete();
        return back()->with('success', 'Usuario eliminado.');
    }
}
