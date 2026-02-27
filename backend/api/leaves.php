<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PATCH");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/Database.php';
require_once '../models/Leave.php';

use Config\Database;
use Models\Leave;

$database = new Database();
$db = $database->getConnection();
$leave = new Leave($db);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $employee_id = isset($_GET['employee_id']) ? $_GET['employee_id'] : null;
        $stmt = $leave->read($employee_id);
        $num = $stmt->rowCount();

        if ($num > 0) {
            $leaves_arr = array();
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $leaves_arr[] = $row;
            }
            http_response_code(200);
            echo json_encode($leaves_arr);
        } else {
            http_response_code(200);
            echo json_encode(array());
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        if (!empty($data->employee_id) && !empty($data->start_date) && !empty($data->end_date)) {
            $leave->employee_id = $data->employee_id;
            $leave->start_date = $data->start_date;
            $leave->end_date = $data->end_date;
            $leave->type = $data->type ?? 'Casual';
            $leave->reason = $data->reason ?? '';

            if ($leave->create()) {
                http_response_code(201);
                echo json_encode(array("message" => "Leave request submitted."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to submit leave request."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Incomplete data."));
        }
        break;

    case 'PATCH':
        $data = json_decode(file_get_contents("php://input"));
        if (!empty($data->id) && !empty($data->status)) {
            $leave->id = $data->id;
            $leave->status = $data->status;
            if ($leave->updateStatus()) {
                http_response_code(200);
                echo json_encode(array("message" => "Leave status updated."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to update status."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Missing data."));
        }
        break;
}
