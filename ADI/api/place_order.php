<?php
// api/place_order.php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Admin-Key");

require_once 'auth_check.php';
require_once 'db_connect.php';

// Ensure orders table exists with the required industrial schema
$pdo->exec("CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
)");

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) { $input = $_POST; }

if (!isset($input['product_id']) || !isset($input['quantity']) || !isset($input['customer_name'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing product_id, quantity, or customer_name."]);
    exit;
}

$productId = (int)$input['product_id'];
$quantity = (int)$input['quantity'];
$customerName = trim($input['customer_name']);

try {
    // Check current stock
    $stmt = $pdo->prepare("SELECT stock FROM products WHERE id = ? FOR UPDATE");
    // Begin transaction
    $pdo->beginTransaction();
    $stmt->execute([$productId]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        $pdo->rollBack();
        http_response_code(404);
        echo json_encode(["error" => "Product not found."]);
        exit;
    }

    $currentStock = (int)$row['stock'];
    if ($quantity > $currentStock) {
        $pdo->rollBack();
        http_response_code(400);
        echo json_encode(["error" => "Insufficient Industrial Stock."]);
        exit;
    }

    // Insert into orders
    $ins = $pdo->prepare("INSERT INTO orders (product_id, quantity, customer_name) VALUES (?, ?, ?)");
    $ins->execute([$productId, $quantity, $customerName]);

    // Update stock
    $upd = $pdo->prepare("UPDATE products SET stock = stock - ? WHERE id = ?");
    $upd->execute([$quantity, $productId]);

    $pdo->commit();
    echo json_encode(["success" => true]);
} catch (\PDOException $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["error" => "Transaction failed.", "details" => $e->getMessage()]);
}
exit;
?>
