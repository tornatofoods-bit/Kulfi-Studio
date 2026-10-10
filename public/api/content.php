<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$contentFilePath = __DIR__ . '/../data/content.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($contentFilePath)) {
        echo file_get_contents($contentFilePath);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'content.json not found']);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $decoded = json_decode($rawInput, true);

    if (!$decoded) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON payload']);
        exit;
    }

    // Write file with exclusive lock
    $dir = dirname($contentFilePath);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }

    $fp = fopen($contentFilePath, 'c+');
    if (!$fp || !flock($fp, LOCK_EX)) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not acquire file lock']);
        exit;
    }

    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);

    echo json_encode(['success' => true, 'version' => $decoded['version'] ?? 1]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
