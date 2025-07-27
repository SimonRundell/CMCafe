<?php

include 'setup.php';

$tableNumber = $receivedData['tableNumber'];
$orders = $receivedData['order'];

if (!is_array($orders)) {
    send_response("Invalid orders data", 400);
}

$mysqli->begin_transaction(); // Start a transaction

// first log whole order
$query = "INSERT INTO customer_order (order_table, order_complete, order_total, order_paid) VALUES (?, 0, 0, 0)";
$stmt = $mysqli->prepare($query);
$stmt->bind_param("s", $tableNumber);

if ($stmt->execute()) {
    $orderId = $stmt->insert_id; // Get the ID of the inserted record
} else {
    $mysqli->rollback(); // Rollback the transaction on error
    send_response("customer_order Error: " . $mysqli->error, 500);
    $mysqli->close();
    exit;
}
$stmt->close();

// then log each item in the order_items table
$stmt = $mysqli->prepare("INSERT INTO order_items (order_id, order_product, product_cost, order_mods) VALUES (?, ?, ?, ?)");
if ($stmt === false) {
    die('Prepare failed: ' . htmlspecialchars($mysqli->error));
}

$orderTotal = 0;
foreach ($orders as $order) {
    
    $order_product = (int)$order['productID']; // Assuming this maps to order_product
    $productCost = (float)$order['productCost'];
    $order_mods = $order['orderMods'];
    $orderModsCost = (float)$order['orderModsCost'];

    $orderTotal += $productCost + $orderModsCost;

    // Bind parameters
    $stmt->bind_param('iids', $orderId, $order_product, $productCost, $order_mods);

    // Execute the statement
    if (!$stmt->execute()) {
        die('Execute failed: ' . htmlspecialchars($stmt->error));
    }
}

// Close the statement after the loop
$stmt->close();

$mysqli->commit(); // Commit the transaction

// now write the total cost back to the customer_order table
$query = "UPDATE customer_order SET time_placed = NOW(), order_total = ?, order_notes = ?, allergy_alert = ? WHERE id = ?";
$stmt = $mysqli->prepare($query);
$stmt->bind_param("dsii", $orderTotal, $receivedData['orderNotes'], $receivedData['allergyAlert'], $orderId);
$stmt->execute();

send_response(array("outcome" => "Order placed successfully.", "orderid" => $orderId, "totalCost"=> $orderTotal), 200);

// Close the database connection
$mysqli->close();