<?php
header("Content-Type: application/json; charset=UTF-8");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . "/../vendor/autoload.php";

// Leer JSON crudo
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

// Verificar JSON válido
if (!$data) {
    echo json_encode([
        "success" => false,
        "message" => "JSON inválido o vacío"
    ]);
    exit;
}

// Sanitizar datos
$name    = trim($data["name"] ?? "");
$email   = trim($data["email"] ?? "");
$phone   = trim($data["phone"] ?? "No especificado");
$service = trim($data["service"] ?? "No especificado");
$message = trim($data["message"] ?? "");

// Validación
if ($name === "" || $email === "" || $message === "") {
    echo json_encode([
        "success" => false,
        "message" => "Datos incompletos"
    ]);
    exit;
}

$mail = new PHPMailer(true);

try {
    // SMTP Hostinger
    $mail->isSMTP();
    $mail->Host       = "smtp.hostinger.com";
    $mail->SMTPAuth   = true;
    $mail->Username   = "soporte@weblycr.com";
    $mail->Password   = "TU_PASSWORD";
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;

    // Remitentes
    $mail->setFrom("soporte@weblycr.com", "Webly");
    $mail->addAddress("soporte@weblycr.com");
    $mail->addReplyTo($email, $name);

    // Contenido
    $mail->isHTML(true);
    $mail->Subject = "Nuevo contacto desde Webly";
    $mail->Body = "
        <h3>Nuevo mensaje</h3>
        <p><strong>Nombre:</strong> {$name}</p>
        <p><strong>Email:</strong> {$email}</p>
        <p><strong>Teléfono:</strong> {$phone}</p>
        <p><strong>Servicio:</strong> {$service}</p>
        <p><strong>Mensaje:</strong><br>{$message}</p>
    ";

    $mail->send();

    echo json_encode([
        "success" => true,
        "message" => "Mensaje enviado correctamente"
    ]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error al enviar el correo",
        "error"   => $mail->ErrorInfo
    ]);
}
