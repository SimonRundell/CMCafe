<?php

include 'setup.php';

$query = "UPDATE products SET product_name = ?, product_category = ?, product_description = ?, product_cost = ?, product_available = ?, image_url =? WHERE id = ?";
$stmt = $mysqli->prepare($query);
$stmt->bind_param("sssdisi", $receivedData["product_name"], 
                           $receivedData["product_category"], 
                           $receivedData["product_description"], 
                           $receivedData["product_cost"],
                           $receivedData["product_available"], 
                           $receivedData["image_url"],
                           $receivedData["id"]);

if ($stmt->execute()) {
    send_response(array("outcome" => $receivedData["product_name"]." successfully updated."), 200);
} else {
    send_response("Error: " . $mysqli->error, 500);
}                           