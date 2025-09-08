<?php
// get_employees.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Include database connection
require_once 'db_connection.php';

try {
    // Query to get all employees
    $query = "SELECT * FROM pegawai ORDER BY nama ASC";
    $result = $conn->query($query);
    
    if ($result) {
        $employees = [];