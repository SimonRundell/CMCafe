<?php

include 'setup.php';

$query = "SELECT * FROM products ORDER BY product_category";
$result = mysqli_query($mysqli, $query);

if ($result) {
    $rows = mysqli_fetch_all($result, MYSQLI_ASSOC);
    $json = json_encode($rows);
    send_response($json, 200);
} else {
    // Handle the error if the query fails
    send_response("Error: " . mysqli_error($connection), 500);
}