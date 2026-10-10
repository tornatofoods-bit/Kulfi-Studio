<?php
require_once __DIR__ . '/config.php';
sendCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $settings = loadAuthSettings();
    $googleClientId = getGoogleClientId();
    $allowedEmails = getAllowedAdminGoogleEmails();
    
    $currentUser = getSessionUser();
    $isAdmin = $currentUser && in_array($currentUser['role'] ?? '', ['super_admin', 'editor']);

    $response = [
        'success' => true,
        'googleClientId' => $googleClientId,
        'googleEnabled' => !empty($googleClientId)
    ];

    // Only expose admin emails list to verified logged-in admins
    if ($isAdmin) {
        $response['allowedAdminGoogleEmails'] = $allowedEmails;
    }

    echo json_encode($response);
    exit;
}

if ($method === 'POST') {
    $currentUser = getSessionUser();
    if (!$currentUser || !in_array($currentUser['role'] ?? '', ['super_admin', 'editor'])) {
        http_response_code(403);
        echo json_encode(['success' => false, 'error' => 'Admin authorization required']);
        exit;
    }

    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true) ?: [];

    $settings = loadAuthSettings();
    if (isset($data['googleClientId'])) {
        $settings['googleClientId'] = trim($data['googleClientId']);
    }
    if (isset($data['allowedAdminGoogleEmails']) && is_array($data['allowedAdminGoogleEmails'])) {
        $settings['allowedAdminGoogleEmails'] = array_values(array_unique(array_filter(array_map('strtolower', array_map('trim', $data['allowedAdminGoogleEmails'])))));
    }

    saveAuthSettings($settings);

    echo json_encode([
        'success' => true,
        'googleClientId' => $settings['googleClientId'] ?? '',
        'allowedAdminGoogleEmails' => $settings['allowedAdminGoogleEmails'] ?? []
    ]);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method not allowed']);
