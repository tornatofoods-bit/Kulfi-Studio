<?php
require_once __DIR__ . '/config.php';
sendCorsHeaders();

$user = getSessionUser();

echo json_encode([
    'success' => true,
    'mode' => 'php',
    'user' => $user
]);
