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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('telephone', 30);
            $table->text('adresse');
            
            // Clé étrangère vers le produit (nullable pour éviter la suppression en cascade)
            $table->foreignId('product_id')->nullable()->constrained('products')->onDelete('set null');
            
            // Sauvegarde des informations du produit au moment de la commande
            $table->string('product_name')->comment('Copie du nom du produit au moment de la commande');
            $table->decimal('product_price', 10, 2)->comment('Copie du prix du produit au moment de la commande');
            
            // Gestion du statut et des notes
            $table->enum('statut', ['en_attente', 'confirmé', 'livré'])->default('en_attente');
            $table->text('note_client')->nullable();
            
            // Gestion de la livraison
            $table->string('livreur_nom')->nullable()->comment('Nom du livreur assigné');
            $table->timestamp('date_livraison')->nullable()->comment('Date estimée ou réelle de livraison');
            
            // Timestamps
            $table->timestamps();
            
            // Index pour optimiser les requêtes
            $table->index('statut');
            $table->index('created_at');
            $table->index('product_id');
            $table->index('date_livraison');
            $table->index('nom');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
