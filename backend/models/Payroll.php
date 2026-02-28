<?php
namespace Models;

use PDO;

class Payroll {
    private $conn;
    private $table_name = "payroll";

    public $id;
    public $employee_id;
    public $month;
    public $year;
    public $base_salary;
    public $bonuses;
    public $deductions;
    public $net_salary;
    public $status;
    public $processed_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function read() {
        $query = "SELECT p.*, e.name as employee_name, e.department, e.role 
                  FROM " . $this->table_name . " p
                  JOIN employees e ON p.employee_id = e.id
                  ORDER BY p.year DESC, p.month DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  (employee_id, month, year, base_salary, bonuses, deductions, net_salary, status)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $this->conn->prepare($query);

        // Calculate net salary if not provided
        $this->net_salary = $this->base_salary + $this->bonuses - $this->deductions;

        return $stmt->execute([
            $this->employee_id,
            $this->month,
            $this->year,
            $this->base_salary,
            $this->bonuses,
            $this->deductions,
            $this->net_salary,
            $this->status ?? 'Unpaid'
        ]);
    }

    public function updateStatus($id, $status) {
        $query = "UPDATE " . $this->table_name . " SET status = ? WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$status, $id]);
    }

    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                  SET base_salary = ?, bonuses = ?, deductions = ?, net_salary = ?, status = ? 
                  WHERE id = ?";
        
        $stmt = $this->conn->prepare($query);

        $this->net_salary = $this->base_salary + $this->bonuses - $this->deductions;

        return $stmt->execute([
            $this->base_salary,
            $this->bonuses,
            $this->deductions,
            $this->net_salary,
            $this->status,
            $this->id
        ]);
    }

    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$this->id]);
    }
}
