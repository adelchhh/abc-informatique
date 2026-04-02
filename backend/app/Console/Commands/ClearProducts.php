<?php

namespace App\Console\Commands;

use App\Models\Product;
use Illuminate\Console\Command;

class ClearProducts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'products:clear {--force : Forcer la suppression sans confirmation}';

    /**
     * The description of the console command.
     *
     * @var string
     */
    protected $description = 'Vider tous les produits du catalogue';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Confirmation avant suppression (sauf si --force est utilisé)
        if (!$this->option('force') && !$this->confirm('Êtes-vous sûr de vouloir EFFACER TOUS les produits ? Cette action est irréversible !')) {
            $this->info('Opération annulée.');
            return;
        }

        try {
            $count = Product::count();
            
            // Supprimer tous les produits
            Product::truncate();

            $this->info("✅ {$count} produit(s) supprimé(s) avec succès !");
        } catch (\Exception $e) {
            $this->error("❌ Erreur : " . $e->getMessage());
        }
    }
}
