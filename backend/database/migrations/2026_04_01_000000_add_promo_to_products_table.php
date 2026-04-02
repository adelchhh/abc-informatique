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
        Schema::table('products', function (Blueprint $table) {
            // Ajouter les colonnes pour la promotion
            $table->boolean('is_promo')->default(false)->after('stock');
            $table->decimal('prix_original', 10, 2)->nullable()->after('is_promo');
            $table->decimal('prix_promo', 10, 2)->nullable()->after('prix_original');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['is_promo', 'prix_original', 'prix_promo']);
        });
    }
};
