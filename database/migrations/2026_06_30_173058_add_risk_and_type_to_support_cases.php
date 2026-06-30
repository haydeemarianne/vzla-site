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
        Schema::table('support_cases', function (Blueprint $table) {
            $table->boolean('has_risk')->default(false)->after('has_elderly');
            $table->string('case_type', 20)->default('familiar')->after('has_risk');
        });
    }

    public function down(): void
    {
        Schema::table('support_cases', function (Blueprint $table) {
            $table->dropColumn(['has_risk', 'case_type']);
        });
    }
};
