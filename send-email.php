<?php

switch ($_SERVER['REQUEST_METHOD']) {
    case ("OPTIONS"): //Allow preflighting to take place.
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST");
        header("Access-Control-Allow-Headers: content-type");
        exit;
        case("POST"): //Send the email;
            header("Access-Control-Allow-Origin: *");
            // Payload is not send to $_POST Variable,
            // is send to php:input as a text
            $json = file_get_contents('php://input');
            //parse the Payload from text format to Object
            $params = json_decode($json);

            $email = $params->email;
            $name = $params->name;
            $message = $params->message;
            $agreedToPrivacyPolicy = $params->agreedToPrivacyPolicy;

            $recipient = 'marco-ammann@outlook.com';
            $subject = "Contact From <$email>";
            $message = "
<html>
<head>
  <title>Kontaktformular Nachricht</title>
</head>
<body>
  <div style='background-color:#f8f9fa; padding:20px;'>
    <h2 style='color:#333;'>Neue Kontaktanfrage</h2>
    <p><strong>Von:</strong> {$name} &lt;{$email}&gt;</p>
    <p><strong>Nachricht:</strong></p>
    <div style='background-color:#fff; padding:15px; border-radius:5px; border:1px solid #ddd;'>
      {$message}
    </div>
    <p style='font-size:0.9em; color:#666;'>Diese Nachricht wurde automatisch vom Kontaktformular gesendet.</p>
  </div>
</body>
</html>
";

            $headers   = array();
            $headers[] = 'MIME-Version: 1.0';
            $headers[] = 'Content-type: text/html; charset=utf-8';

            // Additional headers
            $headers[] = "From: noreply@malspirale.ch";

            mail($recipient, $subject, $message, implode("\r\n", $headers));
            break;
        default: //Reject any non POST or OPTIONS requests.
            header("Allow: POST", true, 405);
            exit;
    }
