<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
            $validated = $request->validated();
            
            // Créer le dossier s'il n'existe pas
            $storageDir = public_path('storage/products');
            if (!is_dir($storageDir)) {
                mkdir($storageDir, 0755, true);
            }
            
            // Upload des images multiples ou single
            $imagePaths = [];
            
            // Traiter images[] (multiples - préféré)
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $file) {
                    $filename = uniqid() . '.' . $file->getClientOriginalExtension();
                    $file->move($storageDir, $filename);
                    $path = 'storage/products/' . $filename;
                    if ($path) {
                        $imagePaths[] = $path;
                    }
                }
            }
            // Traiter image (single - compatibilité)
            elseif ($request->hasFile('image')) {
                $file = $request->file('image');
                $filename = uniqid() . '.' . $file->getClientOriginalExtension();
                $file->move($storageDir, $filename);
                $path = 'storage/products/' . $filename;
                if ($path) {
                    $imagePaths[] = $path;
                }
            }
            
            // Ajouter les images au validated
            if (!empty($imagePaths)) {
                $validated['images'] = $imagePaths;
            }
            
            // Créer le produit
            $product = Product::create($validated);
            
            return response()->json([
                'success' => true,
                'message' => 'Produit créé avec succès',
                'data' => $product,
            ], 201);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
    
    /**
     * Format bytes en taille lisible
     */
    private function formatBytes(int $bytes, int $precision = 2): string
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        return round($bytes, $precision) . ' ' . $units[$i];
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
                    $fullPath = public_path($imageToDelete);
                    if (file_exists($fullPath)) {
                        unlink($fullPath);
                        \Log::info('UpdateProduct - Image supprimée:', ['path' => $imageToDelete]);
                    }
                }
            }

            // Ajouter les nouvelles images
            $finalImages = $imagesToKeep;
            
            // Créer le dossier s'il n'existe pas
            $storageDir = public_path('storage/products');
            if (!is_dir($storageDir)) {
                mkdir($storageDir, 0755, true);
            }
            
            if ($request->hasFile('images')) {
                $files = $request->file('images');
                if (!is_array($files)) {
                    $files = [$files];
                }
                foreach ($files as $file) {
                    if ($file instanceof \Illuminate\Http\UploadedFile) {
                        $filename = uniqid() . '.' . $file->getClientOriginalExtension();
                        $file->move($storageDir, $filename);
                        $path = 'storage/products/' . $filename;
                        $finalImages[] = $path;
                        \Log::info('UpdateProduct - Nouvelle image ajoutée:', ['path' => $path]);
                    }
                }
            } elseif ($request->hasFile('image')) {
                // Support de l'image unique (compatibilité avec l'ancienne version)
                $file = $request->file('image');
                $filename = uniqid() . '.' . $file->getClientOriginalExtension();
                $file->move($storageDir, $filename);
                $path = 'storage/products/' . $filename;
                $validated['image'] = $path;
                // Supprimer les anciennes images si on envoie une image unique en PUT
                if ($product->images && is_array($product->images)) {
                    foreach ($product->images as $oldImage) {
                        $fullPath = public_path($oldImage);
                        if (file_exists($fullPath)) {
                            unlink($fullPath);
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
            
            // Supprimer l'image unique si elle existe
            if ($product->image) {
                $fullPath = public_path($product->image);
                if (file_exists($fullPath)) {
                    unlink($fullPath);
                    \Log::info('DeleteProduct - Image unique supprimée:', ['path' => $product->image]);
                }
            }
            
            // Supprimer les images multiples si elles existent
            if ($product->images && is_array($product->images)) {
                foreach ($product->images as $imagePath) {
                    if ($imagePath) {
                        $fullPath = public_path($imagePath);
                        if (file_exists($fullPath)) {
                            unlink($fullPath);
                            \Log::info('DeleteProduct - Image supprimée:', ['path' => $imagePath]);
                        }
                    }
                }
            }
            
            $product->delete();
            \Log::info('DeleteProduct - Produit supprimé complètement:', ['id' => $product->id]);

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
