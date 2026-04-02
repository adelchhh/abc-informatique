<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Enregistrer le middleware CORS pour les routes API
        $middleware->api(append: [
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);
        
        // Enregistrer le middleware IsAdmin
        $middleware->alias([
            'isadmin' => \App\Http\Middleware\IsAdmin::class,
            'issuperadmin' => \App\Http\Middleware\IsSuperAdmin::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
