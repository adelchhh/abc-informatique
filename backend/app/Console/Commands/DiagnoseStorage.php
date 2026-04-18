<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class DiagnoseStorage extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'storage:diagnose';

    /**
     * The description of the console command.
     *
     * @var string
     */
    protected $description = 'Diagnostique la configuration du stockage et des symlinks';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('=== DIAGNOSTIC STOCKAGE ===');
        $this->newLine();

        // 1. Vérifier la configuration
        $this->info('1️⃣  Configuration des disques:');
        $publicDiskRoot = Storage::disk('public')->path('');
        $this->line("   Root du disque public: {$publicDiskRoot}");
        $this->line("   URL du disque public: " . config('filesystems.disks.public.url'));
        $this->newLine();

        // 2. Vérifier l'existence des dossiers
        $this->info('2️⃣  État des dossiers:');
        
        $storagePath = storage_path('app/public');
        $publicStoragePath = public_path('storage');
        
        $storageExists = is_dir($storagePath);
        $publicExists = is_dir($publicStoragePath) || is_link($publicStoragePath);
        
        $this->line("   storage/app/public existe: " . ($storageExists ? '✅ OUI' : '❌ NON'));
        if ($storageExists) {
            $this->line("      Permissions: " . substr(sprintf('%o', fileperms($storagePath)), -4));
            $this->line("      Espace utilisé: " . $this->formatBytes($this->getDirectorySize($storagePath)));
        }
        
        $this->line("   public/storage existe: " . ($publicExists ? '✅ OUI' : '❌ NON'));
        if (is_link($publicStoragePath)) {
            $this->line("      C'est un symlink ✔️");
            $this->line("      Pointe vers: " . readlink($publicStoragePath));
        } elseif (is_dir($publicStoragePath)) {
            $this->line("      C'est un dossier normal (PAS un symlink)");
        }
        $this->newLine();

        // 3. Vérifier le dossier products
        $this->info('3️⃣  Dossier products:');
        $productsPath = storage_path('app/public/products');
        $productsExists = is_dir($productsPath);
        
        $this->line("   Existe: " . ($productsExists ? '✅ OUI' : '❌ NON'));
        if ($productsExists) {
            $fileCount = count(File::files($productsPath));
            $this->line("   Nombre de fichiers: {$fileCount}");
            $this->line("   Permissions: " . substr(sprintf('%o', fileperms($productsPath)), -4));
        }
        $this->newLine();

        // 4. Permissions d'écriture
        $this->info('4️⃣  Permissions d\'écriture:');
        $storageWritable = is_writable($storagePath ?? '');
        $productsWritable = is_writable($productsPath ?? '');
        
        $this->line("   storage/app/public writable: " . ($storageWritable ? '✅ OUI' : '❌ NON'));
        $this->line("   storage/app/public/products writable: " . ($productsWritable ? '✅ OUI' : '❌ NON'));
        $this->newLine();

        // 5. Test d'écriture
        $this->info('5️⃣  Test d\'écriture:');
        $testDir = storage_path('app/public/test');
        try {
            if (!is_dir($testDir)) {
                mkdir($testDir, 0775, true);
            }
            file_put_contents($testDir . '/test.txt', 'test');
            $this->line("   Création fichier test: ✅ OK");
            unlink($testDir . '/test.txt');
            rmdir($testDir);
        } catch (\Exception $e) {
            $this->line("   Création fichier test: ❌ " . $e->getMessage());
        }
        $this->newLine();

        // 6. Résumé et recommandations
        $this->info('6️⃣  Recommandations:');
        
        if (!$storageExists) {
            $this->line("   ⚠️  Créer le dossier storage/app/public:");
            $this->line("      mkdir -p " . $storagePath);
        }
        
        if (!$productsExists) {
            $this->line("   ⚠️  Créer le dossier products:");
            $this->line("      mkdir -p {$productsPath}");
        }
        
        if (!$publicExists || !is_link($publicStoragePath)) {
            $this->line("   ⚠️  Créer/recrée le symlink:");
            $this->line("      php artisan storage:link");
        }
        
        if (!$storageWritable || !$productsWritable) {
            $this->line("   ⚠️  Corriger les permissions:");
            $this->line("      chmod -R 775 {$storagePath}");
            $this->line("      chmod -R 775 {$productsPath}");
        }

        $this->newLine();
        $this->info('=== FIN DIAGNOSTIC ===');

        return Command::SUCCESS;
    }

    /**
     * Calcul la taille totale d'un dossier
     */
    private function getDirectorySize(string $path): int
    {
        $size = 0;
        foreach (File::allFiles($path) as $file) {
            $size += $file->getSize();
        }
        return $size;
    }

    /**
     * Formate les bytes en format lisible
     */
    private function formatBytes(int $bytes, int $precision = 2): string
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, $precision) . ' ' . $units[$i];
    }
}
