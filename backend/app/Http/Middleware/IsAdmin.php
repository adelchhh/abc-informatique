<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Vérifier que l'utilisateur est authentifié
        if (!$request->user()) {
            return response()->json([
                'success' => false,
                'message' => 'Non authentifié',
            ], 401);
        }

        // Vérifier que l'utilisateur a le rôle 'admin' ou 'super_admin'
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json([
                'success' => false,
                'message' => 'Accès réservé aux administrateurs',
            ], 403);
        }

        return $next($request);
    }
}
