

<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["message" => "Método no permitido."]);
    exit;
}

// Leer JSON (igual que bodyParser.json())
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

$name    = trim($data["name"] ?? "");
$email   = trim($data["email"] ?? "");
$phone   = trim($data["phone"] ?? "");
$service = trim($data["service"] ?? "");
$message = trim($data["message"] ?? "");

if (!$name || !$email || !$service || !$message) {
    http_response_code(400);
    echo json_encode(["message" => "Faltan campos obligatorios."]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["message" => "Correo inválido."]);
    exit;
}

// Cargar autoloader de Composer (vendor/)
require __DIR__ . "/../vendor/autoload.php";

$mail = new PHPMailer(true);

try {
    // SMTP Hostinger (igual que tu Nodemailer)
    $mail->isSMTP();
    $mail->Host       = "smtp.hostinger.com";
    $mail->SMTPAuth   = true;

    // IMPORTANTE: poné aquí tu correo real y contraseña real
    $smtpUser = "soporte@weblycr.com";
    $smtpPass = "TU_PASSWORD_REAL";

    $mail->Username   = $smtpUser;
    $mail->Password   = $smtpPass;

    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;

    // Contenido del correo
    $mail->setFrom($smtpUser, "Formulario Webly");
    $mail->addAddress($smtpUser);            // te llega a vos
    $mail->addReplyTo($email, $name);        // responder al cliente

    $mail->isHTML(true);
    $mail->Subject = "Nuevo mensaje desde Webly - " . $service;

    $safeMsg = nl2br(htmlspecialchars($message, ENT_QUOTES, "UTF-8"));
    $safeName = htmlspecialchars($name, ENT_QUOTES, "UTF-8");
    $safeEmail = htmlspecialchars($email, ENT_QUOTES, "UTF-8");
    $safePhone = htmlspecialchars($phone ?: "No indicado", ENT_QUOTES, "UTF-8");
    $safeService = htmlspecialchars($service, ENT_QUOTES, "UTF-8");

    $mail->Body = "
      <h2>Nuevo mensaje desde el formulario de contacto</h2>
      <p><strong>Nombre:</strong> {$safeName}</p>
      <p><strong>Correo:</strong> {$safeEmail}</p>
      <p><strong>Teléfono:</strong> {$safePhone}</p>
      <p><strong>Servicio:</strong> {$safeService}</p>
      <p><strong>Mensaje:</strong></p>
      <p>{$safeMsg}</p>
    ";

    $mail->send();

    http_response_code(200);
    echo json_encode(["message" => "Correo enviado correctamente."]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Error al enviar el correo."]);
}
