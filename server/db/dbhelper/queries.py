import data
import pymysql
from connection import ConnectionWrapper


def runQuery(query, args, fetch=False, db=data.DATABASE):
    cw = ConnectionWrapper(db)
    try:
        cursor = cw.getCursor()
        cursor.execute(query, args)

        if fetch:
            result = cursor.fetchall()
        else:
            result = None
        cw.commit()
        return result

    finally:
        cw.close()


def createTestingDB():
    query = "CREATE DATABASE " + data.DATABASE + ";"
    runQuery(query, None, False, None)


def dropTestingDB():
    query = "DROP DATABASE IF EXISTS " + data.DATABASE + ";"
    runQuery(query, None, False, None)


def createTables(create_script_name):
    with open(create_script_name, 'r') as myfile:
        query = myfile.read()

    # data processing
    query = query.replace("\t", "")
    query = query.replace("\n", "")
    queries = query.split(";")

    for i in range(len(queries) - 1):  # Skip the last comments
        runQuery(queries[i] + ";", None, False)


    
def searchInfoByPartialConditions(tableName, info_format, cons_format=None, keyword=None):  # quotes
    query = ""
    if cons_format == None and keyword == None:
        query = ("SELECT " + info_format + " FROM " + tableName + ";")
    else:
        kword = ('%s'%keyword)
        cons_format = (cons_format + " like '%" + kword + "%'")
        query = (
            "SELECT " + info_format + " FROM " + tableName + " WHERE " +
            cons_format + ";"
        )
    return runQuery(query, None, True)


def selectInfoByConditions(tableName, info_format, cons_format=None, vals=None):  # quotes
    query = ""
    if cons_format == None and vals == None:
        query = ("SELECT " + info_format + " FROM " + tableName + ";")
    else:
        query = (
            "SELECT " + info_format + " FROM " + tableName + " WHERE " +
            cons_format + ";"
        )
        query = query % vals
    return runQuery(query, None, True)


def searchInfoByConditions(tableName, info_format, cons_format=None, vals=None):  # quotes
    query = ""
    if cons_format == None and vals == None:
        query = ("SELECT " + info_format + " FROM " + tableName + ";")
    else:
        query = (
            "SELECT " + info_format + " FROM " + tableName + " WHERE " +
            cons_format + ";"
        )
        query = query % vals
    return runQuery(query, None, True)


def selectAllByConditions(tableName, cons_format=None, vals=None):
    return selectInfoByConditions(tableName, "*", cons_format, vals)


def getNumOfRecordByConditions(tableName, cons_format=None, vals=None):
    return len(selectAllByConditions(tableName, cons_format, vals))


def checkRecordExistByConditions(tableName, cons_format=None, vals=None):
    return (getNumOfRecordByConditions(tableName, cons_format, vals) > 0)


def deleteRecordByCondition(tableName, cons_format, vals):
    query = ("DELETE FROM " + tableName + " WHERE " + cons_format + ";")
    query = query % vals
    # print(query)
    runQuery(query, None, False)
    return True


def insertRecordTo(tableName, cols, vals, vals_format):
    query = "INSERT INTO " + tableName + cols + " VALUES " + vals_format + ";"
    runQuery(query, vals, False)
    return True


def insertRecordForcibly(tableName, user_id, info):
    info = pymysql.escape_string(info)
    query = 'INSERT INTO %s (user_id, info) VALUES ("%s", "%s") ON DUPLICATE KEY UPDATE info="%s";' % (
        tableName, user_id, info, info)
    print query
    runQuery(query, None, False)
    return True


def updateRecordByConditions(tableName, info_format, cons_format, vals):
    query = (
        "UPDATE " + tableName + " SET " + info_format + " WHERE "
        + cons_format + ";"
    )
    query = query % vals
    runQuery(query, None, False)
    return True


def getValsByKey(result_list, key):  # return a list
    vals = []
    if (len(result_list) <= 0) or (key not in result_list[0]):
        return vals

    for i in range(len(result_list)):
        vals.append(result_list[i][key])

    return vals
