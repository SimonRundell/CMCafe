<?php

include 'setup.php';

$orderID = $receivedData['id'];

$query="UPDATE order_items SET item_complete=1 WHERE order_id=?";
$stmt = $mysqli->prepare($query);
$stmt->bind_param("i", $orderID);

if ($stmt->execute()) {
    send_response(array("outcome" => "Item marked as complete"), 200);
} else {
    send_response("Error: " . $mysqli->error, 500);
}
