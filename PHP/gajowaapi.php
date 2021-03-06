<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, OPTIONS, DELETE");

require_once("./FinanceManagement/get.php");
require_once("./FinanceManagement/delete.php");
require_once("./FinanceManagement/put.php");
require_once("./FinanceManagement/post.php");

// get the HTTP method, path and body of the request
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'],'/'));
$input = json_decode(file_get_contents('php://input'));
$masterAdress = 'localhost';

// in case of SQL injection
function clear($data){
  return  preg_replace('/[^a-z0-9_]+/i','',$data);
}

// retrieve the table and key from the path
$table = clear(array_shift($request));
$key = clear(array_shift($request)+0);

if($table == ""){
  header("Content-Type: text/html; charset=utf-8");
  readfile('./FinanceManagement/api.html' );
  die();
}

// connect to the mysql database
$link = mysqli_connect($masterAdress, 'rado', 'Ameba123', 'gajowa')
or die('Error connectiong to MySQL server');

mysqli_set_charset($link,'utf8');

// create SQL based on HTTP method
switch ($method) {
  case 'GET':
  $sql = getRequest($table, $key); break;
  case 'DELETE':
  $sql = deleteRequest($table, $key); break;
  case 'PUT':
  $sql = putRequest($table, $input); break;
  case 'POST':
  $sql = postRequest($table, $key, $input); break;
}

$result = mysqli_query($link,$sql);

// die if SQL statement failed
if (!$result) {
  http_response_code(404);
  die(mysqli_error());
}

// print results, insert id or affected row count
if ($method == 'GET' || $table == 'login') {
  echo '[';
  for ($i=0;$i<mysqli_num_rows($result);$i++) {
    echo ($i>0?',':'').json_encode(mysqli_fetch_object($result));
  }
  echo ']';
} elseif ($method == 'POST') {
  echo mysqli_insert_id($link);
} else {
  echo mysqli_affected_rows($link);
}


// close mysql connection
mysqli_close($link);
?>
