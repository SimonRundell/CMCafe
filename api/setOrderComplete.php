<?php
/**
 * Staff endpoint: mark a whole order as complete.
 * Expects: { id: number }
 */

require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/auth.php';
require_staff();

$receivedData = get_json_input();
$orderID = $receivedData['id'];

$query = "UPDATE customer_order SET order_complete=1, time_completed=NOW() WHERE id=?";
$stmt = $mysqli->prepare($query);
$stmt->bind_param("i", $orderID);

if ($stmt->execute()) {
    send_response(["outcome" => "Item marked as complete"], 200);
} else {
    send_response("Error: " . $mysqli->error, 500);
}
