from transform import four_point_transform as tf
import numpy as np
import argparse
import cv2
from skimage.filters import threshold_local
import imutils
import os, sys

def transform(imagePath, outPath):
	# load the image and compute the ratio of the old height
	# to the new height, clone it, and resize it
	image = cv2.imread(imagePath)
	ratio = image.shape[0] / 500.0
	orig = image.copy()
	image = imutils.resize(image, height = 500)
	
	# convert the image to grayscale, blur it, and find edges
	# in the image
	gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
	gray = cv2.GaussianBlur(gray, (5, 5), 0)
	edged = cv2.Canny(gray, 75, 200)
	
	# show the original image and the edge detected image
	# print("STEP 1: Edge Detection")
	# cv2.imshow("Image", image)
	# cv2.imshow("Edged", edged)
	# cv2.waitKey(0)
	# cv2.destroyAllWindows()

	# find the contours in the edged image, keeping only the
	# largest ones, and initialize the screen contour
	cnts = cv2.findContours(edged.copy(), cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
	cnts = cnts[0] if imutils.is_cv2() else cnts[1]
	cnts = sorted(cnts, key = cv2.contourArea, reverse = True)[:5]
	
	# loop over the contours
	for c in cnts:
		# approximate the contour
		peri = cv2.arcLength(c, True)
		approx = cv2.approxPolyDP(c, 0.02 * peri, True)
	
		# if our approximated contour has four points, then we
		# can assume that we have found our screen
		if len(approx) == 4:
			screenCnt = approx
			break
	
	# show the contour (outline) of the piece of paper
	# print("STEP 2: Find contours of paper")
	cv2.drawContours(image, [screenCnt], -1, (0, 255, 0), 2)
	# cv2.imshow("Outline", image)
	# cv2.waitKey(0)
	# cv2.destroyAllWindows()


	# apply the four point transform to obtain a top-down
	# view of the original image
	warped = tf(orig, screenCnt.reshape(4, 2) * ratio)
	
	# convert the warped image to grayscale, then threshold it
	# to give it that 'black and white' paper effect
	warped = cv2.cvtColor(warped, cv2.COLOR_BGR2GRAY)
	# T = threshold_local(warped, 11, offset = 10, method = "gaussian")
	# warped = (warped > T).astype("uint8") * 255
	
	# show the original and scanned images
	# print("STEP 3: Apply perspective transform")
	# cv2.imshow("Original", imutils.resize(orig, height = 650))
	# cv2.imshow("Scanned", imutils.resize(warped, height = 650))
	# cv2.waitKey(0)
	cv2.imwrite(outPath, warped)

	# print("STEP 4: Clean the text")
	os.system(sys.path[0] + '/ocr/scripts/textcleaner -g -e stretch -f 15 -o 4 -t 30 -u -a 1 -T -p 10 ' + outPath + ' ' + outPath)
	# ./Scripts/textdeskew output/receipt3.jpg output/receipt3.jpg

def main(imagePath):
	transform(imagePath)

if __name__ == '__main__':
	# construct the argument parser and parse the arguments
	ap = argparse.ArgumentParser()
	ap.add_argument("-i", "--image", required = True,
		help = "Path to the image to be scanned")
	args = vars(ap.parse_args())
	main(args["image"])
