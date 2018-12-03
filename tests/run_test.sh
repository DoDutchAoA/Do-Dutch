# run db test
cd ../database/server
#python tests.py
coverage run tests.py
coverage xml --omit=/usr/* -o ../../tests/test-reports/coverage/coverage.xml
coverage run test_functions.py
coverage xml --omit=/usr/* -o ../../tests/test-reports/coverage/coverage1.xml

# run react test
#cd ../../do_dutch/
#npm install
#react-native link
#npm run test
