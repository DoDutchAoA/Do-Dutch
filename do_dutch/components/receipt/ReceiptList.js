import React, { Component } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions
} from "react-native";
import { Text } from "react-native-elements";

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

class ReceiptListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalVisible: false,
      receiptData: simReceiptData,
      friendsData: simFriendsData,
      receiptHistory: simReceiptHistory,

      image_url: props.image_url,
      title: props.title,
      balance: props.balance,
      place: props.place,
      time: props.time,
      status: props.status
    };
  }

  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={styles.rowContainer}>
          <Image source={{ uri: this.state.image_url }} style={styles.photo} />
          <View style={{ flex: 1, flexDirection: "column" }}>
            <View style={styles.containerText}>
              <Text style={{ fontSize: 16, color: "#000" }}>
                {this.state.title}
              </Text>
              <Text style={{ fontSize: 16, color: "#000" }}>
                {this.state.balance}
              </Text>
            </View>
            <View style={styles.containerText}>
              <Text style={{ fontSize: 10, color: "#aaa" }}>
                {this.state.place}
              </Text>
              <Text style={{ fontSize: 10, color: "#aaa" }}>
                {this.state.time}
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
                  {this.state.status}
                </Text>
              </View>
              <Text style={{ fontSize: 12, color: "#000" }}>{"✘"}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default class ReceiptList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalVisible: false,
      receiptData: simReceiptData,
      friendsData: simFriendsData,
      receiptHistory: simReceiptHistory
    };
  }

  onClick = () => {
    this.item.method(); // do stuff
  };

  launch(receiptData, friendsData) {
    this.setState({
      receiptData: receiptData,
      friendsData: friendsData
    });
  }

  render() {
    return (
      <View style={styles.listContainer}>
        <FlatList
          data={this.state.receiptHistory}
          renderItem={({ item }) => (
            <ReceiptListItem
              onPress={this.props.onPress}
              image_url={item.image_url}
              title={item.title}
              balance={item.balance}
              place={item.place}
              time={item.time}
              status={item.status}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
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
