<?php
session_start();
require_once '../config/database.php';

$error = '';
$success = '';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = sanitize_input($_POST['email']);
    $password = $_POST['password'];
    
    try {
        $stmt = $conn->prepare("SELECT id, password, user_type FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        if ($user && password_verify($password, $user['password'])) {
            // Generate session token
            $session_token = generate_session_token();
            
            // Store session in database
            $stmt = $conn->prepare("INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR))");
            $stmt->execute([$user['id'], $session_token]);
            
            // Set session variables
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['session_token'] = $session_token;
            $_SESSION['user_type'] = $user['user_type'];
            
            // Redirect based on user type
            if ($user['user_type'] == 'owner') {
                header("Location: owner_dashboard.php");
            } else {
                header("Location: user_dashboard.php");
            }
            exit();
        } else {
            $error = "Invalid email or password";
        }
    } catch(PDOException $e) {
        $error = "Login failed. Please try again later.";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <title>Login - Room For U</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/service.css" media="all">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://kit.fontawesome.com/61d1b80f50.js" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>
    <style>
        .login-container {
            max-width: 400px;
            margin: 100px auto;
            padding: 30px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .login-form {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        .form-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        
        .form-group label {
            color: #4254b3;
            font-weight: 500;
        }
        
        .form-group input {
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 16px;
            transition: all 0.3s ease;
        }
        
        .form-group input:focus {
            border-color: #4254b3;
            outline: none;
            box-shadow: 0 0 0 3px rgba(66, 84, 179, 0.1);
        }
        
        .login-btn {
            background: linear-gradient(90deg, #4254b3, #25a9e0);
            color: white;
            padding: 12px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .login-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(66, 84, 179, 0.3);
        }
        
        .error-message {
            color: #ff3988;
            background: rgba(255, 57, 136, 0.1);
            padding: 10px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        
        .success-message {
            color: #28a745;
            background: rgba(40, 167, 69, 0.1);
            padding: 10px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        
        .user-type-toggle {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }
        
        .user-type-btn {
            flex: 1;
            padding: 10px;
            border: 2px solid #4254b3;
            background: white;
            color: #4254b3;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .user-type-btn.active {
            background: #4254b3;
            color: white;
        }
    </style>
</head>
<body>
    <nav>
        <h1 class="brand-heading-1 animate__animated animate__fadeIn">
            <span class="multicolor-title">
                <span>Room</span> <span class="color-lired">For</span> <span>U</span>
            </span>
        </h1>
        <img src="../img/home.png" alt="" class="home-png">
        <div class="nav-items animate__animated animate__fadeIn">
            <a href="../index.html"><button class="post-btn">Home</button></a>
        </div>
    </nav>

    <div class="login-container animate__animated animate__fadeInUp">
        <h2 class="heading" style="text-align: center; margin-bottom: 30px;">Login</h2>
        
        <?php if ($error): ?>
            <div class="error-message animate__animated animate__fadeIn"><?php echo $error; ?></div>
        <?php endif; ?>
        
        <?php if ($success): ?>
            <div class="success-message animate__animated animate__fadeIn"><?php echo $success; ?></div>
        <?php endif; ?>
        
        <div class="user-type-toggle">
            <button class="user-type-btn active" onclick="toggleUserType('user')">User</button>
            <button class="user-type-btn" onclick="toggleUserType('owner')">Owner</button>
        </div>
        
        <form class="login-form" method="POST" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            
            <button type="submit" class="login-btn">Login</button>
        </form>
        
        <div style="text-align: center; margin-top: 20px;">
            <p>Don't have an account? <a href="register.php" style="color: #4254b3; text-decoration: none;">Register here</a></p>
        </div>
    </div>

    <script>
        function toggleUserType(type) {
            const buttons = document.querySelectorAll('.user-type-btn');
            buttons.forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            
            // You can add additional logic here to handle user type selection
        }
    </script>
</body>
</html> 