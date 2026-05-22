<?php
// api/update_order_status.php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Admin-Key");

require_once 'db_connect.php';

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) { $input = $_POST; }

if (!isset($input['order_id']) || !isset($input['status'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing order_id or status"]);
    exit;
}

$orderId = (int)$input['order_id'];
$status = trim($input['status']);

$validStatuses = ['Processing', 'Dispatched', 'Hold-Back'];
if (!in_array($status, $validStatuses)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid status. Must be: Processing, Dispatched, or Hold-Back"]);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE orders SET status = ? WHERE id = ?");
    $stmt->execute([$status, $orderId]);
    
    echo json_encode(["success" => true, "message" => "Order status updated"]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to update order", "details" => $e->getMessage()]);
}
exit;
?>
