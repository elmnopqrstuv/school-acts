<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
require_once 'db_connect.php';

$errorResponse = ["error" => "No industrial records found."];

if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode($errorResponse);
    exit;
}

try {
    $productId = intval($_GET['id']);
    // Parameterized lookup queries mapping input strings securely
    $stmt = $pdo->prepare("SELECT p.*, c.category_name 
                           FROM products p 
                           LEFT JOIN categories c ON p.category_id = c.id 
                           WHERE p.id = ?");
    $stmt->execute([$productId]);
    $car = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($car) {
        echo json_encode($car);
    } else {
        http_response_code(404);
        echo json_encode($errorResponse);
    }
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Asset Isolation Integrity Crash."]);
}
exit;
?>