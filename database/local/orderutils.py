import data
import queries as q


def orderExists(orderId):
    return q.checkRecordExistByConditions("Orders", "order_id = '%s'", orderId)


def itemExists(itemId):
    return q.checkRecordExistByConditions("Items", "item_id = '%s'", itemId)


def allocationExists(alloId):
    return q.checkRecordExistByConditions("Allocations", "allo_id = '%s'", alloId)


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
