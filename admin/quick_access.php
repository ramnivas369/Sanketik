<?php
// Auto-login with default admin credentials
session_start();

// Set admin session directly
$_SESSION['admin_id'] = 1;  // ID of the default admin
$_SESSION['admin_username'] = 'admin';
$_SESSION['admin_role'] = 'developer';

// Redirect to dashboard
header("Location: dashboard.php");
exit();
?> 