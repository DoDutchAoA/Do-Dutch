cd ../database/server
coverage run tests.py
coverage xml --omit=/usr/* -o ../../tests/test-reports/coverage/coverage.xml
