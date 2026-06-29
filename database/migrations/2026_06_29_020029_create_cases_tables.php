<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('support_cases', function (Blueprint $table) {
            $table->id();
            $table->string('family_name');
            $table->text('description');
            $table->json('needs');
            $table->string('zone');
            $table->string('state');
            $table->unsignedTinyInteger('people_count')->default(1);
            $table->boolean('has_children')->default(false);
            $table->boolean('has_elderly')->default(false);
            $table->string('contact_phone');
            $table->string('photo_path')->nullable();
            $table->enum('validation_status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->enum('status', ['open', 'adopted', 'resolved'])->default('open');
            $table->timestamp('adopted_at')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
        });

        Schema::create('case_volunteers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('cedula')->nullable();
            $table->string('phone')->unique();
            $table->string('email')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->text('motivation')->nullable();
            $table->enum('validation_status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamps();
        });

        Schema::create('case_adoptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('support_case_id')->constrained('support_cases');
            $table->foreignId('case_volunteer_id')->constrained('case_volunteers');
            $table->text('message')->nullable();
            $table->enum('status', ['active', 'completed', 'withdrawn'])->default('active');
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });

        Schema::create('case_updates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('support_case_id')->constrained('support_cases');
            $table->string('author_name');
            $table->enum('author_type', ['volunteer', 'family', 'admin'])->default('volunteer');
            $table->text('content');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('case_updates');
        Schema::dropIfExists('case_adoptions');
        Schema::dropIfExists('case_volunteers');
        Schema::dropIfExists('support_cases');
    }
};
