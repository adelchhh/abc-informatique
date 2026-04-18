<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'category',
        'description',
        'prix',
        'stock',
        'is_promo',
        'prix_original',
        'prix_promo',
        'image',
        'images', // Tableau JSON des images multiples
    ];

    // Déclarer les colonnes JSON pour Eloquent
    protected $casts = [
        'images' => 'array', // Convertir automatiquement en array/JSON
        'is_promo' => 'boolean', // Convertir en boolean
        'prix' => 'float',
        'prix_original' => 'float',
        'prix_promo' => 'float',
    ];

    /**
     * Obtenir les commandes associées à ce produit.
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
