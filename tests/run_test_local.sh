cd ../database/local

coverage run tests.py
coverage xml --omit=/usr/* -o ../../tests/test-reports/coverage/coverage.xml
coverage run test_functions.py
coverage xml --omit=/usr/* -o ../../tests/test-reports/coverage/coverage1.xml
