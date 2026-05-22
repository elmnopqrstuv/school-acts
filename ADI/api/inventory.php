<?php
// api/inventory.php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Phase 3 Security Session Interlock
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized access: Active session matrix missing."]);
    exit;
}

require_once 'db_connect.php';

try {
    // Query products with their category names (use LEFT JOIN to preserve products without a category)
    $stmt = $pdo->query("SELECT p.*, c.category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.id ASC");
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Provide clean datatypes for Javascript parsing loops
    foreach ($products as &$car) {
        if (!isset($car['category_name']) || empty($car['category_name'])) {
            $car['category_name'] = 'Uncategorized';
        }
        if (!isset($car['image']) || empty($car['image'])) {
            $car['image'] = 'images/default.jpg';
        }
        $car['id'] = (int)$car['id'];
        $car['stock'] = (int)$car['stock'];
        $car['price'] = (float)$car['price'];
    }

    echo json_encode($products);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "SQL Inventory Sync Failure", "details" => $e->getMessage()]);
}
exit;
?>