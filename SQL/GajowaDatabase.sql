-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Czas generowania: 03 Lis 2018, 15:03
-- Wersja serwera: 10.1.36-MariaDB
-- Wersja PHP: 7.2.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `gajowa`
--
DROP DATABASE IF EXISTS `gajowa`;
CREATE DATABASE IF NOT EXISTS `gajowa` DEFAULT CHARACTER SET utf8 COLLATE utf8_polish_ci;
USE `gajowa`;

DELIMITER $$
--
-- Procedury
--
DROP PROCEDURE IF EXISTS `AddAdvert`$$
CREATE DEFINER=`rado`@`localhost` PROCEDURE `AddAdvert` (IN `_text` VARCHAR(300), IN `_id` INT, IN `_endDate` TIMESTAMP)  NO SQL
BEGIN
INSERT INTO adverts(`Text`, `Added`, `EndDate`, `AddDate`, `IsRemoved`) VALUES(_text, _id, _endDate, CURRENT_TIMESTAMP(),0);
END$$

DROP PROCEDURE IF EXISTS `AddBalances`$$
CREATE DEFINER=`rado`@`localhost` PROCEDURE `AddBalances` (IN `_id1` INT, IN `_id2` INT)  BEGIN
	INSERT INTO balances(`User1ID`, `User2ID`, `Value`) VALUES(_id1, _id2, 0);
	INSERT INTO balances(`User1ID`, `User2ID`, `Value`) VALUES(_id2, _id1, 0);
END$$

DROP PROCEDURE IF EXISTS `AddCleaner`$$
CREATE DEFINER=`rado`@`localhost` PROCEDURE `AddCleaner` (IN `_userId` INT)  BEGIN
INSERT INTO cleaners(`UserID`, `Counter`) VALUES (_userId, 0);
END$$

DROP PROCEDURE IF EXISTS `AddCleaning`$$
CREATE DEFINER=`rado`@`localhost` PROCEDURE `AddCleaning` (IN `_cleanerId` INT, IN `_date` DATE)  BEGIN
INSERT INTO cleaning(`CleanerID`,`Date`) VALUES (_cleanerId, _date);
UPDATE cleaners 
SET Counter = Counter + 1, LastTime = _date 
WHERE ID = _cleanerId;
END$$

DROP PROCEDURE IF EXISTS `AddPayment`$$
CREATE DEFINER=`rado`@`localhost` PROCEDURE `AddPayment` (IN `_id1` INT, IN `_id2` INT, IN `_name` VARCHAR(80), IN `_val` DECIMAL(10,2), IN `_type` ENUM('expense','return-cash','return-transfer'), IN `_action` INT)  BEGIN
	INSERT INTO payments(User1ID, User2ID, Name, Amount, `Type`,`Action`,`Date`,`Rollback`) VALUES (_id1, _id2, _name, _val, _type, _action, CURRENT_TIMESTAMP(),0);
	UPDATE balances SET `Value` = `Value` + _val WHERE User1ID = _id1 AND User2ID = _id2;
	UPDATE balances SET `Value` = `Value` - _val WHERE User1ID = _id2 AND User2ID = _id1;
END$$

DROP PROCEDURE IF EXISTS `AddShoppingItem`$$
CREATE DEFINER=`rado`@`localhost` PROCEDURE `AddShoppingItem` (IN `_id` INT, IN `_name` VARCHAR(50), IN `_category` VARCHAR(50))  BEGIN
	INSERT INTO shoppinglist(Name, Category, IsBought, Added, `AddDate`) VALUES(_name, _category, 0, _id, CURRENT_TIMESTAMP());
END$$

DROP PROCEDURE IF EXISTS `AddUser`$$
CREATE DEFINER=`rado`@`localhost` PROCEDURE `AddUser` (IN `_name` VARCHAR(20), IN `_fullName` VARCHAR(30), IN `_shortName` VARCHAR(5), IN `_password` VARCHAR(20), IN `_account` VARCHAR(26), IN `_page` VARCHAR(100))  BEGIN
INSERT INTO users(Login, FullName, ShortName, BankAccount, BankPage, Password) VALUES(_name, _fullName, _shortName, _account, _page, _password);
SELECT @n := COUNT(*) FROM users;
SET @i=1;
WHILE @i<@n DO 
  CALL AddBalances(@i,@n);
  SET @i = @i + 1;
END WHILE;
END$$

DROP PROCEDURE IF EXISTS `CheckPaymentNumber`$$
CREATE DEFINER=`rado`@`localhost` PROCEDURE `CheckPaymentNumber` ()  BEGIN
SELECT MAX(Action) FROM payments;
END$$

DROP PROCEDURE IF EXISTS `GetLastCleaningDate`$$
CREATE DEFINER=`rado`@`localhost` PROCEDURE `GetLastCleaningDate` ()  BEGIN
SELECT `Date` FROM cleaning WHERE ID = (SELECT MAX(ID) FROM cleaning);
END$$

DROP PROCEDURE IF EXISTS `GetShoppingList`$$
CREATE DEFINER=`rado`@`localhost` PROCEDURE `GetShoppingList` ()  BEGIN
	SELECT * FROM `shoppinglist` WHERE IsBought = 0;
END$$

DROP PROCEDURE IF EXISTS `RemoveAdvert`$$
CREATE DEFINER=`rado`@`localhost` PROCEDURE `RemoveAdvert` (IN `_id` INT)  NO SQL
BEGIN
UPDATE adverts SET IsRemoved = 1 WHERE ID=_id;
END$$

DROP PROCEDURE IF EXISTS `RemoveShoppingItem`$$
CREATE DEFINER=`rado`@`localhost` PROCEDURE `RemoveShoppingItem` (IN `_id` INT)  BEGIN
	UPDATE shoppinglist SET IsBought = 1, `BoughtDate`=CURRENT_TIMESTAMP() WHERE ID=_id;
END$$

DROP PROCEDURE IF EXISTS `Rollback`$$
CREATE DEFINER=`rado`@`localhost` PROCEDURE `Rollback` (IN `paymentId` INT)  NO SQL
BEGIN
	UPDATE payments SET `Rollback` = 1 WHERE ID = paymentId;
END$$

DROP PROCEDURE IF EXISTS `BalancesCorrection`$$
CREATE DEFINER=`rado`@`%` PROCEDURE `BalancesCorrection` ()  NO SQL
BEGIN
	SET @size := (SELECT Count(*) FROM users);
    SET @u1 = 1;
    WHILE @u1<@size DO
		SET @u2 = @u1+1;
		WHILE @u2<=@size DO
			SET @v := (SELECT COALESCE(SUM(S),0) FROM (SELECT COALESCE(SUM(Amount),0) as S FROM payments WHERE Rollback=0 AND User1ID=@u1 AND User2ID=@u2 UNION SELECT COALESCE(SUM(-1*Amount),0) FROM payments WHERE Rollback=0 AND User1ID=@u2 AND User2ID=@u1) t1);
			UPDATE balances SET `Value` = @v WHERE User1ID = @u1 AND User2ID = @u2;
			UPDATE balances SET `Value` = (-1*@v) WHERE User1ID = @u2 AND User2ID = @u1;
			SET @u2 = @u2 + 1;
		END WHILE;
        SET @u1 = @u1 + 1;
    END WHILE;
END$$

DROP PROCEDURE IF EXISTS `RollbackAction`$$
CREATE DEFINER=`rado`@`localhost` PROCEDURE `RollbackAction` (IN `actionId` INT)  NO SQL
BEGIN
	SET @size := (SELECT Count(*) FROM payments WHERE Action=actionId AND Rollback=0);
    SET @i = 0;
    SET @countNum = 1;
    WHILE @i<@size DO
		SET @asd = CONCAT('SELECT ID FROM payments WHERE Action = ',actionId,' LIMIT ',@i,',',@countNum,' INTO @outvar');
  		PREPARE zxc FROM @asd;
  		EXECUTE zxc;
        CALL Rollback(@outvar);
        SET @i = @i + 1;
    END WHILE;
    
    CALL BalancesCorrection();
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `adverts`
--

DROP TABLE IF EXISTS `adverts`;
CREATE TABLE IF NOT EXISTS `adverts` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Text` varchar(300) COLLATE utf8_polish_ci NOT NULL,
  `Added` int(11) NOT NULL,
  `EndDate` datetime DEFAULT NULL,
  `AddDate` datetime NOT NULL,
  `IsRemoved` tinyint(4) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `balances`
--

DROP TABLE IF EXISTS `balances`;
CREATE TABLE IF NOT EXISTS `balances` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `User1ID` int(11) NOT NULL,
  `User2ID` int(11) NOT NULL,
  `Value` decimal(10,2) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `cleaners`
--

DROP TABLE IF EXISTS `cleaners`;
CREATE TABLE IF NOT EXISTS `cleaners` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `UserID` int(11) NOT NULL,
  `Counter` int(11) NOT NULL,
  `LastTime` date DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `cleaning`
--

DROP TABLE IF EXISTS `cleaning`;
CREATE TABLE IF NOT EXISTS `cleaning` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `CleanerID` int(11) NOT NULL,
  `Date` date NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `payments`
--

DROP TABLE IF EXISTS `payments`;
CREATE TABLE IF NOT EXISTS `payments` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `User1ID` int(11) NOT NULL,
  `User2ID` int(11) NOT NULL,
  `Name` varchar(100) COLLATE utf8_polish_ci NOT NULL,
  `Amount` decimal(10,2) NOT NULL,
  `Action` int(11) NOT NULL,
  `Date` datetime NOT NULL,
  `Type` enum('expense','return-cash','return-transfer') COLLATE utf8_polish_ci NOT NULL,
  `Rollback` tinyint(4) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `shoppinglist`
--

DROP TABLE IF EXISTS `shoppinglist`;
CREATE TABLE IF NOT EXISTS `shoppinglist` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) COLLATE utf8_polish_ci NOT NULL,
  `Category` varchar(50) COLLATE utf8_polish_ci NOT NULL,
  `IsBought` tinyint(1) NOT NULL,
  `Added` int(11) DEFAULT NULL,
  `AddDate` datetime NOT NULL,
  `BoughtDate` datetime DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Login` varchar(20) COLLATE utf8_polish_ci NOT NULL,
  `ShortName` varchar(5) COLLATE utf8_polish_ci NOT NULL,
  `FullName` varchar(30) COLLATE utf8_polish_ci NOT NULL,
  `Password` varchar(20) COLLATE utf8_polish_ci NOT NULL DEFAULT '1',
  `BankAccount` varchar(26) COLLATE utf8_polish_ci NOT NULL,
  `BankPage` varchar(100) COLLATE utf8_polish_ci DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
