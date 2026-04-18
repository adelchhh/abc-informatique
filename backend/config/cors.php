<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Configure CORS settings for your API. This allows the frontend
    | (React/Vite) running on a different domain to make requests to this API.
    |
    | ✅ For cPanel:
    |    - localhost: development
    |    - yourdomain.com: production
    |    - add more origins as needed
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', '/health'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        // ✅ Development
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:8000',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:8000',
        
        // ✅ cPanel production (update with your actual domains)
        'https://abcinformatique.org',
        'https://www.abcinformatique.org',
        'http://abcinformatique.org',
        'http://www.abcinformatique.org',
    ],

    'allowed_origins_patterns' => [
        // Uncomment for wildcard URLS (NOT recommended for production)
        // '/^https:\/\/.*\.yourdomain\.com/',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [
        'Content-Length',
        'X-JSON-Response',
    ],

    'max_age' => 86400,  // 24 hours cache

    'supports_credentials' => true,

];
