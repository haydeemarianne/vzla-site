<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('validation_logs', function (Blueprint $table) {
            $table->id();
            $table->string('validatable_type');
            $table->unsignedBigInteger('validatable_id');
            $table->string('stage')->nullable();
            $table->string('action');
            $table->unsignedBigInteger('admin_id')->nullable();
            $table->string('admin_name')->nullable();
            $table->text('note')->nullable();
            $table->string('photo_path')->nullable();
            $table->timestamps();

            $table->index(['validatable_type', 'validatable_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('validation_logs');
    }
};
