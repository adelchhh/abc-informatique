<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Créer un nouvel administrateur (Super Admin uniquement)
     * POST /api/users/create-admin
     */
    public function createAdmin(Request $request): JsonResponse
    {
        try {
            // Valider les données
            $validated = $request->validate([
                'name' => 'required|string|max:255|min:3',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:8|confirmed',
            ], [
                'name.required' => 'Le nom est obligatoire',
                'name.min' => 'Le nom doit contenir au moins 3 caractères',
                'email.required' => 'L\'email est obligatoire',
                'email.unique' => 'Cet email existe déjà',
                'password.required' => 'Le mot de passe est obligatoire',
                'password.min' => 'Le mot de passe doit contenir au moins 8 caractères',
                'password.confirmed' => 'Les mots de passe ne correspondent pas',
            ]);

            // Créer le nouvel utilisateur admin
            $adminUser = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]);

            \Log::info('Nouvel admin créé par ' . $request->user()->email, [
                'admin_id' => $adminUser->id,
                'admin_email' => $adminUser->email,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Administrateur créé avec succès',
                'data' => [
                    'id' => $adminUser->id,
                    'name' => $adminUser->name,
                    'email' => $adminUser->email,
                    'role' => $adminUser->role,
                ],
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Erreur création admin:', ['message' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de l\'administrateur',
                'error' => env('APP_DEBUG') ? $e->getMessage() : 'Erreur serveur',
            ], 500);
        }
    }

    /**
     * Récupérer tous les administrateurs
     * GET /api/users/admins
     */
    public function getAdmins(): JsonResponse
    {
        try {
            $admins = User::whereIn('role', ['admin', 'super_admin'])
                ->select('id', 'name', 'email', 'role', 'created_at')
                ->orderBy('role', 'desc')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Administrateurs récupérés',
                'count' => $admins->count(),
                'data' => $admins,
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Erreur récupération admins:', ['message' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des administrateurs',
                'error' => env('APP_DEBUG') ? $e->getMessage() : 'Erreur serveur',
            ], 500);
        }
    }

    /**
     * Supprimer un administrateur (Super Admin uniquement)
     * DELETE /api/users/{id}
     */
    public function deleteUser($id): JsonResponse
    {
        try {
            // Vérifier que ce n'est pas le dernier super_admin
            $user = User::find($id);
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non trouvé',
                ], 404);
            }

            if ($user->role === 'super_admin') {
                $superAdminCount = User::where('role', 'super_admin')->count();
                if ($superAdminCount <= 1) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Impossible de supprimer le dernier super administrateur',
                    ], 403);
                }
            }

            // Empêcher la suppression du compte actuel
            if ($user->id === auth()->id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous ne pouvez pas supprimer votre propre compte',
                ], 403);
            }

            $userName = $user->name;
            $user->delete();

            \Log::info('Admin supprimé par ' . auth()->user()->email, [
                'deleted_admin' => $userName,
                'deleted_admin_id' => $id,
            ]);

            return response()->json([
                'success' => true,
                'message' => "L'administrateur '$userName' a été supprimé",
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Erreur suppression utilisateur:', ['message' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression',
                'error' => env('APP_DEBUG') ? $e->getMessage() : 'Erreur serveur',
            ], 500);
        }
    }
}
