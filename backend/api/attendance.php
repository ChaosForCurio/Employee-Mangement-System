<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/Database.php';
require_once '../models/Attendance.php';

use Config\Database;
use Models\Attendance;

$database = new Database();
$db = $database->getConnection();
$attendance = new Attendance($db);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $employee_id = isset($_GET['employee_id']) ? $_GET['employee_id'] : null;
        $stmt = $attendance->read($employee_id);
        $num = $stmt->rowCount();

        if ($num > 0) {
            $attendance_arr = array();
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $attendance_arr[] = $row;
            }
            http_response_code(200);
            echo json_encode($attendance_arr);
        } else {
            http_response_code(200);
            echo json_encode(array());
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        if (!empty($data->employee_id) && !empty($data->date) && !empty($data->status)) {
            $attendance->employee_id = $data->employee_id;
            $attendance->date = $data->date;
            $attendance->status = $data->status;
            $attendance->check_in = $data->check_in ?? null;

            if ($attendance->create()) {
                http_response_code(201);
                echo json_encode(array("message" => "Attendance recorded."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to record attendance."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Incomplete data."));
        }
        break;

    case 'PATCH':
        $data = json_decode(file_get_contents("php://input"));
        if (!empty($data->id)) {
            $attendance->id = $data->id;
            $attendance->status = $data->status ?? null;
            $attendance->check_in = $data->check_in ?? null;
            $attendance->check_out = $data->check_out ?? null;

            if ($attendance->update()) {
                http_response_code(200);
                echo json_encode(array("message" => "Attendance updated."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to update attendance."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Missing ID."));
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"));
        $id = $data->id ?? ($_GET['id'] ?? null);
        if (!empty($id)) {
            $attendance->id = $id;
            if ($attendance->delete()) {
                http_response_code(200);
                echo json_encode(array("message" => "Attendance deleted."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to delete attendance."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Missing ID."));
        }
        break;
}
