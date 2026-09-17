<?php
/**
 * Staff endpoint: create a new product.
 */

require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/auth.php';
require_staff();

$receivedData = get_json_input();

$query = "INSERT INTO products (product_name, product_category, product_description, product_cost) VALUES (?, ?, ?, ?)";
$stmt = $mysqli->prepare($query);
$stmt->bind_param("sssd", $receivedData["product_name"],
                           $receivedData["product_category"],
                           $receivedData["product_description"],
                           $receivedData["product_cost"]);

if ($stmt->execute()) {
    $productID = $stmt->insert_id;
    send_response(["outcome" => "New Product added", "productID" => $productID], 200);
} else {
    send_response("Error: " . $mysqli->error, 500);
}
