cd ../database/server
coverage run tests.py
ls
coverage xml --omit=/usr/* -o ../../tests/test-reports/coverage/coverage.xml
