<?php

namespace Config;

use PDO;
use PDOException;

class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    public $conn;

    public function __construct() {
        // In a real app, use a .env loader. For simplicity, we'll parse the .env.local if it exists
        $env = $this->loadEnv(__DIR__ . '/../../.env.local');
        
        // Parsing the Neon connection string if provided in full or as separate parts
        // NEON_DB_URL=psql 'postgresql://neondb_owner:npg_...gate-pooler...neondb?sslmode=require'
        if (isset($env['NEON_DB_URL'])) {
            preg_match('/postgresql:\/\/([^:]+):([^@]+)@([^:\/]+)(?::(\d+))?\/([^?]+)/', $env['NEON_DB_URL'], $matches);
            if ($matches) {
                $this->username = $matches[1];
                $this->password = $matches[2];
                $this->host = $matches[3];
                $this->db_name = $matches[5];
            }
        }

        // Fallback or override
        $this->host = $this->host ?? 'ep-shy-salad-a7ny2ree-pooler.ap-southeast-2.aws.neon.tech';
        $this->db_name = $this->db_name ?? 'neondb';
        $this->username = $this->username ?? 'neondb_owner';
        $this->password = $this->password ?? 'npg_2OD6YjdKRCVQ';
    }

    private function loadEnv($path) {
        $env = [];
        if (file_exists($path)) {
            $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                if (strpos(trim($line), '#') === 0) continue;
                list($name, $value) = explode('=', $line, 2);
                $env[trim($name)] = trim($value, " '\"");
            }
        }
        return $env;
    }

    public function getConnection() {
        $this->conn = null;
        try {
            $dsn = "pgsql:host=" . $this->host . ";dbname=" . $this->db_name . ";sslmode=require";
            $this->conn = new PDO($dsn, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ATTR_ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::ATTR_ASSOC);
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }
        return $this->conn;
    }
}
