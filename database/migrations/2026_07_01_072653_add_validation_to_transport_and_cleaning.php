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
        foreach (['cleaning_points', 'transport_requests', 'transport_drivers'] as $table) {
            Schema::table($table, function (Blueprint $t) {
                $t->string('validation_status')->default('pending')->after('id');
                $t->timestamp('validated_at')->nullable()->after('validation_status');
            });
        }

        Schema::table('printable_materials', function (Blueprint $table) {
            $table->timestamp('validated_at')->nullable()->after('validation_status');
        });
    }

    public function down(): void
    {
        foreach (['cleaning_points', 'transport_requests', 'transport_drivers'] as $table) {
            Schema::table($table, function (Blueprint $t) {
                $t->dropColumn(['validation_status', 'validated_at']);
            });
        }
        Schema::table('printable_materials', function (Blueprint $table) {
            $table->dropColumn('validated_at');
        });
    }
};
