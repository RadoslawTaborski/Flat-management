DELIMITER $$
--
-- Procedury
--
DROP PROCEDURE IF EXISTS `AddBalances`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `AddBalances`(IN _id1 INT, IN _id2 INT)
BEGIN
	INSERT INTO Balances(`User1ID`, `User2ID`, `Value`) VALUES(_id1, _id2, 0);
	INSERT INTO Balances(`User1ID`, `User2ID`, `Value`) VALUES(_id2, _id1, 0);
END$$

DROP PROCEDURE IF EXISTS `AddCleaner`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `AddCleaner`(IN _userId INT)
BEGIN
INSERT INTO Cleaners(`UserID`, `Counter`) VALUES (_userId, 0);
END$$

DROP PROCEDURE IF EXISTS `AddCleaning`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `AddCleaning`(IN `_cleanerId` INT)
BEGIN
INSERT INTO Cleaning(`CleanerID`,`Date`) VALUES (_cleanerId, CURDATE());
UPDATE Cleaners 
SET Counter = Counter + 1, LastTime = CURDATE() 
WHERE ID = _cleanerId;
END$$

DROP PROCEDURE IF EXISTS `AddPayment`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `AddPayment`(IN _id1 INT, IN _id2 INT, IN _name VARCHAR(80), IN _val DECIMAL(10,2), IN _return BOOL, IN _action INT)
BEGIN
	INSERT INTO Payments(User1ID, User2ID, Name, Amount, IsReturn,`Action`,`Date`) VALUES (_id1, _id2, _name, _val, _return, _action, CURDATE());
	UPDATE Balances SET `Value` = `Value` + _val WHERE User1ID = _id1 AND User2ID = _id2;
	UPDATE Balances SET `Value` = `Value` - _val WHERE User1ID = _id2 AND User2ID = _id1;
END$$

DROP PROCEDURE IF EXISTS `AddShoppingItem`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `AddShoppingItem`(IN _id INT, IN _name VARCHAR(50), IN _category VARCHAR(50))
BEGIN
	INSERT INTO ShoppingList(Name, Category, IsBought, Added, `AddDate`) VALUES(_name, _category, 0, _id, CURDATE());
END$$

DROP PROCEDURE IF EXISTS `AddUser`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `AddUser`(IN _name VARCHAR(20), IN _password VARCHAR(20))
BEGIN
INSERT INTO Users(Login, Password) VALUES(_name, _password);
SELECT @n := COUNT(*) FROM Users;
SET @i=1;
WHILE @i<@n DO 
  CALL AddBalances(@i,@n);
  SET @i = @i + 1;
END WHILE;
END$$

DROP PROCEDURE IF EXISTS `CheckPaymentNumber`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `CheckPaymentNumber`()
BEGIN
SELECT MAX(Action) FROM Payments;
END$$

DROP PROCEDURE IF EXISTS `GetLastCleaningDate`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetLastCleaningDate`()
BEGIN
SELECT `Date` FROM Cleaning WHERE ID = (SELECT MAX(ID) FROM Cleaning);
END$$

DROP PROCEDURE IF EXISTS `GetShoppingList`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetShoppingList`()
BEGIN
	SELECT * FROM `ShoppingList` WHERE IsBought = 0;
END$$

DROP PROCEDURE IF EXISTS `RemoveShoppingItem`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `RemoveShoppingItem`(IN _id INT)
BEGIN
	UPDATE ShoppingList SET IsBought = 1, `BoughtDate`=CURDATE() WHERE ID=_id;
END$$

DELIMITER ;