<?php
/**
 * Conformity Alliance - Unified API Bridge (api.php)
 * Handles Server-Side Persistence, Form Submissions, and JSON Database Backups.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataDir = __DIR__ . '/../data';
if (!file_exists($dataDir)) {
    mkdir($dataDir, 0777, true);
}
$dataFile = $dataDir . '/site_data.json';

// Initialize data file if not present
if (!file_exists($dataFile)) {
    // Initial placeholder empty structure
    file_put_contents($dataFile, json_encode(['initialized' => false], JSON_PRETTY_PRINT));
}

$action = isset($_GET['action']) ? $_GET['action'] : '';

// 1. Get All Database Data
if ($action === 'get_all' || ($_SERVER['REQUEST_METHOD'] === 'GET' && empty($action))) {
    if (file_exists($dataFile)) {
        $content = file_get_contents($dataFile);
        echo $content ? $content : json_encode(['status' => 'empty']);
    } else {
        echo json_encode(['status' => 'not_found']);
    }
    exit;
}

// 2. Save All Database Data
if ($action === 'save_all' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    if ($raw) {
        $decoded = json_decode($raw, true);
        if ($decoded !== null) {
            file_put_contents($dataFile, json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            echo json_encode(['success' => true, 'message' => 'Data persisted to server successfully']);
            exit;
        }
    }
    echo json_encode(['success' => false, 'error' => 'Invalid JSON payload']);
    exit;
}

// 3. Public Lead / Consultation Form Submission
if ($action === 'submit_lead' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    $leadData = $raw ? json_decode($raw, true) : $_POST;

    if (!empty($leadData['name']) && (!empty($leadData['email']) || !empty($leadData['phone']))) {
        $current = [];
        if (file_exists($dataFile)) {
            $current = json_decode(file_get_contents($dataFile), true) ?: [];
        }
        if (!isset($current['leads'])) {
            $current['leads'] = [];
        }

        $newLead = [
            'id' => 'ld-' . time() . '-' . rand(100, 999),
            'name' => htmlspecialchars($leadData['name']),
            'email' => htmlspecialchars($leadData['email'] ?? ''),
            'phone' => htmlspecialchars($leadData['phone'] ?? ''),
            'service' => htmlspecialchars($leadData['service'] ?? 'General Legal Consultation'),
            'company' => htmlspecialchars($leadData['company'] ?? ''),
            'message' => htmlspecialchars($leadData['message'] ?? ''),
            'source' => htmlspecialchars($leadData['source'] ?? 'Public Website'),
            'status' => 'new',
            'createdAt' => date('c')
        ];

        array_unshift($current['leads'], $newLead);
        file_put_contents($dataFile, json_encode($current, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        echo json_encode(['success' => true, 'lead' => $newLead, 'message' => 'Inquiry received. An advocate will contact you shortly.']);
        exit;
    }

    echo json_encode(['success' => false, 'error' => 'Please provide name and either phone or email.']);
    exit;
}

// 4. Default fallback
echo json_encode(['status' => 'Conformity Alliance API v1.0 operational']);
