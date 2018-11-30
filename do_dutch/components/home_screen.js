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

import Spinner from "react-native-loading-spinner-overlay";
// import ReceiptScreen from "./receipt_actions/receipt_screen";
import Modal from "react-native-modal";

// import { Button, Container, Header, Content, Left } from "native-base";
// import Ripple from "react-native-material-ripple";
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/Ionicons";

import ImagePicker from "react-native-image-picker";
import RNFetchBlob from "react-native-fetch-blob";

const date = new Date().toDateString();

const list = [
  {
    name: "Amy Farha",
    avatar_url:
      "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg",
    subtitle: "Vice President"
  },
  {
    name: "Chris Jackson",
    avatar_url:
      "https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg",
    subtitle: "Vice Chairman"
  }
];

const CustomRow = ({
  title,
  time,
  place,
  balance,
  image_url,
  status,
  onPress
}) => (
  // <Ripple>
  <TouchableOpacity onPress={onPress}>
    <View style={styles.rowContainer}>
      <Image
        source={{ uri: image_url }}
        style={styles.photo}
        onPress={onPress}
      />
      <View style={{ flex: 1, flexDirection: "column" }}>
        <View style={styles.containerText}>
          <Text style={{ fontSize: 16, color: "#000" }}>{title}</Text>
          <Text style={{ fontSize: 16, color: "#000" }}>{balance}</Text>
        </View>
        <View style={styles.containerText}>
          <Text style={{ fontSize: 10, color: "#aaa" }}>{place}</Text>
          <Text style={{ fontSize: 10, color: "#aaa" }}>{time}</Text>
        </View>
        <View style={styles.containerText}>
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
  </TouchableOpacity>
);

const CustomListview = ({ itemList, onPress }) => (
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
          onPress={onPress}
        />
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  </View>
);

export default class HomeScreen extends Component {

  state = {
    spinner: false,
    isModalVisible: false
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

        this.props.navigation.navigate("Receipt", {
          receipt_items: JSON.parse(resp.data).items,
          receipt_total: JSON.parse(resp.data).accumTotal
        });
      })
      .catch(err => {
        console.error("Error: " + err);
      });
  }

  _toggleModal = () =>
    this.setState({ isModalVisible: !this.state.isModalVisible });

  render() {
    return (
      <View style={styles.container}>
        <SearchBar
          containerStyle={{ backgroundColor: "#fff" }}
          lightTheme
          placeholder="Search Receipt..."
        />
        <View style={styles.statsContainer}>
          <Text>{date}</Text>
        </View>

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
          onPress={this._toggleModal}
        />

        <View style={{ alignItems: "center", margin: 10 }}>
          <Text>End of Receipts</Text>
        </View>

        <Modal
          isVisible={this.state.isModalVisible}
          onSwipe={() => this.setState({ isModalVisible: false })}
          swipeDirection="down"
        >
          <View style={styles.modalContent}>
            <Text h4>Checkout Items</Text>
            <List>
              <FlatList
                data={list}
                renderItem={item => (
                  <ListItem
                    roundAvatar
                    title={item.name}
                    subtitle={item.subtitle}
                    avatar={{ uri: item.avatar_url }}
                  />
                )}
                keyExtractor={item => item.name}
              />
            </List>
            <Button onPress={this._toggleModal}>
              <Text>Hide me!</Text>
            </Button>
          </View>
        </Modal>
        <List>
          <FlatList
            data={list}
            renderItem={item => (
              <ListItem
                roundAvatar
                title={item.name}
                subtitle={item.subtitle}
                avatar={{ uri: item.avatar_url }}
              />
            )}
            keyExtractor={item => item.name}
          />
        </List>
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
    borderRadius: 5,
    // backgroundColor: "#FFF",
    elevation: 1,
    width: itemWidth
  },
  listContainer: {},
  statsContainer: {
    margin: 10
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
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
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
  }
});
