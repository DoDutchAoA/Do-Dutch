import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  ScrollView
} from "react-native";
import {
  Button,
  Text,
  List,
  ListItem,
  Icon,
  Avatar,
  ButtonGroup
} from "react-native-elements";

import Modal from "react-native-modal";
//import NumericInput from "react-native-numeric-input";

class Title extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditable: false,
      title: props.title,
      tempText: props.title
    };
  }

  changeEditable() {
    this.setState({ isEditable: !this.state.isEditable });
  }

  render() {
    let title;
    if (!this.state.isEditable) {
      title = (
        <TouchableOpacity onPress={() => this.changeEditable()}>
          <Text style={{ fontSize: 30, fontWeight: "bold" }}>
            {this.state.title}
          </Text>
        </TouchableOpacity>
      );
    } else {
      title = (
        <View
          style={{
            flexDirection: "row"
          }}
        >
          <TextInput
            value={this.state.tempText}
            style={{
              height: 60,
              marginRight: -50,
              fontSize: 30,
              fontWeight: "bold"
            }}
            placeholder="Title of receipt"
            onChangeText={text =>
              this.setState({
                tempText: text
              })
            }
          />

          <Icon
            raised
            name="check"
            type="font-awesome"
            color="#0f0"
            size={10}
            onPress={() => {
              let newTitle = this.state.tempText;
              this.setState({ title: newTitle });
              this.props.changeTitleCallback(newTitle);
              this.changeEditable();
            }}
            containerStyle={{ marginRight: 0, marginTop: 20 }}
          />
          <Icon
            raised
            name="times"
            type="font-awesome"
            color="#f00"
            size={10}
            onPress={() => {
              this.setState({ tempText: this.state.title });
              this.changeEditable();
            }}
            containerStyle={{ marginRight: 0, marginTop: 20 }}
          />
        </View>
      );
    }

    return title;
  }
}

class Item extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditable: false,
      data: props.data,
      tempText: props.data.name,
      split: true
    };
  }

  changeEditable() {
    this.setState({ isEditable: !this.state.isEditable });
  }

  render() {
    let name;
    if (!this.state.isEditable) {
      name = (
        <TouchableOpacity onPress={() => this.changeEditable()}>
          <Text>{this.state.data.name}</Text>
        </TouchableOpacity>
      );
    } else {
      name = (
        <View
          style={{
            flexDirection: "row"
          }}
        >
          <TextInput
            value={this.state.tempText}
            style={{ height: 40, marginRight: -50 }}
            placeholder="Type here to translate!"
            onChangeText={text =>
              this.setState({
                tempText: text
              })
            }
          />

          <Icon
            raised
            name="check"
            type="font-awesome"
            color="#0f0"
            size={10}
            onPress={() => {
              this.state.data.name = this.state.tempText;
              this.changeEditable();
            }}
            containerStyle={{ marginRight: 0 }}
          />
          <Icon
            raised
            name="times"
            type="font-awesome"
            color="#f00"
            size={10}
            onPress={() => {
              this.setState({ tempText: this.state.data.name });
              this.changeEditable();
            }}
          />
        </View>
      );
    }

    let splitTotal;
    if (this.state.data.split) {
      splitTotal = (this.props.data.price / this.props.sharerCount).toFixed(2);
    } else {
      splitTotal = this.props.data.price.toFixed(2);
    }

    return (
      <ListItem
        leftIcon={
          <Icon
            type="font-awesome"
            name={this.state.data.icon}
            color="#868686"
            size={15}
            iconStyle={{ marginRight: 10 }}
          />
        }
        key={this.state.data.name}
        title={<View>{name}</View>}
        hideChevron
        badge={{
          element: (
            <View style={{ flexDirection: "row" }}>
              <Text style={{ marginTop: 5, marginRight: 5 }}>$</Text>
              <Text style={{ marginTop: 5, marginRight: 1 }}>{splitTotal}</Text>
              <Text
                style={{
                  color: "#aaa",
                  marginTop: 10,
                  marginRight: 1,
                  fontSize: 10
                }}
              >
                {"/" + this.props.data.price.toFixed(2)}
              </Text>
              <ButtonGroup
                onPress={index => {
                  let data = this.state.data;
                  data.split = index == 0;
                  this.setState({ data: data });
                  this.props.updateReceipt(this.state.data);
                }}
                selectedIndex={this.state.data.split ? 0 : 1}
                buttons={["Split", "All"]}
                textStyle={{ fontSize: 12 }}
                containerStyle={{ height: 20, width: 70, marginRight: -10 }}
                selectedButtonStyle={{ backgroundColor: "#a5d6a7" }}
              />
              {/* <NumericInput
                rounded
                type="up-down"
                initValue={this.state.amount}
                value={this.state.amount}
                onChange={value => {
                  this.setState({ amount: value, total: value * 10 });
                }}
                totalWidth={60}
                totalHeight={30}
                maxValue={10}
                minValue={0}
                valueType="real"
                upDownButtonsBackgroundColor="#aecdc2"
                rightButtonBackgroundColor="#aecdc2"
                leftButtonBackgroundColor="#f0b8b8"
              /> */}
            </View>
          )
        }}
      />
    );
  }
}

export default class ReceiptModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      sharerCount: 0,
      friends: [],
      receiptData: [],
      confirmCallback: () => {},
      total: 0,
      image_url: ""
    };
  }

  onClick = () => {
    this.item.method(); // do stuff
  };

  componentDidMount() {
    this.props.onRef(this);
  }
  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  calculateTotal(receiptData, sharerCount) {
    total = 0;
    for (index in receiptData) {
      if (receiptData[index].split) {
        total += receiptData[index].price / sharerCount;
      } else {
        total += receiptData[index].price;
      }
    }
    this.setState({ total: total });
  }

  launch(receiptRecord, confirmCallback) {
    let sharerCount = 1;
    for (i in receiptRecord.friends) {
      if (receiptRecord.friends[i].selected) sharerCount++;
    }
    let d = new Date();
    this.setState({
      isModalVisible: true,
      title: receiptRecord.title,
      time: receiptRecord.time,
      receiptData: receiptRecord.items,
      image_url: receiptRecord.image_url,
      friends: receiptRecord.friends,
      sharerCount: sharerCount,
      status: receiptRecord.status,
      confirmCallback: confirmCallback
    });
    this.calculateTotal(receiptRecord.items, sharerCount);
  }

  render() {
    let processedTime;
    if (this.state.time)
      processedTime =
        this.state.time.split(" ")[0] + " " + this.state.time.split(" ")[1];
    return (
      <Modal isVisible={this.state.isModalVisible}>
        <ScrollView
          contentContainerStyle={styles.modalContent}
          scrollEnabled={true}
        >
          <View
            style={{
              alignItems: "flex-end",
              marginTop: -30,
              marginBottom: -40
            }}
          >
            <Text style={{ fontSize: 80, color: "#e1e1e1" }}>
              {processedTime}
            </Text>
          </View>

          <Title
            title={this.state.title}
            changeTitleCallback={title => {
              this.setState({ title: title });
            }}
          />

          <Text style={{ fontSize: 15, fontWeight: "bold" }}>Friends</Text>
          <ScrollView
            horizontal={true}
            scrollEnabled={true}
            contentContainerStyle={styles.modalContent}
            style={{ height: 110 }}
          >
            {this.state.friends.map((l, index) => {
              l.key = index.toString();
              let opacity = l.selected ? 1.0 : 0.3;
              let icon = l.selected ? (
                <Icon
                  reverse
                  raised
                  name="check"
                  type="font-awesome"
                  color="#0d0"
                  size={10}
                  containerStyle={{
                    marginTop: -20,
                    marginRight: -30
                  }}
                />
              ) : null;
              return (
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "center",
                    marginRight: 10
                  }}
                  key={index.toString()}
                >
                  <Avatar
                    medium
                    rounded
                    source={{
                      uri: l.avatar
                    }}
                    onPress={() => {
                      let friends = this.state.friends;
                      friends[index].selected = !friends[index].selected;
                      let sharerCount = this.state.sharerCount;
                      if (friends[index].selected) sharerCount += 1;
                      else sharerCount -= 1;
                      this.setState({
                        friends: friends,
                        sharerCount: sharerCount
                      });
                      this.calculateTotal(this.state.receiptData, sharerCount);
                    }}
                    activeOpacity={0.7}
                    avatarStyle={{ opacity: opacity, backgroundColor: "#fff" }}
                  />
                  <Text style={{ marginTop: 10, marginBottom: 5 }}>
                    {l.name}
                  </Text>
                  <View style={{ marginTop: -35 }}>{icon}</View>
                </View>
              );
            })}
          </ScrollView>
          <Text
            style={{
              marginTop: 20,
              marginBottom: -10,
              fontSize: 15,
              backgroundColor: "#fff",
              fontWeight: "bold"
            }}
          >
            My Choice
          </Text>
          <List containerStyle={{ marginBottom: 20 }}>
            {this.state.receiptData.map((l, index) => (
              <Item
                data={l}
                key={index.toString()}
                sharerCount={this.state.sharerCount}
                updateReceipt={receipt => {
                  let receiptData = this.state.receiptData;
                  receiptData[index] = receipt;
                  this.setState({ receiptData: receiptData });
                  this.calculateTotal(receiptData, this.state.sharerCount);
                }}
              />
            ))}
          </List>
          <View
            style={{
              justifyContent: "flex-end",
              flexDirection: "row"
            }}
          >
            <Text style={{ fontSize: 10, color: "#868686", marginRight: 10 }}>
              $xx (balance) + $xx (amortized tax)
            </Text>
          </View>
          <View
            style={{
              justifyContent: "flex-end",
              flexDirection: "row",
              margin: 5
            }}
          >
            <Text style={{ marginRight: 5, fontWeight: "bold", marginTop: 2 }}>
              Total:
            </Text>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {"$" + this.state.total.toFixed(2)}
            </Text>
          </View>
          <View style={styles.modalBtnContainer}>
            <Button
              rounded
              title="Cancel"
              color="#868686"
              backgroundColor="rgba(0, 0, 0, 0.0)"
              fontSize={15}
              buttonStyle={styles.modalBtn}
              onPress={() => {
                this.setState({ isModalVisible: false });
              }}
            />
            <Button
              rounded
              title="OK"
              color="#9ccc65"
              backgroundColor="rgba(0, 0, 0, 0.0)"
              fontSize={15}
              buttonStyle={styles.modalBtn}
              onPress={() => {
                this.state.confirmCallback({
                  accumTotal: this.state.total,
                  detectedTotal: "$114.58",
                  image_url: this.state.image_url,
                  items: this.state.receiptData,
                  place: "Walmart",
                  status: this.state.status,
                  time: this.state.time,
                  title: this.state.title,
                  friends: this.state.friends
                });
                this.setState({ isModalVisible: false });
              }}
            />
          </View>
        </ScrollView>
      </Modal>
    );
  }
}

const { width: viewportWidth, height: viewportHeight } = Dimensions.get(
  "window"
);
const marginLR = 5;
const itemWidth = viewportWidth - 2 * marginLR;

const styles = StyleSheet.create({
  // Modal Contents
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
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
    marginRight: -20,
    marginLeft: -30
    // height: 10
  }
});
