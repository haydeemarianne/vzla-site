<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('donor_companies', function (Blueprint $table) {
            $table->id();
            $table->string('company_name');
            $table->string('contact_person');
            $table->string('email');
            $table->string('phone');
            $table->json('donation_types');
            $table->text('description')->nullable();
            $table->string('country')->default('Venezuela');
            $table->string('zones_available')->nullable();
            $table->string('website')->nullable();
            $table->string('validation_status')->default('approved');
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('donor_companies'); }
};
