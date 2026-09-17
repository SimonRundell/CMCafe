<?php
/**
 * Public endpoint: staff login. Starts a session cookie on success.
 * Expects: { username: string, password: string }
 */

require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/auth.php';

$receivedData = get_json_input();

$username = $receivedData['username'] ?? '';
$password = $receivedData['password'] ?? '';

$stmt = $mysqli->prepare("SELECT id, password_hash FROM staff WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$staff = $stmt->get_result()->fetch_assoc();

if (!$staff || !password_verify($password, $staff['password_hash'])) {
    send_response("Invalid username or password", 401);
}

session_regenerate_id(true);
$_SESSION['staff_id'] = $staff['id'];

send_response(["outcome" => "Logged in"], 200);
