import queries as q


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

        if addMembersToGroup(groupId, ownerId):  # add the owner himself to this group
            return groupId

    return -1


def createGroupWithMembers(groupName, ownerId, memberIds):
    groupId = createEmptyGroup(groupName, ownerId)
    if not addMembersToGroup(groupId, memberIds):
        return -1
    return groupId


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
        return False
    return insertMembersToGroup(groupId, memberIds)


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