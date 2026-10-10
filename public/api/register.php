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

// Honeypot check (anti-bot)
if (!empty($data['hp_field']) || !empty($data['honeypot'])) {
    // Silently return success to bot without registering
    echo json_encode(['success' => true]);
    exit;
}

// Rate limiting check
$rate = checkRateLimit();
if ($rate['locked']) {
    http_response_code(429);
    echo json_encode(['success' => false, 'error' => $rate['message']]);
    exit;
}

$name = trim($data['name'] ?? '');
$email = strtolower(trim($data['email'] ?? ''));
$password = $data['password'] ?? '';
$company = trim($data['company'] ?? '');

// Input validations
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Please provide a valid email address.']);
    exit;
}

if (strlen($password) < 8) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Password must be at least 8 characters long.']);
    exit;
}

if (empty($name)) {
    $name = explode('@', $email)[0];
}

$users = loadUsers();

// Check if user already exists
foreach ($users as $u) {
    if (strtolower($u['email']) === $email) {
        http_response_code(400);
        // Do not leak detailed info, but inform user this email is registered
        echo json_encode(['success' => false, 'error' => 'An account with this email address already exists. Please log in.']);
        exit;
    }
}

// New client user
$newUser = [
    'id' => 'usr_' . bin2hex(random_bytes(8)),
    'email' => $email,
    'name' => htmlspecialchars($name, ENT_QUOTES, 'UTF-8'),
    'role' => 'client', // Always client role for public registration
    'passwordHash' => password_hash($password, PASSWORD_BCRYPT),
    'company' => htmlspecialchars($company, ENT_QUOTES, 'UTF-8'),
    'status' => 'active',
    'createdAt' => date('c')
];

$users[] = $newUser;
saveUsers($users);

// Start session
session_regenerate_id(true);
$_SESSION['kulfi_user_id'] = $newUser['id'];
$_SESSION['kulfi_user_role'] = 'client';

echo json_encode([
    'success' => true,
    'user' => [
        'id' => $newUser['id'],
        'email' => $newUser['email'],
        'name' => $newUser['name'],
        'role' => 'client',
        'company' => $newUser['company'],
        'createdAt' => $newUser['createdAt']
    ]
]);
