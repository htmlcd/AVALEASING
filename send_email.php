<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Получаем данные из POST запроса
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Проверяем наличие всех необходимых данных
    if (!isset($data['name']) || !isset($data['phone']) || !isset($data['carModel'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Не все данные предоставлены']);
        exit;
    }
    
    $to = 'avaleasing20@gmail.com';
    $subject = 'Новая заявка на лизинг автомобиля';
    
    // Формируем текст письма в HTML формате
    $message = "
    <html>
    <head>
        <title>Новая заявка на лизинг автомобиля</title>
    </head>
    <body>
        <h2>Новая заявка на лизинг автомобиля</h2>
        <p><strong>Модель автомобиля:</strong> {$data['carModel']}</p>
        <p><strong>Имя клиента:</strong> {$data['name']}</p>
        <p><strong>Телефон:</strong> {$data['phone']}</p>
    </body>
    </html>
    ";
    
    // Заголовки письма
    $headers = array(
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=utf-8',
        'From: AVA Leasing <no-reply@avaleasing.ru>',
        'Reply-To: no-reply@avaleasing.ru',
        'X-Mailer: PHP/' . phpversion()
    );
    
    // Отправляем письмо
    if (mail($to, $subject, $message, implode("\r\n", $headers))) {
        echo json_encode(['success' => true, 'message' => 'Заявка успешно отправлена']);
    } else {
        // Попробуем отправить через альтернативный метод
        if (@mail($to, $subject, $message, implode("\r\n", $headers))) {
            echo json_encode(['success' => true, 'message' => 'Заявка успешно отправлена']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Ошибка при отправке письма']);
        }
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Метод не разрешен']);
}
?> 