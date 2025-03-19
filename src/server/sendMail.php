<?php
// Set the correct Content-Type for JSON response
header('Content-Type: application/json');

// Better CORS handling for both development and production
$allowedOrigins = [
    'https://malspirale.ch',
    'https://www.malspirale.ch',
    'http://localhost:4200'
];

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

// If it's a same-origin request, or if it's from an allowed origin
if (empty($origin) || in_array($origin, $allowedOrigins)) {
    if (!empty($origin)) {
        header("Access-Control-Allow-Origin: $origin");
    }
    
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Max-Age: 3600"); // Cache preflight for 1 hour
}

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

switch ($_SERVER['REQUEST_METHOD']) {
    case ("OPTIONS"): 
        // We already handled OPTIONS above, but keeping this for redundancy
        exit;
    case("POST"): 
        // Get the JSON payload
        $json = file_get_contents('php://input');
        $params = json_decode($json);

        // Debug information
        error_log("Received request: " . print_r($params, true));

        // Validate required fields
        if(empty($params->email) || empty($params->name) || empty($params->message)) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields']);
            exit;
        }

        // Sanitize inputs
        $email = filter_var($params->email, FILTER_SANITIZE_EMAIL);
        $name = htmlspecialchars($params->name, ENT_QUOTES, 'UTF-8');
        $message = htmlspecialchars($params->message, ENT_QUOTES, 'UTF-8');
        $phone = isset($params->phone) ? htmlspecialchars($params->phone, ENT_QUOTES, 'UTF-8') : '';
        $agreedToPrivacyPolicy = $params->agreedToPrivacyPolicy;

        // Validate email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid email address']);
            exit;
        }

        // Set recipient email (change to the actual recipient)
        $recipient = 'malbegleiterin@malspirale.ch';
        $subject = "Kontaktformular: " . substr($name, 0, 30);
        
        // Create HTML email
        $htmlMessage = "
<html>
<head>
  <title>Kontaktformular Nachricht</title>
</head>
<body>
  <div style='background-color:#f8f9fa; padding:20px;'>
    <h2 style='color:#333;'>Neue Kontaktanfrage</h2>
    <p><strong>Von:</strong> {$name} &lt;{$email}&gt;</p>
    " . ($phone ? "<p><strong>Telefon:</strong> {$phone}</p>" : "") . "
    <p><strong>Nachricht:</strong></p>
    <div style='background-color:#fff; padding:15px; border-radius:5px; border:1px solid #ddd;'>
      " . nl2br($message) . "
    </div>
    <p style='font-size:0.9em; color:#666;'>Diese Nachricht wurde automatisch vom Kontaktformular gesendet.</p>
  </div>
</body>
</html>
";

        $headers = [
            'MIME-Version: 1.0',
            'Content-type: text/html; charset=utf-8',
            'From: Malspirale Website <noreply@malspirale.ch>',
            'Reply-To: ' . $email
        ];

        // For development, just simulate success and log
        if (strpos($_SERVER['HTTP_HOST'], 'localhost') !== false) {
            error_log("Development mode - would have sent email to: $recipient");
            echo json_encode(['success' => true, 'dev_mode' => true]);
            exit;
        }

        // Send email and check result
        $mailSent = mail($recipient, $subject, $htmlMessage, implode("\r\n", $headers));
        
        if ($mailSent) {
            http_response_code(200);
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to send email']);
            
            // Optional: Log the error to a file
            error_log("Failed to send email from: $email, Name: $name");
        }
        break;
    default: 
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        header("Allow: POST, OPTIONS", true, 405);
        exit;
}
