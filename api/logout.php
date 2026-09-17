<?php
/**
 * Public endpoint: staff logout. Destroys the current session.
 */

require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/auth.php';

$_SESSION = [];
session_destroy();

send_response(["outcome" => "Logged out"], 200);
