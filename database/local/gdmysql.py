createFileName = "create_tables.sql"


def runQuery(conn, query, args, fetch=False):
    cursor = conn.getCursor()
    cursor.execute(query, args)

    if fetch:
        result = cursor.fetchall()
    else:
        result = None

    conn.commit()
    return result  # [dict]


def rebuilDB(conn, dbName):
    dropDB(conn, dbName)
    query = "CREATE DATABASE " + dbName + ";"
    # print("***", query)
    runQuery(conn, query, None, False)


def useDB(conn, dbName):
    runQuery(conn, "USE " + dbName + ";", None, False)


def dropDB(conn, dbName):
    query = "DROP DATABASE IF EXISTS " + dbName + ";"
    runQuery(conn, query, None, False)


def createTables(conn):
    with open(createFileName, 'r') as myfile:
        query = myfile.read()

    # data processing
    query = query.replace("\t", "")
    query = query.replace("\n", "")
    queries = query.split(";")

    for i in range(len(queries) - 1):  # Skip the last comments
        runQuery(conn, queries[i] + ";", None, False)


def usernameExists(conn, username):
    query = "SELECT user_id FROM Users WHERE user_name = %s;"
    result = runQuery(conn, query, username, True)
    return (len(result) > 0)


def selectUserByUsername(conn, username):
    # guarantee username exist
    query = "SELECT user_id FROM Users WHERE user_name = %s;"
    result = runQuery(conn, query, username, True)
    return result[0]


def deleteUserByUsername(conn, username):
    query = "DELETE FROM Users WHERE user_name = %s;"
    runQuery(conn, query, username, True)
    return True


def getUserIdByUsername(conn, username):
    return selectUserByUsername(conn, username)['user_id']


def groupExists(conn, groupId):
    query = "SELECT * FROM gGroups WHERE group_id = %s;"
    result = runQuery(conn, query, groupId, True)
    # print("result", result)
    return len(result) > 0


def userInGroup(conn, groupId, userId):
    query = "SELECT * FROM GroupUsers WHERE group_id = %s AND member_id = %s;"
    result = runQuery(conn, query, (groupId, userId), True)
    return len(result) > 0


def orderExists(conn, orderId):
    query = "SELECT * FROM Orders WHERE order_id = %s;"
    result = runQuery(conn, query, orderId, True)
    return len(result) > 0


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
