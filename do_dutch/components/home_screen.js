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
import { friendsData1 } from "./receipt/SimulationData";

export default class HomeScreen extends Component {
  state = {
    uploadingSpinner: false,
    receiptSpinner: false,
    searchText: "",
    receiptHistory: [],
    pastHistory: [],
    ongoingList: undefined,
    pastList: undefined,
    searchList: undefined
  };

  constructor(props) {
    super(props);

    DataHelper.getFromLocal("history", data => {
      this.saveReceiptHistory(JSON.parse(data));
    });
    NetworkHelper.beginPollingReceipt(10000, json => {
      if (json.length > 0) {
        let receiptRecord = JSON.parse(json[0].data);
        receiptRecord.status = "Sharer";
        let history = this.state.receiptHistory;
        history.push(receiptRecord);
        this.saveReceiptHistory(history);
      }
    });
  }

  saveReceiptHistory(historyJSON) {
    this.setState({ receiptHistory: historyJSON });
    if (this.state.ongoingList) {
      this.state.ongoingList.setReceiptHistory(historyJSON);
    }
    if (this.state.searchList) {
      this.state.searchList.setReceiptHistory(historyJSON);
    }
    // if (this.state.pastList) {
    //   this.state.pastList.setReceiptHistory(historyJSON);
    // }
    DataHelper.saveToLocal("history", historyJSON);
    NetworkHelper.saveToCloud(window.user_id, historyJSON);
  }

  refreshLists() {
    NetworkHelper.loadFromCloud(window.user_id, history => {
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
    NetworkHelper.loadAllGroups(window.user_id, groups => {
      this.setState({
        receiptSpinner: false
      });
      this.modal.launch(receipt, groups, confirmedReceiptData => {
        //////////// CONFIRMATION CALLBACK /////////////
        if (isNewReceipt) {
          history.push(confirmedReceiptData);
          NetworkHelper.uploadReceiptData(confirmedReceiptData);
        } else {
          history[index] = confirmedReceiptData;
        }
        this.saveReceiptHistory(history);
      });
    });
  }

  render() {
    window.user_id = 1;
    let receiptPrompt,
      loginPrompt,
      searchListView,
      ongoingListView,
      pastListView;
    if (window.user_id == undefined || window.user_id == "") {
      loginPrompt = "Please login first!";
    } else {
      loginPrompt = "";
      receiptPrompt =
        !this.state.receiptHistory.length && !this.state.pastHistory.length
          ? "No Receipt Yet 😕"
          : "End of Receipts";
      /////////////////  SEARCH LIST  //////////////////
      if (this.state.searchText.length > 0) {
        searchListView = (
          <ReceiptList
            onRef={ref => this.setState({ searchList: ref })}
            groupTitle="SEARCH RESULT"
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
        ongoingListView = (
          <ReceiptList
            onRef={ref => this.setState({ ongoingList: ref })}
            groupTitle="ONGOING"
            prompt=""
            keyword=""
            onPressRecord={index => {
              this.launchModal(false, index);
            }}
            receiptHistory={this.state.receiptHistory}
          />
        );
        /////////////////  PAST LIST  //////////////////
        if (this.state.pastHistory.length > 0) {
          pastListView = (
            <ReceiptList
              onRef={ref => this.setState({ pastList: ref })}
              groupTitle="PAST"
              prompt="No Record"
              keyword=""
              onPressRecord={index => {
                this.launchModal(false, index); // TODO: modify: state.pastList, state.pastHistory
              }}
              receiptHistory={this.state.pastHistory}
            />
          );
        }
      }
    }

    /////////////////////// RENDERING ////////////////////////
    return (
      <View style={styles.container}>
        {/************** SEARCH BAR ****************/}
        <SearchBar
          containerStyle={{ backgroundColor: "#fff" }}
          lightTheme
          placeholder="Search receipt name, merchant, or status..."
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
        <View>
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
        <ActionButton buttonColor="rgba(231,76,60,1)" position="center">
          <ActionButton.Item
            buttonColor="#9b59b6"
            title="New Photo"
            onPress={() => {
              NetworkHelper.uploadReceiptPhoto(
                ///////  IMAGE SELECTED CALLBACK  ///////
                (source, data, spinner) => {
                  this.setState({
                    imageSource: source,
                    data: data,
                    uploadingSpinner: spinner
                  });
                },
                ///////  RESPONSE RECEIVED CALLBACK  ///////
                receiptRecord => {
                  this.setState({ spinner: false });
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
