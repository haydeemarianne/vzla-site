<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('missing_children', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('age')->nullable();
            $table->string('gender')->nullable();
            $table->text('description')->nullable();
            $table->string('photo_path')->nullable();
            $table->string('zone');
            $table->string('state')->default('La Guaira');
            $table->string('last_seen_place')->nullable();
            $table->string('status')->default('missing');
            $table->string('reporter_name');
            $table->string('reporter_phone');
            $table->string('reporter_relation')->nullable();
            $table->string('validation_status')->default('pending');
            $table->integer('duplicate_score')->default(0);
            $table->unsignedBigInteger('possible_duplicate_of')->nullable();
            $table->timestamp('validated_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->index(['status', 'validation_status']);
            $table->index('zone');
        });
    }

    public function down(): void { Schema::dropIfExists('missing_children'); }
};
