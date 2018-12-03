import queries as q


def insertNewReceipt(sender, receiver, receiptId, data):
    if q.insertRecordTo(
        "MessageQueue", "(sender, receiver, event, receipt_id, data)",
        (sender, receiver, "new", receiptId, data), "(%s, %s, %s, %s, %s)",
    ):
        return True
    else:
        return False


def pollingMessage(receiver):
    result_list = q.selectInfoByConditions(
        "MessageQueue", "sender, receiver, event, receipt_id, data", "receiver = '%s'", (
            receiver
        ),
    )
    q.deleteRecordByCondition("MessageQueue", "receiver = '%s'", receiver)
    return result_list
