<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('missing_children', function (Blueprint $table) {
            $table->string('cedula', 20)->nullable()->after('name');
            $table->string('contact_phone', 30)->nullable()->after('reporter_relation');
            $table->index('cedula');
        });
    }

    public function down(): void
    {
        Schema::table('missing_children', function (Blueprint $table) {
            $table->dropIndex(['cedula']);
            $table->dropColumn(['cedula', 'contact_phone']);
        });
    }
};
