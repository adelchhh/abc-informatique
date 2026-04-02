<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'telephone',
        'adresse',
        'product_id',
        'product_name',
        'product_price',
        'statut',
        'note_client',
        'livreur_nom',
        'date_livraison',
    ];

    protected $casts = [
        'statut' => 'string',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Obtenir le produit associé à cette commande.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
