<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admin_users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->enum('role', ['super_admin', 'admin', 'validator'])->default('validator');
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        DB::table('admin_users')->insert([
            'name'       => 'Super Admin',
            'email'      => config('app.admin_email', 'admin@vzla.site'),
            'password'   => Hash::make(config('app.admin_password', 'vzla2026')),
            'role'       => 'super_admin',
            'active'     => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('admin_users');
    }
};
