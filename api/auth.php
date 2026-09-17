<?php
/**
 * Staff session auth for CMCafe API endpoints.
 * Requires cors.php, db.php and helpers.php to have run first.
 */

session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => true,
    'httponly' => true,
    'samesite' => 'None',
]);
session_start();

/**
 * Halt the request with 401 unless a staff member is logged in.
 * Call at the top of any endpoint that only staff should reach.
 */
function require_staff() {
    if (empty($_SESSION['staff_id'])) {
        send_response('Unauthorized', 401);
    }
}
