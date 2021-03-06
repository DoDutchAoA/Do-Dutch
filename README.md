# Go Dutch Version 1.1

## Introduction

Go Dutch is an Android application built on React Native. It can set you free from the tedious and error-prone experience of working out the money flow in a shared bill! A digital receipt which contains detailed information of a purchase will be generated after a purchase payer (receipt owner) scan their receipt. Payers can share this digital receipt with a specific group, and all members of this group become the sharers of this receipt. Depending on you are a purchase payer or receipt sharer, this application can help you to calculate how much you should receive and pay. Also, this application can keep track of payments for each receipt by showing the number of sharers who have confirmed their payments. Once sharers complete their payment to payers offline, sharers can confirm their payment on our app. A receipt is marked as completed once all sharers have confirmed their payment. That makes our application becomes a good tool to keep accounts!

This is the first "release" of our application. More features are coming on their ways!

## User Interface

### User-related

User sign up, log in and log out
<p float="left">

<img src="https://github.com/DoDutchAoA/Dutch_src/blob/master/photo/signup_t.png" alt="Login" width="280" height="470" />
<img src="https://github.com/DoDutchAoA/Dutch_src/blob/master/photo/login_t.png" alt="Signup" width="280" height="470"/>
<img src="https://github.com/DoDutchAoA/Dutch_src/blob/master/photo/logout_t.png" alt="Logout" width="280" height="470"/>
</p>

Friend and Group:
<p float="left">

<img src="https://github.com/DoDutchAoA/Dutch_src/blob/master/photo/friend_t.png" alt="Friend" width="280" height="470" />
<img src="https://github.com/DoDutchAoA/Dutch_src/blob/master/photo/groupdetail_t.png" alt="Group information" width="280" height="470" />
<img src="https://github.com/DoDutchAoA/Dutch_src/blob/master/photo/groupchat_t.png" alt="Group Chat" width="280" height="470"/>
</p>



### Receipt-related

Receipt History

<p float="left">

<img src="https://github.com/DoDutchAoA/Dutch_src/blob/master/photo/History1.png" alt="history1" width="280" height="470" />
<img src="https://github.com/DoDutchAoA/Dutch_src/blob/master/photo/History2.png" alt="history1" width="280" height="470"/>
</p>

Receipt Modal
<p float="left">
<img src="https://github.com/DoDutchAoA/Dutch_src/blob/master/photo/ReceiptModal1.png" alt="modal1" width="280" height="470"/>
<img src="https://github.com/DoDutchAoA/Dutch_src/blob/master/photo/ReceiptModal2.png" alt="modal2" width="280" height="470"/>
<img src="https://github.com/DoDutchAoA/Dutch_src/blob/master/photo/ReceiptModal3.png" alt="modal2" width="280" height="470"/>
</p>

## Getting Started

### Prerequisites

Making sure you have [React Native CLI](https://facebook.github.io/react-native/docs/getting-started), [SDK 8.1 (Oreo)](https://facebook.github.io/react-native/docs/getting-started), [npm](https://www.npmjs.com) equipped to run our application.


### Installation

First clone our repository:

```
git clone https://github.com/DoDutchAoA/Do-Dutch.git
```

Install all dependencies:
```
npm install
```

Establish links to all dependencies:
```
react-native link
```

### Running

By simply running
Establish links to all dependencies:
```
react-native run-android
```

## Tests

### Unit Tests

We utilized Jest and Enzyme to test this application, and unittest to test our back-end database. All test script resides in [here]([here](https://github.com/DoDutchAoA/Do-Dutch/tree/jenkins/do_dutch/__test__)) and [here](https://github.com/DoDutchAoA/Do-Dutch/blob/jenkins/database/server/tests.py). To run test scripts for the front-end, you can  run

```
npm test
```

Since you have no access to our database, you may not be able to run those tests for our back-end. But you can navigate to [here](https://github.com/DoDutchAoA/Do-Dutch/tree/jenkins/tests/test-reports/coverage) and [here]((https://github.com/DoDutchAoA/Do-Dutch/tree/jenkins/tests/test-reports/unittest)) to check out all test reports. Below is a coverage report generated when tests are ran locally.

![alt text](https://github.com/DoDutchAoA/Do-Dutch/blob/jenkins/coverage_local.png)



## CI server (Jenkins)

We successfully deployed tests to test our database code (implemented in Python) but failed to deploy our test for the mobile part (tested by Jest and Enzyme) on our CI server due to some reasons. Firstly, our server, an EC2 instance running under the Amazon free trial, only has less than 8GB disk space and limited RAM space. Currently, without installing any dependency to run tests for our mobile app, there is only nearly 2GB left. We are afraid that installing all dependency (including OpenSSL, nodejs, npm, react-cli, jest, enzyme and so on) would leave no room for our server to process requests from the front-end. Also, to run tests successfully requires some manual configurations, which we have not figured out how to achieve them by running a script on our CI server.

Even though we did not have our CI server configured, we still got the coverage report successfully shown on our CI server. The reason for that reports which can be read by the CI server is not necessarily generated by tests running on the CI server. So it reads reports we generated locally and pushed to the git repository. The report is shown below.

![alt text](https://github.com/DoDutchAoA/Do-Dutch/blob/jenkins/coverage.png)

The reasons why the coverage rate is not so high is we did not cover all of UI rendering tests and some tests which will interact with our server directly.

## Miscellaneous

Static analysis reports
  - For Python code: https://github.com/DoDutchAoA/Do-Dutch/tree/jenkins/first_iteration
  - For React code: https://github.com/DoDutchAoA/Do-Dutch/tree/jenkins/static_analysis

## Future work

Currently our application can be able to handle relatively simple logic. We will keep on developing more features to make "Go Dutch" more powerful!
