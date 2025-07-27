<?php
/* 
==================================================================
Setup communal code for PHP scripts
Simon Rundell for CodeMonkey Design Ltd.
25th July 2024
==================================================================
*/

// debug
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Headers and CORS permissions
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Access-Control-Allow-Origin, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // Return 200 OK for preflight requests
    http_response_code(200);
    exit;
}


// Read connection information from a secure location
$config = json_decode(file_get_contents('./.config.json'), true);
$mysqli = new mysqli($config['servername'], $config['username'], $config['password'], $config['dbname']);

// Check connection
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

// Read the raw POST data
$jsonPayload = file_get_contents('php://input');

// Decode the JSON payload into an associative array
$receivedData = json_decode($jsonPayload, true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    log_info("Received: ".json_encode($receivedData));
    $data = $receivedData;

    // Move the array check here, after decoding
    if (!is_array($data)) {
        send_response("Invalid JSON payload", 400);
        exit;
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Assuming GET requests are handled differently and might not need JSON decoding
    // $data['action'] = $_GET['action']; 
    // $data['data'] = $_GET['data'];
}

function console_log($output, $with_script_tags = true) {
    $js_code = 'console.log(' . json_encode($output, JSON_HEX_TAG) . ');';
    if ($with_script_tags) {
        $js_code = '<script>' . $js_code . '</script>';
    }
    echo $js_code;
}

function send_response ($response, $code = 200) {
    header('Content-Type: application/json');
    http_response_code($code);
    die(json_encode($response));
}  // send_response

function log_info($log) {
    $currentDirectory = getcwd();
    $file=$currentDirectory.'server.log';
    $currentDateTime = date('Y-m-d H:i:s');
    file_put_contents($file, $currentDateTime." : ".$log.chr(13), FILE_APPEND);
} // log_info
