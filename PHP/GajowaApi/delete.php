<?php

function deleteRequest($table, $key){

  $sql = "";

  switch ($table) {
  }

  if($sql == ""){
    http_response_code(404);
    die("no method found");
  }

  return $sql;
}

?>
