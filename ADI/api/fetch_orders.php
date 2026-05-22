<?php
// api/fetch_orders.php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");

require_once 'db_connect.php';

try {
    $stmt = $pdo->prepare("
        SELECT 
            o.id,
            o.product_id,
            o.quantity,
            o.customer_name,
            o.status,
            o.created_at,
            p.name as product_name,
            p.price as product_price
        FROM orders o
        JOIN products p ON o.product_id = p.id
        ORDER BY o.created_at DESC
    ");
    $stmt->execute();
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($orders);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to fetch orders", "details" => $e->getMessage()]);
}
exit;
?>
