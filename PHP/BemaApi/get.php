<?php

function getRequest($table, $key){

  $sql = "";

  switch ($table) {
    case 'items': $sql ="select * from ShoppingList".($key?" WHERE id=$key AND IsBought=0":" WHERE IsBought=0"); break;
    case 'payments': $sql ="select * from Payments".($key?" WHERE id=$key AND Rollback=0":" WHERE Rollback=0")." order by ID desc"; break;
    case 'balances': $sql ="select * from Balances".($key?" WHERE id=$key":'')." order by User1ID"; break;
	case 'users': $sql ="select ID, Login, ShortName, FullName, BankAccount from Users".($key?" WHERE id=$key":''); break;
	case 'cleaners': $sql ="select * from Cleaners".($key?" WHERE id=$key":''); break;
	case 'cleanings': $sql ="select * from Cleaning".($key?" WHERE id=$key":'')." order by ID desc"; break;
	case 'lastcleaning': $sql = "CALL GetLastCleaningDate()";  break;
	case 'paymentaction': $sql = "CALL CheckPaymentNumber()";  break;
  }

  if($sql == ""){
    http_response_code(403);
    die("no method found");
  }
  //  echo $sql;
  return $sql;
}

?>
