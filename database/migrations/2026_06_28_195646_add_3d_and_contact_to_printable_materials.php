<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('printable_materials', function (Blueprint $table) {
            $table->string('contributor_instagram')->nullable()->after('contact');
            $table->string('contributor_phone')->nullable()->after('contributor_instagram');
            $table->string('subcategory')->nullable()->after('category');
            $table->boolean('is_3d')->default(false)->after('subcategory');
        });
    }

    public function down(): void
    {
        Schema::table('printable_materials', function (Blueprint $table) {
            $table->dropColumn(['contributor_instagram', 'contributor_phone', 'subcategory', 'is_3d']);
        });
    }
};
