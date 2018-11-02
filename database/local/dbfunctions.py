# import dbqueries as q
import dbhelpers as h


def signUp(username, userpwd):  # return user_id
    return h.createUser(username, userpwd)


def login(username, userpwd):
    return h.getUserIdByAuthentication(username, userpwd)

# Group


def createEmptyGroup(gName, ownerId):  # return g_id
    if h.createGroup(gName, ownerId):
        group_id = h.getGroupIdBygName(gName)
        # add the owner himself to this group
        addMembersToGroup(group_id, ownerId)
        return group_id

    return -1


def addMembersToGroup(groupId, memberIds):
    if not h.groupExists(groupId):
        return False
    return h.insertMembersToGroup(groupId, memberIds)


def createGroupWithMembers(groupName, ownerId, memberIds):
    g_id = createEmptyGroup(groupName, ownerId)
    if not addMembersToGroup(g_id, memberIds):
        return -1
    return g_id


def removeMembersFromGroup(groupId, memberIds):
    return h.removeMembersFromGroupByIds(groupId, memberIds)


def deleteGroup(groupId):
    if h.removeAllMembersFromGroup(groupId):
        return h.deleteGroupById(groupId)
    else:
        return False


def createOrder(groupId, orderName, numOfItems):
    return h.createOrder(groupId, orderName, numOfItems)


def deleteOrder(orderId):
    return h.deleteOrderById(orderId)


def createReceipt(orderId, receiptPath, ReceiptIdx=1):
    return h.createReceipt(orderId, receiptPath, ReceiptIdx)


def deleteReceipt(orderId, receiptIdx):
    return h.deleteReceipt(orderId, receiptIdx)


def createItem(itemName, leftAmount, orderId):
    return h.createItem(itemName, leftAmount, orderId)


def deleteItem(itemId):
    return h.deleteItemById(itemId)


def modifyItemName(itemId, itemName):
    return h.modifyItemName(itemId, itemName)


def modifyItemAmount(itemId, itemAmount):
    return h.modifyItemAmount(itemId, itemAmount)


def createAllocation(userId, itemId, alloAmount):
    return h.createAllocation(userId, itemId, alloAmount)


def deleteAllocation(alloId):
    return h.deleteAllocation(alloId)


def modifyAllocatedAmount(alloId, alloAmount):
    return h.modifyAllocatedAmount(alloId, alloAmount)
