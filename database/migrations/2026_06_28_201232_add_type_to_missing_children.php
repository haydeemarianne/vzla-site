<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('missing_children', function (Blueprint $table) {
            $table->string('type')->default('child')->after('id');
            $table->string('cause_of_death')->nullable()->after('last_seen_place');
            $table->string('found_location')->nullable()->after('cause_of_death');
            $table->index('type');
        });
    }

    public function down(): void
    {
        Schema::table('missing_children', function (Blueprint $table) {
            $table->dropIndex(['type']);
            $table->dropColumn(['type', 'cause_of_death', 'found_location']);
        });
    }
};
