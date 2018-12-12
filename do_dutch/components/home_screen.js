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
    spinner: false,
    searchText: "",
    receiptHistory: [],
    pastHistory: []
  };

  constructor(props) {
    super(props);

    DataHelper.getFromLocal("history", data => {
      let history = JSON.parse(data);
      this.setState({ receiptHistory: history });
      this.ongoingList.setReceiptHistory(history);
    });
    NetworkHelper.beginPollingReceipt(10000, json => {
      if (json.length > 0) {
        let receiptRecord = JSON.parse(json[0].data);
        receiptRecord.status = "Sharer";
        let history = this.state.receiptHistory;
        history.push(receiptRecord);
        this.setState({ receiptHistory: history });
        this.ongoingList.setReceiptHistory(history);
        DataHelper.saveToLocal("history", history);
      }
    });
  }

  refreshLists() {
    this.ongoingList.setReceiptHistory(this.state.receiptHistory);
    this.pastList.setReceiptHistory(this.state.pastHistory);
    DataHelper.saveToLocal("history", this.state.receiptHistory);
  }

  launchModal(isNewReceipt, receiptItemData, index) {
    this.modal.launch(receiptItemData, recordData => {
      let history = this.state.receiptHistory;
      if (isNewReceipt) {
        history.push(recordData);
        NetworkHelper.uploadReceiptData(recordData);
      } else {
        history[index] = recordData;
      }
      this.setState({ receiptHistory: history });
      this.refreshLists();
    });
  }

  render() {
    let searchListView, ongoingListView, pastListView;
    /////////////////  SEARCH LIST  //////////////////
    if (this.state.searchText.length > 0) {
      searchListView = (
        <ReceiptList
          onRef={ref => (this.searchList = ref)}
          groupTitle="SEARCH RESULT"
          prompt="All Done!"
          keyword={this.state.searchText}
          onPressRecord={(index, receiptItemData) => {
            this.launchModal(false, receiptItemData, index);
          }}
          receiptHistory={this.state.receiptHistory}
        />
      );
    }
    ////////////////  ONGOING LIST  /////////////////
    else {
      ongoingListView = (
        <ReceiptList
          onRef={ref => (this.ongoingList = ref)}
          groupTitle="ONGOING"
          prompt=""
          keyword=""
          onPressRecord={(index, receiptItemData) => {
            this.launchModal(false, receiptItemData, index);
          }}
          receiptHistory={this.state.receiptHistory}
        />
      );
      /////////////////  PAST LIST  //////////////////
      if (this.state.pastHistory.length > 0) {
        pastListView = (
          <ReceiptList
            onRef={ref => (this.pastList = ref)}
            groupTitle="PAST"
            prompt="No Record"
            keyword=""
            onPressRecord={(index, receiptItemData) => {
              this.launchModal(false, receiptItemData, index); // TODO: modify: state.pastList, state.pastHistory
            }}
            receiptHistory={this.state.pastHistory}
          />
        );
      }
    }

    let prompt =
      !this.state.receiptHistory.length && !this.state.pastHistory.length
        ? "No Receipt Yet 😕"
        : "End of Receipts";
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
            if (this.searchList !== undefined && text.length > 0)
              this.searchList.setReceiptHistory(this.state.receiptHistory);
          }}
        />
        {/************* RECEIPT LISTS ***************/}
        <ScrollView scrollEnabled={true}>
          {searchListView}
          {ongoingListView}
          {pastListView}
          <View style={styles.prompt}>
            <Text>{prompt}</Text>
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
          visible={this.state.spinner}
          textContent={"Processing Receipt..."}
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
                    spinner: spinner
                  });
                },
                ///////  RESPONSE RECEIVED CALLBACK  ///////
                receiptRecord => {
                  this.setState({ spinner: false });
                  receiptRecord.friends = friendsData1;
                  this.modal.launch(
                    receiptRecord,
                    ///////////  MODAL CONFIRMED CALLBACK  ////////////
                    recordData => {
                      this.launchModal(true, recordData);
                    }
                  );
                }
              );
            }}
          >
            <Icon name="md-camera" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor="#1abc9c" title="Refresh">
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
