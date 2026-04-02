<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Récupérer tous les produits
     * GET /api/products
     */
    public function index(): JsonResponse
    {
        try {
            $products = Product::select('id', 'nom', 'category', 'description', 'prix', 'stock', 'is_promo', 'prix_original', 'prix_promo', 'image', 'images', 'created_at', 'updated_at')
                ->orderBy('created_at', 'desc')
                ->get();
            
            return response()->json([
                'success' => true,
                'message' => 'Produits récupérés avec succès',
                'count' => $products->count(),
                'data' => $products,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des produits',
                'error' => env('APP_DEBUG') ? $e->getMessage() : 'Erreur serveur',
            ], 500);
        }
    }

    /**
     * Récupérer un produit spécifique
     * GET /api/products/{id}
     */
    public function show($id): JsonResponse
    {
        try {
            // Valider l'ID
            if (!is_numeric($id) || $id <= 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'L\'ID du produit doit être un nombre positif',
                ], 400);
            }

            $product = Product::find($id);

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Produit non trouvé',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Produit récupéré avec succès',
                'data' => $product,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération du produit',
                'error' => env('APP_DEBUG') ? $e->getMessage() : 'Erreur serveur',
            ], 500);
        }
    }

    /**
     * Créer un nouveau produit (Admin)
     * POST /api/products
     */
    public function store(StoreProductRequest $request): JsonResponse
    {
        try {
            \Log::info('StoreProduct - Début du processus', ['all_request' => $request->all()]);
            $validated = $request->validated();
            \Log::info('StoreProduct - Données validées:', $validated);

            // Gérer l'upload des images multiples
            $imagePaths = [];
            if ($request->hasFile('images')) {
                \Log::info('StoreProduct - Fichiers trouvés en images[]');
                $files = $request->file('images');
                // S'assurer que c'est un tableau
                if (!is_array($files)) {
                    $files = [$files];
                }
                \Log::info('StoreProduct - Nombre de fichiers:', ['count' => count($files)]);
                
                foreach ($files as $file) {
                    if ($file instanceof \Illuminate\Http\UploadedFile) {
                        \Log::info('StoreProduct - Upload fichier:', ['name' => $file->getClientOriginalName()]);
                        $path = $file->store('products', 'public');
                        $imagePaths[] = $path;
                        \Log::info('StoreProduct - Fichier sauvegardé:', ['path' => $path]);
                    }
                }
            } elseif ($request->hasFile('image')) {
                // Support de l'image unique (compatibilité avec l'ancienne version)
                \Log::info('StoreProduct - Image unique trouvée');
                $file = $request->file('image');
                $path = $file->store('products', 'public');
                $validated['image'] = $path;
            } else {
                \Log::warning('StoreProduct - Aucun fichier image trouvé');
            }

            // Ajouter les images au validated si présentes
            if (!empty($imagePaths)) {
                $validated['images'] = $imagePaths;
                \Log::info('StoreProduct - Images à sauvegarder:', ['paths' => $imagePaths]);
            }

            \Log::info('StoreProduct - Avant création du produit:', $validated);
            $product = Product::create($validated);
            \Log::info('StoreProduct - Produit créé avec succès:', ['id' => $product->id]);

            return response()->json([
                'success' => true,
                'message' => 'Produit créé avec succès',
                'data' => $product,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('StoreProduct - Erreur de validation:', $e->errors());
            \Log::error('StoreProduct - Request all:', $request->all());
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('StoreProduct - Exception:', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du produit',
                'error' => env('APP_DEBUG') ? $e->getMessage() : 'Erreur serveur',
            ], 500);
        }
    }

    /**
     * Mettre à jour un produit (Admin)
     * PUT /api/products/{id}
     */
    public function update($id, UpdateProductRequest $request): JsonResponse
    {
        try {
            // Valider l'ID
            if (!is_numeric($id) || $id <= 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'L\'ID du produit doit être un nombre positif',
                ], 400);
            }

            $product = Product::find($id);

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Produit non trouvé',
                ], 404);
            }

            $validated = $request->validated();

            // Récupérer les images actuelles du produit
            $currentImages = $product->images ?? [];
            if ($product->image && !$currentImages) {
                $currentImages = [$product->image];
            }
            \Log::info('UpdateProduct - Images actuelles:', ['images' => $currentImages]);

            // Traiter les images existantes à garder
            $imagesToKeep = [];
            if ($request->has('existingImages') && is_array($request->input('existingImages'))) {
                $imagesToKeep = $request->input('existingImages');
            }
            \Log::info('UpdateProduct - Images à garder:', ['images' => $imagesToKeep]);

            // Traiter les indices des images à supprimer
            $imagesToRemove = [];
            if ($request->has('imagesToRemove')) {
                $removeData = $request->input('imagesToRemove');
                if (is_string($removeData)) {
                    $imagesToRemove = json_decode($removeData, true) ?? [];
                } elseif (is_array($removeData)) {
                    $imagesToRemove = $removeData;
                }
            }
            \Log::info('UpdateProduct - Indices à supprimer:', ['indices' => $imagesToRemove]);

            // Supprimer les images
            foreach ($imagesToRemove as $indexToRemove) {
                if (isset($currentImages[$indexToRemove])) {
                    $imageToDelete = $currentImages[$indexToRemove];
                    if (Storage::disk('public')->exists($imageToDelete)) {
                        Storage::disk('public')->delete($imageToDelete);
                        \Log::info('UpdateProduct - Image supprimée:', ['path' => $imageToDelete]);
                    }
                }
            }

            // Ajouter les nouvelles images
            $finalImages = $imagesToKeep;
            if ($request->hasFile('images')) {
                $files = $request->file('images');
                if (!is_array($files)) {
                    $files = [$files];
                }
                foreach ($files as $file) {
                    if ($file instanceof \Illuminate\Http\UploadedFile) {
                        $path = $file->store('products', 'public');
                        $finalImages[] = $path;
                        \Log::info('UpdateProduct - Nouvelle image ajoutée:', ['path' => $path]);
                    }
                }
            } elseif ($request->hasFile('image')) {
                // Support de l'image unique (compatibilité avec l'ancienne version)
                $file = $request->file('image');
                $path = $file->store('products', 'public');
                $validated['image'] = $path;
                // Supprimer les anciennes images si on envoie une image unique en PUT
                if ($product->images && is_array($product->images)) {
                    foreach ($product->images as $oldImage) {
                        if (Storage::disk('public')->exists($oldImage)) {
                            Storage::disk('public')->delete($oldImage);
                        }
                    }
                }
            }

            // Mettre à jour les images finales
            if (!empty($finalImages)) {
                $validated['images'] = array_values($finalImages); // Réindexer le tableau
            }
            \Log::info('UpdateProduct - Images finales:', ['images' => $finalImages]);

            $product->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Produit mis à jour avec succès',
                'data' => $product,
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
                'message' => 'Erreur lors de la mise à jour du produit',
                'error' => env('APP_DEBUG') ? $e->getMessage() : 'Erreur serveur',
            ], 500);
        }
    }

    /**
     * Supprimer un produit (Admin)
     * DELETE /api/products/{id}
     */
    public function destroy($id): JsonResponse
    {
        try {
            // Valider l'ID
            if (!is_numeric($id) || $id <= 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'L\'ID du produit doit être un nombre positif',
                ], 400);
            }

            $product = Product::find($id);

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Produit non trouvé',
                ], 404);
            }

            $productName = $product->nom;
            
            // Supprimer l'image si elle existe
            if ($product->image && Storage::disk('public')->exists($product->image)) {
                Storage::disk('public')->delete($product->image);
            }
            
            $product->delete();

            return response()->json([
                'success' => true,
                'message' => "Produit '$productName' supprimé avec succès",
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression du produit',
                'error' => env('APP_DEBUG') ? $e->getMessage() : 'Erreur serveur',
            ], 500);
        }
    }
}
