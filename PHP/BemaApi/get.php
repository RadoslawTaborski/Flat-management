<?php

function getRequest($table, $key){

  $sql = "";

  switch ($table) {
    case 'shopping': $sql ="select * from ShoppingList".($key?" WHERE id=$key and IsBought=0":'WHERE IsBought=0'); break;
    case 'payment': $sql ="select * from Payment".($key?" WHERE id=$key":''); break;
    case 'balances': $sql ="select * from Balances".($key?" WHERE id=$key":''); break;
	case 'users': $sql ="select ID, Login from Users".($key?" WHERE id=$key":''); break;
  }

  if($sql == ""){
    http_response_code(403);
    die("no method found");
  }
  //  echo $sql;
  return $sql;
}

?>
