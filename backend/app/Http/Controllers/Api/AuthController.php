<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;

class AuthController extends Controller
{
    /**
     * Connexion et génération du token
     * POST /api/login
     */
    public function login(Request $request): JsonResponse
    {
        try {
            // Valider les données
            $validated = $request->validate([
                'email' => 'required|email',
                'password' => 'required|min:6',
            ], [
                'email.required' => 'L\'email est requis',
                'email.email' => 'Email invalide',
                'password.required' => 'Le mot de passe est requis',
                'password.min' => 'Le mot de passe doit contenir au minimum 6 caractères',
            ]);

            // Chercher l'utilisateur
            $user = User::where('email', $validated['email'])->first();

            // Vérifier que l'utilisateur existe et le mot de passe est correct
            if (!$user || !Hash::check($validated['password'], $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email ou mot de passe incorrect',
                ], 401);
            }

            // Générer le token Sanctum
            $token = $user->createToken('api-token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Connecté avec succès',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                ],
                'token' => $token,
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation échouée',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la connexion',
                'error' => env('APP_DEBUG') ? $e->getMessage() : 'Erreur serveur',
            ], 500);
        }
    }

    /**
     * Obtenir l'utilisateur courant
     * GET /api/me
     */
    public function me(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Non authentifié',
                ], 401);
            }

            return response()->json([
                'success' => true,
                'message' => 'Utilisateur récupéré',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                ],
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur',
                'error' => env('APP_DEBUG') ? $e->getMessage() : 'Erreur serveur',
            ], 500);
        }
    }

    /**
     * Déconnexion et suppression du token
     * POST /api/logout
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Non authentifié',
                ], 401);
            }

            // Supprimer le token courant
            $user->currentAccessToken()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Déconnecté avec succès',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la déconnexion',
                'error' => env('APP_DEBUG') ? $e->getMessage() : 'Erreur serveur',
            ], 500);
        }
    }
}
