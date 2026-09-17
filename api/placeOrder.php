<?php
/**
 * Public endpoint: place a new order.
 *
 * Prices are never trusted from the client — every product cost and mod
 * cost is re-looked-up from the database here, so the total returned is
 * always the true chargeable amount regardless of what the browser sent.
 *
 * Expects: {
 *   tableNumber: string,
 *   order: [{ productID: number, orderMods: string }],  // orderMods is a
 *     pipe-joined list of product_extras ids, e.g. "3|7", as sent by getMenu.jsx
 *   orderNotes: string,
 *   allergyAlert: 0|1
 * }
 */

require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';

$receivedData = get_json_input();

$tableNumber = $receivedData['tableNumber'];
$orders = $receivedData['order'];

if (!is_array($orders) || count($orders) === 0) {
    send_response("Invalid orders data", 400);
}

$productStmt = $mysqli->prepare("SELECT product_cost, product_available FROM products WHERE id = ?");
$modStmt = $mysqli->prepare("SELECT mod_cost FROM product_extras WHERE id = ? AND product_id = ?");

// Resolve every line's true cost from the database before writing anything.
$resolvedOrders = [];
foreach ($orders as $order) {
    $productId = (int)$order['productID'];

    $productStmt->bind_param("i", $productId);
    $productStmt->execute();
    $productResult = $productStmt->get_result()->fetch_assoc();

    if (!$productResult || (int)$productResult['product_available'] !== 1) {
        send_response("Product $productId is not available", 400);
    }

    $productCost = (float)$productResult['product_cost'];
    $orderModsRaw = (string)($order['orderMods'] ?? '');
    $modIds = $orderModsRaw === '' ? [] : array_map('intval', explode('|', $orderModsRaw));
    $modsCost = 0.0;

    foreach ($modIds as $modId) {
        $modId = (int)$modId;
        $modStmt->bind_param("ii", $modId, $productId);
        $modStmt->execute();
        $modResult = $modStmt->get_result()->fetch_assoc();

        if (!$modResult) {
            send_response("Extra $modId is not valid for product $productId", 400);
        }

        $modsCost += (float)$modResult['mod_cost'];
    }

    $resolvedOrders[] = [
        'productId' => $productId,
        'productCost' => $productCost,
        'modIds' => $modIds,
        'modsCost' => $modsCost,
    ];
}

$productStmt->close();
$modStmt->close();

$mysqli->begin_transaction();

$query = "INSERT INTO customer_order (order_table, order_complete, order_total, order_paid) VALUES (?, 0, 0, 0)";
$stmt = $mysqli->prepare($query);
$stmt->bind_param("s", $tableNumber);

if (!$stmt->execute()) {
    $mysqli->rollback();
    send_response("customer_order Error: " . $mysqli->error, 500);
}
$orderId = $stmt->insert_id;
$stmt->close();

$stmt = $mysqli->prepare("INSERT INTO order_items (order_id, order_product, product_cost, order_mods) VALUES (?, ?, ?, ?)");
if ($stmt === false) {
    $mysqli->rollback();
    send_response("Prepare failed: " . $mysqli->error, 500);
}

$orderTotal = 0;
foreach ($resolvedOrders as $line) {
    $orderTotal += $line['productCost'] + $line['modsCost'];
    $orderModsString = implode('|', $line['modIds']);

    $stmt->bind_param('iids', $orderId, $line['productId'], $line['productCost'], $orderModsString);

    if (!$stmt->execute()) {
        $mysqli->rollback();
        send_response("order_items Error: " . $stmt->error, 500);
    }
}
$stmt->close();

$query = "UPDATE customer_order SET time_placed = NOW(), order_total = ?, order_notes = ?, allergy_alert = ? WHERE id = ?";
$stmt = $mysqli->prepare($query);
$allergyAlert = (int)($receivedData['allergyAlert'] ?? 0);
$orderNotes = $receivedData['orderNotes'] ?? '';
$stmt->bind_param("dsii", $orderTotal, $orderNotes, $allergyAlert, $orderId);

if (!$stmt->execute()) {
    $mysqli->rollback();
    send_response("customer_order update Error: " . $mysqli->error, 500);
}
$stmt->close();

$mysqli->commit();

send_response(["outcome" => "Order placed successfully.", "orderid" => $orderId, "totalCost" => $orderTotal], 200);
