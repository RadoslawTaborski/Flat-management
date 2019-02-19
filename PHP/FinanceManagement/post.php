<?php

function postRequest($table, $key, $d){
  $sql = "";

  if($key){
    switch ($table) {
      case 'removeItem': $sql = "CALL RemoveShoppingItem('$key')";  break;
	  case 'removeAdvert': $sql = "CALL RemoveAdvert('$key')"; break;
	  case 'rollbackAction': $sql = "CALL RollbackAction('$key')";  break;
    case 'rollback': $sql = "CALL `Rollback`('$key')";  break;
    }
  }else{
    switch ($table) {
      case 'addItem': $sql = "CALL AddShoppingItem('$d->Added', '$d->Name', '$d->Category')";  break;
	  case 'addPayment': $sql = "CALL AddPayment('$d->User1ID', '$d->User2ID', '$d->Name' ,'$d->Amount', '$d->Type', '$d->Action')";  break;
	  case 'addCleaning': $sql = "CALL AddCleaning('$d->CleanerID','$d->Date')";  break;
    case 'addAdvert': $sql = "CALL AddAdvert('$d->Text','$d->Added','$d->EndDate')"; break;
    case 'balancesCorrection': $sql = "CALL BalancesCorrection()"; break;
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
