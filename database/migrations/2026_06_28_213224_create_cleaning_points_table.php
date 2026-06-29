<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('cleaning_points', function (Blueprint $table) {
            $table->id();
            $table->string('zone_name');
            $table->string('city')->nullable();
            $table->string('state')->default('La Guaira (Vargas)');
            $table->string('address')->nullable();
            $table->enum('type', ['domestic', 'debris', 'both'])->default('domestic');
            $table->enum('volume', ['low', 'medium', 'high'])->default('medium');
            $table->string('photo_path')->nullable();
            $table->string('resolved_photo_path')->nullable();
            $table->enum('status', ['pending', 'in_process', 'resolved'])->default('pending');
            $table->unsignedInteger('helpers_count')->default(0);
            $table->string('reporter_name');
            $table->string('reporter_phone');
            $table->text('notes')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
            $table->index(['status']);
            $table->index(['state']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cleaning_points');
    }
};
