<?php

require_once 'functions.php';
require_once 'db_conn.php';
set_exception_handler('error_handler');

startUp();

$bodyData = getBodyData();
$method = $_SERVER['REQUEST_METHOD'];

if (empty($bodyData['timestamp'])) {
  throw new Exception('did not receive timestamp from bodyData');
}

if ($method === 'GET') {
  $query = "SELECT * FROM `lastUpdated`";
  $result = mysqli_query($conn, $insertQuery);

  if (!$result) {
    throw new Exception('mysql error' . mysqli_error($conn));
  }

  $output = [];
  while ($row = mysqli_fetch_assoc($result)) {
    $row['timestamp'] = intval($row['timestamp']);
    $output[] = $row;
  }

  print(json_encode($output));
}

if ($method === 'POST') {
  $query = "INSERT INTO `lastUpdated` (`timestamp`) VALUES ($bodyData['timestamp'])";
  $result = mysqli_query($conn, $insertQuery);

  if (!$result) {
    throw new Exception('mysql error' . mysqli_error($conn));
  }
}

?>
