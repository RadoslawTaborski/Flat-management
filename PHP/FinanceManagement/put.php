<?php

function putRequest($table, $d){
  $sql = "";

  switch ($table) {
      case 'item': $sql = "CALL AddShoppingItem('$d->Id', '$d->Name', '$d->Category')";  break;
    case 'payment': $sql = "CALL AddPayment('$d->Id1', '$d->Id2', '$d->Name' ,'$d->Value', '$d->Return')";  break;
  }

  if($sql == ""){
    http_response_code(405);
    die("no method found");
  }
  //  echo $sql;
  return $sql;
}

?>
