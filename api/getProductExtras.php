<?php
/**
 * Public endpoint: list the extras/mods available for one product.
 * Expects: { product_id: number }
 */

require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';

$receivedData = get_json_input();

$query = "SELECT * FROM product_extras WHERE product_id = ?";
$stmt = $mysqli->prepare($query);
$stmt->bind_param("i", $receivedData["product_id"]);
$stmt->execute();
$result = $stmt->get_result();

if ($result) {
    $rows = mysqli_fetch_all($result, MYSQLI_ASSOC);
    send_response($rows, 200);
} else {
    send_response("Error: " . mysqli_error($mysqli), 500);
}
