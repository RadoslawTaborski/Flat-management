<?php

function postRequest($table, $key, $d){
  $sql = "";

  if($key){
    switch ($table) {
      case 'removeItem': $sql = "CALL RemoveShoppingItem('$key')";  break;
    }
  }else{
    switch ($table) {
      case 'addItem': $sql = "CALL AddShoppingItem('$d->UserId', '$d->Name', '$d->Category')";  break;
	  case 'addPayment': $sql = "CALL AddPayment('$d->Id1', '$d->Id2', '$d->Name' ,'$d->Value', '$d->Return', '$d->Action')";  break;
	  case 'addCleaning': $sql = "CALL AddCleaning('$d->CleanerId')";  break;
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
