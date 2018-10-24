<?php

    define('PRZELEWY24_MERCHANT_ID', 'Twój nr sprzedawcy');
    define('PRZELEWY24_CRC', 'Twój kod CRC');
    // sandbox - środowisko testowe, secure - środowisko produkcyjne
    define('PRZELEWY24_TYPE', 'sandbox');

    class Przelewy24_API
    {
        public function CreateToken($p24_amount = null, $p24_description = null, $p24_email = null, $p24_url_return = null, $p24_url_status = null)
        {
            $p24_session_id = uniqid();

            $headers[] = 'p24_merchant_id=' . PRZELEWY24_MERCHANT_ID;
            $headers[] = 'p24_pos_id=' . PRZELEWY24_MERCHANT_ID;
            $headers[] = 'p24_crc=' . PRZELEWY24_CRC;
            $headers[] = 'p24_session_id=' . $p24_session_id;
            $headers[] = 'p24_amount=' . $p24_amount;
            $headers[] = 'p24_currency=PLN';
            $headers[] = 'p24_description=' . $p24_description;
            $headers[] = 'p24_country=PL';
            $headers[] = 'p24_url_return=' . urlencode($p24_url_return);
            $headers[] = 'p24_url_status=' . urlencode($p24_url_status);
            $headers[] = 'p24_api_version=3.2';
            $headers[] = 'p24_sign=' . md5($p24_session_id . '|' . PRZELEWY24_MERCHANT_ID . '|' . $p24_amount . '|PLN|' . PRZELEWY24_CRC);
            $headers[] = 'p24_email=' . $p24_email;

            $oCURL = curl_init();
            curl_setopt($oCURL, CURLOPT_POST, 1);
            curl_setopt($oCURL, CURLOPT_SSL_CIPHER_LIST, 'TLSv1');
            curl_setopt($oCURL, CURLOPT_POSTFIELDS, implode('&', $headers));
            curl_setopt($oCURL, CURLOPT_URL, 'https://' . PRZELEWY24_TYPE . '.przelewy24.pl/trnRegister');
            curl_setopt($oCURL, CURLOPT_SSL_VERIFYHOST, 2);
            curl_setopt($oCURL, CURLOPT_USERAGENT, 'Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)');
            curl_setopt($oCURL, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($oCURL, CURLOPT_SSL_VERIFYPEER, false);
            $response = curl_exec($oCURL);
            curl_close($oCURL);

            parse_str($response, $output);
            return isset($output['token']) ? $output['token'] : 0;
        }

        public function Pay($p24_amount = null, $p24_description = null, $p24_email = null, $p24_url_return = null, $p24_url_status = null)
        {
            $token = $this->CreateToken($p24_amount, $p24_description, $p24_email, $p24_url_return, $p24_url_status);
            return 'https://' . PRZELEWY24_TYPE . '.przelewy24.pl/trnRequest/' . $token;
        }

        public function Verify($data = null)
        {
            $headers[] = 'p24_merchant_id=' . $data['p24_merchant_id'];
            $headers[] = 'p24_pos_id=' . $data['p24_pos_id'];
            $headers[] = 'p24_session_id=' . $data['p24_session_id'];
            $headers[] = 'p24_amount=' . $data['p24_amount'];
            $headers[] = 'p24_currency=PLN';
            $headers[] = 'p24_order_id=' . $data['p24_order_id'];
            $headers[] = 'p24_sign=' . md5($data['p24_session_id'] . '|' . $data['p24_order_id'] . '|' . $data['p24_amount'] . '|PLN|' . PRZELEWY24_CRC);

            $oCURL = curl_init();
            curl_setopt($oCURL, CURLOPT_POST, 1);
            curl_setopt($oCURL, CURLOPT_SSL_CIPHER_LIST, 'TLSv1');
            curl_setopt($oCURL, CURLOPT_POSTFIELDS, implode('&', $headers));
            curl_setopt($oCURL, CURLOPT_URL, 'https://' . PRZELEWY24_TYPE . '.przelewy24.pl/trnVerify');
            curl_setopt($oCURL, CURLOPT_SSL_VERIFYHOST, 2);
            curl_setopt($oCURL, CURLOPT_USERAGENT, 'Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)');
            curl_setopt($oCURL, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($oCURL, CURLOPT_SSL_VERIFYPEER, false);
            $response = curl_exec($oCURL);
            curl_close($oCURL);

            parse_str($response, $output);
            return ($output['error'] == '0') ? true : false;
        }
    }