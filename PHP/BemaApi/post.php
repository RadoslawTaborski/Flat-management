<?php

function postRequest($table, $key, $d){
  $sql = "";

  if($key){
    switch ($table) {
      case 'removeItem': $sql = "CALL RemoveShoppingItem('$key')";  break;
    }
  }else{
    switch ($table) {
      case 'item': $sql = "CALL AddShoppingItem('$d->UserId', '$d->Name', '$d->Category')";  break;
	  case 'payment': $sql = "CALL AddPayment('$d->Id1', '$d->Id2', '$d->Name' ,'$d->Value', '$d->Return')";  break;
    }
  }

  if($sql == ""){
    http_response_code(404);
    die("no method found");
  }
  //  echo $sql;
  return $sql;
}

?>
