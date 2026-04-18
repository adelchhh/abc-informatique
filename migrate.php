<?php
$backend_exists = is_dir('/home/pfsqqgdm/public_html/backend');
$autoload_exists = file_exists('/home/pfsqqgdm/public_html/backend/vendor/autoload.php');

echo "<h1>DIAGNOSTIC</h1>";
echo "Backend existe? " . ($backend_exists ? "✓ OUI" : "✗ NON") . "<br>";
echo "Autoload existe? " . ($autoload_exists ? "✓ OUI" : "✗ NON") . "<br>";

if ($autoload_exists) {
    echo "<h2>Exécution des migrations...</h2>";
    try {
        require '/home/pfsqqgdm/public_html/backend/vendor/autoload.php';
        $app = require_once '/home/pfsqqgdm/public_html/backend/bootstrap/app.php';
        $kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
        $status = $kernel->call('migrate');
        echo "✓ Migrations terminées! Status: $status";
    } catch (Exception $e) {
        echo "✗ Erreur: " . $e->getMessage();
    }
} else {
    echo "<br><br>Liste des fichiers en public_html:<br>";
    echo "<pre>";
    print_r(scandir('/home/pfsqqgdm/public_html/'));
    echo "</pre>";
}
?>
