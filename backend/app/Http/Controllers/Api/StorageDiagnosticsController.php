<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class StorageDiagnosticsController extends Controller
{
    /**
     * Obtenir le diagnostic du stockage
     * GET /api/admin/storage/diagnostics
     * 
     * @return JsonResponse
     */
    public function diagnostics(): JsonResponse
    {
        try {
            $publicDiskRoot = Storage::disk('public')->path('');
            $storagePath = storage_path('app/public');
            $publicStoragePath = public_path('storage');
            $productsPath = storage_path('app/public/products');
            
            $storageExists = is_dir($storagePath);
            $publicExists = is_dir($publicStoragePath) || is_link($publicStoragePath);
            $productsExists = is_dir($productsPath);
            
            $isSymlink = is_link($publicStoragePath);
            $symlinkTarget = $isSymlink ? readlink($publicStoragePath) : null;
            
            $storageWritable = is_writable($storagePath ?? '');
            $productsWritable = is_writable($productsPath ?? '');
            
            $fileCount = $productsExists ? count(File::files($productsPath)) : 0;
            
            // Vérifier les permissions
            $storagePerms = $storageExists ? substr(sprintf('%o', fileperms($storagePath)), -4) : null;
            $productsPerms = $productsExists ? substr(sprintf('%o', fileperms($productsPath)), -4) : null;
            
            // Tester l'écriture
            $writeTest = $this->testWrite();
            
            $diagnostics = [
                'storage_root' => $publicDiskRoot,
                'storage_url' => config('filesystems.disks.public.url'),
                'folders' => [
                    'storage_app_public' => [
                        'exists' => $storageExists,
                        'path' => $storagePath,
                        'writable' => $storageWritable,
                        'permissions' => $storagePerms,
                    ],
                    'public_storage' => [
                        'exists' => $publicExists,
                        'path' => $publicStoragePath,
                        'is_symlink' => $isSymlink,
                        'symlink_target' => $symlinkTarget,
                    ],
                    'products' => [
                        'exists' => $productsExists,
                        'path' => $productsPath,
                        'writable' => $productsWritable,
                        'permissions' => $productsPerms,
                        'file_count' => $fileCount,
                    ],
                ],
                'tests' => [
                    'write_test' => $writeTest,
                ],
                'status' => $this->getStatus($storageExists, $publicExists, $isSymlink, $productsExists, $storageWritable, $productsWritable),
            ];
            
            return response()->json([
                'success' => true,
                'message' => 'Diagnostic du stockage',
                'data' => $diagnostics,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du diagnostic',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Liste les fichiers du dossier products
     * GET /api/admin/storage/products
     * 
     * @return JsonResponse
     */
    public function listProducts(): JsonResponse
    {
        try {
            $productsPath = storage_path('app/public/products');
            
            if (!is_dir($productsPath)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Le dossier products n\'existe pas',
                ], 404);
            }
            
            $files = File::files($productsPath);
            $fileList = [];
            
            foreach ($files as $file) {
                $fileList[] = [
                    'name' => $file->getFilename(),
                    'size' => $file->getSize(),
                    'modified' => $file->getMTime(),
                    'url' => config('filesystems.disks.public.url') . '/products/' . $file->getFilename(),
                ];
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Fichiers du dossier products',
                'count' => count($fileList),
                'data' => $fileList,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des fichiers',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Teste l'upload et suppression d'un fichier test
     * 
     * @return array
     */
    private function testWrite(): array
    {
        try {
            $testDir = storage_path('app/public/test');
            $testFile = $testDir . '/test_' . time() . '.txt';
            
            if (!is_dir($testDir)) {
                mkdir($testDir, 0775, true);
            }
            
            file_put_contents($testFile, 'test content');
            $fileExists = file_exists($testFile);
            
            if ($fileExists) {
                unlink($testFile);
            }
            
            if (is_dir($testDir) && count(File::files($testDir)) === 0) {
                rmdir($testDir);
            }
            
            return [
                'success' => true,
                'message' => 'Test d\'écriture réussi',
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Erreur lors du test d\'écriture: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Détermine le statut global
     * 
     * @return string
     */
    private function getStatus(
        bool $storageExists,
        bool $publicExists,
        bool $isSymlink,
        bool $productsExists,
        bool $storageWritable,
        bool $productsWritable
    ): string {
        if (!$storageExists) {
            return 'error: storage/app/public missing';
        }
        
        if (!$publicExists) {
            return 'error: public/storage missing';
        }
        
        if (!$isSymlink) {
            return 'warning: public/storage is not a symlink';
        }
        
        if (!$productsExists) {
            return 'error: products folder missing';
        }
        
        if (!$storageWritable || !$productsWritable) {
            return 'error: permission denied';
        }
        
        return 'ok: all systems operational';
    }
}
