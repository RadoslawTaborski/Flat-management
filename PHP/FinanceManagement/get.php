<?php

function getRequest($table, $key){

  $sql = "";

  switch ($table) {
    case 'items': $sql ="select * from shoppinglist".($key?" WHERE ID=$key AND IsBought=0":" WHERE IsBought=0"); break;
    case 'payments': $sql ="select * from payments".($key?" WHERE ID=$key AND Rollback=0":" WHERE Rollback=0")." AND `Date` > (ADDDATE(CURDATE(), INTERVAL -1 MONTH)) order by ID desc"; break;
    case 'balances': $sql ="select * from balances".($key?" WHERE ID=$key":'')." order by User1ID"; break;
	case 'users': $sql ="select ID, Login, ShortName, FullName, BankAccount, BankPage from users".($key?" WHERE ID=$key":''); break;
	case 'cleaners': $sql ="select * from cleaners".($key?" WHERE ID=$key":''); break;
	case 'cleanings': $sql ="select * from cleaning".($key?" WHERE ID=$key":'')." order by ID desc"; break;
	case 'lastcleaning': $sql = "call GetLastCleaningDate()";  break;
	case 'paymentaction': $sql = "call CheckPaymentNumber()";  break;
	case 'adverts': $sql = "select * from adverts".($key?" WHERE ID = $key AND IsRemoved = 0":" WHERE IsRemoved=0")." order by EndDate"; break;
  }

  if($sql == ""){
    http_response_code(403);
    die("no method found");
  }
  //  echo $sql;
  return $sql;
}

?>