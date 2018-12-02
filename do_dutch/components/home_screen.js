import React, { Component } from "react";
import { View, StyleSheet, Dimensions, ScrollView } from "react-native";
import { SearchBar, Text } from "react-native-elements";
import Spinner from "react-native-loading-spinner-overlay";
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/Ionicons";

import ReceiptList from "./receipt/ReceiptList.js";
import ReceiptModal from "./receipt/ReceiptModal.js";
import photoTools from "./receipt/UploadingTools.js";

import {
  // receiptData,
  friendsData1,
  receiptHistory
  // receiptData
} from "./receipt/SimulationData";

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    spinner: false,
    isModalVisible: false,
    receiptHistory: receiptHistory,
    searching: false,
    searchText: ""
  };

  selectPhoto = () => {
    photoTools.loadPhoto(
      (source, data, spinner) => {
        this.setState({
          imageSource: source,
          data: data,
          spinner: spinner
        });
      },
      receiptRecord => {
        this.setState({
          spinner: false
        });
        receiptRecord.friends = friendsData1;
        this.modal.launch(receiptRecord, recordData => {
          let history = this.state.receiptHistory;
          history.push(recordData);
          this.setState({ receiptHistory: history });
          this.ongoingList.setReceiptHistory(history);
        });
      }
    );
  };

  render() {
    let list;
    if (this.state.searchText.length > 0) {
      list = (
        <ReceiptList
          onRef={ref => (this.searchList = ref)}
          groupTitle="SEARCH RESULT"
          prompt="All Done!"
          keyword={this.state.searchText}
          onPressRecord={(listKey, receiptItemData, setDataCallback) => {
            this.modal.launch(receiptItemData, recordData => {
              setDataCallback(recordData);
            });
          }}
          receiptHistory={this.state.receiptHistory}
        />
      );
    } else {
      list = (
        <View>
          <ReceiptList
            onRef={ref => (this.ongoingList = ref)}
            groupTitle="ONGOING"
            prompt="All Done!"
            keyword=""
            onPressRecord={(index, receiptItemData) => {
              this.modal.launch(receiptItemData, recordData => {
                console.log(recordData);
                let history = this.state.receiptHistory;
                history[index] = recordData;
                this.setState({ receiptHistory: history });
                this.ongoingList.setReceiptHistory(history);
              });
            }}
            receiptHistory={this.state.receiptHistory}
          />
          <ReceiptList
            onRef={ref => (this.pastList = ref)}
            groupTitle="PAST"
            prompt="No Record"
            keyword=""
            onPressRecord={(index, receiptItemData) => {
              this.modal.launch(receiptItemData, recordData => {
                let history = this.state.receiptHistory;
                history[index] = recordData;
                this.setState({ receiptHistory: history });
                this.pastList.setReceiptHistory(history);
              });
            }}
            receiptHistory={this.state.receiptHistory}
          />
        </View>
      );
    }

    return (
      <View style={styles.container}>
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
        <ScrollView scrollEnabled={true}>
          {list}
          <View style={{ alignItems: "center", margin: 10 }}>
            <Text>End of Receipts</Text>
          </View>
        </ScrollView>

        <View>
          <ReceiptModal
            onRef={ref => (this.modal = ref)}
            data={[]}
            friends={[]}
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
            onPress={() => this.selectPhoto()}
          >
            <Icon
              // type="font-awesome"
              name="md-camera"
              style={styles.actionButtonIcon}
            />
          </ActionButton.Item>
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
