<?php
session_start();
$conn = new mysqli("localhost", "root", "", "contact_db");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST["username"];
    $password = $_POST["password"];

    $stmt = $conn->prepare("SELECT password FROM admin WHERE username = ?"); 
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();
    $stmt->bind_result($hashed_password);
    $stmt->fetch();

    if ($stmt->num_rows > 0 && password_verify($password, $hashed_password)) {
        $_SESSION["admin"] = $username;
        header("Location: admin_dashboard.php");
    } else {
        echo "Invalid login credentials!";
    }

    $stmt->close();
}

$conn->close();
?>