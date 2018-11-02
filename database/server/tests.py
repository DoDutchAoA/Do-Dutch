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


class TestDB(unittest.TestCase):

    def setUp(self):
        buildTestEnv()

    def tearDown(self):
        q.dropTestingDB()

    def test_sign_up_notexist(self):
        username = "Jason"
        userpwd = "12345"
        check = q.checkRecordExistByConditions(
            "Users", "user_name = '%s' AND "
            "user_pwd = '%s'", (username, userpwd),
        )
        self.assertFalse(check)  # No such user

        f.signUp(username, userpwd)

        check = q.checkRecordExistByConditions(
            "Users", "user_name = '%s' AND "
            "user_pwd = '%s'", (username, userpwd),
        )
        self.assertTrue(check)  # Exist now

    def test_sign_up_exist(self):
        username = "Jason"
        userpwd1 = "12345"
        userpwd2 = "123456"

        f.signUp(username, userpwd1)  # "Jason" inserted
        f.signUp(username, userpwd2)  # Same name but different pwds

        check = q.checkRecordExistByConditions(
            "Users", "user_name = '%s' AND user_pwd = '%s'",
            (username, userpwd2),
        )
        self.assertFalse(check)  # Still no exist now

    def test_login_exist(self):
        # Pre-cond
        username = "Jason"
        userpwd = "12345"
        f.signUp(username, userpwd)

        result_list = q.selectInfoByConditions(
            "Users", "user_id", "user_name = '%s' AND user_pwd = '%s'",
            (username, userpwd),
        )
        self.assertEqual(len(result_list), 1)  # Exist now

        u_id = f.login(username, userpwd)
        u_id_db = result_list[0]['user_id']
        self.assertEqual(u_id, u_id_db)

    def test_login_notexist(self):
        username = "Jason"
        userpwd = "12345"
        check = q.checkRecordExistByConditions(
            "Users", "user_name = '%s' AND user_pwd = '%s'",
            (username, userpwd),
        )
        self.assertFalse(check)  # No such user

        u_id = f.login(username, userpwd)

        # invalid u_id indicating no such user exist
        self.assertEqual(u_id, -1)

    def test_create_empty_group_exist(self):
        ownerId = f.signUp("Jason", "12345")
        groupName = "group1"

        g_id = f.createEmptyGroup(groupName, ownerId)  # create a new group

        check = q.checkRecordExistByConditions(
            "gGroups", "group_name = '%s'",
            groupName,
        )
        self.assertTrue(check)  # No such group exsit

        g_id = f.createEmptyGroup(groupName, ownerId)  # insert again
        result_list = q.selectAllByConditions(
            "gGroups",
            "group_name = '%s'", groupName,
        )

        self.assertEqual(g_id, -1)
        self.assertEqual(len(result_list), 1)  # Only one record exsit

    def test_create_empty_group_notexist(self):
        ownerId = f.signUp("Jason", "12345")
        groupName = "group1"
        check = q.checkRecordExistByConditions(
            "gGroups", "group_name = '%s'",
            groupName,
        )
        self.assertFalse(check)  # No such group exsit

        g_id = f.createEmptyGroup(groupName, ownerId)  # create a new group

        check = q.checkRecordExistByConditions(
            "gGroups",
            "group_name = '%s' AND owner_id = '%s'", (groupName, ownerId),
        )
        self.assertTrue(check)  # The group exsits now

        check = q.checkRecordExistByConditions(
            "GroupUsers",
            "group_id = '%s' AND member_id = '%s'", (g_id, ownerId),
        )
        self.assertTrue(check)  # Owner in this group now

    def test_create_group_with_members(self):
        # numOfGroups = q.getNumOfRecordByConditions("gGroups")
        self.assertEqual(q.getNumOfRecordByConditions("gGroups"), 0)
        # No exsiting group

        # Create group members
        memberIds = []
        ownerId = f.signUp("Amy", "1234")  # Amy is the group owner

        # Create member list
        memberIds.append(f.signUp("Bob", "1234"))
        memberIds.append(f.signUp("Candy", "1234"))
        groupName = "group1"
        # Groupname: "group1", ownerId = 1, memberIds = [2,3]

        groupId = f.createGroupWithMembers(groupName, ownerId, memberIds)

        # check if group exists now
        check = q.checkRecordExistByConditions(
            "gGroups",
            "group_name = '%s' AND owner_id = '%s'", (groupName, ownerId),
        )
        self.assertTrue(check)  # The group exsits now

        # For convenience, add the owner to the memberlist
        memberIds.append(ownerId)  # Member list
        result_list = q.selectInfoByConditions(
            "GroupUsers", "member_id",
            "group_id = '%s'", str(groupId),
        )
        self.assertEqual(len(result_list), len(memberIds))

        # All members in the tables from memberIds
        membersDB = u.getAllMemberIds(groupId)

        self.assertEqual(set(membersDB), set(memberIds))

    def test_remove_members_from_group(self):
        # No exsiting group
        self.assertEqual(q.getNumOfRecordByConditions("gGroups"), 0)
        # Create group members
        memberIds = []
        removedIds = []
        ownerId = f.signUp("Amy", "1234")  # Amy is the group owner
        member1 = f.signUp("Bob", "1234")  # Bob is gonna be removed
        member2 = f.signUp("Candy", "1234")

        # Create member list
        groupName = "group1"
        memberIds.append(member1)
        memberIds.append(member2)

        removedIds.append(member1)
        removedIds.append(member2)

        groupId = f.createGroupWithMembers(groupName, ownerId, memberIds)
        memberIds.append(ownerId)  # add owner to memberlist for comparison

        check = f.removeMembersFromGroup(groupId, removedIds)
        self.assertTrue(check)  # Removed successfully

        membersDB = u.getAllMemberIds(groupId)

        for i in range(len(removedIds)):
            # remove the removed Ids from member list
            memberIds.remove(removedIds[i])
        self.assertEqual(set(membersDB), set(memberIds))

    def test_delete_group(self):
        # No exsiting group
        self.assertEqual(q.getNumOfRecordByConditions("gGroups"), 0)
        # Create group members
        memberIds = []
        ownerId = f.signUp("Amy", "1234")  # Amy is the group owner
        member1 = f.signUp("Bob", "1234")  # Bob is gonna be removed
        member2 = f.signUp("Candy", "1234")

        # Create member list
        groupName = "group1"
        memberIds.append(member1)
        memberIds.append(member2)

        groupId = f.createGroupWithMembers(groupName, ownerId, memberIds)
        f.deleteGroup(groupId)

        self.assertEqual(
            q.getNumOfRecordByConditions(
                "gGroups",
            ), 0,
        )  # 0 group exists
        self.assertEqual(
            q.getNumOfRecordByConditions(
                "GroupUsers",
                "group_id = '%s'", groupId,
            ), 0,
        )  # No members in groupId group

    def test_create_order(self):
        ownerId = f.signUp("Owner", "12345")
        groupId = f.createEmptyGroup("Group", ownerId)

        orderName = "Order0"
        numOfItems = 5
        self.assertEqual(
            q.getNumOfRecordByConditions(
                "Orders",
            ), 0,
        )  # No exsiting group
        orderId = f.createOrder(groupId, orderName, numOfItems)

        result_list = q.selectAllByConditions("Orders")

        self.assertEqual(len(result_list), 1)
        self.assertEqual(result_list[0]['order_id'], 1)
        self.assertEqual(result_list[0]['group_id'], groupId)
        self.assertEqual(result_list[0]['order_name'], orderName)
        self.assertEqual(result_list[0]['item_unres_num'], numOfItems)

    def test_delete_order(self):
        ownerId = f.signUp("Owner", "12345")
        groupId = f.createEmptyGroup("Group", ownerId)
        orderName = "Order0"
        numOfItems = 5
        orderId = f.createOrder(groupId, orderName, numOfItems)

        f.deleteOrder(orderId)

        numOfRecord = q.getNumOfRecordByConditions(
            "Orders", "order_id = '%s'",
            str(orderId),
        )
        self.assertEqual(numOfRecord, 0)

    def test_create_receipt(self):
        # No exsiting receipt
        self.assertEqual(q.getNumOfRecordByConditions("OrderReceipts"), 0)

        groupId = f.createEmptyGroup("Group", f.signUp("Owner", "12345"))
        orderId = f.createOrder(groupId, "Order", 5)
        receiptIdx = 1
        f.createReceipt(orderId, "abc.jpg", receiptIdx)

        numOfRecords = q.getNumOfRecordByConditions(
            "OrderReceipts",
            " order_id = '%s' AND receipt_idx = '%s'", (orderId, receiptIdx),
        )
        self.assertEqual(numOfRecords, 1)

    def test_delete_receipt(self):
        # No exsiting receipt
        self.assertEqual(q.getNumOfRecordByConditions("OrderReceipts"), 0)
        groupId = f.createEmptyGroup("Group", f.signUp("Owner", "12345"))
        orderId = f.createOrder(groupId, "Order", 5)
        receiptIdx = 1

        f.createReceipt(orderId, "abc.jpg", receiptIdx)
        f.deleteReceipt(orderId, receiptIdx)

        numOfRecords = q.getNumOfRecordByConditions(
            "OrderReceipts",
            " order_id = '%s' AND receipt_idx = '%s'", (orderId, receiptIdx),
        )
        self.assertEqual(numOfRecords, 0)

    def test_create_item(self):
        # No exsiting receipt
        self.assertEqual(q.getNumOfRecordByConditions("Items"), 0)

        groupId = f.createEmptyGroup("Group", f.signUp("Owner", "12345"))
        orderId = f.createOrder(groupId, "Order", 5)

        itemName = "item1"
        leftAmount = 124.3

        itemId = f.createItem(itemName, leftAmount, orderId)

        numOfRecords = q.getNumOfRecordByConditions(
            "Items",
            " order_id = '%s' AND item_name = '%s' AND left_amount = '%s'",
            (orderId, itemName, leftAmount),
        )
        self.assertEqual(numOfRecords, 1)
        self.assertEqual(itemId, 1)

    def test_delete_item(self):
        groupId = f.createEmptyGroup("Group", f.signUp("Owner", "12345"))
        orderId = f.createOrder(groupId, "Order", 5)

        itemId = f.createItem("item1", 124.3, orderId)
        f.deleteItem(itemId)

        numOfRecords = q.getNumOfRecordByConditions(
            "Items",
            "item_id = '%s'", itemId,
        )
        self.assertEqual(numOfRecords, 0)

    def test_modify_item_name(self):
        groupId = f.createEmptyGroup("Group", f.signUp("Owner", "12345"))
        orderId = f.createOrder(groupId, "Order", 5)

        itemOldName = "itemOld"
        itemNewName = "itemNew"

        itemId = f.createItem(itemOldName, 124.3, orderId)
        check = f.modifyItemName(itemId, itemNewName)

        result_list = q.selectInfoByConditions(
            "Items", "item_name",
            "item_id = '%s'", itemId,
        )

        self.assertTrue(check)
        self.assertEqual(len(result_list), 1)
        self.assertEqual(result_list[0]['item_name'], itemNewName)

    def test_modify_item_amount(self):
        groupId = f.createEmptyGroup("Group", f.signUp("Owner", "12345"))
        orderId = f.createOrder(groupId, "Order", 5)

        itemPrevAmount = 124.3
        itemCurAmount_valid = 150
        itemCurAmount_small = -34
        itemCurAmount_Large = 1001

        itemId = f.createItem("itemOld", 124.3, orderId)
        check = f.modifyItemAmount(itemId, itemCurAmount_valid)

        result_list = q.selectInfoByConditions(
            "Items", "left_amount",
            "item_id = '%s'", itemId,
        )

        self.assertTrue(check)
        self.assertEqual(len(result_list), 1)
        self.assertEqual(result_list[0]['left_amount'], itemCurAmount_valid)

        f.modifyItemAmount(itemId, itemPrevAmount)  # reset

        # Too small
        check = f.modifyItemAmount(itemId, itemCurAmount_small)
        result_list = q.selectInfoByConditions(
            "Items", "left_amount",
            "item_id = '%s'", itemId,
        )
        self.assertFalse(check)
        self.assertEqual(len(result_list), 1)
        self.assertEqual(
            result_list[0]['left_amount'], itemPrevAmount,
        )  # remains

        # Too large
        check = f.modifyItemAmount(itemId, itemCurAmount_Large)
        result_list = q.selectInfoByConditions(
            "Items", "left_amount",
            "item_id = '%s'", itemId,
        )
        self.assertFalse(check)
        self.assertEqual(len(result_list), 1)
        self.assertEqual(
            result_list[0]['left_amount'], itemPrevAmount,
        )  # remains

    def test_create_allocation_valid(self):
        # No exsiting allocation
        self.assertEqual(
            q.getNumOfRecordByConditions(
                "Allocations",
            ), 0,
        )        #

        userId = f.signUp("Amy", "12345")
        groupId = f.createEmptyGroup("Group", f.signUp("Owner", "12345"))
        orderId = f.createOrder(groupId, "Order", 5)
        oriAmount = 124.3
        itemId = f.createItem("item", oriAmount, orderId)

        alloAmount = 110

        a_id = f.createAllocation(userId, itemId, alloAmount)

        result_list = q.selectInfoByConditions(
            "Items", "left_amount",
            "item_id = '%s'", itemId,
        )

        self.assertEqual(a_id, 1)
        self.assertEqual(len(result_list), 1)
        self.assertEqual(
            result_list[0]['left_amount'],
            round(oriAmount - alloAmount, 4),
        )

        numOfRecords = q.getNumOfRecordByConditions(
            "Allocations",
            "item_id = '%s' AND user_id = '%s'", (itemId, userId),
        )
        self.assertEqual(numOfRecords, 1)

    def test_create_allocation_invalid(self):
        # No exsiting allocation
        self.assertEqual(
            q.getNumOfRecordByConditions(
                "Allocations",
            ), 0,
        )        #

        userId = f.signUp("Amy", "12345")
        groupId = f.createEmptyGroup("Group", userId)
        orderId = f.createOrder(groupId, "Order", 5)
        oriAmount = 124.3
        itemId = f.createItem("item", oriAmount, orderId)

        alloAmount = 150

        a_id = f.createAllocation(userId, itemId, alloAmount)

        result_list = q.selectInfoByConditions(
            "Items", "left_amount",
            "item_id = '%s'", itemId,
        )

        self.assertEqual(a_id, -1)
        self.assertEqual(len(result_list), 1)
        self.assertEqual(result_list[0]['left_amount'], oriAmount)  # remains

        numOfRecords = q.getNumOfRecordByConditions(
            "Allocations",
            "item_id = '%s' AND user_id = '%s'", (itemId, userId),
        )
        self.assertEqual(numOfRecords, 0)

    def test_delete_allocation(self):
        userId = f.signUp("Amy", "12345")
        groupId = f.createEmptyGroup("Group", userId)
        orderId = f.createOrder(groupId, "Order", 5)
        oriAmount = 124.3
        itemId = f.createItem("item", 124.3, orderId)
        alloAmount = 110
        a_id = f.createAllocation(userId, itemId, alloAmount)
        check = f.deleteAllocation(a_id)

        self.assertTrue(check)
        self.assertEqual(
            q.getNumOfRecordByConditions(
                "Allocations",
                "allo_id = '%s'", a_id,
            ), 0,
        )

        self.assertEqual(
            q.selectInfoByConditions(
                "Items", "left_amount",
                "item_id = '%s'", itemId,
            )[0]['left_amount'], oriAmount,
        )

    def test_modify_allocation_valid(self):
        userId = f.signUp("Amy", "12345")
        groupId = f.createEmptyGroup("Group", userId)
        orderId = f.createOrder(groupId, "Order", 5)
        oriAmount = 124.3
        itemId = f.createItem("item", 124.3, orderId)
        prevAlloAmount = 110
        curAlloAmount = 120
        a_id = f.createAllocation(userId, itemId, prevAlloAmount)
        check = f.modifyAllocatedAmount(a_id, curAlloAmount)

        self.assertTrue(check)
        result = q.selectAllByConditions(
            "Allocations", "allo_id = '%s'",
            str(a_id),
        )[0]

        self.assertEqual(result['allo_amount'], curAlloAmount)
        self.assertEqual(
            q.selectInfoByConditions(
                "Items", "left_amount",
                "item_id = '%s'", result['item_id'],
            )[0]['left_amount'],
            round(oriAmount - curAlloAmount, 4),
        )

    def test_modify_allocation_invalid(self):
        userId = f.signUp("Amy", "12345")
        groupId = f.createEmptyGroup("Group", userId)
        orderId = f.createOrder(groupId, "Order", 5)
        oriAmount = 124.3
        itemId = f.createItem("item", 124.3, orderId)
        prevAlloAmount = 110
        curAlloAmount = 150
        a_id = f.createAllocation(userId, itemId, prevAlloAmount)
        check = f.modifyAllocatedAmount(a_id, curAlloAmount)

        self.assertFalse(check)
        result = q.selectAllByConditions(
            "Allocations", "allo_id = '%s'",
            str(a_id),
        )[0]

        self.assertEqual(result['allo_amount'], prevAlloAmount)
        self.assertEqual(
            q.selectInfoByConditions(
                "Items", "left_amount",
                "item_id = '%s'", result['item_id'],
            )[0]['left_amount'],
            round(oriAmount - prevAlloAmount, 4),
        )


if __name__ == '__main__':
    with open('test-reports/db_results.xml', 'wb') as output:
        unittest.main(
            testRunner=xmlrunner.XMLTestRunner(output=output),
            failfast=False, buffer=False, catchbreak=False,
        )
