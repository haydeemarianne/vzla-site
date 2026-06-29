<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('validators', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('token', 64)->unique();
            $table->json('modules')->nullable();
            $table->boolean('active')->default(true);
            $table->timestamp('last_active_at')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('validators'); }
};
