<?php
/**
 * Shared MySQL connection for CMCafe API endpoints.
 * Requires cors.php to have run first. Reads connection info and the
 * debug flag from .config.json (gitignored, see .config.example.json).
 */

$config = json_decode(file_get_contents(__DIR__ . '/.config.json'), true);

if (!empty($config['debug'])) {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', 0);
    error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE);
}

$dbConfig = $config['db'];
$mysqli = new mysqli($dbConfig['host'], $dbConfig['user'], $dbConfig['pass'], $dbConfig['name'], $dbConfig['port']);

if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}
