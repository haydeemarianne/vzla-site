<?php
/**
 * Deploy webhook — llamado por GitHub Actions via curl.
 * Protegido por DEPLOY_SECRET en .env
 */

$secret = getenv('DEPLOY_SECRET') ?: 'vzla-deploy-secret-2026';

// Verificar header de autorización
$authHeader = $_SERVER['HTTP_X_DEPLOY_SECRET'] ?? '';
if (! hash_equals($secret, $authHeader)) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Ejecutar deploy en background y devolver respuesta rápido
$logFile  = '/home/vzla.site/deploy.log';
$deployScript = '/home/vzla.site/deploy.sh';

if (! file_exists($deployScript)) {
    http_response_code(500);
    echo json_encode(['error' => 'deploy.sh not found']);
    exit;
}

// Lanzar en background para no bloquear el request
exec("bash {$deployScript} > {$logFile} 2>&1 &");

http_response_code(200);
header('Content-Type: application/json');
echo json_encode([
    'status'  => 'deploying',
    'log'     => $logFile,
    'time'    => date('Y-m-d H:i:s'),
]);
