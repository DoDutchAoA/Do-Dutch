import React, { Component } from "react";
import { View, StyleSheet, Dimensions, ScrollView } from "react-native";
import { SearchBar, Text } from "react-native-elements";
import ReceiptModal from "./receipt/ReceiptModal.js";

import Spinner from "react-native-loading-spinner-overlay";

import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/Ionicons";

import ReceiptList from "./receipt/ReceiptList.js";

import { loadPhoto } from "./receipt/UploadingTools.js";

import {
  receiptData,
  friendsData,
  receiptHistory
} from "./receipt/SimulationData";

export default class HomeScreen extends Component {
  state = {
    spinner: false,
    isModalVisible: false,
    receiptHistory: receiptHistory
  };

  selectPhoto = () => {
    loadPhoto(
      (source, data, spinner) => {
        this.setState({
          imageSource: source,
          data: data,
          spinner: spinner
        });
      },
      (receiptData, accumTotal, detectedTotal, timeStamp) => {
        this.setState({
          spinner: false,
          receiptData: receiptData,
          accumTotal: accumTotal,
          detectedTotal: detectedTotal
        });
        this.modal.launch(receiptData, friendsData, () => {
          let receiptRecord = {
            title: "Default Name",
            time: timeStamp,
            place: "Unknown",
            balance: "$" + accumTotal.toFixed(2).toString(),
            image_url: "https://i.imgur.com/UYiroysl.jpg",
            status: "Pending"
          };
          let history = this.state.receiptHistory;
          history.push(receiptRecord);
          this.setState({ receiptHistory: history });
        });

        // this.props.navigation.navigate("Receipt", {
        //   receipt_items: JSON.parse(resp.data).items,
        //   receipt_total: JSON.parse(resp.data).accumTotal
        // });
      }
    );
  };

  toggleModal = () => {
    this.modal.launch(receiptData, friendsData);
  };

  render() {
    return (
      <View style={styles.container}>
        <SearchBar
          containerStyle={{ backgroundColor: "#fff" }}
          lightTheme
          placeholder="Search Receipt..."
        />
        <ScrollView scrollEnabled={true}>
          <ReceiptList
            groupTitle="ONGOING"
            prompt="All Done!"
            onPress={this.toggleModal}
            receiptHistory={receiptHistory}
          />
          <ReceiptList
            groupTitle="PAST"
            prompt="No Record"
            onPress={this.toggleModal}
            receiptHistory={receiptHistory}
          />

          <View style={{ alignItems: "center", margin: 10 }}>
            <Text>End of Receipts</Text>
          </View>
        </ScrollView>

        <View>
          <ReceiptModal
            onRef={ref => (this.modal = ref)}
            text="I love to blinkkkk"
            data={this.state.receiptData}
            friends={friendsData}
          />
        </View>

        <Spinner
          cancelable={true}
          visible={this.state.spinner}
          textContent={"Processing Receipt..."}
          textStyle={styles.spinnerTextStyle}
        />

        <ActionButton buttonColor="rgba(231,76,60,1)" position="center">
          <ActionButton.Item
            buttonColor="#9b59b6"
            title="New Photo"
            onPress={this.selectPhoto.bind(this)}
          >
            <Icon
              // type="font-awesome"
              name="md-camera"
              style={styles.actionButtonIcon}
            />
          </ActionButton.Item>
          {/* <ActionButton.Item
            buttonColor="#3498db"
            title="Gallery"
            onPress={() => this.props.navigation.navigate("Form")}
          >
            <Icon name="md-card" style={styles.actionButtonIcon} />
          </ActionButton.Item> */}
          <ActionButton.Item
            buttonColor="#1abc9c"
            title="Refresh"
            onPress={() => {}}
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
const { width: viewportWidth, height: viewportHeight } = Dimensions.get(
  "window"
);
const marginLR = 5;
const itemWidth = viewportWidth - 2 * marginLR;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    backgroundColor: "#ffffff"
  },
  rowContainer: {
    flex: 1,
    flexDirection: "row",
    padding: 10,
    marginLeft: marginLR,
    marginRight: marginLR,
    marginTop: 2,
    marginBottom: 2,
    borderRadius: 2,
    borderWidth: 0,
    // backgroundColor: "#FFF",
    elevation: 0.1,
    width: itemWidth
  },
  listContainer: {},
  statsContainer: {
    marginLeft: 10,
    marginTop: 10
  },
  tagContainer: {
    backgroundColor: "steelblue",
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 2,
    width: 70,
    alignItems: "center",
    marginTop: 3
  },

  title: {
    fontSize: 16,
    color: "#000"
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: "white"
  },
  containerText: {
    flex: 1,
    flexDirection: "row",
    marginLeft: 12,
    justifyContent: "space-between"
  },
  spinnerTextStyle: {
    color: "#fff"
  },
  balance: {
    fontSize: 11,
    fontStyle: "italic"
  },
  photo: {
    height: 50,
    width: itemWidth / 10
  },
  button: {
    width: 250,
    height: 50,
    backgroundColor: "#330066",
    borderRadius: 30,
    justifyContent: "center",
    marginTop: 15
  },
  text: {
    color: "white",
    fontSize: 18,
    textAlign: "center"
  },
  view: {
    flex: 1
    // justifyContent: "flex-end",
    // alignItems: "center"
  },

  // Modal Contents
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    // alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  modalBtnContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 15
  },
  modalBtn: {
    marginLeft: -20
    // width: 50,
    // height: 10
  }
});
