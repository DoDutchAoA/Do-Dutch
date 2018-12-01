import React, { Component } from "react";
import {
  View,
  FlatList,
  Platform,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  TouchableNativeFeedback
} from "react-native";
import {
  Button,
  SearchBar,
  Text,
  Divider,
  List,
  ListItem
} from "react-native-elements";
import ReceiptModal from "./receipt/ReceiptModal.js";

import Spinner from "react-native-loading-spinner-overlay";
// import ReceiptScreen from "./receipt_actions/receipt_screen";

import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/Ionicons";

import ImagePicker from "react-native-image-picker";
import RNFetchBlob from "react-native-fetch-blob";

const date = new Date().toDateString();

const simReceiptData = [
  { name: "pizza", icon: "file" },
  { name: "apple", icon: "file" }
];
const simFriendsData = [
  {
    name: "Amy Farha",
    avatar: "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg",
    selected: false
  },
  {
    name: "Chris Jackson",
    avatar: "https://s3.amazonaws.com/uifaces/faces/twitter/kfriedson/128.jpg",
    selected: true
  },
  {
    name: "Amy Farha",
    avatar: "https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg",
    selected: false
  },
  {
    name: "Chris Jackson",
    avatar:
      "https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg",
    selected: true
  }
];

const simReceiptHistory = [
  {
    title: "Beautiful",
    time: "Today 15:33",
    place: "HMart",
    balance: "$10.20",
    image_url: "https://i.imgur.com/UYiroysl.jpg",
    status: "Pending"
  },
  {
    title: "NYC",
    time: "Nov 13, 10:20",
    place: "ACME",
    balance: "$20.40",
    image_url: "https://i.imgur.com/UPrs1EWl.jpg",
    status: "Pending"
  },
  {
    title: "White",
    time: "Oct 08 09:28",
    place: "Walmart",
    balance: "$30.60",
    image_url: "https://i.imgur.com/MABUbpDl.jpg",
    status: "Pending"
  }
];

export default class HomeScreen extends Component {
  state = {
    spinner: false,
    isModalVisible: false,
    receiptHistory: simReceiptHistory
  };
  options = {
    title: "New Receipt",
    takePhotoButtonTitle: "Take a photo",
    chooseFromLibraryButtonTitle: "Choose from gallery",
    quality: 1
  };

  selectPhoto() {
    ImagePicker.showImagePicker(this.options, response => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else {
        let source = { uri: response.uri };
        this.setState({
          imageSource: source,
          data: response.data,
          spinner: true
        });
        this.uploadPhoto();
      }
    });
  }

  uploadPhoto() {
    RNFetchBlob.fetch(
      "POST",
      "http://52.12.74.177:5000/upload",
      {
        "Content-Type": "multipart/form-data"
      },
      [
        {
          name: "image",
          filename: window.user_id + "image.png",
          type: "image/png",
          data: this.state.data
        }
      ]
    )
      .then(resp => {
        this.setState({
          spinner: false
        });
        console.log("upload successfully!");
        console.log(resp);
        console.log("========");
        console.log(JSON.parse(resp.data).items);

        let parsedData = JSON.parse(resp.data);
        let receiptData = parsedData.items;
        for (let i = 0; i < receiptData.length; i++) {
          receiptData[i]["icon"] = "file";
          receiptData[i]["name"] = receiptData[i]["display"];
          receiptData[i]["price"] = receiptData[i]["price"];
        }
        let accumTotal = parsedData.accumTotal;
        let detectedTotal = parsedData.detectedTotal;

        this.setState({
          receiptData: receiptData,
          accumTotal: accumTotal,
          detectedTotal: detectedTotal
        });
        this.modal.launch(receiptData, simFriendsData);

        let time = new Date();
        let parsedTime = time.toString().split(" ");
        let timeStr =
          parsedTime[1] +
          " " +
          parsedTime[2] +
          " " +
          time.getHours() +
          ":" +
          time.getMinutes();
        let receiptRecord = {
          title: "Default Name",
          time: timeStr,
          place: "Unknown",
          balance: "$" + accumTotal.toFixed(2).toString(),
          image_url: "https://i.imgur.com/UYiroysl.jpg",
          status: "Pending"
        };
        let history = this.state.receiptHistory;
        history.push(receiptRecord);
        this.setState({ receiptHistory: history });

        // this.props.navigation.navigate("Receipt", {
        //   receipt_items: JSON.parse(resp.data).items,
        //   receipt_total: JSON.parse(resp.data).accumTotal
        // });
      })
      .catch(err => {
        console.error("Error: " + err);
      });
  }

  toggleModal = () => {
    this.modal.launch(simReceiptData, simFriendsData);
  };

  render() {
    return (
      <View style={styles.container}>
        <SearchBar
          containerStyle={{ backgroundColor: "#fff" }}
          lightTheme
          placeholder="Search Receipt..."
        />
        <View style={styles.statsContainer}>
          <Text>Unfinished</Text>
        </View>

        <View style={styles.listContainer}>
          <FlatList
            data={this.state.receiptHistory}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={this.toggleModal}>
                <View style={styles.rowContainer}>
                  <Image
                    source={{ uri: item.image_url }}
                    style={styles.photo}
                  />
                  <View style={{ flex: 1, flexDirection: "column" }}>
                    <View style={styles.containerText}>
                      <Text style={{ fontSize: 16, color: "#000" }}>
                        {item.title}
                      </Text>
                      <Text style={{ fontSize: 16, color: "#000" }}>
                        {item.balance}
                      </Text>
                    </View>
                    <View style={styles.containerText}>
                      <Text style={{ fontSize: 10, color: "#aaa" }}>
                        {item.place}
                      </Text>
                      <Text style={{ fontSize: 10, color: "#aaa" }}>
                        {item.time}
                      </Text>
                    </View>
                    <View style={styles.containerText}>
                      <View style={styles.tagContainer}>
                        <Text
                          style={{
                            fontSize: 10,
                            color: "#ffffff"
                          }}
                        >
                          {item.status}
                        </Text>
                      </View>
                      <Text style={{ fontSize: 12, color: "#000" }}>{"✘"}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>

        <View style={{ alignItems: "center", margin: 10 }}>
          <Text>End of Receipts</Text>
        </View>
        <View>
          <ReceiptModal
            onRef={ref => (this.modal = ref)}
            text="I love to blinkkkk"
            data={this.state.receiptData}
            friends={simFriendsData}
          />
        </View>
        <Divider style={{ backgroundColor: "rgb(200, 200, 200)" }} />

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
