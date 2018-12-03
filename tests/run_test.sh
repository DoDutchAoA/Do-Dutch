# run db test
cd ../database/server
coverage run tests.py
coverage xml --omit=/usr/* -o ../../tests/test-reports/coverage/coverage.xml

# run react test
#cd ../../do_dutch/
#npm install
#react-native link
#npm run test
