<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('hospital_lists', function (Blueprint $table) {
            $table->id();
            $table->string('hospital_name');
            $table->string('zone');
            $table->string('state')->default('La Guaira');
            $table->string('address')->nullable();
            $table->text('description')->nullable();
            $table->json('photo_paths');
            $table->integer('patient_count_approx')->nullable();
            $table->string('uploaded_by');
            $table->string('uploader_phone')->nullable();
            $table->string('uploader_contact')->nullable();
            $table->string('validation_status')->default('pending');
            $table->timestamp('validated_at')->nullable();
            $table->timestamp('list_date')->nullable();
            $table->timestamps();
            $table->index(['hospital_name', 'validation_status']);
        });
    }
    public function down(): void { Schema::dropIfExists('hospital_lists'); }
};
