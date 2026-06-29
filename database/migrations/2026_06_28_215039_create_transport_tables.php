<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('transport_drivers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('phone');
            $table->enum('vehicle_type', ['moto', 'car', 'pickup', 'truck']);
            $table->string('capacity')->nullable();
            $table->json('zones')->nullable();
            $table->string('state')->default('La Guaira (Vargas)');
            $table->enum('availability', ['available', 'busy', 'unavailable'])->default('available');
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->index(['availability', 'vehicle_type']);
        });

        Schema::create('transport_requests', function (Blueprint $table) {
            $table->id();
            $table->enum('cargo_type', ['supplies', 'debris', 'people']);
            $table->text('description');
            $table->string('origin_zone');
            $table->string('origin_state')->default('La Guaira (Vargas)');
            $table->string('destination_zone');
            $table->string('destination_state')->default('La Guaira (Vargas)');
            $table->enum('urgency', ['normal', 'urgent'])->default('normal');
            $table->enum('status', ['open', 'taken', 'completed'])->default('open');
            $table->unsignedBigInteger('driver_id')->nullable();
            $table->string('requester_name');
            $table->string('requester_phone');
            $table->text('notes')->nullable();
            $table->timestamp('taken_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            $table->index(['status', 'urgency']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transport_requests');
        Schema::dropIfExists('transport_drivers');
    }
};
