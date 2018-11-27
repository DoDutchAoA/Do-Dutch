import React, { Component } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions
} from "react-native";
import { Button, Container, Header, Content, Left } from "native-base";
import Ripple from "react-native-material-ripple";
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/Ionicons";

const CustomRow = ({ title, time, place, balance, image_url, status }) => (
  <Ripple>
    <View style={styles.rowContainer}>
      <Image source={{ uri: image_url }} style={styles.photo} />
      <View style={{ flex: 1, flexDirection: "column" }}>
        <View style={styles.container_text}>
          <Text style={{ fontSize: 16, color: "#000" }}>{title}</Text>
          <Text style={{ fontSize: 16, color: "#000" }}>{balance}</Text>
        </View>
        <View style={styles.container_text}>
          <Text style={{ fontSize: 10, color: "#aaa" }}>{place}</Text>
          <Text style={{ fontSize: 10, color: "#aaa" }}>{time}</Text>
        </View>
        <View style={styles.container_text}>
          <View style={styles.tagContainer}>
            <Text
              style={{
                fontSize: 10,
                color: "#ffffff"
              }}
            >
              {status}
            </Text>
          </View>
          <Text style={{ fontSize: 12, color: "#000" }}>{"✘"}</Text>
        </View>
      </View>
    </View>
  </Ripple>
);

const CustomListview = ({ itemList }) => (
  <View style={styles.listContainer}>
    <FlatList
      data={itemList}
      renderItem={({ item }) => (
        <CustomRow
          title={item.title}
          place={item.place}
          time={item.time}
          balance={item.balance}
          image_url={item.image_url}
          status={item.status}
        />
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  </View>
);

export default class HomeScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        {/* <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.navigate("Camera")}
          >
            <Text style={styles.text}>Create a New Receipt</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.navigate("Form")}
          >
            <Text style={styles.text}>Check Form</Text>
          </TouchableOpacity>
          </View> */}
        <CustomListview
          itemList={[
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
          ]}
        />
        <ActionButton buttonColor="rgba(231,76,60,1)" position="center">
          <ActionButton.Item
            buttonColor="#9b59b6"
            title="New Photo"
            onPress={() => this.props.navigation.navigate("Camera")}
          >
            <Icon name="md-add" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor="#3498db"
            title="Gallery"
            onPress={() => this.props.navigation.navigate("Form")}
          >
            <Icon name="md-card" style={styles.actionButtonIcon} />
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

const { width: viewportWidth, height: viewportHeight } = Dimensions.get(
  "window"
);
const marginLR = 5;
const itemWidth = viewportWidth - 2 * marginLR;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
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
    borderRadius: 5,
    // backgroundColor: "#FFF",
    elevation: 1,
    width: itemWidth
  },
  listContainer: {
    flex: 1
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
  container_text: {
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
  }
});
