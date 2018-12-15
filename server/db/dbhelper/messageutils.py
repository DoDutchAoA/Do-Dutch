import queries as q


def insertNewReceipt(sender, receiver, receiptId, data):
    if q.insertRecordTo(
        "MessageQueue", "(sender_id, receiver_id, event, receipt_id, data)",
        (sender, receiver, "new", receiptId, data), "(%s, %s, %s, %s, %s)",
    ):
        return True
    else:
        return False


def pollingMessage(receiver):
    if not receiver:
        return []
    result_list = q.selectInfoByConditions(
        "MessageQueue", "sender_id, receiver_id, event, receipt_id, data", "receiver_id = '%s'", (
            receiver
        ),
    )
    if result_list and result_list.__len__() > 0:
        q.deleteRecordByCondition("MessageQueue", "receiver_id = '%s'", receiver)
    return result_list
