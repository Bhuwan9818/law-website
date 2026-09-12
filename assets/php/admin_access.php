// <?php
// Hash the password securely
// $hashed_password = password_hash("admin123", PASSWORD_DEFAULT);

// Connect to MySQL database
// $conn = new mysqli("localhost", "root", "", "contact_db");

// Check for connection error
// if ($conn->connect_error) {
//     die("Database connection failed: " . $conn->connect_error);
// }

// Insert the admin user
// $sql = "INSERT INTO admin (username, password) VALUES ('admin', '$hashed_password')";
// if ($conn->query($sql) === TRUE) {
//     echo "Admin user created successfully.";
// } else {
//     echo "Error: " . $conn->error;
// }

// Close connection
// $conn->close();
// ?>