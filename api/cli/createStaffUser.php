<?php
/**
 * CLI-only script to create a staff login. Never reachable over HTTP.
 * Usage: php createStaffUser.php <username> <password>
 */

if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    die('This script can only be run from the command line.');
}

if ($argc !== 3) {
    fwrite(STDERR, "Usage: php createStaffUser.php <username> <password>\n");
    exit(1);
}

[, $username, $password] = $argv;

$config = json_decode(file_get_contents(__DIR__ . '/../.config.json'), true)['db'];
$mysqli = new mysqli($config['host'], $config['user'], $config['pass'], $config['name'], $config['port']);

if ($mysqli->connect_error) {
    fwrite(STDERR, "Connection failed: " . $mysqli->connect_error . "\n");
    exit(1);
}

$passwordHash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $mysqli->prepare("INSERT INTO staff (username, password_hash) VALUES (?, ?)");
$stmt->bind_param("ss", $username, $passwordHash);

if ($stmt->execute()) {
    echo "Staff user '$username' created.\n";
} else {
    fwrite(STDERR, "Error: " . $mysqli->error . "\n");
    exit(1);
}
