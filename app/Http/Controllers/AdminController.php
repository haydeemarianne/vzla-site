<?php
namespace App\Http\Controllers;

use App\Models\AdminUser;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function login()
    {
        if (session('is_admin')) {
            return redirect('/validar');
        }
        return Inertia::render('Admin/Login');
    }

    public function authenticate(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = AdminUser::where('email', $request->email)
            ->where('active', true)
            ->first();

        if (! $user || ! $user->checkPassword($request->password)) {
            return back()->withErrors(['email' => 'Credenciales incorrectas.']);
        }

        session([
            'is_admin'    => true,
            'admin_id'    => $user->id,
            'admin_email' => $user->email,
            'admin_name'  => $user->name,
            'admin_role'  => $user->role,
        ]);

        return redirect('/validar');
    }

    public function logout(Request $request)
    {
        $request->session()->forget(['is_admin', 'admin_id', 'admin_email', 'admin_name', 'admin_role']);
        return redirect('/admin/login');
    }
}
