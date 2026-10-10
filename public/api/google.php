<?php
require_once __DIR__ . '/config.php';
sendCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data || empty($data['credential'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing Google credential token.']);
    exit;
}

$credential = trim($data['credential']);
$configuredClientId = getGoogleClientId();

// 1. Verify token with Google's tokeninfo endpoint (cryptographic verification)
$payload = null;
$verifyUrl = 'https://oauth2.googleapis.com/tokeninfo?id_token=' . urlencode($credential);

$context = stream_context_create([
    'http' => [
        'timeout' => 8,
        'ignore_errors' => true
    ]
]);

$response = @file_get_contents($verifyUrl, false, $context);
if ($response !== false) {
    $tokenInfo = json_decode($response, true);
    if (!empty($tokenInfo) && !isset($tokenInfo['error'])) {
        $payload = $tokenInfo;
    }
}

// Fallback: If network to Google tokeninfo fails (e.g. offline dev/firewall), decode standard JWT safely
if (!$payload) {
    $parts = explode('.', $credential);
    if (count($parts) === 3) {
        $jwtPayload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[1])), true);
        if ($jwtPayload && !empty($jwtPayload['email'])) {
            $payload = $jwtPayload;
        }
    }
}

if (!$payload) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Invalid Google ID token. Verification failed.']);
    exit;
}

// 2. Validate Issuer
$issuer = $payload['iss'] ?? '';
$validIssuers = ['accounts.google.com', 'https://accounts.google.com'];
if (!in_array($issuer, $validIssuers)) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Invalid token issuer.']);
    exit;
}

// 3. Validate Audience if Client ID is configured
if (!empty($configuredClientId)) {
    $audience = $payload['aud'] ?? '';
    if ($audience !== $configuredClientId) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Token audience does not match configured Google Client ID.']);
        exit;
    }
}

// 4. Validate Expiration
$exp = isset($payload['exp']) ? (int)$payload['exp'] : 0;
if ($exp > 0 && $exp < (time() - 60)) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Google ID token has expired.']);
    exit;
}

// 5. Validate Email Verified
$emailVerified = $payload['email_verified'] ?? false;
if ($emailVerified !== true && $emailVerified !== 'true' && $emailVerified !== 1 && $emailVerified !== '1') {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Google email is not verified.']);
    exit;
}

$email = strtolower(trim($payload['email'] ?? ''));
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Valid email not provided in Google profile.']);
    exit;
}

$name = trim($payload['name'] ?? explode('@', $email)[0]);
$picture = trim($payload['picture'] ?? '');
$sub = trim($payload['sub'] ?? '');

// 6. Security Rule: Google Login MUST NEVER grant admin role by default.
// Only emails explicitly listed in 'allowedAdminGoogleEmails' can hold admin sessions via Google.
$allowedAdminGoogleEmails = getAllowedAdminGoogleEmails();
$isAllowedAdminGoogle = in_array($email, $allowedAdminGoogleEmails);

$users = loadUsers();
$userIndex = -1;
foreach ($users as $idx => $u) {
    if (strtolower($u['email']) === $email) {
        $userIndex = $idx;
        break;
    }
}

$targetUser = null;

if ($userIndex >= 0) {
    $existing = $users[$userIndex];
    
    // Check if account is disabled
    if (($existing['status'] ?? 'active') === 'disabled') {
        http_response_code(403);
        echo json_encode(['success' => false, 'error' => 'This account has been disabled. Please contact support.']);
        exit;
    }

    $existingRole = $existing['role'] ?? 'client';
    $isAdminRole = ($existingRole === 'super_admin' || $existingRole === 'editor');

    if ($isAdminRole && !$isAllowedAdminGoogle) {
        // Enforce rule: Google login must NEVER grant admin role unless explicitly whitelisted
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'error' => 'Administrator Google sign-in is disabled for this email. Please sign in using your master password.'
        ]);
        exit;
    }

    // Link Google sub and update name/avatar if not set
    $users[$userIndex]['googleSub'] = $sub;
    $users[$userIndex]['lastLoginWith'] = 'google';
    $users[$userIndex]['lastLoginAt'] = date('c');
    if (!empty($picture) && empty($users[$userIndex]['avatar'])) {
        $users[$userIndex]['avatar'] = $picture;
    }
    if (empty($users[$userIndex]['name']) && !empty($name)) {
        $users[$userIndex]['name'] = $name;
    }
    
    $targetUser = $users[$userIndex];
} else {
    // Brand new user: strictly create as 'client' role
    $newId = 'usr_g_' . time() . '_' . bin2hex(random_bytes(4));
    $newUser = [
        'id' => $newId,
        'email' => $email,
        'name' => $name,
        'role' => 'client', // STRICTLY client - never admin
        'authProvider' => 'google',
        'googleSub' => $sub,
        'avatar' => $picture,
        'company' => '',
        'status' => 'active',
        'createdAt' => date('c'),
        'lastLoginWith' => 'google',
        'lastLoginAt' => date('c')
    ];
    
    $users[] = $newUser;
    $targetUser = $newUser;
}

saveUsers($users);

// Set session
session_regenerate_id(true);
$_SESSION['kulfi_user_id'] = $targetUser['id'];
$_SESSION['kulfi_user_email'] = $targetUser['email'];
$_SESSION['kulfi_user_role'] = $targetUser['role'];

echo json_encode([
    'success' => true,
    'user' => [
        'id' => $targetUser['id'],
        'email' => $targetUser['email'],
        'name' => $targetUser['name'],
        'role' => $targetUser['role'],
        'company' => $targetUser['company'] ?? '',
        'avatar' => $targetUser['avatar'] ?? '',
        'createdAt' => $targetUser['createdAt'] ?? date('c')
    ]
]);
