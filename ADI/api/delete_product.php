<?php
// api/delete_product.php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Credentials: true");

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Also validate header-based admin key for extra security
require_once 'auth_check.php';

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'Admin') {
    http_response_code(403);
    echo json_encode(["error" => "Destructive commands reserved for Administrative clearance profiles."]);
    exit;
}

require_once 'db_connect.php';

$inputData = json_decode(file_get_contents("php://input"), true);

if (empty($inputData['id'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing target identifier attribute code string."]);
    exit;
}

try {
    $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
    $stmt->execute([$inputData['id']]);
    echo json_encode(["success" => true]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "SQL Deletion execution failed.", "details" => $e->getMessage()]);
}
exit;
?>