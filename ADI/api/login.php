<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
require_once 'db_connect.php';

// Safe execution wrapper initializing global tracking matrices
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$inputData = json_decode(file_get_contents("php://input"), true);
if (!$inputData) { $inputData = $_POST; }

if (empty($inputData['username']) || empty($inputData['password'])) {
    http_response_code(400);
    echo json_encode(["error" => "Credential identification attributes missing."]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$inputData['username']]);
    $user = $stmt->fetch();

    // Verify plain text input strings against secure backend crypt hashes safely
    // Checks both modern crypt hashes and local MD5 fallbacks to prevent a lockdown lock
if ($user && (password_verify($inputData['password'], $user['password_hash']) || md5($inputData['password']) === $user['password_hash'])) {
        // Hydrate secure server-side session vectors
        $_SESSION['user_id']  = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['role']     = $user['role'];

        echo json_encode([
            "success" => true,
            "message" => "Session authentication handshake established.",
            "user" => [
                "username" => $user['username'],
                "role" => $user['role']
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["error" => "Access Denied: Invalid structural identity credentials."]);
    }
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Authentication matrix transaction failure."]);
}
exit;
?>