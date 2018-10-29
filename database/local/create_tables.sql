CREATE TABLE Users (
	user_id INT NOT NULL AUTO_INCREMENT,
	user_name VARCHAR(100) NOT NULL UNIQUE,
	user_pwd VARCHAR(50) NOT NULL,
	user_preferences VARCHAR(1000),
	PRIMARY KEY (user_id)
);


CREATE TABLE Friends (
	user_id INT NOT NULL,
	friend_id INT NOT NULL,
	FOREIGN KEY (user_id) REFERENCES Users(user_id),
	FOREIGN KEY (friend_id) REFERENCES Users(user_id)
);


CREATE TABLE gGroups (
	group_id INT NOT NULL AUTO_INCREMENT,
	group_name VARCHAR(100) NOT NULL,
	owner_id INT NOT NULL,
	PRIMARY KEY (group_id),
	FOREIGN KEY (owner_id) REFERENCES Users(user_id)
);


CREATE TABLE GroupUsers (
	group_id INT NOT NULL,
	member_id INT NOT NULL,
	FOREIGN KEY (group_id) REFERENCES gGroups(group_id),
	FOREIGN KEY (member_id) REFERENCES Users(user_id),
	PRIMARY KEY (group_id, member_id)
);

CREATE TABLE Orders (
	order_id INT NOT NULL AUTO_INCREMENT,
	order_name VARCHAR(100),
	item_unres_num INT NOT NULL,
	PRIMARY KEY (order_id)
);


CREATE TABLE GroupOrders (
	group_id INT NOT NULL,
	order_id INT NOT NULL,
	receipt_index INT NOT NULL DEFAULT 1,
	receipt_path VARCHAR(300) NOT NULL,
	FOREIGN KEY (group_id) REFERENCES gGroups(group_id),
	FOREIGN KEY (order_id) REFERENCES Orders(order_id)
);	-- If multiple reciepts, collect all items to one order.


CREATE TABLE Items (
	item_id INT NOT NULL AUTO_INCREMENT,
	item_name VARCHAR(150),
	order_id INT NOT NULL,
	left_amount DOUBLE(50, 4) NOT NULL,
	PRIMARY KEY (item_id),
	FOREIGN KEY (order_id) REFERENCES Orders(order_id)
);	-- Not empty at the begining


CREATE TABLE Allocations (
	allo_id INT NOT NULL AUTO_INCREMENT,
	allo_amount DOUBLE(50, 4) NOT NULL,
	item_id INT NOT NULL,
	user_id INT NOT NULL,
	PRIMARY KEY (allo_id),
	FOREIGN KEY (item_id) REFERENCES Items(item_id),
	FOREIGN KEY (user_id) REFERENCES Users(user_id)
);	-- Empty at the begining
