<?php
require_once __DIR__ . '/config.php';
sendCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true) ?: $_POST;

$identifier = strtolower(trim($data['email'] ?? $data['username'] ?? ''));
$password = $data['password'] ?? '';
$expectedRole = $data['role'] ?? null; // 'admin' or 'client'

// Check lockout
$rate = checkRateLimit($identifier);
if ($rate['locked']) {
    http_response_code(429);
    echo json_encode(['success' => false, 'error' => $rate['message']]);
    exit;
}

if (empty($identifier) || empty($password)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Please provide both email/username and password.']);
    exit;
}

$users = loadUsers();
$matchedUser = null;

foreach ($users as $u) {
    if (strtolower($u['email']) === $identifier || (!empty($u['username']) && strtolower($u['username']) === $identifier)) {
        $matchedUser = $u;
        break;
    }
}

// Support for admin username alias 'admin' mapped to admin users
if (!$matchedUser && $identifier === 'admin') {
    foreach ($users as $u) {
        if (($u['role'] ?? '') === 'super_admin') {
            $matchedUser = $u;
            break;
        }
    }
}

$valid = false;
if ($matchedUser && !empty($matchedUser['passwordHash'])) {
    if (password_verify($password, $matchedUser['passwordHash'])) {
        $valid = true;
    }
}

if (!$valid) {
    recordLoginFailure($identifier);
    http_response_code(401);
    // Generic error to prevent enumeration
    echo json_encode(['success' => false, 'error' => 'Invalid email/username or password.']);
    exit;
}

// Check status
if (($matchedUser['status'] ?? 'active') === 'disabled') {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Your account has been deactivated. Please contact support.']);
    exit;
}

// Role validation if specified
$userRole = $matchedUser['role'] ?? 'client';
if ($expectedRole === 'admin' && !in_array($userRole, ['super_admin', 'editor'])) {
    recordLoginFailure($identifier);
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Access denied. Administrator privileges required.']);
    exit;
}

// Success: Clear lockout counters and establish session
clearLoginFailures($identifier);
session_regenerate_id(true);
$_SESSION['kulfi_user_id'] = $matchedUser['id'];
$_SESSION['kulfi_user_role'] = $userRole;

echo json_encode([
    'success' => true,
    'user' => [
        'id' => $matchedUser['id'],
        'email' => $matchedUser['email'],
        'name' => $matchedUser['name'] ?? '',
        'role' => $userRole,
        'company' => $matchedUser['company'] ?? '',
        'createdAt' => $matchedUser['createdAt'] ?? ''
    ]
]);
