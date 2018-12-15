import queries as q
import time
import datetime


def updateUserReceipts(userId, info):
    return q.insertRecordForcibly("Receipts", userId, info)


def getUserReceipts(userId):
    result_list = q.selectInfoByConditions(
        "Receipts", "info",
        "user_id = '%s'", (userId),
    )
    if (result_list.__len__() > 0):
        return result_list[0]
    else:
        return ''


def usernameExists(username):
    return q.checkRecordExistByConditions("Users", "user_name = '%s'", username)


def groupExists(groupId):
    return q.checkRecordExistByConditions("gGroups", "group_id = '%s'", groupId)


def groupNameExists(groupName):
    return q.checkRecordExistByConditions("gGroups", "group_name = '%s'", groupName)


def userInGroup(groupId, userId):
    return q.checkRecordExistByConditions(
        "GroupUsers", "group_id = '%s' AND member_id "
        " = '%s'", (groupId, userId),
    )


def createEmptyGroup(groupName, ownerId):  # return g_id
    if createGroup(groupName, ownerId):
        groupId = getGroupIdBygName(groupName)

        if addMembersToGroup(groupId, int(ownerId)):  # add the owner himself to this group
            return groupId

    return -1


def createGroupWithMembers(groupName, ownerId, memberIds):
    groupId = createEmptyGroup(groupName, ownerId)
    if not addMembersToGroup(groupId, memberIds):
        return -1
    return groupId


def getAllGroups(userId):
    result_list = q.selectInfoByConditions(
        "GroupUsers INNER JOIN gGroups ON gGroups.group_id = GroupUsers.group_id", "gGroups.group_id as group_id, group_name, owner_id",
        "member_id = '%s'", (userId),
    )
    for index, data in enumerate(result_list):
        result_list[index]['members'] = getAllMembersByGroupId(
            data['group_id'])
    return result_list


def getAllMembersByGroupId(groupId):
    result_list = q.selectInfoByConditions(
        "GroupUsers INNER JOIN Users ON GroupUsers.member_id = Users.user_id", "Users.user_id as member_id, Users.user_name as member_name",
        "group_id = '%s'", (groupId),
    )
    return result_list


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


def addMembersToGroup(groupId, memberIds):
    if not groupExists(groupId):
        return True
    return insertMembersToGroup(groupId, memberIds)


def insertMemberToGroup(groupId, memberId):
    result_list = q.selectInfoByConditions(
        "GroupUsers", "group_id",
        "group_id = '%s' AND member_id = '%s'", (groupId, memberId),
    )

    if (len(result_list) > 0):
        print("MATCH")
        return True

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


def addFriend(first_user_id, second_user_id):
    result_list = q.selectInfoByConditions(
        "Friends", "user_id",
        "user_id = '%s' AND friend_id = '%s'", (first_user_id, second_user_id),
    )

    res = {}
    if len(result_list) > 0 or first_user_id == second_user_id:
        res["status"] = False
    else:

        first_res = q.selectInfoByConditions(
            "Users", "user_name",
            "user_id = '%s'", (first_user_id),
        )

        second_res = q.selectInfoByConditions(
            "Users", "user_name",
            "user_id = '%s'", (second_user_id),
        )

        if len(first_res) == 0 or len(second_res) == 0:
            res["status"] = False
            return res

        print(first_res)
        res["status"] = True
        q.insertRecordTo(
            "Friends", "(user_id, friend_id, friend_name, title)",
            (
                first_user_id, second_user_id,
                second_res[0]["user_name"], second_res[0]["user_name"][0].upper(),
            ), "(%s, %s, %s, %s)",
        )
        q.insertRecordTo(
            "Friends", "(user_id, friend_id, friend_name, title)",
            (
                second_user_id, first_user_id,
                first_res[0]["user_name"], first_res[0]["user_name"][0].upper(),
            ), "(%s, %s, %s, %s)",
        )

    return res


def removeFriend(first_user_id, second_user_id):
    result_list = q.selectInfoByConditions(
        "Friends", "user_id",
        "user_id = '%s' AND friend_id = '%s'", (first_user_id, second_user_id),
    )

    res = {}
    if len(result_list) == 0:
        res["status"] = False
    else:
        res["status"] = True
        q.deleteRecordByCondition(
            "Friends", "user_id = '%s' AND friend_id = '%s'",
            (first_user_id, second_user_id),
        )
        q.deleteRecordByCondition(
            "Friends", "user_id = '%s' AND friend_id = '%s'",
            (second_user_id, first_user_id),
        )

    return res


def searchUserByKeyword(keyword):
    result_list = q.searchInfoByPartialConditions(
        "Users", "user_id, user_name",
        "user_name", keyword
    )

    return result_list


def getAllFriends(userId):
    result_list = q.searchInfoByConditions(
        "Friends", "friend_id, friend_name, title",
        "user_id = '%s' ORDER BY title", userId,
    )

    res = {}
    for result in result_list:
        if not result["title"] in res:
            res[result["title"]] = []
        res[result["title"]].append(result)

    return res


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


def deleteGroup(groupId):
    if removeAllMembersFromGroup(groupId):
        return deleteGroupById(groupId)
    else:
        return False


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

def addGroupChat(group_id, user_id, user_name, text):
    ts = time.time()
    timestamp = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')

    return q.insertRecordTo(
        "GroupChats", "(group_id, user_id, user_name, text, timestamp)",
        (group_id, user_id, user_name, text, timestamp), "(%s, %s, %s, %s, %s)",
    )

def getGroupChats(group_id):
    result = q.searchInfoByConditions(
        "GroupChats", "user_id, user_name, text, timestamp",
        "group_id = '%s'", group_id,
    )

    for res in result:
        res["timestamp"] = res["timestamp"].strftime('%Y-%m-%dT%H:%M:%SZ')

    return result
