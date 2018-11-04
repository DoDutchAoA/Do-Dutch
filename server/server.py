import os, sys
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
        result = functions.signUp(request.args.get('username'), request.args.get('userpwd'))
        return str(result)

@app.route("/login", methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        result = functions.login(request.args.get('username'), request.args.get('userpwd'))
        return str(result)

@app.route("/createEmptyGroup", methods=['POST', 'GET'])
def createEmptyGroup():
    if request.method == 'POST':
        result = functions.createEmptyGroup(request.args.get('groupName'), request.args.get('ownerId'))
        return str(result)

@app.route("/addMembersToGroup", methods=['POST', 'GET'])
def addMembersToGroup():
    if request.method == 'POST':
        result = functions.addMembersToGroup(request.args.get('groupId'), request.args.get('memberIds'))
        return str(result)

@app.route("/createGroupWithMembers", methods=['POST', 'GET'])
def createGroupWithMembers():
    if request.method == 'POST':
        result = functions.createGroupWithMembers(request.args.get('groupName'), request.args.get('ownerId'), request.args.get('memberIds'))
        return str(result)

@app.route("/removeMemberFromGroup", methods=['POST', 'GET'])
def removeMemberFromGroup():
    if request.method == 'POST':
        result = functions.removeMemberFromGroup(request.args.get('groupId'), request.args.get('memberId'))
        return str(result)

@app.route("/createOrder", methods=['POST', 'GET'])
def createOrder():
    if request.method == 'POST':
        result = functions.createOrder(request.args.get('orderName'), request.args.get('totalItems'))
        return str(result)

@app.route("/deleteOrder", methods=['POST', 'GET'])
def deleteOrder():
    if request.method == 'POST':
        functions.deleteOrder(request.args.get('username'), request.args.get('pwd'))

@app.route("/orderExists", methods=['POST', 'GET'])
def orderExists():
    if request.method == 'POST':
        result = functions.orderExists(request.args.get('username'), request.args.get('pwd'))
        return str(result)

@app.route("/insertRecieptInfo", methods=['POST', 'GET'])
def insertRecieptInfo():
    if request.method == 'POST':
        result = functions.insertRecieptInfo(request.args.get('orderId'), request.args.get('groupId'), request.args.get('receiptPath'), request.args.get('receiptIdx'))
        return str(result)

@app.route("/addItemToOrder", methods=['POST', 'GET'])
def addItemToOrder():
    if request.method == 'POST':
        result = functions.addItemToOrder(request.args.get('itemName'), request.args.get('orderId'), request.args.get('itemAmount'))

@app.route("/modifyItemName", methods=['POST', 'GET'])
def modifyItemName():
    if request.method == 'POST':
        result = functions.modifyItemName(request.args.get('itemId'), request.args.get('itemName'))
        return str(result)

@app.route("/modifyItemTotalAmount", methods=['POST', 'GET'])
def modifyItemTotalAmount():
    if request.method == 'POST':
        functions.modifyItemTotalAmount(request.args.get('itemId'), request.args.get('totalAmount'))

@app.route("/validAllocation", methods=['POST', 'GET'])
def validAllocation():
    if request.method == 'POST':
        result = functions.validAllocation(request.args.get('itemId'), request.args.get('amount'))
        return str(result)

@app.route("/createAllocation", methods=['POST', 'GET'])
def createAllocation():
    if request.method == 'POST':
        result = functions.createAllocation(request.args.get('userId'), request.args.get('itemId'), request.args.get('amount'))
        return str(result)

@app.route("/modifyAllocation", methods=['POST', 'GET'])
def modifyAllocation():
    if request.method == 'POST':
        result = functions.signUp(request.args.get('allId'), request.args.get('updatedAmount'))
        return str(result)

@app.route("/getUserIdByUsername", methods=['POST', 'GET'])
def getUserIdByUsername():
    if request.method == 'POST':
        result = functions.getUserIdByUsername(request.args.get('username'))
        return str(result)

@app.route("/deleteUserByUsername", methods=['POST', 'GET'])
def deleteUserByUsername():
    if request.method == 'POST':
        result = functions.deleteUserByUsername(request.args.get('username'))
        return str(result)

if __name__ == '__main__':
    app.debug = True
    app.run(host= '0.0.0.0')
