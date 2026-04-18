<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductRequestController extends Controller
{
    /**
     * Récupérer toutes les demandes de produits (Admin)
     * GET /api/product-requests
     */
    public function index(): JsonResponse
    {
        try {
            $requests = ProductRequest::orderBy('created_at', 'desc')->get();

            return response()->json([
                'success' => true,
                'message' => 'Demandes de produits récupérées avec succès',
                'count' => $requests->count(),
                'data' => $requests,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des demandes',
                'error' => env('APP_DEBUG') ? $e->getMessage() : 'Erreur serveur',
            ], 500);
        }
    }

    /**
     * Récupérer une demande spécifique
     * GET /api/product-requests/{id}
     */
    public function show($id): JsonResponse
    {
        try {
            // Valider l'ID
            if (!is_numeric($id) || $id <= 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'L\'ID de la demande doit être un nombre positif',
                ], 400);
            }

            $request = ProductRequest::find($id);

            if (!$request) {
                return response()->json([
                    'success' => false,
                    'message' => 'Demande non trouvée',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Demande récupérée avec succès',
                'data' => $request,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération de la demande',
                'error' => env('APP_DEBUG') ? $e->getMessage() : 'Erreur serveur',
            ], 500);
        }
    }

    /**
     * Créer une nouvelle demande de produit
     * POST /api/product-requests
     */
    public function store(Request $request): JsonResponse
    {
        try {
            // DEBUG: Vérifier les données reçues
            \Log::info('ProductRequest received:', $request->all());
            
            // Valider les données
            $validated = $request->validate([
                'nom' => 'required|string|max:255',
                'prenom' => 'required|string|max:255',
                'telephone' => 'required|string|max:20',
                'description_produit' => 'required|string|min:10',
            ], [
                'nom.required' => 'Le nom est requis',
                'prenom.required' => 'Le prénom est requis',
                'telephone.required' => 'Le numéro de téléphone est requis',
                'description_produit.required' => 'La description du produit est requise',
                'description_produit.min' => 'La description doit contenir au moins 10 caractères',
            ]);

            $productRequest = ProductRequest::create([
                'nom' => $validated['nom'],
                'prenom' => $validated['prenom'],
                'telephone' => $validated['telephone'],
                'description_produit' => $validated['description_produit'],
                'status' => 'nouveau',
            ]);

            \Log::info('ProductRequest created successfully:', $productRequest->toArray());

            return response()->json([
                'success' => true,
                'message' => 'Demande de produit créée avec succès. L\'administrateur va examiner votre demande.',
                'data' => $productRequest,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::warning('ProductRequest validation error:', $e->errors());
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('ProductRequest creation error:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de la demande',
                'error' => $e->getMessage(), // FORCER affichage erreur pour debug
                'debug_info' => [
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                ],
            ], 500);
        }
    }

    /**
     * Mettre à jour le statut d'une demande (Admin)
     * PUT /api/product-requests/{id}
     */
    public function update($id, Request $request): JsonResponse
    {
        try {
            // Valider l'ID
            if (!is_numeric($id) || $id <= 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'L\'ID de la demande doit être un nombre positif',
                ], 400);
            }

            $productRequest = ProductRequest::find($id);

            if (!$productRequest) {
                return response()->json([
                    'success' => false,
                    'message' => 'Demande non trouvée',
                ], 404);
            }

            // Valider le statut
            $validated = $request->validate([
                'status' => 'required|in:nouveau,lu,traité',
            ]);

            $productRequest->update(['status' => $validated['status']]);

            return response()->json([
                'success' => true,
                'message' => 'Statut de la demande mis à jour avec succès',
                'data' => $productRequest,
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour de la demande',
                'error' => env('APP_DEBUG') ? $e->getMessage() : 'Erreur serveur',
            ], 500);
        }
    }

    /**
     * Supprimer une demande (Admin)
     * DELETE /api/product-requests/{id}
     */
    public function destroy($id): JsonResponse
    {
        try {
            // Valider l'ID
            if (!is_numeric($id) || $id <= 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'L\'ID de la demande doit être un nombre positif',
                ], 400);
            }

            $productRequest = ProductRequest::find($id);

            if (!$productRequest) {
                return response()->json([
                    'success' => false,
                    'message' => 'Demande non trouvée',
                ], 404);
            }

            $productRequest->delete();

            return response()->json([
                'success' => true,
                'message' => 'Demande supprimée avec succès',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression de la demande',
                'error' => env('APP_DEBUG') ? $e->getMessage() : 'Erreur serveur',
            ], 500);
        }
    }
}
