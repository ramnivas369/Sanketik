<?php
session_start();
require_once '../config/database.php';

$error = '';
$success = '';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = sanitize_input($_POST['name']);
    $email = sanitize_input($_POST['email']);
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];
    $user_type = sanitize_input($_POST['user_type']);
    
    // Validate password match
    if ($password !== $confirm_password) {
        $error = "Passwords do not match";
    } else {
        try {
            // Check if email already exists
            $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$email]);
            if ($stmt->fetch()) {
                $error = "Email already registered";
            } else {
                // Hash password
                $hashed_password = password_hash($password, PASSWORD_DEFAULT);
                
                // Insert new user
                $stmt = $conn->prepare("INSERT INTO users (name, email, password, user_type, created_at) VALUES (?, ?, ?, ?, NOW())");
                $stmt->execute([$name, $email, $hashed_password, $user_type]);
                
                $success = "Registration successful! Please login.";
                
                // Redirect to login page after 2 seconds
                header("refresh:2;url=userlogin.php");
            }
        } catch(PDOException $e) {
            $error = "Registration failed. Please try again later.";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <title>Register - Room For U</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/service.css" media="all">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://kit.fontawesome.com/61d1b80f50.js" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>
    <style>
        .register-container {
            max-width: 400px;
            margin: 100px auto;
            padding: 30px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .register-form {
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
        
        .form-group input, .form-group select {
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 16px;
            transition: all 0.3s ease;
        }
        
        .form-group input:focus, .form-group select:focus {
            border-color: #4254b3;
            outline: none;
            box-shadow: 0 0 0 3px rgba(66, 84, 179, 0.1);
        }
        
        .register-btn {
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
        
        .register-btn:hover {
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

    <div class="register-container animate__animated animate__fadeInUp">
        <h2 class="heading" style="text-align: center; margin-bottom: 30px;">Register</h2>
        
        <?php if ($error): ?>
            <div class="error-message animate__animated animate__fadeIn"><?php echo $error; ?></div>
        <?php endif; ?>
        
        <?php if ($success): ?>
            <div class="success-message animate__animated animate__fadeIn"><?php echo $success; ?></div>
        <?php endif; ?>
        
        <form class="register-form" method="POST" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
            <div class="form-group">
                <label for="name">Full Name</label>
                <input type="text" id="name" name="name" required>
            </div>
            
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            
            <div class="form-group">
                <label for="confirm_password">Confirm Password</label>
                <input type="password" id="confirm_password" name="confirm_password" required>
            </div>
            
            <div class="form-group">
                <label for="user_type">Register as</label>
                <select id="user_type" name="user_type" required>
                    <option value="user">User</option>
                    <option value="owner">Property Owner</option>
                </select>
            </div>
            
            <button type="submit" class="register-btn">Register</button>
        </form>
        
        <div style="text-align: center; margin-top: 20px;">
            <p>Already have an account? <a href="userlogin.php" style="color: #4254b3; text-decoration: none;">Login here</a></p>
        </div>
    </div>
</body>
</html> 