<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('volunteer_engineers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->string('license_number')->nullable();
            $table->string('specialty');
            $table->json('zones_available');
            $table->date('available_until')->nullable();
            $table->text('notes')->nullable();
            $table->string('validation_status')->default('pending');
            $table->timestamp('validated_at')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('volunteer_engineers'); }
};
