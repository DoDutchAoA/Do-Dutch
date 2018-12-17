import React, { Component } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { SearchBar, Text } from "react-native-elements";
import Spinner from "react-native-loading-spinner-overlay";
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/Ionicons";

import ReceiptList from "./receipt/ReceiptList.js";
import ReceiptModal from "./receipt/ReceiptModal.js";
import NetworkHelper from "./receipt/NetworkHelper.js";
import DataHelper from "./receipt/DataHelper.js";

export default class HomeScreen extends Component {

  state = {
    uploadingSpinner: false,
    receiptSpinner: false,
    searchText: "",
    receiptHistory: [],
    ongoingList: undefined,
    pastList: undefined,
    searchList: undefined
  };

  constructor(props) {
    super(props);
    window.user_id = 2;
    window.username = "payer";

    // window.user_id = 8;
    // window.username = "Sara";

    if (window.user_id !== undefined) {
      DataHelper.getFromLocal(window.user_id.toString(), data => {
        this.saveReceiptHistory(JSON.parse(data));
      });
      NetworkHelper.beginPollingReceipt(10000, messages => {
        if (messages.length > 0) {
          let history = this.state.receiptHistory;
          messages.forEach(message => {
            if (message.event == "new") {
              let newReceipt = JSON.parse(message.data);
              let receiptIndex = history.findIndex(
                receipt => receipt.receiptId == newReceipt.receiptId
              );
              if (receiptIndex != undefined && receiptIndex != -1) {
                history[receiptIndex] = newReceipt;
              } else {
                history.push(newReceipt);
              }
            } else if (message.event == "pay") {
              let receiptIndex = history.findIndex(
                receipt => receipt.receiptId == message.receipt_id
              );
              if (receiptIndex != undefined && receiptIndex != -1) {
                let memberIndex = history[receiptIndex].group.members.findIndex(
                  member => member.member_id == message.sender_id
                );
                if (memberIndex != undefined && memberIndex != -1) {
                  history[receiptIndex].group.members[memberIndex].payment =
                    "paid";
                }
              }
            } else if (message.event == "challenge") {
              let receiptIndex = history.findIndex(
                receipt => receipt.receiptId == message.receipt_id
              );
              if (receiptIndex != undefined && receiptIndex != -1) {
                history[receiptIndex].payment = "challenged";
              }
            }
          });
          this.saveReceiptHistory(history);
        }
      });
    }
  }

  saveReceiptHistory(historyJSON) {
    this.setState({ receiptHistory: historyJSON });
    if (this.state.ongoingList) {
      this.state.ongoingList.setReceiptHistory(historyJSON);
    }
    if (this.state.searchList) {
      this.state.searchList.setReceiptHistory(historyJSON);
    }
    if (this.state.pastList) {
      this.state.pastList.setReceiptHistory(historyJSON);
    }
    DataHelper.saveToLocal(window.user_id.toString(), historyJSON);
    NetworkHelper.saveToCloud(window.user_id.toString(), historyJSON);
  }

  refreshLists() {
    NetworkHelper.loadFromCloud(window.user_id.toString(), history => {
      this.saveReceiptHistory(history);
    });
  }

  /////////////////  MODAL LAUNCHING  //////////////////
  launchModal(isNewReceipt, index, receiptData) {
    let receipt = isNewReceipt ? receiptData : this.state.receiptHistory[index];
    let history = this.state.receiptHistory;
    this.setState({
      receiptSpinner: true
    });
    ///////////////////  LOAD GROUPS FIRST ///////////////////
    NetworkHelper.loadAllGroups(window.user_id.toString(), groups => {
      this.setState({
        receiptSpinner: false
      });
      this.modal.launch(
        receipt,
        groups,
        (confirmType, confirmedReceiptData) => {
          //////////// CONFIRMATION CALLBACK /////////////
          //////////// UPDATE THE LOCAL RECEIPT //////////
          if (
            confirmType == "update" ||
            confirmType == "pay" ||
            confirmType == "challenge"
          ) {
            if (isNewReceipt) {
              history.push(confirmedReceiptData);
            } else {
              history[index] = confirmedReceiptData;
            }
            this.saveReceiptHistory(history);
          }
          /////////// PROCESS THE NETWORK REQUESTS ///////////
          if (confirmType == "update") {
            NetworkHelper.pushReceiptData(confirmedReceiptData);
          } else if (confirmType == "pay") {
            NetworkHelper.sendPayment(receipt.creator, receipt.receiptId);
          } else if (confirmType == "challenge") {
            NetworkHelper.sendChallenge(receipt.creator, receipt.receiptId);
          } else {
            /// confirmType == "Cancel", don't do anything
          }
        }
      );
    });
  }

  render() {
    let receiptPrompt,
      loginPrompt,
      searchListView,
      ongoingListView,
      pastListView;
    if (window.user_id == undefined || window.user_id == "") {
      loginPrompt = "Please login first!";
    } else {
      loginPrompt = "";
      receiptPrompt = !this.state.receiptHistory.length
        ? "No Receipt Yet 😕"
        : "End of Receipts";

      /////////////////  SEARCH LIST  //////////////////
      if (this.state.searchText.length > 0) {
        searchListView = (
          <ReceiptList
            onRef={ref => this.setState({ searchList: ref })}
            listTitle="SEARCH RESULT"
            prompt="All Done!"
            keyword={this.state.searchText}
            onPressRecord={index => {
              this.launchModal(false, index);
            }}
            receiptHistory={this.state.receiptHistory}
          />
        );
      }
      ////////////////  ONGOING LIST  /////////////////
      else {
        if (this.state.receiptHistory.length > 0) {
          ongoingListView = (
            <ReceiptList
              onRef={ref => this.setState({ ongoingList: ref })}
              listTitle="ONGOING"
              prompt=""
              keyword=""
              onPressRecord={index => {
                this.launchModal(false, index);
              }}
              receiptHistory={this.state.receiptHistory}
            />
          );
          /////////////////  PAST LIST  //////////////////
          pastListView = (
            <ReceiptList
              onRef={ref => this.setState({ pastList: ref })}
              listTitle="PAST"
              prompt=""
              keyword=""
              onPressRecord={index => {
                this.launchModal(false, index);
              }}
              receiptHistory={this.state.receiptHistory}
            />
          );
        }
      }
    }

    /////////////////////// RENDERING ////////////////////////
    return (
      <View style={styles.container} className="Container">
        {/************** SEARCH BAR ****************/}
        <SearchBar
          containerStyle={{ backgroundColor: "#fff" }}
          lightTheme
          placeholder="Search receipt name or merchant..."
          onChangeText={text => {
            this.setState({ searchText: text });
            if (this.state.searchList !== undefined && text.length > 0)
              this.saveReceiptHistory(this.state.receiptHistory);
          }}
        />
        {/************* RECEIPT LISTS ***************/}
        <ScrollView scrollEnabled={true}>
          {searchListView}
          {ongoingListView}
          {pastListView}
          <View style={styles.prompt}>
            <Text>{receiptPrompt}</Text>
            <Text>{loginPrompt}</Text>
          </View>
        </ScrollView>

        {/************* RECEIPT MODAL ***************/}
        <View className="Modal">
          <ReceiptModal
            onRef={ref => (this.modal = ref)}
            data={[]}
            friends={[]}
          />
        </View>

        {/**************** SPINNER ******************/}
        <Spinner
          cancelable={true}
          visible={this.state.uploadingSpinner}
          textContent={"Processing Receipt..."}
          textStyle={styles.spinnerTextStyle}
          overlayColor={"rgba(0, 0, 0, 0.50)"}
        />
        <Spinner
          cancelable={true}
          visible={this.state.receiptSpinner}
          textContent={"Opening Receipt..."}
          textStyle={styles.spinnerTextStyle}
          overlayColor={"rgba(0, 0, 0, 0.50)"}
        />

        {/******************** UPLOADING RECEIPT **********************/}
        <ActionButton buttonColor="rgba(63,81,181,1.0)">
          <ActionButton.Item
            buttonColor="#9b59b6"
            title="New Receipt"
            onPress={() => {
              NetworkHelper.uploadReceiptPhoto(
                ///////  IMAGE SELECTED CALLBACK  ///////
                (source, data) => {
                  this.setState({
                    imageSource: source,
                    data: data,
                    uploadingSpinner: true
                  });
                },
                ///////  RESPONSE RECEIVED CALLBACK  ///////
                receiptRecord => {
                  this.setState({ uploadingSpinner: false });
                  this.launchModal(true, 0, receiptRecord);
                }
              );
            }}
          >
            <Icon name="md-camera" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor="#1abc9c"
            title="Refresh"
            onPress={this.refreshLists}
          >
            <Icon name="md-refresh" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
      </View>
    );
  }
}

////////////////////////////////////////////
// STYLE SHEET
////////////////////////////////////////////
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  prompt: {
    alignItems: "center",
    margin: 10
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: "white"
  },
  spinnerTextStyle: {
    color: "#fff"
  }
});
