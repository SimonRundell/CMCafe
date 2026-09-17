<?php
/**
 * Shared CORS handler for CMCafe API endpoints.
 * Must be required first, before any other output, in every endpoint.
 *
 * Reflects the request Origin back when it is localhost on any port, so
 * Vite's dev server is accepted regardless of which port it picks, and
 * answers OPTIONS preflight requests directly.
 */

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (preg_match('#^https?://(localhost|127\.0\.0\.1)(:\d+)?$#', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
}

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Authorization, Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
