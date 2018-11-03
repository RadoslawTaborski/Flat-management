<?php

function getRequest($table, $key){

  $sql = "";

  switch ($table) {
    case 'items': $sql ="select * from ShoppingList".($key?" WHERE ID=$key AND IsBought=0":" WHERE IsBought=0"); break;
    case 'payments': $sql ="select * from Payments".($key?" WHERE ID=$key AND Rollback=0":" WHERE Rollback=0")." AND `Date` > (ADDDATE(CURDATE(), INTERVAL -1 MONTH)) order by ID desc"; break;
    case 'balances': $sql ="select * from Balances".($key?" WHERE ID=$key":'')." order by User1ID"; break;
	case 'users': $sql ="select ID, Login, ShortName, FullName, BankAccount, BankPage from Users".($key?" WHERE ID=$key":''); break;
	case 'cleaners': $sql ="select * from Cleaners".($key?" WHERE ID=$key":''); break;
	case 'cleanings': $sql ="select * from Cleaning".($key?" WHERE ID=$key":'')." order by ID desc"; break;
	case 'lastcleaning': $sql = "call GetLastCleaningDate()";  break;
	case 'paymentaction': $sql = "call CheckPaymentNumber()";  break;
	case 'adverts': $sql = "select * from Adverts".($key?" WHERE ID = $key AND IsRemoved = 0":" WHERE IsRemoved=0")." order by EndDate"; break;
  }

  if($sql == ""){
    http_response_code(403);
    die("no method found");
  }
  //  echo $sql;
  return $sql;
}

?>