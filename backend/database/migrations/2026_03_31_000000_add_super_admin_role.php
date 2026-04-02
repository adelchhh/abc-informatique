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
        // Modifier la colonne role pour inclure 'super_admin'
        // Note: SQLite ne supporte pas la modification d'enums directement
        // On doit utiliser du SQL brut
        DB::statement("
            UPDATE users SET role = 'user' WHERE role NOT IN ('admin', 'user', 'super_admin')
        ");
        
        // Pour SQLite, on ne peut pas modifier enum, on change simplement le type
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('user')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['admin', 'user'])->default('user')->change();
        });
    }
};
