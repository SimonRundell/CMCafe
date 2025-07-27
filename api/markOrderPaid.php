<?php

include 'setup.php';

$orderID = $receivedData['id'];


$query="UPDATE customer_order SET order_paid=1, time_paid=NOW() WHERE id=?";
$stmt = $mysqli->prepare($query);
$stmt->bind_param("i", $orderID);

if ($stmt->execute()) {
    send_response(array("outcome" => "Item marked as paid"), 200);
} else {
    send_response("Error: " . $mysqli->error, 500);
}