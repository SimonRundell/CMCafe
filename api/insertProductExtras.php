<?php
/**
 * Staff endpoint: add an extra/mod option to a product.
 */

require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/auth.php';
require_staff();

$receivedData = get_json_input();

if (!isset($receivedData["mod_cost"])) {
    $receivedData["mod_cost"] = 0;
}

$query = "INSERT INTO product_extras (product_id, mod_name, mod_cost) VALUES (?, ?, ?)";
$stmt = $mysqli->prepare($query);
$stmt->bind_param("isd", $receivedData["product_id"],
                           $receivedData["mod_name"],
                           $receivedData["mod_cost"]);

if ($stmt->execute()) {
    send_response(["outcome" => $receivedData["mod_name"] . " successfully added."], 200);
} else {
    send_response("Error: " . $mysqli->error, 500);
}
