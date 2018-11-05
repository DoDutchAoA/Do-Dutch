# W4156 Go Dutch

## First iteration

### 1. Progress overview

This Android application is developed in two languages where React (javascript) is used in the front-end development and Python is utilized for the server-end development. Until the deadline of the first iteration, we have done:

- Front-end:
  Sign-in, Login-in, photo uploading
- Server-end:
  Image preprocess, OCR analysis, database implementation

### 2. Pre-commit

Since two distinct languages are used, we have set up two pre-commit configuration files which contain language-specific pre-commit hooks. You can go to [this directory](https://github.com/DoDutchAoA/Do-Dutch/tree/master/first_iteration) to check them out. Because yaml file itself violates several hooks so it is not allowed to be committed. That’s why we exported them to pdf format to be able to bypass the restriction of pre-commit hook to upload.
Also, we have uploaded some screenshots to show how the pre-commit actually worked on our code. Sometimes it did detect a few problems with our code sometimes it did not.

### 3. Post-commit

In the first iteration, we did not deploy any test for the front-end part. Because in this stage, we focused on the simple GUI, and context switch to build a skeleton for our application and have not implemented the authentication yet. In that sense, same as our IA, we thought it is not very necessary to have tests on the front-end so far.

For the server-side, the CI server we chose is Jenkin because Travis does not support python 3 on macOS yet. Jenkin is a user-friendly CI server which provides the integration of Github. So, after a few installation steps in our terminal, the set-up is mostly done with their web GUI, so actually, we do not have many configuration files. Since testing OCR on the server leads to the break-down of server due to lack of RAM, so we only test our database. The screenshot of the report is [here](https://github.com/DoDutchAoA/Do-Dutch/blob/master/first_iteration/db_test_report.jpg) and the one with xml format is [here](https://github.com/DoDutchAoA/Do-Dutch/blob/master/database/server/test-reports/db_results.xml). Also, our test scripts reside in [here](https://github.com/DoDutchAoA/Do-Dutch/blob/master/database/server/tests.py).

### 4. Summary and future tasks

So, to briefly summarize, by the first demo day (Nov 8th), we should spend more efforts on the front-end development, coming with some minor teaks on our server-side development. Our goals are at least achieving those features tagged as basic in our revised proposal. Along with the development, we should do the tests at the same time. Jenkins also works for Javascript so we plan to use this CI server for the front-end as well.
