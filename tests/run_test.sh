cd ../database/server
coverage run tests.py
coverage xml --omit=/usr/*
