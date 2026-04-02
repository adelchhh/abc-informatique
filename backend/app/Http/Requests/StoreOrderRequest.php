<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Tous les utilisateurs peuvent créer une commande
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'nom' => 'required|string|max:255|min:2',
            'telephone' => 'required|string|max:30|min:8',
            'adresse' => 'required|string|max:1000|min:5',
            'product_id' => 'required|integer|exists:products,id',
            'quantité' => 'nullable|integer|min:1|max:999',
            'note_client' => 'nullable|string|max:500',
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
            'nom.required' => 'Le nom est obligatoire',
            'nom.min' => 'Le nom doit contenir au moins 2 caractères',
            'nom.max' => 'Le nom ne peut pas dépasser 255 caractères',
            'telephone.required' => 'Le téléphone est obligatoire',
            'telephone.min' => 'Le téléphone doit être valide',
            'telephone.max' => 'Le téléphone ne peut pas dépasser 30 caractères',
            'adresse.required' => 'L\'adresse est obligatoire',
            'adresse.min' => 'L\'adresse doit contenir au moins 5 caractères',
            'adresse.max' => 'L\'adresse ne peut pas dépasser 1000 caractères',
            'product_id.required' => 'Vous devez sélectionner un produit',
            'product_id.exists' => 'Le produit sélectionné n\'existe pas ou a été supprimé',
            'quantité.integer' => 'La quantité doit être un nombre entier',
            'quantité.min' => 'La quantité doit être au moins 1',
            'quantité.max' => 'La quantité ne peut pas dépasser 999',
            'note_client.max' => 'La note ne peut pas dépasser 500 caractères',
        ];
    }
}
