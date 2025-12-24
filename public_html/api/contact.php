<?php
header("Content-Type: application/json");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . "/../vendor/autoload.php";

// Leer JSON
$data = json_decode(file_get_contents("php://input"), true);

// Validación básica
if (
    empty($data["name"]) ||
    empty($data["email"]) ||
    empty($data["message"])
) {
    echo json_encode([
        "success" => false,
        "message" => "Datos incompletos"
    ]);
    exit;
}

$mail = new PHPMailer(true);

try {
    // CONFIG SMTP HOSTINGER
    $mail->isSMTP();
    $mail->Host       = "smtp.hostinger.com";
    $mail->SMTPAuth   = true;
    $mail->Username   = "soporte@weblycr.com"; // TU CORREO
    $mail->Password   = "p7l98N*j3R";     // TU PASSWORD
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;

    // CORREOS
    $mail->setFrom("soporte@weblycr.com", "Webly");
    $mail->addAddress("soporte@weblycr.com"); // Donde lo recibes
    $mail->addReplyTo($data["email"], $data["name"]);

    // CONTENIDO
    $mail->isHTML(true);
    $mail->Subject = "Nuevo contacto desde Webly";
    $mail->Body    = "
        <h3>Nuevo mensaje</h3>
        <p><strong>Nombre:</strong> {$data['name']}</p>
        <p><strong>Email:</strong> {$data['email']}</p>
        <p><strong>Teléfono:</strong> {$data['phone']}</p>
        <p><strong>Servicio:</strong> {$data['service']}</p>
        <p><strong>Mensaje:</strong><br>{$data['message']}</p>
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
