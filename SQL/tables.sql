-- phpMyAdmin SQL Dump
-- version 4.2.12deb2+deb8u2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Czas generowania: 08 Paź 2018, 17:28
-- Wersja serwera: 5.5.54-0+deb8u1-log
-- Wersja PHP: 5.6.30-0+deb8u1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+01:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `Balances`
--

CREATE TABLE IF NOT EXISTS `Balances` (
`ID` int(11) NOT NULL,
  `User1ID` int(11) NOT NULL,
  `User2ID` int(11) NOT NULL,
  `Value` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `Payment`
--

CREATE TABLE IF NOT EXISTS `Payment` (
`ID` int(11) NOT NULL,
  `User1ID` int(11) NOT NULL,
  `User2ID` int(11) NOT NULL,
  `Name` varchar(80) COLLATE utf8_polish_ci NOT NULL,
  `Amount` decimal(10,2) NOT NULL,
  `IsReturn` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `ShoppingList`
--

CREATE TABLE IF NOT EXISTS `ShoppingList` (
  `ID` int(11) NOT NULL,
  `Name` varchar(50) COLLATE utf8_polish_ci NOT NULL,
  `Category` varchar(50) COLLATE utf8_polish_ci NOT NULL,
  `IsBought` tinyint(1) NOT NULL,
  `Added` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `Users`
--

CREATE TABLE IF NOT EXISTS `Users` (
`ID` int(11) NOT NULL,
  `Login` varchar(20) COLLATE utf8_polish_ci NOT NULL,
  `Password` varchar(20) COLLATE utf8_polish_ci NOT NULL DEFAULT '1'
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Indexes for table `Balances`
--
ALTER TABLE `Balances`
 ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `Payment`
--
ALTER TABLE `Payment`
 ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `ShoppingList`
--
ALTER TABLE `ShoppingList`
 ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
 ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT dla tabeli `Balances`
--
ALTER TABLE `Balances`
MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT dla tabeli `Payment`
--
ALTER TABLE `Payment`
MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT dla tabeli `ShoppingList`
--
ALTER TABLE `ShoppingList`
MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT dla tabeli `Users`
--
ALTER TABLE `Users`
MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;