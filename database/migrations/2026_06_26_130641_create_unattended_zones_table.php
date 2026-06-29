<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('unattended_zones', function (Blueprint $table) {
            $table->id();
            $table->string('zone_name');
            $table->string('state')->default('La Guaira');
            $table->string('city')->nullable();
            $table->string('coordinates')->nullable();
            $table->text('description');
            $table->json('needs');
            $table->string('urgency_level')->default('high');
            $table->integer('estimated_people')->nullable();
            $table->string('reporter_name');
            $table->string('reporter_phone');
            $table->string('reporter_role')->nullable();
            $table->string('status')->default('active');
            $table->string('validation_status')->default('pending');
            $table->timestamp('validated_at')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
            $table->index(['status', 'urgency_level']);
        });
    }
    public function down(): void { Schema::dropIfExists('unattended_zones'); }
};
