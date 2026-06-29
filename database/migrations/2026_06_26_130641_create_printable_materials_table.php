<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('printable_materials', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('file_path');
            $table->string('file_type');
            $table->string('category');
            $table->json('print_instructions');
            $table->string('uploaded_by');
            $table->string('organization')->nullable();
            $table->string('contact')->nullable();
            $table->integer('download_count')->default(0);
            $table->string('validation_status')->default('approved');
            $table->timestamps();
            $table->index('category');
        });
    }
    public function down(): void { Schema::dropIfExists('printable_materials'); }
};
