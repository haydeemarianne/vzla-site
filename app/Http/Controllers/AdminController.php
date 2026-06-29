<?php
namespace App\Http\Controllers;

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

        $adminEmail = config('app.admin_email');
        $adminPass  = config('app.admin_password');

        if ($request->email === $adminEmail && $request->password === $adminPass) {
            session(['is_admin' => true, 'admin_email' => $request->email]);
            return redirect('/validar');
        }

        return back()->withErrors(['email' => 'Credenciales incorrectas.']);
    }

    public function logout(Request $request)
    {
        $request->session()->forget(['is_admin', 'admin_email']);
        return redirect('/admin/login');
    }
}
