<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$leadsFilePath = __DIR__ . '/../data/leads.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($leadsFilePath)) {
        echo file_get_contents($leadsFilePath);
    } else {
        echo json_encode([]);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $lead = json_decode($rawInput, true);

    if (!$lead) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid lead payload']);
        exit;
    }

    // Check honeypot spam
    if (!empty($lead['honeypot'])) {
        echo json_encode(['success' => true, 'note' => 'Filtered spam']);
        exit;
    }

    $leads = [];
    if (file_exists($leadsFilePath)) {
        $content = file_get_contents($leadsFilePath);
        $decoded = json_decode($content, true);
        if (is_array($decoded)) {
            $leads = $decoded;
        }
    }

    array_unshift($leads, $lead);

    // Save with lock
    $dir = dirname($leadsFilePath);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }

    file_put_contents($leadsFilePath, json_encode($leads, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES), LOCK_EX);

    echo json_encode(['success' => true, 'id' => $lead['id'] ?? null]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
