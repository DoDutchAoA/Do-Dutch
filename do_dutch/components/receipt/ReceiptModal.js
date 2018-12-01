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
  Avatar
} from "react-native-elements";

import Modal from "react-native-modal";
import NumericInput from "react-native-numeric-input";

class Item extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditable: false,
      data: props.data,
      tempText: props.data.name,
      amount: 5,
      total: 5
    };
  }

  componentDidMount() {
    this.props.onRef(this);
  }
  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  changeEditable() {
    this.setState({ isEditable: !this.state.isEditable });
  }

  render() {
    let name;
    if (!this.state.isEditable) {
      name = (
        <TouchableOpacity
          // style={{ width: 100, height: 50 }}
          onPress={() => this.changeEditable()}
        >
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
              let _data = this.state.data;
              _data.name = this.state.tempText;
              this.setState({ data: _data });
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
              <Text style={{ marginTop: 5, marginRight: 10 }}>
                ${this.state.total}
              </Text>
              <NumericInput
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
              />
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
      friendsData: [
        {
          name: "Amy Farha",
          avatar:
            "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg",
          selected: false
        }
      ],
      receiptData: [
        {
          name: "name",
          icon: "file"
        }
      ]
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

  launch(receiptData, friendsData, confirmCallback) {
    this.setState({
      isModalVisible: true,
      receiptData: receiptData,
      friendsData: friendsData,
      confirmCallback: confirmCallback
    });
  }

  render() {
    return (
      <Modal
        isVisible={this.state.isModalVisible}
        // onSwipe={() => this.setState({ isModalVisible: false })}
        // swipeDirection="down"
      >
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
            <Text style={{ fontSize: 80, color: "#e1e1e1" }}>NOV 16</Text>
          </View>

          <Text style={{ fontSize: 30, fontWeight: "bold" }}>Receipt</Text>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>Friends</Text>
          <ScrollView
            horizontal={true}
            scrollEnabled={true}
            contentContainerStyle={styles.modalContent}
            style={{ height: 110 }}
          >
            {this.state.friendsData.map((l, index) => {
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
                >
                  <Avatar
                    medium
                    rounded
                    source={{
                      uri: l.avatar
                    }}
                    onPress={() => {
                      let friends = this.state.friendsData;
                      friends[index].selected = !friends[index].selected;
                      this.setState({ friends: friends });
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
            {this.state.receiptData.map(l => (
              <Item onRef={ref => (this.item = ref)} data={l} />
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
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>$50.00</Text>
          </View>
          <View style={styles.modalBtnContainer}>
            <Button
              rounded
              title="Cancel"
              color="#868686"
              backgroundColor="rgba(0, 0, 0, 0.0)"
              fontSize={15}
              buttonStyle={styles.modalBtn}
            />
            <Button
              rounded
              title="OK"
              color="#9ccc65"
              backgroundColor="rgba(0, 0, 0, 0.0)"
              fontSize={15}
              buttonStyle={styles.modalBtn}
              onPress={() => {
                this.state.confirmCallback();
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
