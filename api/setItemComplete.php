<?php
/**
 * Staff endpoint: mark a single order line item as complete.
 * Expects: { id: number } - the order_items.id (returned as itemorderID
 * by getOrderDetails.php), not the order id.
 */

require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/auth.php';
require_staff();

$receivedData = get_json_input();
$itemID = $receivedData['id'];

$query = "UPDATE order_items SET item_complete=1 WHERE id=?";
$stmt = $mysqli->prepare($query);
$stmt->bind_param("i", $itemID);

if ($stmt->execute()) {
    send_response(["outcome" => "Item marked as complete"], 200);
} else {
    send_response("Error: " . $mysqli->error, 500);
}
