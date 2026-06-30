<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('cleaning_point_volunteers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cleaning_point_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('phone');
            $table->enum('status', ['confirmed', 'on_the_way', 'arrived', 'done'])->default('confirmed');
            $table->string('token', 32)->unique();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cleaning_point_volunteers');
    }
};
