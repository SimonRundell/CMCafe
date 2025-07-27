<?php

include 'setup.php';

$query = "SELECT * FROM product_extras WHERE product_id = ?";
$stmt = $mysqli->prepare($query);
$stmt->bind_param("i", $receivedData["product_id"]);
$stmt->execute();
$result = $stmt->get_result();

if ($result) {
    $rows = mysqli_fetch_all($result, MYSQLI_ASSOC);
    $json = json_encode($rows);
    send_response($json, 200);
} else {
    // Handle the error if the query fails
    send_response("Error: " . mysqli_error($connection), 500);
}