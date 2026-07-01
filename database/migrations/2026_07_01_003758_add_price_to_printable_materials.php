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
        Schema::table('printable_materials', function (Blueprint $table) {
            $table->string('price_estimate')->nullable()->after('download_count');
        });
    }

    public function down(): void
    {
        Schema::table('printable_materials', function (Blueprint $table) {
            $table->dropColumn('price_estimate');
        });
    }
};
