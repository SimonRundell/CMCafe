<?php
/**
 * Public endpoint: list all products, ordered by category.
 */

require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';

$receivedData = get_json_input();

$query = "SELECT * FROM products ORDER BY product_category";
$result = mysqli_query($mysqli, $query);

if ($result) {
    $rows = mysqli_fetch_all($result, MYSQLI_ASSOC);
    send_response($rows, 200);
} else {
    send_response("Error: " . mysqli_error($mysqli), 500);
}
