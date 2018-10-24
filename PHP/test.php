<?php

    ob_start();

    include_once('przelewy24api.php');
    $oPrzelewy24_API = new Przelewy24_API();

    if (isset($_POST['p24_merchant_id']) AND isset($_POST['p24_sign'])) {
        if ($oPrzelewy24_API->Verify($_POST) === true) {
        }
    } else {
        // Powrotny adres URL
        $p24_url_return = 'http://bema5.zapto.org';

        // Adres dla weryfikacji płatności
        $p24_url_status = 'http://bema5.zapto.org';

        // Kwota do zapłaty musi być pomnożona razy 100.
        // Czyli, jeżeli użytkownik ma zapłacić 499 złotych, to kwota do zapłaty
        // to 499 * 100 (wyrażona w groszach)
        $redirect = $oPrzelewy24_API->Pay('1', 'ZWROT', 'radoslaw.taborski@gmail.com', $p24_url_return, $p24_url_status);
        Header('Location: ' . $redirect); exit;
    }