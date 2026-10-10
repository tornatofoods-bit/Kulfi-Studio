<?php
require_once __DIR__ . '/config.php';
sendCorsHeaders();

$setupFile = getSetupFile();
$setupData = [];
if (file_exists($setupFile)) {
    $setupData = json_decode(file_get_contents($setupFile), true) ?: [];
}
$isCompleted = !empty($setupData['setupCompleted']);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode([
        'success' => true,
        'setupCompleted' => $isCompleted
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($isCompleted) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'error' => 'Initial setup has already been completed. This console is locked.'
        ]);
        exit;
    }

    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true) ?: $_POST;

    $email = strtolower(trim($data['email'] ?? ''));
    $name = trim($data['name'] ?? 'Master Confectioner');
    $password = $data['password'] ?? '';

    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Please provide a valid administrator email.']);
        exit;
    }

    if (strlen($password) < 8) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Admin password must be at least 8 characters long.']);
        exit;
    }

    $users = loadUsers();
    $found = false;
    $adminId = 'usr_admin_' . bin2hex(random_bytes(6));
    $hashed = password_hash($password, PASSWORD_BCRYPT);

    foreach ($users as &$u) {
        if (strtolower($u['email']) === $email || ($u['role'] ?? '') === 'super_admin') {
            $u['email'] = $email;
            $u['name'] = $name;
            $u['passwordHash'] = $hashed;
            $u['role'] = 'super_admin';
            $u['status'] = 'active';
            $adminId = $u['id'];
            $found = true;
            break;
        }
    }
    unset($u);

    if (!$found) {
        $users[] = [
            'id' => $adminId,
            'email' => $email,
            'name' => $name,
            'role' => 'super_admin',
            'passwordHash' => $hashed,
            'company' => 'Kulfi Studio',
            'status' => 'active',
            'createdAt' => date('c')
        ];
    }

    saveUsers($users);

    // Lock setup permanently
    $setupData = [
        'setupCompleted' => true,
        'completedAt' => date('c'),
        'adminEmail' => $email
    ];
    file_put_contents($setupFile, json_encode($setupData, JSON_PRETTY_PRINT), LOCK_EX);

    // Auto-login newly configured admin
    session_regenerate_id(true);
    $_SESSION['kulfi_user_id'] = $adminId;
    $_SESSION['kulfi_user_role'] = 'super_admin';

    echo json_encode([
        'success' => true,
        'message' => 'Administrator credentials configured. Setup is now permanently locked.',
        'user' => [
            'id' => $adminId,
            'email' => $email,
            'name' => $name,
            'role' => 'super_admin'
        ]
    ]);
    exit;
}
