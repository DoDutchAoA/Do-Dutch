import messageutils as m
import orderutils as o
import userutils as u


def signUp(username, userpwd):  # return user_id
    return u.createUser(username, userpwd)


def login(username, userpwd):
    return u.getUserIdByAuthentication(username, userpwd)


def updateUserReceipt(userId, info):
    return u.updateUserReceipt(userId, info)


def createEmptyGroup(groupName, ownerId):  # return g_id
    return u.createEmptyGroup(groupName, ownerId)


def addMembersToGroup(groupId, memberIds):
    return u.addMembersToGroup(groupId, memberIds)


def searchUserByUsername(keyword):
    return u.searchUserByKeyword(keyword)


def getAllFriends(userId):
    return u.getAllFriends(userId)


def addFriend(first_user_id, second_user_id):
    return u.addFriend(first_user_id, second_user_id)


def removeFriend(first_user_id, second_user_id):
    return u.removeFriend(first_user_id, second_user_id)


def createGroupWithMembers(groupName, ownerId, memberIds):
    return u.createGroupWithMembers(groupName, ownerId, memberIds)


def getAllMembersByGroupId(groupId):
    return u.getAllMembersByGroupId(groupId)


def removeMembersFromGroup(groupId, memberIds):
    return u.removeMembersFromGroupByIds(groupId, memberIds)


def deleteGroup(groupId):
    return u.deleteGroup(groupId)


def getAllGroups(userId):
    return u.getAllGroups(userId)


def createOrder(groupId, orderName, numOfItems):
    return o.createOrder(groupId, orderName, numOfItems)


def deleteOrder(orderId):
    return o.deleteOrderById(orderId)


def createReceipt(orderId, receiptPath, ReceiptIdx=1):
    return o.createReceipt(orderId, receiptPath, ReceiptIdx)


def deleteReceipt(orderId, receiptIdx):
    return o.deleteReceipt(orderId, receiptIdx)


def createItem(itemName, leftAmount, orderId):
    return o.createItem(itemName, leftAmount, orderId)


def deleteItem(itemId):
    return o.deleteItemById(itemId)


def modifyItemName(itemId, itemName):
    return o.modifyItemName(itemId, itemName)


def modifyItemAmount(itemId, itemAmount):
    return o.modifyItemAmount(itemId, itemAmount)


def createAllocation(userId, itemId, alloAmount):
    return o.createAllocation(userId, itemId, alloAmount)


def deleteAllocation(alloId):
    return o.deleteAllocation(alloId)


def modifyAllocatedAmount(alloId, alloAmount):
    return o.modifyAllocatedAmount(alloId, alloAmount)


def insertNewReceipt(sender, receiver, receiptId, data):
    return m.insertNewReceipt(sender, receiver, receiptId, data)


def pollingMessage(receiver):
    return m.pollingMessage(receiver)
