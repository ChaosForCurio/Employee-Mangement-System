<?php

namespace Models;

use PDO;

class Attendance {
    private $conn;
    private $table_name = "attendance";

    public $id;
    public $employee_id;
    public $date;
    public $status;
    public $check_in;
    public $check_out;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function read($employee_id = null) {
        $query = "SELECT * FROM " . $this->table_name;
        if ($employee_id) {
            $query .= " WHERE employee_id = :employee_id";
        }
        $query .= " ORDER BY date DESC";
        
        $stmt = $this->conn->prepare($query);
        if ($employee_id) {
            $stmt->bindParam(":employee_id", $employee_id);
        }
        $stmt->execute();
        return $stmt;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  (employee_id, date, status, check_in) 
                  VALUES (:employee_id, :date, :status, :check_in)
                  ON CONFLICT (employee_id, date) DO UPDATE 
                  SET status = EXCLUDED.status, check_in = EXCLUDED.check_in";
        
        $stmt = $this->conn->prepare($query);

        $this->employee_id = htmlspecialchars(strip_tags($this->employee_id));
        $this->date = htmlspecialchars(strip_tags($this->date));
        $this->status = htmlspecialchars(strip_tags($this->status));
        $this->check_in = $this->check_in ? htmlspecialchars(strip_tags($this->check_in)) : date('Y-m-d H:i:s');

        $stmt->bindParam(":employee_id", $this->employee_id);
        $stmt->bindParam(":date", $this->date);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":check_in", $this->check_in);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
}
