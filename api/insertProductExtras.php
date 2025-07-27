<?php

include 'setup.php';

if (!isset($receivedData["mod_cost"])) {
    $receivedData["mod_cost"] = 0;
}

$query = "INSERT INTO  product_extras (product_id, mod_name, mod_cost) VALUES (?, ?, ?)";
$stmt = $mysqli->prepare($query);
$stmt->bind_param("isd", $receivedData["product_id"], 
                           $receivedData["mod_name"], 
                           $receivedData["mod_cost"]);

if ($stmt->execute()) {
    send_response(array("outcome" => $receivedData["mod_name"]." successfully added."), 200);
} else {
    send_response("Error: " . $mysqli->error, 500);
}                           