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
    this.state = { isModalVisible: false, friends: props.friends };
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

  toggle() {
    this.setState({ isModalVisible: !this.state.isModalVisible });
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
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Receipt</Text>
          <ScrollView
            horizontal={true}
            scrollEnabled={true}
            contentContainerStyle={styles.modalContent}
          >
            {this.state.friends.map((l, index) => {
              let opacity = l.selected ? 1.0 : 0.3;
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
                      console.log(this.state.friends[index]);
                      let friends = this.state.friends;
                      friends[index].selected = !friends[index].selected;
                      this.setState({ friends: friends });
                    }}
                    activeOpacity={0.7}
                    avatarStyle={{ opacity: opacity, backgroundColor: "#fff" }}
                  />
                  <Text>{l.name}</Text>
                </View>
              );
            })}
          </ScrollView>
          <List containerStyle={{ marginBottom: 20 }}>
            {this.props.data.map(l => (
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
