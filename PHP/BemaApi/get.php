<?php

function getRequest($table, $key){

  $sql = "";

  switch ($table) {
    case 'items': $sql ="select * from ShoppingList".($key?" WHERE id=$key AND IsBought=0":" WHERE IsBought=0"); break;
    case 'payments': $sql ="select * from Payments".($key?" WHERE id=$key":'')." order by ID desc"; break;
    case 'balances': $sql ="select * from Balances".($key?" WHERE id=$key":'')." order by User1ID"; break;
	case 'users': $sql ="select ID, Login from Users".($key?" WHERE id=$key":''); break;
	case 'cleaners': $sql ="select * from Cleaners".($key?" WHERE id=$key":''); break;
	case 'cleanings': $sql ="select * from Cleaning".($key?" WHERE id=$key":'')." order by ID desc"; break;
	case 'lastCleaning': $sql = "CALL GetLastCleaningDate()";  break;
	case 'paymentAction': $sql = "CALL CheckPaymentNumber()";  break;
  }

  if($sql == ""){
    http_response_code(403);
    die("no method found");
  }
  //  echo $sql;
  return $sql;
}

?>
