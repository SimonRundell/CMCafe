<?php

include 'setup.php';

$query = "INSERT INTO products (product_name, product_category, product_description, product_cost) VALUES (?, ?, ?, ?)";
$stmt = $mysqli->prepare($query);
$stmt->bind_param("sssd", $receivedData["product_name"], 
                           $receivedData["product_category"], 
                           $receivedData["product_description"], 
                           $receivedData["product_cost"]);

if ($stmt->execute()) {
    $productID = $stmt->insert_id; // Get the ID of the inserted record
    send_response(array("outcome" => "New Product added", "productID" => $productID), 200);
} else {
    send_response("Error: " . $mysqli->error, 500);
}   