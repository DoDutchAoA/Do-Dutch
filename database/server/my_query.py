#Local testing
import pymysql.cursors

hostname = '127.0.0.1'
user = 'root'
password = ''
db = 'GODUTCH_SERVER'


def runQuery(conn, query, args, fetch=False):
    cursor = conn.cursor()
    cursor.execute(query, args)

    if fetch:
        result = cursor.fetchall()
    else:
        result = None

    conn.commit()
    return result #[dict]

#Sign up
def signUp(conn, username, userpwd): # return user_id
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
    return result[-1]   #Get the newly inserted

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

# Order
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

# Item
def addItemToOrder(conn, itemName, orderId, itemAmount):
    query = "INSERT INTO Items (item_name, order_id, left_amount) VALUES \
    (itemName, orderId, itemAmount);"
    runQuery(conn, query, (itemName, orderId, itemAmount), False)
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


#Testing

# Connect to the database
connection = pymysql.connect(host=hostname,
                             user=user,
                             password=password,
                             db=db,
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)

# prepare a cursor object using cursor() method
# cursor = connection.cursor()

# Signup
# print(signUp(connection, "Amy", "1111222")) #True
# print(signUp(connection, "Andrew", "1156511222")) #True
# deleteUserByUsername(connection, "Amy")
# deleteUserByUsername(connection, "Xiaoming")

## login
# getUserId(connection, "Xiaoming")
# usernameExists(connection, "Jane") #false
# login(connection, "Xiaoming", "1234567")    #true
# login(connection, "Xiaoming", "123467")     #false

# group
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

# order
# createOrder(connection, "orderTest", 5)
# deleteOrder(connection, 1)

# item
addItemToOrder(connection, "apple", 1, 3)
addItemToOrder(connection, "pear", 1, 4.55)
addItemToOrder(connection, "peach", 1, 4.6666666)


connection.close()
