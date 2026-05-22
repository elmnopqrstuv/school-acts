<?php
// api/auth_check.php
// Header-based security helper. Checks for X-Admin-Key header.
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$expected = 'IND-SECURE-2024';

// PHP converts incoming HTTP headers to $_SERVER entries prefixed with HTTP_
$received = isset($_SERVER['HTTP_X_ADMIN_KEY']) ? $_SERVER['HTTP_X_ADMIN_KEY'] : null;

if ($received !== $expected) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized: invalid admin key header."]);
    exit;
}

// If header matches, allow execution to continue.
?>
