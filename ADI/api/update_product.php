<?php
// api/update_product.php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Credentials: true");

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Require header-based admin key and session
require_once 'auth_check.php';
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'Admin') {
    http_response_code(403);
    echo json_encode(["error" => "Access Denied: Insufficient data update permissions."]);
    exit;
}

require_once 'db_connect.php';

$inputData = json_decode(file_get_contents("php://input"), true);

if (!isset($inputData['id']) || !isset($inputData['stock']) || !isset($inputData['price'])) {
    http_response_code(400);
    echo json_encode(["error" => "Incomplete asset target parameters."]);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE products SET stock = ?, price = ? WHERE id = ?");
    $stmt->execute([$inputData['stock'], $inputData['price'], $inputData['id']]);
    echo json_encode(["success" => true]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Update pipeline failure.", "details" => $e->getMessage()]);
}
exit;
?>