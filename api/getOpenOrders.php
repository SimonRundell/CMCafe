<?php
/**
 * Staff endpoint: list all orders that aren't complete yet.
 */

require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/auth.php';
require_staff();

$receivedData = get_json_input();

$query = "SELECT * FROM customer_order WHERE order_complete = 0 ORDER BY time_placed ASC";
$result = mysqli_query($mysqli, $query);

if ($result) {
    $rows = mysqli_fetch_all($result, MYSQLI_ASSOC);
    send_response($rows, 200);
} else {
    send_response("Error: " . mysqli_error($mysqli), 500);
}
