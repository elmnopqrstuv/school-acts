<?php
// api/add_product.php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Credentials: true");

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Strict Admin validation block (session + header)
require_once 'auth_check.php';
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'Admin') {
    http_response_code(403);
    echo json_encode(["error" => "Operation Aborted: Only Administrators can write data entries."]);
    exit;
}

require_once 'db_connect.php';

$inputData = json_decode(file_get_contents("php://input"), true);
if (!$inputData) { $inputData = $_POST; }

if (empty($inputData['name']) || empty($inputData['sku']) || empty($inputData['price'])) {
    http_response_code(400);
    echo json_encode(["error" => "Required request fields missing."]);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO products (name, sku, category_id, stock, price, image) VALUES (?, ?, ?, ?, ?, ?)");
    $defaultImage = 'images/default.jpg';
    $stmt->execute([
        $inputData['name'],
        $inputData['sku'],
        $inputData['category_id'] ?? 1,
        $inputData['stock'] ?? 1,
        $inputData['price'],
        $defaultImage
    ]);

    echo json_encode(["success" => true, "message" => "Asset recorded cleanly inside database mapping array."]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Insertion sequence aborted.", "details" => $e->getMessage()]);
}
exit;
?>