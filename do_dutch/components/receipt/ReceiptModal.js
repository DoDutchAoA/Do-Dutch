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
import NetworkHelper from "./NetworkHelper.js";

const digits = 2;

export class Title extends React.Component { //Receipt name

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
            className="ChangeConfirmed"
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
            className="ChangeDropped"
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

export class Item extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditable: false,
      data: props.data,
      tempText: props.data.name,
      split: true
    };
  }

  setToFix(number, digits) {
    return (number !== undefined) ? number.toFixed(digits) : number;
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
          style={{ flexDirection: "row" }}
        >
          <TextInput
            value={this.state.tempText}
            style={{ height: 40, marginRight: -50 }}
            placeholder=""
            onChangeText={text =>
              this.setState({
                tempText: text
              })
            }
          />

          <Icon
            className="ChangeConfirmed"
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
            className="ChangeDropped"
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

    const digits = 2;
    let splitButtons;
    let payerTotal;
    if (this.props.sharerCount == 1) {
      splitButtons = ["All"];
      payerTotal = this.setToFix(this.props.data.price, digits);
    } else {
      splitButtons = ["Split", "All"];
      if (this.state.data.split) {
        let payment = this.props.data.price / (this.props.sharerCount + 1);
        payerTotal = this.setToFix(payment, digits);
      } else {
        payerTotal = this.setToFix(this.props.data.price, digits);
      }
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
        key={this.state.data.name}  //Item name
        title={<View>{name}</View>}
        hideChevron
        badge={{
          element: (
            <View style={{ flexDirection: "row" }}>
              <Text style={{ marginTop: 5, marginRight: 5 }}>$</Text>
              <Text id="processed" style={{ marginTop: 5, marginRight: 1 }}>{payerTotal}</Text>
              <Text
                style={{
                  color: "#aaa",
                  marginTop: 10,
                  marginRight: 1,
                  fontSize: 10
                }}
              >
                {"/" + this.setToFix(this.props.data.price, digits)}
              </Text>
              <ButtonGroup
                className="SplitBtn"
                onPress={index => {
                  let data = this.state.data;
                  data.split = index == 0;  //split == 0, all == 1
                  this.setState({ data: data });
                  this.props.updateReceipt(this.state.data);
                }}

                selectedIndex={this.state.data.split ? 0 : 1}
                buttons={splitButtons}
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
      sharerCount: 1,
      receiptItems: [],
      confirmCallback: () => { },
      total: 0,
      payerTotal: 0,
      sharerTotal: 0,
      image_url: "",
      groups: [],
      isPayer: true,
      receiptId: 0,
      payment: ""
    };
  }

  componentDidMount() {
    if (this.props.onRef)
      this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  calculateTotal() {
    let payerTotal = 0;
    let sharerTotal = 0;
    let total = 0;

    for (let index in this.state.receiptItems) {
      let curItem = this.state.receiptItems[index];

      if (curItem.split) {
        payerTotal += curItem.price / this.state.sharerCount;
      } else {
        payerTotal += curItem.price;
      }
      total += curItem.price;

    }

    if (this.state.sharerCount > 1) {
      sharerTotal = (total - payerTotal) / (this.state.sharerCount - 1);
    } else {
      sharerTotal = 0;
    }

    this.setState({
      total: total,
      payerTotal: payerTotal,
      sharerTotal: sharerTotal
    });
  }

  setToFix(number, digits) {
    return (number !== undefined) ? number.toFixed(digits) : number;
  }

  launch(receipt, groups, confirmCallback) {
    let sharerCount = 1;
    if (receipt.group != undefined && receipt.group.members != undefined) {
      sharerCount = receipt.group.members.length;
    }

    this.setState({
      //   //// Receipt Info ////
      title: receipt.title,
      time: receipt.time,
      receiptItems: receipt.items,
      image_url: receipt.image_url,
      group: receipt.group,
      creator: receipt.creator,
      isPayer: receipt.creator == window.user_id,
      receiptId: receipt.receiptId,
      payment: receipt.payment,
      //// Local Info ////
      isModalVisible: true,
      sharerCount: sharerCount,
      confirmCallback: confirmCallback,
      groups: groups
    });

    this.calculateTotal();
  }

  renderGroupList() {
    let groupList;
    if (this.state.groups == undefined || this.state.groups.length == 0) {
      groupList = (
        <View>
          <Text id="NoGroupPrompt">"You haven't enrolled in any group."></Text>
        </View>
      );
    } else {
      groupList = (
        <View id="GroupList">
          <Text style={{ marginTop: 10, fontSize: 15, fontWeight: "bold" }}>
            Groups
          </Text>
          <ScrollView
            horizontal={true}
            scrollEnabled={true}
            contentContainerStyle={styles.modalContent}
            style={{ height: 100 }}
          >
            {this.state.groups.map((group, index) => {
              let selected;

              if (this.state.group != undefined)
                selected = this.state.group.group_id == group.group_id;
              else selected = false;
              let opacity = selected ? 1.0 : 0.3;
              let icon = selected ? (
                <Icon
                  reverse
                  raised
                  id="selected"
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
                <View className="Group"
                  style={{
                    flexDirection: "column",
                    alignItems: "center",
                    marginRight: 10
                  }}
                  key={index.toString()}
                >
                  <Avatar
                    className="Avatar"
                    medium
                    rounded
                    source={group.avatar}
                    onPress={() => {
                      if (
                        this.state.group != undefined &&
                        this.state.group.group_id == group.group_id
                      ) {
                        this.setState(
                          {
                            group: undefined,
                            sharerCount: 1
                          },
                          this.calculateTotal
                        );
                      } else {

                        this.setState(
                          {
                            group: group,
                            sharerCount: group.members.length
                          },
                          this.calculateTotal
                        );
                      }
                    }}
                    activeOpacity={0.7}
                    avatarStyle={{ opacity: opacity, backgroundColor: "#fff" }}
                  />
                  <Text style={{ marginTop: 5 }}>{group.group_name}</Text>
                  <View style={{ marginTop: -25 }}>{icon}</View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      );
      if (this.state.group != undefined) {
        memberList = (
          <View>
            <Text style={{ marginTop: 5, fontSize: 13 }}>
              Share with {this.state.sharerCount - 1} people:
            </Text>
            <ScrollView
              horizontal={true}
              scrollEnabled={true}
              contentContainerStyle={styles.modalContent}
              style={{ height: 90 }}
            >
              {this.state.group.members.map((member, index) => {
                member.key = index.toString();
                if (member.member_id == window.user_id) return <View />;
                let avatar =
                  member.payment == "paid" ||
                  member.member_id == window.user_id ? (
                    <Avatar
                      small
                      rounded
                      overlayContainerStyle={{ backgroundColor: "#0d0" }}
                      icon={{
                        name: "check",
                        type: "font-awesome"
                      }}
                      avatarStyle={{ backgroundColor: "#fff" }}
                    />
                  ) : (
                    <Avatar
                      small
                      rounded
                      source={member.avatar}
                      avatarStyle={{ backgroundColor: "#fff" }}
                    />
                  );
                return (
                  <View
                    style={{
                      flexDirection: "column",
                      alignItems: "center",
                      marginRight: 10,
                      marginTop: -10
                    }}
                    key={index.toString()}
                  >
                    {avatar}
                    <Text style={{ marginTop: 0, marginBottom: 5 }}>
                      {member.member_name}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        );
      }
    }

    let confirmBtnTitle = this.state.isPayer ? "OK" : "Pay";
    let cancelBtnTitle = this.state.isPayer ? "Cancel" : "Challenge";
    let groupList = this.renderGroupList();
    let memberList = this.renderMemberList();
    let itemList = this.renderItemList();

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
          {groupList}
          {memberList}

          {/************* Items **************************/}
          <Text
            style={{
              marginBottom: -10, fontSize: 15,
              backgroundColor: "#fff", fontWeight: "bold"
            }}>
            Your Items
          </Text>
          {itemList}
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
            <Text id="splitTotal" style={{ fontSize: 20, fontWeight: "bold" }}>
              {"$" + this.setToFix(this.state.payerTotal, digits)}
            </Text>
            <Text
              style={{
                color: "#aaa",
                marginTop: 5,
                fontSize: 13
              }}
            >
              {" / " + this.setToFix(this.state.total, digits)}
            </Text>
          </View>

          <View style={styles.modalBtnContainer}>
            <Button
              rounded
              id="ReceiptCancel"
              title={cancelBtnTitle}
              color="#868686"
              backgroundColor="rgba(0, 0, 0, 0.0)"
              fontSize={15}
              buttonStyle={styles.modalBtn}
              onPress={() => {
                let confirmType = this.state.isPayer ? "cancel" : "challenge";
                let payment = this.state.isPayer ? "unpaid" : "challenged";
                this.state.confirmCallback(confirmType, {
                  receiptId: this.state.receiptId,
                  total: this.state.total,
                  payerTotal: this.state.payerTotal,
                  sharerTotal: this.state.sharerTotal,
                  detectedTotal: "$114.58",
                  image_url: this.state.image_url,
                  items: this.state.receiptItems,
                  place: "The Famous Supermarket",
                  time: this.state.time,
                  title: this.state.title,
                  creator: this.state.creator,
                  group: this.state.group,
                  payment: payment
                });
                this.setState({ isModalVisible: false });
              }}
            />
            <Button
              rounded
              id="ReceiptConfirm"
              title="OK"
              color="#9ccc65"
              backgroundColor="rgba(0, 0, 0, 0.0)"
              fontSize={15}
              buttonStyle={styles.modalBtn}
              onPress={() => {
                let confirmType = this.state.isPayer ? "update" : "pay";
                let payment = this.state.isPayer ? "unpaid" : "paid";
                let group = this.state.group;
                if (confirmType == "update") {
                  group.members.forEach((member, index) => {
                    if (member.member_id != window.user_id) {
                      group.members[index].payment = "unpaid";
                    }
                  });
                }
                this.state.confirmCallback(confirmType, {
                  receiptId: this.state.receiptId,
                  total: this.state.total,
                  payerTotal: this.state.payerTotal,
                  sharerTotal: this.state.sharerTotal,
                  detectedTotal: "$114.58",
                  image_url: this.state.image_url,
                  items: this.state.receiptItems,
                  place: "The Famous Supermarket",
                  time: this.state.time,
                  title: this.state.title,
                  creator: this.state.creator,
                  group: group,
                  payment: payment
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
