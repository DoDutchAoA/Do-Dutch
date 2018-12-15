
import json
import os
import re
import sys
from shutil import copyfile

from db.dbhelper import functions
from flask import flash
from flask import Flask
from flask import redirect
from flask import request
from flask import url_for
from ocr.ocr import ocr
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = './upload'
app.secret_key = "super secret key"
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])

preset = {"items": [{"category": "protein", "text": "chk bnls breast 6.74 f", "price": 6.74, "display": "Chicken"}, {"category": "grain", "text": "si chow mein 5pk 4.49", "price": 4.49, "display": "Noodles"}, {"category": "grain", "text": "pf sandwish buns 3.49", "price": 3.49, "display": "Burger"}, {"category": "protein", "text": "dairypure 1% milk 2.99", "price": 2.99, "display": "milk"}, {"category": "protein", "text": "bcd soon tofu md 2.49", "price": 2.49, "display": "Tofu"}, {"category": "protein", "text": "bcd soon tofu plai 2.49", "price": 2.49, "display": "Tofu"}, {"category": "vegetable", "text": "peeled garlic - 3.44", "price": 3.44, "display": "Garlic"}, {"category": "snack", "text": "breyers orec choco 5.99", "price": 5.99, "display": "Breyers Ice Cream"}, {"category": "protein", "text": "om turkey bologna 2.99", "price": 2.99, "display": "Turkey Meat"}, {"category": "vegetable", "text": "mushroom slice 2.20.", "price": 2.2, "display": "Mushroom"}, {"category": "fruit", "text": "mixed fruit slices 5.27 f", "price": 5.27, "display": "Fruit"}, {"category": "vegetable", "text": "big green onion 2,99 f", "price": 2.99, "display": "onion"}, {"category": "fruit", "text": ". mixed fruit slices \u00a9 5.31 f", "price": 5.31, "display": "Fruit"}, {"category": "snack", "text": "hor mixed nuts | 7.49 f", "price": 7.49, "display": "Nuts"}, {"category": "vegetable", "text": "green cabbage 3.90 f", "price": 3.9, "display": "Cabbage"}, {"category": "seasoning", "text": "otg gsh sesame oil 8.99 f", "price": 8.99, "display": "Oil"}, {"category": "seasoning", "text": "hot chili oil sauc 2.49 f", "price": 2.49, "display": "Oil"}, {"category": "seasoning", "text": "hot chili oil sauc 2.49 f", "price": 2.49, "display": "Hot Sauce"}], "accumTotal": 76.24000000000001, "detectedTotal": 114.58, "path": "http://52.12.74.177/upload/1image.png"}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


def trimUser(_str):
    _str = re.sub(r'[^a-zA-Z0-9@_.]', '', _str)
    return _str[0:30]


def trimGroup(_str):
    _str = re.sub(r'[^a-zA-Z0-9]', '', _str)
    return _str[0:16]


def trimItem(_str):
    _str = re.sub(r'[^a-zA-Z0-9_]', '', _str)
    return _str[0:30]


@app.route("/upload", methods=['POST', 'GET'])
def server():
    if request.method == 'POST' or request.method == 'GET':
        if request.files.__len__() == 0:
            flash('No file part')
            return redirect(request.url)
        file = request.files['image']
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(path)
            copyPath = os.path.join('../../www/upload', filename)
            copyfile(path, copyPath)
	    # if file.filename == '1image.png':
            return json.dumps(preset)
            #response = ocr(
            #    path, os.path.join(
            #        'http://52.12.74.177/upload', filename,
            #    ),
            #)
            #print(type(response))
            #return response
    return 'error'


@app.route("/updateUserReceipts", methods=['POST', 'GET'])
def updateUserReceipt():
    if request.method == 'POST':
        user_id = request.json.get('user_id')
        info = request.json.get('info')
        result = functions.updateUserReceipts(user_id, info)
        return str(result)


@app.route("/getUserReceipts", methods=['POST', 'GET'])
def getUserReceipts():
    if request.method == 'POST':
        user_id = request.json.get('user_id')
        result = functions.getUserReceipts(user_id)
        return json.dumps(result)


@app.route("/signUp", methods=['POST', 'GET'])
def signUp():
    if request.method == 'POST':
        _username = request.json.get('username')
        _userpwd = request.json.get('userpwd')
        _username = _username[0:16]
        _userpwd = _userpwd[0:16]
        username = re.sub(r'[^a-zA-Z0-9@_]', '', _username)
        userpwd = re.sub(r'[^a-zA-Z0-9@_]', '', _userpwd)
        result = functions.signUp(username, userpwd)
        return str(result)


@app.route("/login", methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        _username = request.json.get('username')
        _userpwd = request.json.get('userpwd')
        _username = _username[0:16]
        _userpwd = _userpwd[0:16]
        username = re.sub(r'[^a-zA-Z0-9@_]', '', _username)
        userpwd = re.sub(r'[^a-zA-Z0-9@_]', '', _userpwd)
        result = functions.login(username, userpwd)
        return str(result)


@app.route("/createEmptyGroup", methods=['POST', 'GET'])
def createEmptyGroup():
    if request.method == 'POST':
        groupNm = request.json.get('groupName')
        groupNm = trimGroup(groupNm) 
        result = functions.createEmptyGroup(
            groupNm, request.json.get('ownerId'),
        )
        return str(result)


@app.route("/addMembersToGroup", methods=['POST', 'GET'])
def addMembersToGroup():
    if request.method == 'POST':
        result = functions.addMembersToGroup(
            request.json.get('groupId'), request.json.get('memberIds'),
        )
        return str(result)


@app.route("/createGroupWithMembers", methods=['POST', 'GET'])
def createGroupWithMembers():
    if request.method == 'POST':
        groupNm = request.json.get('groupName')
        groupNm = trimGroup(groupNm) 
        result = functions.createGroupWithMembers(
            groupNm, request.json.get('ownerId'), request.json.get('memberIds'),
        )
        return str(result)


@app.route("/removeGroup", methods=['POST', 'GET'])
def removeGroup():
    if request.method == 'POST':
        result = functions.deleteGroup(request.json.get('groupId'))
        return json.dumps(result)


@app.route("/removeMemberFromGroup", methods=['POST', 'GET'])
def removeMemberFromGroup():
    if request.method == 'POST':
        result = functions.removeMemberFromGroup(
            request.json.get('groupId'), request.json.get('memberId'),
        )
        return str(result)


@app.route("/createOrder", methods=['POST', 'GET'])
def createOrder():
    if request.method == 'POST':
        result = functions.createOrder(
            request.json.get(
                'orderName',
            ), request.json.get('totalItems'),
        )
        return str(result)


@app.route("/deleteOrder", methods=['POST', 'GET'])
def deleteOrder():
    if request.method == 'POST':
        functions.deleteOrder(
            request.json.get(
                'username',
            ), request.json.get('pwd'),
        )


@app.route("/orderExists", methods=['POST', 'GET'])
def orderExists():
    if request.method == 'POST':
        result = functions.orderExists(
            request.json.get('username'), request.json.get('pwd'),
        )
        return str(result)


@app.route("/insertRecieptInfo", methods=['POST', 'GET'])
def insertRecieptInfo():
    if request.method == 'POST':
        result = functions.insertRecieptInfo(
            request.json.get('orderId'), request.json.get(
                'groupId',
            ), request.json.get('receiptPath'), request.json.get('receiptIdx'),
        )
        return str(result)


@app.route("/addItemToOrder", methods=['POST', 'GET'])
def addItemToOrder():
    if request.method == 'POST':
        result = functions.addItemToOrder(
            request.json.get(
                'itemName',
            ), request.json.get('orderId'), request.json.get('itemAmount'),
        )


@app.route("/modifyItemName", methods=['POST', 'GET'])
def modifyItemName():
    if request.method == 'POST':
        itemNm = request.json.get('itemName')
        itemNm = trimItem(itemNm)
        result = functions.modifyItemName(
            request.json.get('itemId'), itemNm,
        )
        return str(result)


@app.route("/modifyItemTotalAmount", methods=['POST', 'GET'])
def modifyItemTotalAmount():
    if request.method == 'POST':
        functions.modifyItemTotalAmount(
            request.json.get(
                'itemId',
            ), request.json.get('totalAmount'),
        )


@app.route("/validAllocation", methods=['POST', 'GET'])
def validAllocation():
    if request.method == 'POST':
        result = functions.validAllocation(
            request.json.get('itemId'), request.json.get('amount'),
        )
        return str(result)


@app.route("/createAllocation", methods=['POST', 'GET'])
def createAllocation():
    if request.method == 'POST':
        result = functions.createAllocation(
            request.json.get(
                'userId',
            ), request.json.get('itemId'), request.json.get('amount'),
        )
        return str(result)


@app.route("/modifyAllocation", methods=['POST', 'GET'])
def modifyAllocation():
    if request.method == 'POST':
        result = functions.signUp(
            request.json.get(
                'allId',
            ), request.json.get('updatedAmount'),
        )
        return str(result)


@app.route("/getUserIdByUsername", methods=['POST', 'GET'])
def getUserIdByUsername():
    if request.method == 'POST':
        result = functions.getUserIdByUsername(request.json.get('username'))
        return str(result)


@app.route("/deleteUserByUsername", methods=['POST', 'GET'])
def deleteUserByUsername():
    if request.method == 'POST':
        result = functions.deleteUserByUsername(request.json.get('username'))
        return str(result)


@app.route("/searchUserByUsername", methods=['POST', 'GET'])
def searchUserByUsername():
    if request.method == 'POST':
        result = functions.searchUserByUsername(request.json.get('keyword'))
        return json.dumps(result)


@app.route("/addFriend", methods=['POST', 'GET'])
def addFriend():
    if request.method == 'POST':
        result = functions.addFriend(
            request.json.get(
                'first_id',
            ), request.json.get('second_id'),
        )
        return json.dumps(result)


@app.route("/removeFriend", methods=['POST', 'GET'])
def removeFriend():
    if request.method == 'POST':
        result = functions.removeFriend(
            request.json.get(
                'first_id',
            ), request.json.get('second_id'),
        )
        return json.dumps(result)


@app.route("/getAllFriends", methods=['POST', 'GET'])
def getAllFriends():
    if request.method == 'POST':
        result = functions.getAllFriends(request.json.get('user_id'))
        return json.dumps(result)


@app.route("/getAllGroups", methods=['POST', 'GET'])
def getAllGroups():
    if request.method == 'POST':
        result = functions.getAllGroups(request.json.get('user_id'))
        return json.dumps(result)


@app.route("/getAllMembersByGroupId", methods=['POST', 'GET'])
def getAllMembersByGroupId():
    if request.method == 'POST':
        result = functions.getAllMembersByGroupId(request.json.get('group_id'))
        return json.dumps(result)


@app.route("/newReceipt", methods=['POST', 'GET'])
def newReceipt():
    if request.method == 'POST':
        result = functions.insertNewReceipt(
            request.json.get('sender'), request.json.get(
                'receiver',
            ), request.json.get('receiptId'), request.json.get('data'),
        )
        return json.dumps(result)


@app.route("/pollingReceipt", methods=['POST', 'GET'])
def pollingReceipt():
    if request.method == 'POST':
        result = functions.pollingMessage(request.json.get('receiver'))
        return json.dumps(result)


@app.route("/addGroupChat", methods=['POST', 'GET'])
def addGroupChat():
    if request.method == 'POST':
        result = functions.addGroupChat(request.json.get('group_id'), request.json.get('user_id'), request.json.get('user_name'), request.json.get('text'))
        return json.dumps(result)


@app.route("/getGroupChats", methods=['POST', 'GET'])
def getGroupChats():
    if request.method == 'POST':
        result = functions.getGroupChats(request.json.get('group_id'))
        return json.dumps(result)


if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0')
