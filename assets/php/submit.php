<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = trim($_POST["name"]);
    $email = trim($_POST["email"]);
    $phone = trim($_POST["phone"]);
    $service = trim($_POST["service"]);
    $company = trim($_POST["company"]);
    $message = trim($_POST["message"]);

    if (empty($name) || empty($email) || empty($phone) || empty($service) || empty($company)) {
        echo "All fields are required!";
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Invalid email format!";
        exit;
    }

    $conn = new mysqli("localhost", "u312509348_pankaj", "@Pankaj123@", "u312509348_conformity_db");

    if ($conn->connect_error) {
        die("Database connection failed: " . $conn->connect_error);
    }

    $stmt = $conn->prepare("INSERT INTO conformity_data (name, email, phone, message, service, company) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $name, $email, $phone, $message, $service, $company);

    if ($stmt->execute()) {
        echo ",<h2>Thank you for your feedback!</h2><button class='btn btn-primary'><a href='/contact.html'>Go Back</a></button>";
    } else {
        echo "Error: " . $conn->error;
    }

    $stmt->close();
    $conn->close();
}
?>