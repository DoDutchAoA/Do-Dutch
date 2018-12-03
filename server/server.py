import os, sys, json, re
from ocr.ocr import ocr
from flask import Flask, flash, request, redirect, url_for
from werkzeug.utils import secure_filename
from db.dbhelper import functions

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = './upload'
app.secret_key = "super secret key"
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

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
            return ocr(path)
    return 'error'

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
        result = functions.createEmptyGroup(request.json.get('groupName'), request.json.get('ownerId'))
        return str(result)

@app.route("/addMembersToGroup", methods=['POST', 'GET'])
def addMembersToGroup():
    if request.method == 'POST':
        result = functions.addMembersToGroup(request.json.get('groupId'), request.json.get('memberIds'))
        return str(result)

@app.route("/createGroupWithMembers", methods=['POST', 'GET'])
def createGroupWithMembers():
    if request.method == 'POST':
        result = functions.createGroupWithMembers(request.json.get('groupName'), request.json.get('ownerId'), request.json.get('memberIds'))
        return str(result)

@app.route("/removeGroup", methods=['POST', 'GET'])
def removeGroup():
    if request.method == 'POST':
        result = functions.deleteGroup(request.json.get('groupId'))
        return json.dumps(result)

@app.route("/removeMemberFromGroup", methods=['POST', 'GET'])
def removeMemberFromGroup():
    if request.method == 'POST':
        result = functions.removeMemberFromGroup(request.json.get('groupId'), request.json.get('memberId'))
        return str(result)

@app.route("/createOrder", methods=['POST', 'GET'])
def createOrder():
    if request.method == 'POST':
        result = functions.createOrder(request.json.get('orderName'), request.json.get('totalItems'))
        return str(result)

@app.route("/deleteOrder", methods=['POST', 'GET'])
def deleteOrder():
    if request.method == 'POST':
        functions.deleteOrder(request.json.get('username'), request.json.get('pwd'))

@app.route("/orderExists", methods=['POST', 'GET'])
def orderExists():
    if request.method == 'POST':
        result = functions.orderExists(request.json.get('username'), request.json.get('pwd'))
        return str(result)

@app.route("/insertRecieptInfo", methods=['POST', 'GET'])
def insertRecieptInfo():
    if request.method == 'POST':
        result = functions.insertRecieptInfo(request.json.get('orderId'), request.json.get('groupId'), request.json.get('receiptPath'), request.json.get('receiptIdx'))
        return str(result)

@app.route("/addItemToOrder", methods=['POST', 'GET'])
def addItemToOrder():
    if request.method == 'POST':
        result = functions.addItemToOrder(request.json.get('itemName'), request.json.get('orderId'), request.json.get('itemAmount'))

@app.route("/modifyItemName", methods=['POST', 'GET'])
def modifyItemName():
    if request.method == 'POST':
        result = functions.modifyItemName(request.json.get('itemId'), request.json.get('itemName'))
        return str(result)

@app.route("/modifyItemTotalAmount", methods=['POST', 'GET'])
def modifyItemTotalAmount():
    if request.method == 'POST':
        functions.modifyItemTotalAmount(request.json.get('itemId'), request.json.get('totalAmount'))

@app.route("/validAllocation", methods=['POST', 'GET'])
def validAllocation():
    if request.method == 'POST':
        result = functions.validAllocation(request.json.get('itemId'), request.json.get('amount'))
        return str(result)

@app.route("/createAllocation", methods=['POST', 'GET'])
def createAllocation():
    if request.method == 'POST':
        result = functions.createAllocation(request.json.get('userId'), request.json.get('itemId'), request.json.get('amount'))
        return str(result)

@app.route("/modifyAllocation", methods=['POST', 'GET'])
def modifyAllocation():
    if request.method == 'POST':
        result = functions.signUp(request.json.get('allId'), request.json.get('updatedAmount'))
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
        result = functions.addFriend(request.json.get('first_id'), request.json.get('second_id'))
        return json.dumps(result)

@app.route("/removeFriend", methods=['POST', 'GET'])
def removeFriend():
    if request.method == 'POST':
        result = functions.removeFriend(request.json.get('first_id'), request.json.get('second_id'))
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

if __name__ == '__main__':
    app.debug = True
    app.run(host= '0.0.0.0')

