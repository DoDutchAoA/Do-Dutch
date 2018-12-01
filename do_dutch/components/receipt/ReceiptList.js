import React, { Component } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions
} from "react-native";
import { Text, Divider } from "react-native-elements";

class ReceiptListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalVisible: false,
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
      receiptHistory: this.props.receiptHistory
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
    let content;
    if (this.state.receiptHistory.length > 0) {
      content = (
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
      );
    } else {
      content = <Text>{this.props.prompt}</Text>;
    }
    return (
      <View>
        <View style={styles.groupTitleContainer}>
          <Text style={styles.groupTitle}>{this.props.groupTitle}</Text>
        </View>
        <Divider
          style={{
            marginLeft: 150,
            marginRight: 150,
            backgroundColor: "rgb(100, 100, 100)"
          }}
        />
        {content}
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
  groupTitle: {
    fontWeight: "bold",
    backgroundColor: "#ffffff",
    color: "#000000",
    padding: 3
  },
  groupTitleContainer: {
    marginLeft: 10,
    marginTop: 10,
    alignItems: "center"
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
  photo: {
    height: 50,
    width: itemWidth / 10
  },
  containerText: {
    flex: 1,
    flexDirection: "row",
    marginLeft: 12,
    justifyContent: "space-between"
  },
  tagContainer: {
    backgroundColor: "steelblue",
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 2,
    width: 70,
    alignItems: "center",
    marginTop: 3
  }
});
