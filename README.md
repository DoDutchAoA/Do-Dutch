# W4156 Go Dutch

## Second iteration

### 1. Progress overview

After the first iteration, tasks were classified into the users-related part and the receipt-related part and assigned to Qianrui and Yushi, Zhihao and Qian respectively. The progress for both parts are listed below:

- User-related part:
  1. Implemented tab navigator to navigate between home page, friend and group and signing in and signing up.
  2. Implemented searching friend function and adding friend function.
  3. Implemented creating group and modifying group function.
  4. Considered valid and invalid partition and boundary condition, and created corresponding tests.

- Receipt-related part:
  1. We drastically improved the interface of the receipt page, which is now able to display the history receipts ordered by timestamps, and allows the user to edit and delete the history receipts.
  2. The functionality of adding new receipts works smoothly as before. Now a floating button is designed as the new entry of this function rather than navigating to a new page.
  3. A new overlaying modal is implemented to let users edit the detailed information of the items.
  4. Notifications and updates will be sent to all related users in real-time after critical operations related to the receipts.

### 2. Coverage report

We deployed coverage.py, a code coverage tool serves to Python program, to analyze the code coverage of our database test script. The report can be accessed by this [link](https://github.com/DoDutchAoA/Do-Dutch/blob/jenkins/tests/test-reports/coverage.xml) and this [one](https://github.com/DoDutchAoA/Do-Dutch/tree/jenkins/do_dutch/__test__).

### 3. Future work

By the demo day for the second iteration, the receipt team is expected to complete the development of all user stories related to the receipt. If time allows, the progress of corresponding tests should be caught up. In the demo for the second iteration, functions mentioned in all user stories should work both individually and integrally. After that, the main tasks for us would be the user testing, maintenance, and UI polishing, if time allows.
