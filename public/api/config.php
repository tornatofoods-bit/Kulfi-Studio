<?php
// Kulfi Studio - Flat-File Authentication & API Configuration
// 100% Free - No External Database Required

// Start session with secure parameters if not already active
if (session_status() === PHP_SESSION_NONE) {
    $isSecure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443);
    session_set_cookie_params([
        'lifetime' => 86400 * 7, // 7 days
        'path' => '/',
        'domain' => '',
        'secure' => $isSecure,
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
    session_start();
}

// Global CORS & JSON Response Headers
function sendCorsHeaders() {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-CSRF-Token");
    header("Content-Type: application/json; charset=utf-8");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

// File path helpers
function getDataDir() {
    return dirname(__DIR__) . '/data';
}

function getUsersFile() {
    return getDataDir() . '/users.json';
}

function getLockoutsFile() {
    return getDataDir() . '/lockouts.json';
}

function getSetupFile() {
    return getDataDir() . '/setup.json';
}

function getAuthSettingsFile() {
    return getDataDir() . '/auth-settings.json';
}

// Load auth settings (Google client ID, allowed admin google emails)
function loadAuthSettings() {
    $file = getAuthSettingsFile();
    if (!file_exists($file)) {
        return [
            'googleClientId' => '',
            'allowedAdminGoogleEmails' => []
        ];
    }
    $content = file_get_contents($file);
    $data = json_decode($content, true);
    return is_array($data) ? $data : [
        'googleClientId' => '',
        'allowedAdminGoogleEmails' => []
    ];
}

function saveAuthSettings($settings) {
    $file = getAuthSettingsFile();
    $dataDir = getDataDir();
    if (!is_dir($dataDir)) {
        mkdir($dataDir, 0755, true);
    }
    return file_put_contents($file, json_encode($settings, JSON_PRETTY_PRINT), LOCK_EX) !== false;
}

function getGoogleClientId() {
    $settings = loadAuthSettings();
    $id = getenv('VITE_GOOGLE_CLIENT_ID') ?: (getenv('GOOGLE_CLIENT_ID') ?: ($settings['googleClientId'] ?? ''));
    return trim($id);
}

function getAllowedAdminGoogleEmails() {
    $settings = loadAuthSettings();
    $emails = $settings['allowedAdminGoogleEmails'] ?? [];
    if (!is_array($emails)) {
        return [];
    }
    return array_map('strtolower', array_map('trim', $emails));
}

// Load users from flat file
function loadUsers() {
    $file = getUsersFile();
    if (!file_exists($file)) {
        return [];
    }
    $content = file_get_contents($file);
    $data = json_decode($content, true);
    return is_array($data) ? $data : [];
}

// Save users to flat file
function saveUsers($users) {
    $file = getUsersFile();
    $dataDir = getDataDir();
    if (!is_dir($dataDir)) {
        mkdir($dataDir, 0755, true);
    }
    return file_put_contents($file, json_encode($users, JSON_PRETTY_PRINT), LOCK_EX) !== false;
}

// Load lockouts
function loadLockouts() {
    $file = getLockoutsFile();
    if (!file_exists($file)) {
        return [];
    }
    $content = file_get_contents($file);
    $data = json_decode($content, true);
    return is_array($data) ? $data : [];
}

// Save lockouts
function saveLockouts($lockouts) {
    $file = getLockoutsFile();
    return file_put_contents($file, json_encode($lockouts, JSON_PRETTY_PRINT), LOCK_EX) !== false;
}

// Client IP detection
function getClientIp() {
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        return $_SERVER['HTTP_CLIENT_IP'];
    }
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        return trim($ips[0]);
    }
    return $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
}

// Rate Limiting & Lockout: 5 failed attempts -> 15 minute lockout
function checkRateLimit($identifier = '') {
    $ip = getClientIp();
    $key = hash('sha256', $ip . '_' . strtolower($identifier));
    $lockouts = loadLockouts();
    
    if (isset($lockouts[$key])) {
        $entry = $lockouts[$key];
        $attempts = $entry['attempts'] ?? 0;
        $lockUntil = $entry['lockUntil'] ?? 0;
        
        if ($lockUntil > time()) {
            $minutesLeft = ceil(($lockUntil - time()) / 60);
            return [
                'locked' => true,
                'message' => "Too many failed attempts. Locked for $minutesLeft more minute(s)."
            ];
        }
        
        // Lock expired
        if ($lockUntil > 0 && $lockUntil <= time()) {
            unset($lockouts[$key]);
            saveLockouts($lockouts);
        }
    }
    
    return ['locked' => false];
}

function recordLoginFailure($identifier = '') {
    $ip = getClientIp();
    $key = hash('sha256', $ip . '_' . strtolower($identifier));
    $lockouts = loadLockouts();
    
    $entry = $lockouts[$key] ?? ['attempts' => 0, 'lockUntil' => 0];
    $entry['attempts'] = ($entry['attempts'] ?? 0) + 1;
    $entry['lastAttempt'] = time();
    
    // 5 failures -> 15 min lockout (900 seconds)
    if ($entry['attempts'] >= 5) {
        $entry['lockUntil'] = time() + 900;
    }
    
    $lockouts[$key] = $entry;
    saveLockouts($lockouts);
}

function clearLoginFailures($identifier = '') {
    $ip = getClientIp();
    $key = hash('sha256', $ip . '_' . strtolower($identifier));
    $lockouts = loadLockouts();
    
    if (isset($lockouts[$key])) {
        unset($lockouts[$key]);
        saveLockouts($lockouts);
    }
}

// Current logged in user from session
function getSessionUser() {
    if (empty($_SESSION['kulfi_user_id'])) {
        return null;
    }
    $userId = $_SESSION['kulfi_user_id'];
    $users = loadUsers();
    foreach ($users as $u) {
        if ($u['id'] === $userId && ($u['status'] ?? 'active') !== 'disabled') {
            return [
                'id' => $u['id'],
                'email' => $u['email'],
                'name' => $u['name'] ?? '',
                'role' => $u['role'] ?? 'client',
                'company' => $u['company'] ?? '',
                'createdAt' => $u['createdAt'] ?? ''
            ];
        }
    }
    return null;
}
