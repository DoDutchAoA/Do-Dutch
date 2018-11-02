import data
import dbqueries as q


def usernameExists(username):
    return q.checkRecordExistByConditions("Users", "user_name = '%s'", username)


def groupExists(groupId):
    return q.checkRecordExistByConditions("gGroups", "group_id = '%s'", groupId)


def groupNameExists(groupName):
    return q.checkRecordExistByConditions("gGroups", "group_name = '%s'", groupName)


def orderExists(orderId):
    return q.checkRecordExistByConditions("Orders", "order_id = '%s'", orderId)


def itemExists(itemId):
    return q.checkRecordExistByConditions("Items", "item_id = '%s'", itemId)


def allocationExists(alloId):
    return q.checkRecordExistByConditions("Allocations", "allo_id = '%s'", alloId)


def userInGroup(groupId, userId):
    return q.checkRecordExistByConditions(
        "GroupUsers", "group_id = '%s' AND member_id "
        " = '%s'", (groupId, userId),
    )

# insert


def createUser(username, userpwd):
    if not usernameExists(username):
        if q.insertRecordTo(
            "Users", "(user_name, user_pwd)",
            (username, userpwd), "(%s, %s)",
        ):
            return getUserIdByUsername(username)
    return -1


def createGroup(gName, ownerId):
    if groupNameExists(gName):
        return False
    return q.insertRecordTo(
        "gGroups", "(group_name, owner_id)",
        (gName, ownerId), "(%s, %s)",
    )


def insertMemberToGroup(groupId, memberId):
    return q.insertRecordTo(
        "GroupUsers", "(group_id, member_id)",
        (groupId, memberId), "(%s, %s)",
    )


def insertMembersToGroup(groupId, memberIds):
    if type(memberIds) is int:
        return insertMemberToGroup(groupId, memberIds)
    else:
        for i in range(len(memberIds)):
            if not insertMemberToGroup(groupId, memberIds[i]):
                return False
        return True


def getUserIdByUsername(username):
    result_list = q.selectInfoByConditions(
        "Users", "user_id",
        "user_name = '%s'", username,
    )

    if (len(result_list) > 0):
        return result_list[0]['user_id']
    else:
        return -1


def getUserIdByAuthentication(username, userpwd):
    result_list = q.selectInfoByConditions(
        "Users", "user_id",
        "user_name = '%s' AND user_pwd = '%s'", (username, userpwd),
    )

    if (len(result_list) > 0):
        return result_list[0]['user_id']
    else:
        return -1


def getGroupIdBygName(gName):
    result_list = q.selectInfoByConditions(
        "gGroups", "group_id",
        "group_name = '%s'", gName,
    )

    if (len(result_list) > 0):
        return result_list[0]['group_id']
    else:
        return -1


def deleteUserByUserId(userId):
    return q.deleteRecordByCondition("Users", "user_id = '%s'", userId)
    # return q.deleteRecordByPK("Users", "user_id", userId)


def deleteGroupById(groupId):
    if not groupExists(groupId):
        return False
    else:
        return q.deleteRecordByCondition("gGroups", "group_id = '%s'", groupId)


def removeMemberFromGroupById(groupId, memberId):
    if not userInGroup(groupId, memberId):
        return False
    else:
        return q.deleteRecordByCondition(
            "GroupUsers", "group_id = '%s' AND "
            "member_id = '%s'", (groupId, memberId),
        )


def removeMembersFromGroupByIds(groupId, memberIds):
    if type(memberIds) is int:
        return removeMemberFromGroupById(groupId, memberIds)
    else:
        for i in range(len(memberIds)):
            if not removeMemberFromGroupById(groupId, memberIds[i]):
                return False
        return True


def getAllMemberIds(groupId):
    result_list = q.selectInfoByConditions(
        "GroupUsers", "member_id",
        "group_id = '%s'", str(groupId),
    )

    return q.getValsByKey(result_list, 'member_id')


def removeAllMembersFromGroup(groupId):
    if not groupExists(groupId):
        return False

    return q.deleteRecordByCondition(
        "GroupUsers", "group_id = '%s'",
        str(groupId),
    )


def createOrder(groupId, orderName, numOfItems):
    check = q.insertRecordTo(
        "Orders", "(group_id, order_name, item_unres_num)",
        (groupId, orderName, numOfItems), "(%s, %s, %s)",
    )

    if check:
        result_list = q.selectInfoByConditions(
            "Orders", "order_id",
            "order_name = '%s' AND group_id = '%s'", (orderName, groupId),
        )
        if len(result_list) > 0:
            return result_list[-1]['order_id']  # get the newly inserted
    return -1  # failed


def deleteOrderById(orderId):
    return q.deleteRecordByCondition("Orders", "order_id = '%s'", str(orderId))

# Receipt


def createReceipt(orderId, receiptPath, receiptIdx=1):
    if not (orderExists(orderId)):
        return (-1, -1)

    if not q.insertRecordTo(
        "OrderReceipts", "(order_id, receipt_idx, "
        "receipt_path)", (orderId, receiptIdx, receiptPath), "(%s, %s, %s)",
    ):
        return (-1, -1)

    return (orderId, receiptIdx)


def deleteReceipt(orderId, receiptIdx):
    return q.deleteRecordByCondition(
        "OrderReceipts",
        " order_id = '%s' AND receipt_idx = '%s'", (orderId, receiptIdx),
    )


def createItem(itemName, leftAmount, orderId):
    q.insertRecordTo(
        "Items", "(item_name, left_amount, order_id)",
        (itemName, leftAmount, orderId), "(%s, %s, %s)",
    )
    result_list = q.selectInfoByConditions(
        "Items", "item_id",
        "order_id = '%s' AND item_name = '%s'", (orderId, itemName),
    )
    if len(result_list) > 0:
        return result_list[0]['item_id']
    else:
        return -1


def deleteItemById(itemId):
    return q.deleteRecordByCondition("Items", "item_id = '%s'", itemId)


def modifyItemName(itemId, itemName):
    if not itemExists(itemId):
        return False
    return q.updateRecordByConditions(
        "Items", "item_name = '%s'",
        "item_id = %s", (itemName, str(itemId)),
    )


def modifyItemAmount(itemId, itemAmount):
    if not itemExists(itemId):
        return False
    if itemAmount > data.MAX_AMOUNT or itemAmount < 0:
        return False
    return q.updateRecordByConditions(
        "Items", "left_amount = '%s'",
        "item_id = %s", (itemAmount, str(itemId)),
    )


def deductItemAmount(itemId, allocated):  # diff >= 0
    # Assume the item exists
    prevAmount = q.selectInfoByConditions(
        "Items", "left_amount",
        "item_id = '%s'", str(itemId),
    )[0]['left_amount']
    return modifyItemAmount(itemId, prevAmount - allocated)


def createAllocation(userId, itemId, alloAmount):
    if not itemExists(itemId):
        return -1

    leftAmount = q.selectInfoByConditions(
        "Items", "left_amount",
        "item_id = '%s'", itemId,
    )[0]['left_amount']
    if alloAmount > leftAmount:
        return -1

    if not deductItemAmount(itemId, alloAmount):  # Modify left_amount
        return -1

    if not q.insertRecordTo(
        "Allocations", "(item_id, user_id, allo_amount)",
        (str(itemId), str(userId), str(alloAmount)), "(%s, %s, %s)",
    ):
        return -1

    return q.selectInfoByConditions(
        "Allocations", "allo_id",
        "item_id = '%s' AND user_id = '%s'", (itemId, userId),
    )[-1]['allo_id']


def deleteAllocation(alloId):
    if not allocationExists(alloId):
        return False

    result = q.selectAllByConditions(
        "Allocations", "allo_id = '%s'", alloId,
    )[0]
    itemId = result['item_id']
    alloAmount = result['allo_amount']
    curAmount = q.selectInfoByConditions(
        "Items", "left_amount",
        "item_id = '%s'", itemId,
    )[0]['left_amount']

    if not modifyItemAmount(itemId, curAmount + alloAmount):
        return False
    return q.deleteRecordByCondition("Allocations", "allo_id = '%s'", alloId)


def modifyAllocatedAmount(alloId, alloAmount):
    if not allocationExists(alloId):
        return False

    result = q.selectAllByConditions(
        "Allocations", "allo_id = '%s'", alloId,
    )[0]
    itemId = result['item_id']
    curAllo = result['allo_amount']
    curAmount = q.selectInfoByConditions(
        "Items", "left_amount",
        "item_id = '%s'", itemId,
    )[0]['left_amount']

    recoverAmount = curAmount + curAllo

    if alloAmount > recoverAmount:
        return False

    if not q.updateRecordByConditions(
        "Allocations", "allo_amount = '%s'",
        "allo_id = '%s'", (alloAmount, alloId),
    ):
        return False

    return q.updateRecordByConditions(
        "Items", "left_amount = '%s'",
        "item_id = '%s'", (recoverAmount - alloAmount, itemId),
    )
