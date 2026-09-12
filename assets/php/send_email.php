<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $name = htmlspecialchars($_POST['name']);
  $email = htmlspecialchars($_POST['email']);
  $phone = htmlspecialchars($_POST['phone']);
  $service = htmlspecialchars($_POST['service']);
  $company = htmlspecialchars($_POST['company']);
  $message = htmlspecialchars($_POST['message']);

  $to = "info@conformityalliance.com"; // Replace with your Gmail address
  $subject = "New Contact Form Submission";
  $body = "Name: $name\nEmail: $email\nphone: $phone\nservice: $service\ncompany: $company\nMessage:$message";
  $headers = "From: pankaj.k@conformityalliance.in";
  // $headers .= "reply-To: $email\r\n";
  // $headers .= "X-Mailer: PHP/".phpversion();

  if (mail($to, $subject, $body, $headers)) {
    echo '
      <div style="max-width:400px;margin:60px auto;padding:30px 40px;background:#f8f9fa;border-radius:12px;box-shadow:0 4px 18px rgba(0,0,0,0.08);text-align:center;">
        <svg width="60" height="60" fill="none" viewBox="0 0 24 24" style="margin-bottom:18px;">
          <circle cx="12" cy="12" r="12" fill="#4CAF50"/>
          <path d="M17 9l-5.2 5.2a1 1 0 01-1.4 0L7 11.8" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h2 style="color:#333;margin-bottom:10px;">Message Sent!</h2>
        <p style="color:#555;margin-bottom:24px;">Thank you for contacting us.<br>We will get back to you soon.</p>
        <a href="javascript:history.back()" style="display:inline-block;padding:10px 28px;background:#4CAF50;color:#fff;border-radius:6px;text-decoration:none;font-weight:600;transition:background 0.2s;">Return</a>
      </div>
      ';
  } else {
    echo '
      <div style="max-width:400px;margin:60px auto;padding:30px 40px;background:#fff3f3;border-radius:12px;box-shadow:0 4px 18px rgba(0,0,0,0.08);text-align:center;">
        <svg width="60" height="60" fill="none" viewBox="0 0 24 24" style="margin-bottom:18px;">
          <circle cx="12" cy="12" r="12" fill="#f44336"/>
          <path d="M15 9l-6 6M9 9l6 6" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h2 style="color:#c00;margin-bottom:10px;">Failed to Send</h2>
        <p style="color:#a33;margin-bottom:24px;">Sorry, there was a problem sending your message.<br>Please try again later.</p>
        <a href="javascript:history.back()" style="display:inline-block;padding:10px 28px;background:#f44336;color:#fff;border-radius:6px;text-decoration:none;font-weight:600;transition:background 0.2s;">Return</a>
      </div>
      ';
  }
} else {
  echo "Invalid request.";
}
