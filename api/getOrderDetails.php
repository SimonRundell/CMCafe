<?php

include 'setup.php';

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

$stmt->execute(); // Execute the prepared statement
$result = $stmt->get_result(); // Get the result of the executed statement

if ($result) {
    $rows = mysqli_fetch_all($result, MYSQLI_ASSOC);
    $json = json_encode($rows);
    send_response($json, 200);
} else {
    // Handle the error if the query fails
    send_response("Error: " . mysqli_error($connection), 500);
}