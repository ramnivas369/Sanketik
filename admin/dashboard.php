<?php
session_start();
require_once '../config/database.php';

// Check if logged in
if(!isset($_SESSION['admin_id'])) {
    header("Location: index.php");
    exit();
}

// Get stats for display
try {
    // Get user count
    $userCount = $conn->query("SELECT COUNT(*) FROM users")->fetchColumn();
    
    // Get property owner count
    $ownerCount = $conn->query("SELECT COUNT(*) FROM users WHERE user_type = 'owner'")->fetchColumn();
    
    // Get property count
    $propertyCount = $conn->query("SELECT COUNT(*) FROM properties")->fetchColumn();
    
    // Get inquiries count
    $inquiryCount = $conn->query("SELECT COUNT(*) FROM property_inquiries")->fetchColumn();
} catch(PDOException $e) {
    $errorMessage = "Database error: " . $e->getMessage();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <title>Admin Dashboard - Room For U</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Poppins', sans-serif;
        }
        
        body {
            background-color: #f8f9fa;
            color: #333;
        }
        
        .container {
            display: flex;
            min-height: 100vh;
        }
        
        .sidebar {
            width: 250px;
            background: linear-gradient(to bottom, #4254b3, #2a3a8c);
            color: white;
            padding-top: 20px;
            position: fixed;
            height: 100%;
            overflow-y: auto;
        }
        
        .sidebar-header {
            padding: 0 20px 20px;
            text-align: center;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            margin-bottom: 20px;
        }
        
        .sidebar-header h2 {
            color: white;
            font-size: 24px;
            margin-bottom: 5px;
        }
        
        .sidebar-header p {
            color: rgba(255,255,255,0.7);
            font-size: 14px;
        }
        
        .sidebar-menu {
            padding: 0;
        }
        
        .sidebar-menu a {
            display: flex;
            align-items: center;
            padding: 12px 20px;
            color: rgba(255,255,255,0.8);
            text-decoration: none;
            transition: all 0.3s;
            border-left: 3px solid transparent;
        }
        
        .sidebar-menu a.active {
            background: rgba(255,255,255,0.1);
            color: white;
            border-left-color: #25a9e0;
        }
        
        .sidebar-menu a:hover {
            background: rgba(255,255,255,0.05);
            color: white;
        }
        
        .sidebar-menu i {
            margin-right: 10px;
            font-size: 18px;
            width: 20px;
            text-align: center;
        }
        
        .main-content {
            flex: 1;
            margin-left: 250px;
            padding: 20px 30px;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #dee2e6;
            margin-bottom: 30px;
        }
        
        .header h1 {
            color: #4254b3;
            font-size: 28px;
        }
        
        .user-info {
            display: flex;
            align-items: center;
        }
        
        .user-info span {
            margin-right: 15px;
            color: #666;
        }
        
        .user-info a {
            color: #dc3545;
            text-decoration: none;
            padding: 8px 15px;
            border-radius: 5px;
            background-color: rgba(220, 53, 69, 0.1);
            transition: all 0.3s;
        }
        
        .user-info a:hover {
            background-color: rgba(220, 53, 69, 0.2);
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.05);
            display: flex;
            align-items: center;
            transition: all 0.3s;
        }
        
        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .stat-icon {
            width: 60px;
            height: 60px;
            background: rgba(66, 84, 179, 0.1);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
        }
        
        .stat-icon i {
            font-size: 24px;
            color: #4254b3;
        }
        
        .stat-info h3 {
            margin-bottom: 5px;
            color: #666;
            font-weight: 500;
            font-size: 16px;
        }
        
        .stat-info p {
            font-size: 24px;
            font-weight: 600;
            color: #4254b3;
            margin: 0;
        }
        
        .data-section {
            margin-bottom: 30px;
        }
        
        .data-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .data-header h2 {
            color: #4254b3;
            font-size: 20px;
        }
        
        .data-header a {
            padding: 8px 15px;
            background: #4254b3;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-size: 14px;
            transition: all 0.3s;
        }
        
        .data-header a:hover {
            background: #374397;
        }
        
        .data-table {
            background: white;
            border-radius: 10px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.05);
            overflow: hidden;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
        }
        
        th, td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        
        th {
            background: #f8f9fa;
            font-weight: 600;
            color: #4254b3;
        }
        
        tr:hover {
            background: #f8f9fa;
        }
        
        .action-buttons {
            display: flex;
            gap: 5px;
        }
        
        .btn {
            padding: 5px 10px;
            border-radius: 5px;
            text-decoration: none;
            font-size: 14px;
        }
        
        .btn-view {
            background: rgba(66, 84, 179, 0.1);
            color: #4254b3;
        }
        
        .btn-edit {
            background: rgba(255, 193, 7, 0.1);
            color: #ffc107;
        }
        
        .btn-delete {
            background: rgba(220, 53, 69, 0.1);
            color: #dc3545;
        }
        
        .search-box {
            margin-bottom: 20px;
        }
        
        .search-box input {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
        }
        
        .tabs {
            display: flex;
            margin-bottom: 20px;
            border-bottom: 1px solid #ddd;
        }
        
        .tab {
            padding: 10px 20px;
            cursor: pointer;
            border-bottom: 3px solid transparent;
            color: #666;
            font-weight: 500;
        }
        
        .tab.active {
            border-bottom-color: #4254b3;
            color: #4254b3;
        }
        
        .tab-content {
            display: none;
        }
        
        .tab-content.active {
            display: block;
        }
        
        @media (max-width: 1024px) {
            .sidebar {
                width: 80px;
            }
            
            .sidebar-header {
                padding: 0 10px 10px;
            }
            
            .sidebar-header h2, .sidebar-header p {
                display: none;
            }
            
            .sidebar-menu a {
                padding: 15px;
                justify-content: center;
            }
            
            .sidebar-menu a span {
                display: none;
            }
            
            .sidebar-menu i {
                margin-right: 0;
                font-size: 20px;
            }
            
            .main-content {
                margin-left: 80px;
            }
        }
        
        @media (max-width: 768px) {
            .stats {
                grid-template-columns: 1fr;
            }
            
            .header {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .user-info {
                margin-top: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Sidebar -->
        <div class="sidebar">
            <div class="sidebar-header">
                <h2>Room For U</h2>
                <p>Developer Panel</p>
            </div>
            
            <div class="sidebar-menu">
                <a href="dashboard.php" class="active">
                    <i class="fas fa-tachometer-alt"></i>
                    <span>Dashboard</span>
                </a>
                <a href="#" onclick="changeTab('users')">
                    <i class="fas fa-users"></i>
                    <span>Users</span>
                </a>
                <a href="#" onclick="changeTab('properties')">
                    <i class="fas fa-building"></i>
                    <span>Properties</span>
                </a>
                <a href="#" onclick="changeTab('inquiries')">
                    <i class="fas fa-envelope"></i>
                    <span>Inquiries</span>
                </a>
                <a href="logout.php">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                </a>
            </div>
        </div>
        
        <!-- Main Content -->
        <div class="main-content">
            <div class="header">
                <h1>Developer Dashboard</h1>
                <div class="user-info">
                    <span>Welcome, <?php echo htmlspecialchars($_SESSION['admin_username']); ?> (<?php echo htmlspecialchars($_SESSION['admin_role']); ?>)</span>
                    <a href="logout.php"><i class="fas fa-sign-out-alt"></i> Logout</a>
                </div>
            </div>
            
            <?php if (isset($errorMessage)): ?>
                <div style="background-color: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                    <?php echo $errorMessage; ?>
                </div>
            <?php endif; ?>
            
            <!-- Statistics Cards -->
            <div class="stats">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-info">
                        <h3>Total Users</h3>
                        <p><?php echo isset($userCount) ? $userCount : '0'; ?></p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-user-tie"></i>
                    </div>
                    <div class="stat-info">
                        <h3>Property Owners</h3>
                        <p><?php echo isset($ownerCount) ? $ownerCount : '0'; ?></p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-building"></i>
                    </div>
                    <div class="stat-info">
                        <h3>Properties</h3>
                        <p><?php echo isset($propertyCount) ? $propertyCount : '0'; ?></p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-envelope"></i>
                    </div>
                    <div class="stat-info">
                        <h3>Inquiries</h3>
                        <p><?php echo isset($inquiryCount) ? $inquiryCount : '0'; ?></p>
                    </div>
                </div>
            </div>
            
            <!-- Tabs -->
            <div class="tabs">
                <div class="tab active" onclick="changeTab('users')">Users</div>
                <div class="tab" onclick="changeTab('properties')">Properties</div>
                <div class="tab" onclick="changeTab('inquiries')">Inquiries</div>
            </div>
            
            <!-- Users Tab -->
            <div id="users-tab" class="tab-content active">
                <div class="search-box">
                    <input type="text" id="userSearch" placeholder="Search users...">
                </div>
                
                <div class="data-section">
                    <div class="data-header">
                        <h2>User Management</h2>
                    </div>
                    
                    <div class="data-table">
                        <table id="usersTable">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>User Type</th>
                                    <th>Registered</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                try {
                                    $stmt = $conn->query("SELECT id, name, email, user_type, created_at FROM users ORDER BY created_at DESC");
                                    if ($stmt->rowCount() > 0) {
                                        while($row = $stmt->fetch()) {
                                            echo '<tr>';
                                            echo '<td>' . $row['id'] . '</td>';
                                            echo '<td>' . htmlspecialchars($row['name']) . '</td>';
                                            echo '<td>' . htmlspecialchars($row['email']) . '</td>';
                                            echo '<td>' . htmlspecialchars($row['user_type']) . '</td>';
                                            echo '<td>' . date('d M Y', strtotime($row['created_at'])) . '</td>';
                                            echo '<td class="action-buttons">
                                                <a href="#" class="btn btn-view"><i class="fas fa-eye"></i> View</a>
                                                <a href="#" class="btn btn-edit"><i class="fas fa-edit"></i> Edit</a>
                                                <a href="#" class="btn btn-delete"><i class="fas fa-trash"></i> Delete</a>
                                            </td>';
                                            echo '</tr>';
                                        }
                                    } else {
                                        echo '<tr><td colspan="6" style="text-align: center;">No users found</td></tr>';
                                    }
                                } catch(PDOException $e) {
                                    echo '<tr><td colspan="6" style="text-align: center; color: red;">Error: ' . $e->getMessage() . '</td></tr>';
                                }
                                ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <!-- Properties Tab -->
            <div id="properties-tab" class="tab-content">
                <div class="search-box">
                    <input type="text" id="propertySearch" placeholder="Search properties...">
                </div>
                
                <div class="data-section">
                    <div class="data-header">
                        <h2>Property Management</h2>
                    </div>
                    
                    <div class="data-table">
                        <table id="propertiesTable">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Type</th>
                                    <th>Price</th>
                                    <th>City</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                try {
                                    $stmt = $conn->query("SELECT id, title, property_type, price, city, status, created_at FROM properties ORDER BY created_at DESC");
                                    if ($stmt->rowCount() > 0) {
                                        while($row = $stmt->fetch()) {
                                            echo '<tr>';
                                            echo '<td>' . $row['id'] . '</td>';
                                            echo '<td>' . htmlspecialchars($row['title']) . '</td>';
                                            echo '<td>' . htmlspecialchars($row['property_type']) . '</td>';
                                            echo '<td>₹' . number_format($row['price'], 2) . '</td>';
                                            echo '<td>' . htmlspecialchars($row['city']) . '</td>';
                                            echo '<td>' . htmlspecialchars($row['status']) . '</td>';
                                            echo '<td>' . date('d M Y', strtotime($row['created_at'])) . '</td>';
                                            echo '<td class="action-buttons">
                                                <a href="#" class="btn btn-view"><i class="fas fa-eye"></i> View</a>
                                                <a href="#" class="btn btn-edit"><i class="fas fa-edit"></i> Edit</a>
                                                <a href="#" class="btn btn-delete"><i class="fas fa-trash"></i> Delete</a>
                                            </td>';
                                            echo '</tr>';
                                        }
                                    } else {
                                        echo '<tr><td colspan="8" style="text-align: center;">No properties found</td></tr>';
                                    }
                                } catch(PDOException $e) {
                                    echo '<tr><td colspan="8" style="text-align: center; color: red;">Error: ' . $e->getMessage() . '</td></tr>';
                                }
                                ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <!-- Inquiries Tab -->
            <div id="inquiries-tab" class="tab-content">
                <div class="search-box">
                    <input type="text" id="inquirySearch" placeholder="Search inquiries...">
                </div>
                
                <div class="data-section">
                    <div class="data-header">
                        <h2>Inquiry Management</h2>
                    </div>
                    
                    <div class="data-table">
                        <table id="inquiriesTable">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Property</th>
                                    <th>User</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                try {
                                    $stmt = $conn->query("
                                        SELECT i.id, i.property_id, i.user_id, i.status, i.created_at, 
                                               p.title as property_title, 
                                               u.name as user_name
                                        FROM property_inquiries i
                                        LEFT JOIN properties p ON i.property_id = p.id
                                        LEFT JOIN users u ON i.user_id = u.id
                                        ORDER BY i.created_at DESC
                                    ");
                                    if ($stmt->rowCount() > 0) {
                                        while($row = $stmt->fetch()) {
                                            echo '<tr>';
                                            echo '<td>' . $row['id'] . '</td>';
                                            echo '<td>' . htmlspecialchars($row['property_title']) . '</td>';
                                            echo '<td>' . htmlspecialchars($row['user_name']) . '</td>';
                                            echo '<td>' . htmlspecialchars($row['status']) . '</td>';
                                            echo '<td>' . date('d M Y', strtotime($row['created_at'])) . '</td>';
                                            echo '<td class="action-buttons">
                                                <a href="#" class="btn btn-view"><i class="fas fa-eye"></i> View</a>
                                                <a href="#" class="btn btn-edit"><i class="fas fa-edit"></i> Edit</a>
                                                <a href="#" class="btn btn-delete"><i class="fas fa-trash"></i> Delete</a>
                                            </td>';
                                            echo '</tr>';
                                        }
                                    } else {
                                        echo '<tr><td colspan="6" style="text-align: center;">No inquiries found</td></tr>';
                                    }
                                } catch(PDOException $e) {
                                    echo '<tr><td colspan="6" style="text-align: center; color: red;">Error: ' . $e->getMessage() . '</td></tr>';
                                }
                                ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        // Tab switching functionality
        function changeTab(tabName) {
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Remove active class from all tabs
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Show selected tab content
            document.getElementById(tabName + '-tab').classList.add('active');
            
            // Add active class to selected tab
            document.querySelectorAll('.tab').forEach(tab => {
                if (tab.textContent.trim().toLowerCase() === tabName) {
                    tab.classList.add('active');
                }
            });
        }
        
        // Search functionality for users
        document.getElementById('userSearch').addEventListener('keyup', function() {
            const searchText = this.value.toLowerCase();
            const table = document.getElementById('usersTable');
            const rows = table.getElementsByTagName('tr');
            
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
                const cells = row.getElementsByTagName('td');
                let found = false;
                
                for (let j = 0; j < cells.length; j++) {
                    const cellText = cells[j].textContent.toLowerCase();
                    if (cellText.includes(searchText)) {
                        found = true;
                        break;
                    }
                }
                
                row.style.display = found ? '' : 'none';
            }
        });
        
        // Search functionality for properties
        document.getElementById('propertySearch').addEventListener('keyup', function() {
            const searchText = this.value.toLowerCase();
            const table = document.getElementById('propertiesTable');
            const rows = table.getElementsByTagName('tr');
            
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
                const cells = row.getElementsByTagName('td');
                let found = false;
                
                for (let j = 0; j < cells.length; j++) {
                    const cellText = cells[j].textContent.toLowerCase();
                    if (cellText.includes(searchText)) {
                        found = true;
                        break;
                    }
                }
                
                row.style.display = found ? '' : 'none';
            }
        });
        
        // Search functionality for inquiries
        document.getElementById('inquirySearch').addEventListener('keyup', function() {
            const searchText = this.value.toLowerCase();
            const table = document.getElementById('inquiriesTable');
            const rows = table.getElementsByTagName('tr');
            
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
                const cells = row.getElementsByTagName('td');
                let found = false;
                
                for (let j = 0; j < cells.length; j++) {
                    const cellText = cells[j].textContent.toLowerCase();
                    if (cellText.includes(searchText)) {
                        found = true;
                        break;
                    }
                }
                
                row.style.display = found ? '' : 'none';
            }
        });
    </script>
</body>
</html> 