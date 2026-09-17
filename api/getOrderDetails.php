<?php
/**
 * Staff endpoint: list the line items for one order.
 * Expects: { orderid: number }
 */

require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/auth.php';
require_staff();

$receivedData = get_json_input();

$query = "SELECT
                    order_items.item_complete,
                    order_items.order_mods,
                    order_items.order_product AS productItemID,
                    products.product_name,
                    products.product_category,
                    products.product_cost,
                    products.product_available,
                    products.id AS productID,
                    order_items.id AS itemorderID
                FROM
                    order_items INNER JOIN products ON
                        order_items.order_product = products.id
                WHERE
                    order_items.order_id = ?";

$stmt = $mysqli->prepare($query);
$stmt->bind_param("i", $receivedData['orderid']);
$stmt->execute();
$result = $stmt->get_result();

if ($result) {
    $rows = mysqli_fetch_all($result, MYSQLI_ASSOC);
    send_response($rows, 200);
} else {
    send_response("Error: " . mysqli_error($mysqli), 500);
}
