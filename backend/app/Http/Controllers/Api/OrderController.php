<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Récupérer toutes les commandes
     * GET /api/orders
     */
    public function index(): JsonResponse
    {
        try {
            $orders = Order::query()
                ->select('id', 'nom', 'telephone', 'adresse', 'product_id', 'product_name', 'product_price', 'statut', 'note_client', 'livreur_nom', 'date_livraison', 'created_at', 'updated_at')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Commandes récupérées avec succès',
                'count' => $orders->count(),
                'data' => $orders,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des commandes',
                'error' => env('APP_DEBUG') ? $e->getMessage() : 'Erreur serveur',
            ], 500);
        }
    }

    /**
     * Récupérer une commande spécifique
     * GET /api/orders/{id}
     */
    public function show($id): JsonResponse
    {
        try {
            // Valider l'ID
            if (!is_numeric($id) || $id <= 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'L\'ID de la commande doit être un nombre positif',
                ], 400);
            }

            $order = Order::with('product')->find($id);

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Commande non trouvée',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Commande récupérée avec succès',
                'data' => $order,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération de la commande',
                'error' => env('APP_DEBUG') ? $e->getMessage() : 'Erreur serveur',
            ], 500);
        }
    }

    /**
     * Créer une nouvelle commande
     * POST /api/orders
     */
    public function store(StoreOrderRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            // Récupérer le produit pour sauvegarder nom et prix
            $product = Product::find($validated['product_id']);

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Le produit sélectionné n\'existe pas',
                ], 404);
            }

            // Vérifier le stock
            if ($product->stock <= 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ce produit est en rupture de stock',
                ], 400);
            }

            $order = Order::create([
                'nom' => $validated['nom'],
                'telephone' => $validated['telephone'],
                'adresse' => $validated['adresse'],
                'product_id' => $validated['product_id'],
                'product_name' => $product->nom,
                'product_price' => $product->prix,
                'quantite' => $validated['quantité'] ?? 1,
                'note_client' => $validated['note_client'] ?? null,
                'statut' => 'en_attente', // Statut par défaut
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Commande créée avec succès',
                'data' => $order->load('product'),
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
                'message' => 'Erreur lors de la création de la commande',
                'error' => env('APP_DEBUG') ? $e->getMessage() : 'Erreur serveur',
            ], 500);
        }
    }

    /**
     * Mettre à jour le statut d'une commande
     * PUT /api/orders/{id}
     */
    public function update($id, UpdateOrderRequest $request): JsonResponse
    {
        try {
            // Valider l'ID
            if (!is_numeric($id) || $id <= 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'L\'ID de la commande doit être un nombre positif',
                ], 400);
            }

            $order = Order::find($id);

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Commande non trouvée',
                ], 404);
            }

            $validated = $request->validated();
            \Log::info('UpdateOrder - Données reçues:', $request->all());
            \Log::info('UpdateOrder - Données validées:', $validated);
            \Log::info('UpdateOrder - Avant update, statut:', [$order->statut]);
            
            $order->update($validated);
            
            \Log::info('UpdateOrder - Après update, statut:', [$order->statut]);
            $order->refresh();
            \Log::info('UpdateOrder - Après refresh, statut:', [$order->statut]);

            return response()->json([
                'success' => true,
                'message' => 'Commande mise à jour avec succès',
                'data' => $order->load('product'),
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('UpdateOrder Exception:', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour de la commande',
                'error' => env('APP_DEBUG') ? $e->getMessage() : 'Erreur serveur',
            ], 500);
        }
    }

    /**
     * Supprimer une commande
     * DELETE /api/orders/{id}
     */
    public function destroy($id): JsonResponse
    {
        try {
            // Valider l'ID
            if (!is_numeric($id) || $id <= 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'L\'ID de la commande doit être un nombre positif',
                ], 400);
            }

            $order = Order::find($id);

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Commande non trouvée',
                ], 404);
            }

            $orderId = $order->id;
            $order->delete();

            return response()->json([
                'success' => true,
                'message' => "Commande #$orderId supprimée avec succès",
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression de la commande',
                'error' => env('APP_DEBUG') ? $e->getMessage() : 'Erreur serveur',
            ], 500);
        }
    }

    /**
     * Récupérer les commandes par statut
     * GET /api/orders/status/{status}
     */
    public function getByStatus($status): JsonResponse
    {
        try {
            $validStatuses = ['en_attente', 'confirmé', 'livré'];

            if (!in_array($status, $validStatuses)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Statut invalide. Statuts valides : en_attente, confirmé, livré',
                ], 400);
            }

            $orders = Order::with('product')
                ->where('statut', $status)
                ->select('id', 'nom', 'telephone', 'adresse', 'product_id', 'product_name', 'product_price', 'statut', 'note_client', 'livreur_nom', 'date_livraison', 'created_at', 'updated_at')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'message' => "Commandes avec statut '$status' récupérées",
                'count' => $orders->count(),
                'data' => $orders,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des commandes',
                'error' => env('APP_DEBUG') ? $e->getMessage() : 'Erreur serveur',
            ], 500);
        }
    }
}
