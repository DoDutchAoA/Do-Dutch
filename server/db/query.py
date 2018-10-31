# Local testing
import pymysql.cursors

hostname = '0.0.0.0'
user = 'debian-sys-maint'
password = 'eOGVeAYkXViKlmgl'
db = 'GODUTCH'
port = 3306

class Connection:

    def __init__(self):
        self.conn = pymysql.connect(host=hostname, user=user,
        password=password, db=db, charset='utf8mb4', port=port,
        cursorclass=pymysql.cursors.DictCursor)
        self.cursor = self.conn.cursor()

    def close(self):
        self.conn.close()
        self.conn = None
        self.cursor = None

    def commit(self):
        self.conn.commit()

    def getCursor(self):
        return self.cursor

def runQuery(conn, query, args, fetch=False):
    cursor = conn.getCursor()
    cursor.execute(query, args)

    if fetch:
        result = cursor.fetchall()
    else:
        result = None

    conn.commit()
    return result  # [dict]

# Sign up


def signUp(conn, username, userpwd):  # return user_id
    if usernameExists(conn, username) > 0:
        return -1
    else:
        query = "INSERT INTO Users (user_name, user_pwd) VALUES (%s, %s);"
        runQuery(conn, query, (username, userpwd), False)
        return getUserIdByUsername(conn, username)

# Login


def usernameExists(conn, username):
    query = "SELECT user_id FROM Users WHERE user_name = %s;"
    result = runQuery(conn, query, username, True)
    return (len(result) > 0)


def login(conn, username, userpwd):
    query = "SELECT * FROM Users WHERE user_name = %s AND user_pwd = %s;"
    result = runQuery(conn, query, (username, userpwd), True)
    if len(result) > 0:
        return result['user_id']
    else:
        return -1

# Group


def groupExists(conn, groupId):
    query = "SELECT * FROM gGroups WHERE group_id = %s;"
    result = runQuery(conn, query, groupId, True)
    # print("result", result)
    return len(result) > 0


def createEmptyGroup(conn, groupName, ownerId):
    createQuery = "INSERT INTO gGroups (group_name, owner_id) VALUES (%s, %s);"
    runQuery(conn, createQuery, (groupName, ownerId), False)
    selectQuery = "SELECT group_id FROM gGroups WHERE group_name = %s AND owner_id = %s;"
    result = runQuery(conn, selectQuery, (groupName, ownerId), True)
    return result[-1]  # Get the newly inserted


def addMembersToGroup(conn, groupId, memberIds):
    if not groupExists(conn, groupId):
        return False
    else:
        query = "INSERT INTO GroupUsers (group_id, member_id) VALUES (%s, %s);"
        for i in range(len(memberIds)):
            runQuery(conn, query, (groupId, memberIds[i]), False)
        return True


def createGroupWithMembers(conn, groupName, ownerId, memberIds):
    result = createEmptyGroup(conn, groupName, ownerId)
    # print("groupId", groupId)
    memberIds.append(ownerId)
    # print(memberIds)
    return addMembersToGroup(conn, result['group_id'], memberIds)


def userInGroup(conn, groupId, userId):
    query = "SELECT * FROM GroupUsers WHERE group_id = %s AND member_id = %s;"
    result = runQuery(conn, query, (groupId, userId), True)
    return len(result) > 0


def removeMemberFromGroup(conn, groupId, memberId):
    if not userInGroup(conn, groupId, memberId):
        return False
    else:
        query = "DELETE FROM GroupUsers WHERE group_id = %s AND member_id = %s;"
        runQuery(conn, query, (groupId, memberId), False)
        return True

# Order (GroupOrder)


def createOrder(conn, orderName, totalItems):
    query = "INSERT INTO Orders (order_name, item_unres_num) VALUES (%s, %s);"
    runQuery(conn, query, (orderName, totalItems), False)
    return True


def deleteOrder(conn, orderId):
    if not orderExists(conn, orderId):
        return False
    else:
        query = "DELETE FROM Orders WHERE order_id = %s;"
        runQuery(conn, query, orderId, False)
        return True


def orderExists(conn, orderId):
    query = "SELECT * FROM Orders WHERE order_id = %s;"
    result = runQuery(conn, query, orderId, True)
    return len(result) > 0

# GroupOrders


def insertRecieptInfo(conn, orderId, groupId, receiptPath, receiptIdx=1):
    if not (orderExists(conn, orderId) and groupExists(conn, groupId)):
        return False
    else:
        query = "INSERT INTO GroupOrders (group_id, order_id, receipt_index, receipt_path) \
        VALUES (%s, %s, %s, %s);"
        runQuery(
            conn, query, (
                groupId, orderId,
                receiptIdx, receiptPath,
            ), False,
        )
        return True

# Item


def addItemToOrder(conn, itemName, orderId, itemAmount):
    query = "INSERT INTO Items (item_name, order_id, left_amount) VALUES \
    (%s, %s, %s);"
    runQuery(conn, query, (itemName, orderId, itemAmount), False)
    return True

# In case OCR does not work properly


def modifyItemName(conn, itemId, itemName):
    if not itemExists(conn, itemId):
        return False
    else:
        query = "UPDATE Items SET item_name = %s WHERE item_id = %s;"
        runQuery(conn, query, (itemName, itemId), False)
        return True

# In case OCR does not work properly


def modifyItemTotalAmount(conn, itemId, totalAmount):
    if not itemExists(conn, itemId):
        return False
    else:
        query = "UPDATE Items SET left_amount = %s WHERE item_id = %s;"
        runQuery(conn, query, (totalAmount, itemId), False)
        return True


def itemExists(conn, itemId):
    query = "SELECT * FROM Items WHERE item_id = %s;"
    result = runQuery(conn, query, itemId, True)
    return len(result) > 0


def updateItemAmountByDiff(conn, itemId, diff):  # diff is sign-sensitive
    # guarantee itemId exists and diff is valid
    selectQuery = "SELECT left_amount FROM Items WHERE item_id = %s;"
    result = runQuery(conn, selectQuery, itemId, True)
    left = result[0]['left_amount']

    query = "UPDATE Items SET left_amount = %s WHERE item_id = %s;"
    runQuery(conn, query, (left + diff, itemId), False)
    return True


def deductItemAmount(conn, itemId, amount):  # amount >= 0
    return updateItemAmountByDiff(conn, itemId, -amount)

# Allocation


def validAllocation(conn, itemId, amount):  # amount >= 0
    query = "SELECT * FROM Items WHERE item_id = %s;"
    result = runQuery(conn, query, itemId, True)

    # print("left = ", result[0]['left_amount'], "amount = ", amount)

    if not len(result) > 0:
        return False  # No such item
    else:
        if (result[0]['left_amount'] - amount) < 0:
            return False    # No sufficient items
        else:
            return True


def createAllocation(conn, userId, itemId, amount):
    if not validAllocation(conn, itemId, amount):
        return False
    else:
        deductItemAmount(conn, itemId, amount)

        query = "INSERT INTO Allocations (allo_amount, item_id, user_id) \
        VALUES (%s, %s, %s);"
        result = runQuery(conn, query, (amount, itemId, userId), False)
        return True


def modifyAllocation(conn, alloId, updatedAmount):  # updatedAmount >= 0
    # guarantee alloId exists
    selectQuery = "SELECT * FROM Allocations WHERE allo_id = %s;"
    result = runQuery(conn, selectQuery, alloId, True)
    itemId = result[0]['item_id']
    prevAllo = result[0]['allo_amount']

    if not validAllocation(conn, itemId, updatedAmount - prevAllo):
        return False
    else:
        deductItemAmount(conn, itemId, updatedAmount - prevAllo)
        updateQuery = "UPDATE Allocations SET allo_amount = %s WHERE allo_id = %s;"
        runQuery(conn, updateQuery, (updatedAmount, alloId), False)
        return True

# Miscellaneous


def selectUserByUsername(conn, username):
    # guarantee username exist
    query = "SELECT user_id FROM Users WHERE user_name = %s;"
    result = runQuery(conn, query, username, True)
    return result[0]


def deleteUserByUsername(conn, username):
    query = "DELETE FROM Users WHERE user_name = %s;"
    result = runQuery(conn, query, username, True)
    return True


def getUserIdByUsername(conn, username):
    return selectUserByUsername(conn, username)['user_id']


# Testing

# Connect to the database
connection = Connection()

# prepare a cursor object using cursor() method
cursor = connection.getCursor()

# # Signup
print(signUp(connection, "Amy", "1111222")) #True
print(signUp(connection, "Andrew", "1156511222")) #True
print(signUp(connection, "Xiaoming", "1156511222")) #True
#
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


connection.close()
