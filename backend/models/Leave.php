<?php

namespace Models;

use PDO;

class Leave {
    private $conn;
    private $table_name = "leaves";

    public $id;
    public $employee_id;
    public $start_date;
    public $end_date;
    public $type;
    public $status;
    public $reason;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function read($employee_id = null) {
        $query = "SELECT l.*, e.name as employee_name FROM " . $this->table_name . " l
                  JOIN employees e ON l.employee_id = e.id";
        if ($employee_id) {
            $query .= " WHERE l.employee_id = :employee_id";
        }
        $query .= " ORDER BY l.applied_at DESC";
        
        $stmt = $this->conn->prepare($query);
        if ($employee_id) {
            $stmt->bindParam(":employee_id", $employee_id);
        }
        $stmt->execute();
        return $stmt;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  (employee_id, start_date, end_date, type, reason) 
                  VALUES (:employee_id, :start_date, :end_date, :type, :reason)";
        
        $stmt = $this->conn->prepare($query);

        $this->employee_id = htmlspecialchars(strip_tags($this->employee_id));
        $this->start_date = htmlspecialchars(strip_tags($this->start_date));
        $this->end_date = htmlspecialchars(strip_tags($this->end_date));
        $this->type = htmlspecialchars(strip_tags($this->type));
        $this->reason = htmlspecialchars(strip_tags($this->reason));

        $stmt->bindParam(":employee_id", $this->employee_id);
        $stmt->bindParam(":start_date", $this->start_date);
        $stmt->bindParam(":end_date", $this->end_date);
        $stmt->bindParam(":type", $this->type);
        $stmt->bindParam(":reason", $this->reason);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                  SET start_date = :start_date, end_date = :end_date, 
                      type = :type, status = :status, reason = :reason 
                  WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);

        $this->start_date = htmlspecialchars(strip_tags($this->start_date));
        $this->end_date = htmlspecialchars(strip_tags($this->end_date));
        $this->type = htmlspecialchars(strip_tags($this->type));
        $this->status = htmlspecialchars(strip_tags($this->status));
        $this->reason = htmlspecialchars(strip_tags($this->reason));
        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(":start_date", $this->start_date);
        $stmt->bindParam(":end_date", $this->end_date);
        $stmt->bindParam(":type", $this->type);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":reason", $this->reason);
        $stmt->bindParam(":id", $this->id);

        return $stmt->execute();
    }

    public function updateStatus() {
        $query = "UPDATE " . $this->table_name . " SET status = :status WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":id", $this->id);
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(":id", $this->id);
        return $stmt->execute();
    }
}
