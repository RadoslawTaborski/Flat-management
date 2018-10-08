delimiter //
DROP PROCEDURE IF EXISTS AddPayment//
CREATE PROCEDURE AddPayment(IN _id1 INT, IN _id2 INT, IN _name VARCHAR(80), IN _val DECIMAL(10,2), IN _return BOOL)
BEGIN
	INSERT INTO Payment(User1ID, User2ID, Name, Amount, IsReturn) VALUES (_id1, _id2, _name, _val, _return);
	UPDATE Balances SET `Value` = `Value` + _val WHERE User1ID = _id1 AND User2ID = _id2;
	UPDATE Balances SET `Value` = `Value` - _val WHERE User1ID = _id2 AND User2ID = _id1;
END
//

delimiter //
DROP PROCEDURE IF EXISTS AddShoppingItem//
CREATE PROCEDURE AddShoppingItem(IN _id INT, IN _name VARCHAR(50), IN _category VARCHAR(50))
BEGIN
	INSERT INTO ShoppingList(Name, Category, IsBought, Added) VALUES(_name, _category, 0, _id);
END
//

delimiter //
DROP PROCEDURE IF EXISTS AddBalances//
CREATE PROCEDURE AddBalances(IN _id1 INT, IN _id2 INT)
BEGIN
	INSERT INTO Balances(`User1ID`, `User2ID`, `Value`) VALUES(_id1, _id2, 0);
	INSERT INTO Balances(`User1ID`, `User2ID`, `Value`) VALUES(_id2, _id1, 0);
END
//

delimiter //
DROP PROCEDURE IF EXISTS RemoveShoppingItem//
CREATE PROCEDURE RemoveShoppingItem(IN _id INT)
BEGIN
	UPDATE ShoppingList SET IsBought = 1 WHERE ID=_id;
END
//

delimiter //
DROP PROCEDURE IF EXISTS AddUser//
CREATE PROCEDURE AddUser(IN _name VARCHAR(20), IN _password VARCHAR(20))
BEGIN
INSERT INTO Users(Login, Password) VALUES(_name, _password);
SELECT @n := COUNT(*) FROM Users;
SET @i=1;
WHILE @i<@n DO 
  CALL AddBalances(@i,@n);
  SET @i = @i + 1;
END WHILE;
END
//

delimiter //
DROP PROCEDURE IF EXISTS GetShoppingList//
CREATE PROCEDURE GetShoppingList()
BEGIN
	SELECT * FROM `ShoppingList` WHERE IsBought = 0;
END