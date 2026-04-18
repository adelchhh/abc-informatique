<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Créer un utilisateur administrateur
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
            ]
        );

        // Créer ou mettre à jour l'utilisateur super admin
        User::updateOrCreate(
            ['email' => 'adelchouia4@gmail.com'],
            [
                'name' => 'Adel - Super Admin',
                'password' => Hash::make('adel12adel12A'),
                'role' => 'super_admin',
            ]
        );

        // Créer 50 produits via le ProductSeeder
        $this->call(ProductSeeder::class);

        // Créer des commandes de test
        $orders = [
            [
                'nom' => 'Mohamed Ali',
                'telephone' => '+216 98 123 456',
                'adresse' => '123 Rue de France, Tunis 1000',
                'product_id' => 1,
                'product_name' => 'Ordinateur Portable Dell XPS 13',
                'product_price' => 1299.99,
                'statut' => 'en_attente',
                'note_client' => 'Livraison avant 17h si possible',
                'livreur_nom' => null,
                'date_livraison' => null,
            ],
            [
                'nom' => 'Fatima Ben Salah',
                'telephone' => '+216 91 234 567',
                'adresse' => '456 Avenue Mohamed V, Sfax 3000',
                'product_id' => 3,
                'product_name' => 'Clavier mécanique RGB',
                'product_price' => 129.99,
                'statut' => 'confirmé',
                'note_client' => null,
                'livreur_nom' => 'Ahmed Chebbi',
                'date_livraison' => \Carbon\Carbon::now()->addDays(2),
            ],
            [
                'nom' => 'Karim Khaled',
                'telephone' => '+216 97 876 543',
                'adresse' => '789 Rue du Hammam, Sousse 4000',
                'product_id' => 5,
                'product_name' => 'Disque SSD 1TB NVMe',
                'product_price' => 89.99,
                'statut' => 'livré',
                'note_client' => 'Merci pour la livraison rapide',
                'livreur_nom' => 'Salah Eddine',
                'date_livraison' => \Carbon\Carbon::now(),
            ],
        ];

        foreach ($orders as $order) {
            Order::create($order);
        }
    }
}
