# Local testing
import gdmysql
import pymysql
# from gdmysql import gdmysql.runQuery

hostname = '127.0.0.1'
user = 'root'
password = ''
database = 'GODUTCH_SERVER'
port = 3306


class Connection:

    def __init__(self, *args, **kwargs):
        self.conn = pymysql.connect(
            host=hostname, user=user,
            password=password, db=kwargs.get(
                'db', database,
            ),
            charset='utf8mb4',
            port=port,
            cursorclass=pymysql.cursors.DictCursor,
        )
        self.cursor = self.conn.cursor()

    def close(self):
        self.conn.close()
        self.conn = None
        self.cursor = None

    def commit(self):
        self.conn.commit()

    def getCursor(self):
        return self.cursor

# Sign up


def signUp(conn, username, userpwd):  # return user_id
    if gdmysql.usernameExists(conn, username) > 0:
        return -1
    else:
        query = "INSERT INTO Users (user_name, user_pwd) VALUES (%s, %s);"
        gdmysql.runQuery(conn, query, (username, userpwd), False)
        return gdmysql.getUserIdByUsername(conn, username)

# Login


def login(conn, username, userpwd):
    query = "SELECT * FROM Users WHERE user_name = %s AND user_pwd = %s;"
    result = gdmysql.runQuery(conn, query, (username, userpwd), True)
    if len(result) > 0:
        return result['user_id']
    else:
        return -1

# Group


def createEmptyGroup(conn, groupName, ownerId):
    createQuery = "INSERT INTO gGroups (group_name, owner_id) VALUES (%s, %s);"
    gdmysql.runQuery(conn, createQuery, (groupName, ownerId), False)
    selectQuery = "SELECT group_id FROM gGroups WHERE group_name = %s AND owner_id = %s;"
    result = gdmysql.runQuery(conn, selectQuery, (groupName, ownerId), True)
    return result[-1]  # Get the newly inserted


def addMembersToGroup(conn, groupId, memberIds):
    if not gdmysql.groupExists(conn, groupId):
        return False
    else:
        query = "INSERT INTO GroupUsers (group_id, member_id) VALUES (%s, %s);"
        for i in range(len(memberIds)):
            gdmysql.runQuery(conn, query, (groupId, memberIds[i]), False)
        return True


def createGroupWithMembers(conn, groupName, ownerId, memberIds):
    result = createEmptyGroup(conn, groupName, ownerId)
    # print("groupId", groupId)
    memberIds.append(ownerId)
    # print(memberIds)
    return addMembersToGroup(conn, result['group_id'], memberIds)


def removeMemberFromGroup(conn, groupId, memberId):
    if not gdmysql.userInGroup(conn, groupId, memberId):
        return False
    else:
        query = "DELETE FROM GroupUsers WHERE group_id = %s AND member_id = %s;"
        gdmysql.runQuery(conn, query, (groupId, memberId), False)
        return True

# Order (GroupOrder)


def createOrder(conn, orderName, totalItems):
    query = "INSERT INTO Orders (order_name, item_unres_num) VALUES (%s, %s);"
    gdmysql.runQuery(conn, query, (orderName, totalItems), False)
    return True


def deleteOrder(conn, orderId):
    if not gdmysql.orderExists(conn, orderId):
        return False
    else:
        query = "DELETE FROM Orders WHERE order_id = %s;"
        gdmysql.runQuery(conn, query, orderId, False)
        return True

# GroupOrders


def createReciept(conn, orderId, groupId, receiptPath, receiptIdx=1):
    if not (gdmysql.orderExists(conn, orderId) and gdmysql.groupExists(conn, groupId)):
        return False
    else:
        query = "INSERT INTO GroupOrders (group_id, order_id, receipt_index, receipt_path) \
        VALUES (%s, %s, %s, %s);"
        gdmysql.runQuery(
            conn, query, (
                groupId, orderId,
                receiptIdx, receiptPath,
            ), False,
        )
        return True

# Deprecated


def insertRecieptInfo(conn, orderId, groupId, receiptPath, receiptIdx=1):
    return createReciept(conn, orderId, groupId, receiptPath, receiptIdx=1)

# Item


def addItemToOrder(conn, itemName, orderId, itemAmount):
    query = "INSERT INTO Items (item_name, order_id, left_amount) VALUES \
    (%s, %s, %s);"
    gdmysql.runQuery(conn, query, (itemName, orderId, itemAmount), False)
    return True


def modifyItemName(conn, itemId, itemName):  # In case OCR does not work properly
    if not gdmysql.itemExists(conn, itemId):
        return False
    else:
        query = "UPDATE Items SET item_name = %s WHERE item_id = %s;"
        gdmysql.runQuery(conn, query, (itemName, itemId), False)
        return True


# In case OCR does not work properly
def modifyItemTotalAmount(conn, itemId, totalAmount):
    if not gdmysql.itemExists(conn, itemId):
        return False
    else:
        query = "UPDATE Items SET left_amount = %s WHERE item_id = %s;"
        gdmysql.runQuery(conn, query, (totalAmount, itemId), False)
        return True

# Allocation


def createAllocation(conn, userId, itemId, amount):
    if not gdmysql.validAllocation(conn, itemId, amount):
        return False
    else:
        gdmysql.deductItemAmount(conn, itemId, amount)

        query = "INSERT INTO Allocations (allo_amount, item_id, user_id) \
        VALUES (%s, %s, %s);"
        gdmysql.runQuery(conn, query, (amount, itemId, userId), False)
        return True


def modifyAllocation(conn, alloId, updatedAmount):  # updatedAmount >= 0
    # guarantee alloId exists
    selectQuery = "SELECT * FROM Allocations WHERE allo_id = %s;"
    result = gdmysql.runQuery(conn, selectQuery, alloId, True)
    itemId = result[0]['item_id']
    prevAllo = result[0]['allo_amount']

    if not gdmysql.validAllocation(conn, itemId, updatedAmount - prevAllo):
        return False
    else:
        gdmysql.deductItemAmount(conn, itemId, updatedAmount - prevAllo)
        updateQuery = "UPDATE Allocations SET allo_amount = %s WHERE allo_id = %s;"
        gdmysql.runQuery(conn, updateQuery, (updatedAmount, alloId), False)
        return True

# Testing

# Connect to the database
# connection = Connection(db='Test')
# connection = Connection()

# gdmysql.dropDB(connection, "TEST")

# # prepare a cursor object using cursor() method
# cursor = connection.getCursor()
#
# # # Signup
# print(signUp(connection, "Amy", "1111222")) #True
# print(signUp(connection, "Andrew", "1156511222")) #True
# print(signUp(connection, "Xiaoming", "1156511222")) #True

# ## login
# login(connection, "Xiaoming", "1156511222")    #true
# login(connection, "Xiaoming", "123467")     #false
#
# # group
# createEmptyGroup(connection, "Testgroupname", 1)
#
# print(addMembersToGroup(connection, 1, [1,2]))  #True
# print(addMembersToGroup(connection, 2, [1,2,3]))  #False
#
# signUp(connection, "Jane", "pwd")   #3
# signUp(connection, "Sam", "1111222")    #4
# createGroupWithMembers(connection, "Test3", 1, [2,3,4])
# print(removeMemberFromGroup(connection, 2, 3))    #True
# print(removeMemberFromGroup(connection, 2, 5))    #False
#
# # order
# createOrder(connection, "orderTest", 5)
#
# # item
# addItemToOrder(connection, "apple", 1, 3)
# addItemToOrder(connection, "pear", 1, 4.55)
# addItemToOrder(connection, "peach", 1, 4.6666666)
# modifyItemName(connection, 1, "grape")  #apple to Grape
# modifyItemName(connection, 8, "grape")  #not exist
# modifyItemTotalAmount(connection, 1, 10)    # 3 to 10
#
# # Allocation
# print(validAllocation(connection, 1, 1.2))  #true
# print(validAllocation(connection, 1, 1))  #true
# print(validAllocation(connection, 1, 3))  #false
# print(deductItemAmount(connection, 1, 1))   #true left 9
# print(deductItemAmount(connection, 1, 0.2)) #true left 8.8
# print(createAllocation(connection, 1, 1, 3)) #true 5 -> 3
# print(createAllocation(connection, 1, 1, 2)) # false
# print(modifyAllocation(connection, 6, 15))

# GroupOrders
# print(insertRecieptInfo(connection, 1, 1, "abc.com"))   #true
# print(insertRecieptInfo(connection, 1, 1, "efg.com", 2))   #true
# print(insertRecieptInfo(connection, 1, 8, "abc.com"))   #false
# print(insertRecieptInfo(connection, 9, 1, "abc.com"))   #false


# connection.close()
