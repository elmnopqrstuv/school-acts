<?php
// api/summary.php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Credentials: true");

require_once 'db_connect.php';

try {
    $stmt = $pdo->query("SELECT COALESCE(SUM(stock * price), 0) as total_inventory_value FROM products");
    $total = $stmt->fetch(PDO::FETCH_ASSOC);

    // Ensure orders table exists (if not, orders today = 0)
    $pdo->exec("CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    $stmt2 = $pdo->prepare("SELECT COUNT(*) as orders_today FROM orders WHERE DATE(created_at) = CURDATE()");
    $stmt2->execute();
    $orders = $stmt2->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'total_inventory_value' => (float)$total['total_inventory_value'],
        'orders_today' => (int)$orders['orders_today']
    ]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Summary query failed.", "details" => $e->getMessage()]);
}
exit;
?>
