<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/Database.php';
require_once '../models/Employee.php';

use Config\Database;
use Models\Employee;

$database = new Database();
$db = $database->getConnection();
$employee = new Employee($db);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $employee->read();
        $num = $stmt->rowCount();

        if ($num > 0) {
            $employees_arr = array();
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $employees_arr[] = $row;
            }
            http_response_code(200);
            echo json_encode($employees_arr);
        } else {
            http_response_code(200);
            echo json_encode(array());
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        if (!empty($data->name) && !empty($data->email) && !empty($data->role)) {
            $employee->name = $data->name;
            $employee->email = $data->email;
            $employee->role = $data->role;
            $employee->department = $data->department ?? 'General';
            $employee->salary = $data->salary ?? 0;

            if ($employee->create()) {
                http_response_code(201);
                echo json_encode(array("message" => "Employee created."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to create employee."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Incomplete data."));
        }
        break;

    case 'DELETE':
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        if ($id) {
            $employee->id = $id;
            if ($employee->delete()) {
                http_response_code(200);
                echo json_encode(array("message" => "Employee deleted."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to delete employee."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Missing ID."));
        }
        break;
}
