<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');  // Change this to your database username
define('DB_PASS', '');      // Change this to your database password
define('DB_NAME', 'room_for_u');

// Create database connection
try {
    $conn = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// Function to sanitize user input
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Function to generate secure session token
function generate_session_token() {
    return bin2hex(random_bytes(32));
}

// Function to verify user session
function verify_session() {
    if (!isset($_SESSION['user_id']) || !isset($_SESSION['session_token'])) {
        return false;
    }
    
    global $conn;
    $stmt = $conn->prepare("SELECT session_token FROM user_sessions WHERE user_id = ? AND expires_at > NOW()");
    $stmt->execute([$_SESSION['user_id']]);
    $session = $stmt->fetch();
    
    return $session && hash_equals($session['session_token'], $_SESSION['session_token']);
}
?> 