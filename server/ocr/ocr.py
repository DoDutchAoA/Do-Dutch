from preprocess import process
from PIL import Image
import pytesseract
import argparse
import cv2
import os, sys
import imutils
import re
import json

from flask import Flask, flash, request, redirect, url_for
from werkzeug.utils import secure_filename

def textAnalysis(text):
    rules = []
    titles = []
    with open(sys.path[0] + '/ocr/rules.csv', 'r') as rulesFile:
        for index, line in enumerate(rulesFile):
            line = line.strip('\n')
            line = line.split(',')
            if index == 0:
                titles = line
                continue
            template = {}
            for i, col in enumerate(line):
                template[titles[i]] = col
            rules.append(template)
    result = {'detectedTotal': 0, 'accumTotal': 0, 'items': []}
    text = text.split('\n')
    for line in text:
        line = line.lower()
        for rule in rules:
            for ruleItem in rule['rule'].split('|'):
                if ruleItem in line:
                    price = re.findall(r'\d+.\d\d', line)
                    if (price.__len__() == 0):
                        continue
                    price = float(price[0].replace(',', '.'))
                    template = {}
                    template['price'] = price
                    template['text'] = line
                    template['display'] = rule['display']
                    template['category'] = rule['category']

                    if (rule['category'] == 'balance'):
                        result['detectedTotal'] = price
                    else:
                        result['accumTotal'] += price
                        result['items'].append(template)
                        break
    return result
                
def ocr(inPath):
    outPath = 'ocr/output/receipt.jpg'
    pdfPath = 'ocr/output/output.pdf'

    process.transform(inPath, outPath)
    # load the example image and convert it to grayscale
    img = cv2.imread(outPath)
    
    # write the grayscale image to disk as a temporary file so we can
    # apply OCR to it
    # psm 4: Assume a single column of text of variable sizes.
    text = pytesseract.image_to_string(img, lang='eng', config='--psm 4 --oem 1')
    # os.remove(filename)
    # print(text)
    result = textAnalysis(text)
    # Generate a PDF
    pdf = pytesseract.image_to_pdf_or_hocr(img, extension='pdf')
    try:
        f = open(pdfPath, 'w')
    	f.write(pdf)
    	f.close()
    except IOError, e:
	print 'IOError: ', e
    # with open(pdfPath, 'w') as f:
    #     f.write(pdf)
    # show the output images
    # cv2.imshow("Image", imutils.resize(img, height = 650))
    # cv2.waitKey(0)
    return json.dumps(result)

def main():
    ocr('upload/receipt.jpg')

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
        print request.files
        file = request.files['image']
        print file.filename
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(path)
            return ocr(path)
    return 'error'

if __name__ == '__main__':
    app.debug = True
    app.run(host= '0.0.0.0')
    # if sys.argv.__len__() < 4:
	   # print 'Please input the image path!'
    # else:
	   # print ocr(sys.argv[1], sys.argv[2], sys.argv[3])
