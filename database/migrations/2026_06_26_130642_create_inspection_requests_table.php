<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('inspection_requests', function (Blueprint $table) {
            $table->id();
            $table->string('address');
            $table->string('zone');
            $table->string('state')->default('La Guaira');
            $table->string('requester_name');
            $table->string('requester_phone');
            $table->text('description')->nullable();
            $table->string('structure_type')->nullable();
            $table->string('urgency')->default('normal');
            $table->unsignedBigInteger('assigned_engineer_id')->nullable();
            $table->string('status')->default('pending');
            $table->timestamp('assigned_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            $table->index(['status', 'zone']);
        });
    }
    public function down(): void { Schema::dropIfExists('inspection_requests'); }
};
