<?php
/**
 * Shared response/logging/request helpers for CMCafe API endpoints.
 * Requires db.php to have run first (uses $mysqli's error state indirectly
 * via callers, not directly here).
 */

/**
 * Send a JSON response and terminate the script.
 *
 * @param mixed $response Any JSON-serialisable value (array, string, etc).
 * @param int   $code     HTTP status code to send.
 */
function send_response($response, $code = 200) {
    header('Content-Type: application/json');
    http_response_code($code);
    die(json_encode($response));
}

/**
 * Append a timestamped line to api/server.log.
 *
 * @param string $log Message to record.
 */
function log_info($log) {
    $file = __DIR__ . '/server.log';
    $currentDateTime = date('Y-m-d H:i:s');
    file_put_contents($file, $currentDateTime . " : " . $log . PHP_EOL, FILE_APPEND);
}

/**
 * Read and JSON-decode the raw request body, logging it for POST requests.
 * Sends a 400 response and terminates if a POST body isn't a JSON object/array.
 *
 * @return array Decoded request payload (empty array for non-POST requests).
 */
function get_json_input() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        return [];
    }

    $jsonPayload = file_get_contents('php://input');
    $receivedData = json_decode($jsonPayload, true);

    log_info("Received: " . $jsonPayload);

    if (!is_array($receivedData)) {
        send_response("Invalid JSON payload", 400);
    }

    return $receivedData;
}
