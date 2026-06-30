<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('case_tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('support_case_id')->constrained()->cascadeOnDelete();
            $table->string('need_key', 50);
            $table->string('title', 200);
            $table->text('description')->nullable();
            $table->enum('status', ['pending', 'claimed', 'done'])->default('pending');
            $table->string('volunteer_name', 100)->nullable();
            $table->string('volunteer_phone', 30)->nullable();
            $table->string('token', 32)->unique()->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('case_tasks');
    }
};
