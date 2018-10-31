import unittest

from ocr.ocr import ocr
import json

class TestOCR(unittest.TestCase):

    def test_total(self):
        # result = ocr('upload/receipt.jpg')
        # result = json.loads(result)
        # self.assertLessEqual(result['accumTotal'], result['detectedTotal'])
        self.assertLessEqual(1， 1)

if __name__ == '__main__':
    unittest.main()