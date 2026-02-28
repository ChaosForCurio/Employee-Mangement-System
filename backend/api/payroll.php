<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PATCH, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/Database.php';
require_once '../models/Payroll.php';

use Config\Database;
use Models\Payroll;

$database = new Database();
$db = $database->getConnection();
$payroll = new Payroll($db);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $payroll->read();
        $num = $stmt->rowCount();

        if ($num > 0) {
            $payroll_arr = array();
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $payroll_item = array(
                    "id" => $id,
                    "employee_id" => $employee_id,
                    "employee_name" => $employee_name,
                    "department" => $department,
                    "month" => $month,
                    "year" => $year,
                    "base_salary" => (float)$base_salary,
                    "bonuses" => (float)$bonuses,
                    "deductions" => (float)$deductions,
                    "net_salary" => (float)$net_salary,
                    "status" => $status,
                    "processed_at" => $processed_at
                );
                array_push($payroll_arr, $payroll_item);
            }
            echo json_encode($payroll_arr);
        } else {
            echo json_encode(array());
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        if (!empty($data->employee_id) && !empty($data->month) && !empty($data->year)) {
            $payroll->employee_id = $data->employee_id;
            $payroll->month = $data->month;
            $payroll->year = $data->year;
            $payroll->base_salary = $data->base_salary;
            $payroll->bonuses = $data->bonuses ?? 0;
            $payroll->deductions = $data->deductions ?? 0;
            $payroll->status = $data->status ?? 'Unpaid';

            if ($payroll->create()) {
                http_response_code(201);
                echo json_encode(array("message" => "Payroll record created."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to create payroll record."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Incomplete data."));
        }
        break;

    case 'PATCH':
        $data = json_decode(file_get_contents("php://input"));
        if (!empty($data->id)) {
            $payroll->id = $data->id;
            
            // If only status is provided, use updateStatus
            if (isset($data->status) && count((array)$data) === 2) {
                if ($payroll->updateStatus($data->id, $data->status)) {
                    echo json_encode(array("message" => "Payroll status updated."));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "Unable to update status."));
                }
            } else {
                // Full update
                $payroll->base_salary = $data->base_salary ?? 0;
                $payroll->bonuses = $data->bonuses ?? 0;
                $payroll->deductions = $data->deductions ?? 0;
                $payroll->status = $data->status ?? 'Unpaid';

                if ($payroll->update()) {
                    http_response_code(200);
                    echo json_encode(array("message" => "Payroll record updated."));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "Unable to update payroll."));
                }
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
            $payroll->id = $id;
            if ($payroll->delete()) {
                http_response_code(200);
                echo json_encode(array("message" => "Payroll record deleted."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to delete payroll."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Missing ID."));
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed."));
        break;
}
