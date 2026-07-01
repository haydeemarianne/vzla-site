<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $tables = [
            'support_cases',
            'volunteer_engineers',
            'cleaning_points',
            'transport_requests',
            'transport_drivers',
            'printable_materials',
        ];

        foreach ($tables as $table) {
            Schema::table($table, function (Blueprint $blueprint) {
                $blueprint->string('validation_stage')->nullable()->after('validation_status');
            });
        }
    }

    public function down(): void
    {
        $tables = [
            'support_cases',
            'volunteer_engineers',
            'cleaning_points',
            'transport_requests',
            'transport_drivers',
            'printable_materials',
        ];

        foreach ($tables as $table) {
            Schema::table($table, function (Blueprint $blueprint) {
                $blueprint->dropColumn('validation_stage');
            });
        }
    }
};
