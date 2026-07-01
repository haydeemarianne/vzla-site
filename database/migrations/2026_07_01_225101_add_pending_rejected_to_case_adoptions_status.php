<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        \DB::statement("ALTER TABLE case_adoptions MODIFY COLUMN status ENUM('pending','active','completed','withdrawn','rejected') DEFAULT 'pending'");
    }

    public function down(): void
    {
        \DB::statement("ALTER TABLE case_adoptions MODIFY COLUMN status ENUM('active','completed','withdrawn') DEFAULT 'active'");
    }
};
