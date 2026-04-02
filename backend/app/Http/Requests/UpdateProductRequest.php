<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // À implémenter : vérifier si admin
    }

    /**
     * Nettoyer et formater les prix avant validation
     * Accepte : 125000, 125.000, 125 000, 125,50, 125 000,50
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('prix')) {
            $prix = $this->prix;
            // Enlever les espaces
            $prix = str_replace(' ', '', $prix);
            // Remplacer la virgule par un point (format français)
            $prix = str_replace(',', '.', $prix);
            
            $this->merge([
                'prix' => $prix,
            ]);
        }

        // Convertir is_promo en booléen
        if ($this->has('is_promo')) {
            $isPromo = $this->is_promo;
            // Si c'est une string "0" ou "1", convertir en booléen
            if (is_string($isPromo)) {
                $isPromo = $isPromo === '1' || $isPromo === 'true';
            }
            $this->merge(['is_promo' => $isPromo ? 1 : 0]);
        }

        // Formater prix_original
        if ($this->has('prix_original')) {
            $prixOriginal = $this->prix_original;
            $prixOriginal = str_replace(' ', '', $prixOriginal);
            $prixOriginal = str_replace(',', '.', $prixOriginal);
            
            $this->merge([
                'prix_original' => $prixOriginal ?: null,
            ]);
        }

        // Formater prix_promo
        if ($this->has('prix_promo')) {
            $prixPromo = $this->prix_promo;
            $prixPromo = str_replace(' ', '', $prixPromo);
            $prixPromo = str_replace(',', '.', $prixPromo);
            
            $this->merge([
                'prix_promo' => $prixPromo ?: null,
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'nom' => 'sometimes|string|max:255|min:3',
            'category' => 'nullable|string|in:laptop,unité,imprimante,modem,autre',
            'description' => 'nullable|string|max:1000',
            'prix' => 'sometimes|numeric|min:0.01|max:999999.99',
            'stock' => 'sometimes|integer|min:0|max:999999',
            // Promotion
            'is_promo' => 'nullable|boolean',
            'prix_original' => 'nullable|numeric|min:0.01|max:999999.99',
            'prix_promo' => 'nullable|numeric|min:0.01|max:999999.99',
            // Images multiples
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp,bmp,svg,tiff,ico|max:52428800', // 50MB par image
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,bmp,svg,tiff,ico|max:52428800', // 50MB max (compatibilité)
            // Images existantes
            'existingImages' => 'nullable|array',
            'existingImages.*' => 'string',
            // Indices des images à supprimer
            'imagesToRemove' => 'nullable|string',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nom.min' => 'Le nom doit contenir au moins 3 caractères',
            'nom.max' => 'Le nom ne peut pas dépasser 255 caractères',
            'prix.numeric' => 'Le prix doit être un nombre valide',
            'prix.min' => 'Le prix doit être supérieur à 0',
            'stock.integer' => 'Le stock doit être un nombre entier',
            'stock.min' => 'Le stock ne peut pas être négatif',
        ];
    }
}
