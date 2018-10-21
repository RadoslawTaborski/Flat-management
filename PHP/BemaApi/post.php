<?php

function postRequest($table, $key, $d){
  $sql = "";

  if($key){
    switch ($table) {
      case 'removeItem': $sql = "CALL RemoveShoppingItem('$key')";  break;
	  case 'rollbackAction': $sql = "CALL RollbackAction('$key')";  break;
    }
  }else{
    switch ($table) {
      case 'addItem': $sql = "CALL AddShoppingItem('$d->Added', '$d->Name', '$d->Category')";  break;
	  case 'addPayment': $sql = "CALL AddPayment('$d->User1ID', '$d->User2ID', '$d->Name' ,'$d->Amount', '$d->Type', '$d->Action')";  break;
	  case 'addCleaning': $sql = "CALL AddCleaning('$d->CleanerID')";  break;
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
