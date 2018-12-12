import unittest

import functions as f
import orderutils as o
import queries as q
import userutils as u
import xmlrunner
from connection import ConnectionWrapper

create_script = "create_tables.sql"


def buildTestEnv():
    q.dropTestingDB()
    q.createTestingDB()
    q.createTables(create_script)


class TestFunctions(unittest.TestCase):
    def setUp(self):
        buildTestEnv()

    def tearDown(self):
        q.dropTestingDB()

    def test_create_empty_group(self):
        ownerId = f.signUp("Jason", "12345")
        groupName = "unique group name"

        g_id = f.createEmptyGroup(groupName, ownerId)  # create a new group
        self.assertNotEqual(g_id, -1)

    def test_create_empty_group_exist_name(self):
        ownerId = f.signUp("Jason", "12345")
        groupName = "unique group name"

        g_id = f.createEmptyGroup(groupName, ownerId)
        g_id = f.createEmptyGroup(groupName, ownerId)
        self.assertEqual(g_id, -1)

    def test_create_empty_group_invalid_owner(self):
        ownerId = -1
        groupName = "unique group name"
        g_id = f.createEmptyGroup(groupName, ownerId)
        self.assertEqual(g_id, -1)

    def test_create_group_with_members(self):
        # Create group members
        memberIds = []
        ownerId = f.signUp("Amy", "1234")  # Amy is the group owner

        # Create member list
        memberIds.append(f.signUp("Bob", "1234"))
        memberIds.append(f.signUp("Candy", "1234"))
        groupName = "group1"

        groupId = f.createGroupWithMembers(groupName, ownerId, memberIds)
        self.assertNotEqual(groupId, -1)

    def test_create_group_with_members_zero_member(self):
        # Create group members
        memberIds = []
        ownerId = f.signUp("Amy", "1234")  # Amy is the group owner
        groupName = "group1"
        # Groupname: "group1", ownerId = 1, memberIds = []

        groupId = f.createGroupWithMembers(groupName, ownerId, memberIds)
        self.assertNotEqual(g_id, -1)

    def test_create_group_with_members_non_exist_member(self):
        # Create group members
        memberIds = []
        ownerId = f.signUp("Amy", "1234")  # Amy is the group owner

        # Create member list
        memberIds.append(f.signUp("Bob", "1234"))
        memberIds.append(f.signUp("Candy", "1234"))
        memberIds.append(-1)
        groupName = "group1"
        # Groupname: "group1", ownerId = 1, memberIds = [2,3, -1]

        groupId = f.createGroupWithMembers(groupName, ownerId, memberIds)
        self.assertEqual(groupId, -1)

    def test_delete_group_non_exist_group(self):
        # No exsiting group
        self.assertEqual(f.deleteGroup(-1), False)

    def test_search_friend(self):
        friendIdList = f.searchUserByUsername("testAddFriend", "12345")
        self.assertEqual(len(friendIdList), 0)

        f.signUp("testAddFriend", "12345")
        f.signUp("testAddFriend", "123")
        friendIdList = f.searchUserByUsername("testAddFriend", "12345")
        self.assertEqual(len(friendIdList), 2)

    def test_add_friend(self):
        ownerId = f.signUp("owner", "12345")
        friendId = f.signUp("friend", "12345")

        result = f.addFriend(ownerId, friendId)
        self.assertEqual(result["status"], True)

    def test_add_friend_non_exist_friend(self):
        ownerId = f.signUp("owner", "12345")
        friendId = -1

        result = f.addFriend(ownerId, friendId)
        self.assertEqual(result["status"], False)

    def test_remove_friend(self):
        ownerId = f.signUp("owner", "12345")
        friendId = f.signUp("friend", "12345")

        result = f.addFriend(ownerId, friendId)

        result = removeFriend(ownerId, friendId)
        self.assertEqual(result["status"], True)

    def test_remove_friend_not_friend(self):
        ownerId = f.signUp("owner", "12345")
        friendId = f.signUp("friend", "12345")

        result = removeFriend(ownerId, friendId)
        self.assertEqual(result["status"], False)

    def test_remove_friend_non_exist_user(self):
        ownerId = f.signUp("owner", "12345")
        friendId = -1

        result = removeFriend(ownerId, friendId)
        self.assertEqual(result["status"], False)


if __name__ == '__main__':
    with open('../../tests/test-reports/unittest/func_tests.xml', 'wb') as output:
        unittest.main(
            testRunner=xmlrunner.XMLTestRunner(output=output),
            failfast=False, buffer=False, catchbreak=False,
        )
