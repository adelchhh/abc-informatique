<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $all = $this->all();
        $json = $this->getContent();
        \Log::info('UpdateOrderRequest::authorize - all():', $all);
        \Log::info('UpdateOrderRequest::authorize - getContent():', [$json]);
        \Log::info('UpdateOrderRequest::authorize - json():', [$this->json()->all()]);
        return true; // À implémenter : vérifier si admin
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        \Log::info('UpdateOrderRequest::rules - Toutes les données reçues:', $this->all());
        \Log::info('UpdateOrderRequest::rules - Input keys:', array_keys($this->all()));
        return [
            'statut' => 'sometimes|in:en_attente,confirmé,livré',
            'livreur_nom' => 'nullable|string|max:255|min:2',
            'date_livraison' => 'nullable|date|after_or_equal:today',
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
            'statut.in' => 'Le statut doit être parmi : en_attente, confirmé, livré',
            'livreur_nom.min' => 'Le nom du livreur doit contenir au moins 2 caractères',
            'livreur_nom.max' => 'Le nom du livreur ne peut pas dépasser 255 caractères',
            'date_livraison.date' => 'La date de livraison doit être une date valide',
            'date_livraison.after_or_equal' => 'La date de livraison ne peut pas être dans le passé',
        ];
    }
}
