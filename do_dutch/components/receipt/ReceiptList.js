import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Text
} from "react-native";

import { FlatList } from "react-native";
import { Divider } from "react-native-elements";

const digits = 2;

export class ReceiptListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      receipt: props.receipt
    };
  }

  setToFix(number, digits) {
    return (number !== undefined) ? number.toFixed(digits) : number;
  }

  render() {

    if (!this.state.receipt)
      return null;

    let receipt = this.state.receipt;
    let balance = "$0.00",
      status;
    let unpaidCount = 0,
      totalCount = 0;
    let statusStyle, balanceStyle, sharerStyle;

    if (receipt.group != undefined) {
      receipt.group.members.forEach(member => {
        if (member.member_id != window.user_id) {
          totalCount += 1;
          if (!(member.payment == "paid")) {
            unpaidCount += 1;
          }
        }
      });
    } else {
      unpaidCount = 0;
      totalCount = 0;
    }

    ///////// DON"T SHOW THIS RECEIPT  /////////////
    ///////////   Payer    ///////////////
    if (receipt.creator == window.user_id) {
      if (
        (this.props.listTitle == "ONGOING" && unpaidCount == 0) ||
        (this.props.listTitle == "PAST" && unpaidCount > 0)
      ) {
        return <View />;
      }
    } else {
      if (
        (this.props.listTitle == "ONGOING" && receipt.payment == "paid") ||
        (this.props.listTitle == "PAST" && !(receipt.payment == "paid"))
      ) {
        return <View />;
      }
    }

    let paymentInfo;
    ////////////// IS PAYER! /////////////////
      if (receipt.creator == window.user_id) {
        status = "Payer";
        statusStyle = styles.payerTagContainer;
        balance = this.setToFix(-receipt.sharerTotal * unpaidCount, digits);
        if (unpaidCount == 0) {
          balanceStyle = styles.greenText;
          sharerStyle = styles.greenSharerText;
        } else {
          balanceStyle = styles.redText;
          sharerStyle = styles.redSharerText;
        }
        paymentInfo = (
          <View style={{ flexDirection: "row" }}>
            <Text style={sharerStyle}>{totalCount - unpaidCount}</Text>
            <Text style={{ fontSize: 12, color: "#aaa" }}>
              /{totalCount} Sharers Paid
            </Text>
          </View>
        );
      }

      paymentInfo = (
        <View style={{ flexDirection: "row" }}>
          <Text style={sharerStyle}>{totalCount - unpaidCount}</Text>
          <Text style={{ fontSize: 12, color: "#aaa" }}>
            /{totalCount} Sharers Paid
          </Text>
        </View>
      );
    }
    ////////////// IS SHARER! ///////////////
    else {
      status = "Sharer";
      statusStyle = styles.sharerTagContainer;
      let paidPrompt;
      if (receipt.payment == "paid") {
        balance = (0).toFixed(2);
        balanceStyle = styles.greenText;
        sharerStyle = styles.greenSharerText;
        paidPrompt = "Paid √";
      } else {
        balance = receipt.sharerTotal.toFixed(2);
        balanceStyle = styles.redText;
        sharerStyle = styles.redSharerText;
        paidPrompt = "Unpaid";
      }
      paymentInfo = <Text style={sharerStyle}>{paidPrompt}</Text>;
    }
    //////////// AFTER ALL, CHALLENGED //////////////
    if (receipt.payment == "challenged") {
      balance = receipt.sharerTotal.toFixed(2);
      balanceStyle = styles.yellowText;
      sharerStyle = styles.yellowSharerText;
      paidPrompt = "Challenged";
      paymentInfo = <Text style={sharerStyle}>{paidPrompt}</Text>;
    }

    return (
      <TouchableOpacity
        onPress={() => this.props.onPressRecord(this.props.index)}
      >
        <View style={styles.rowContainer}>
          <Image source={{ uri: receipt.image_url }} style={styles.photo} />
          <View style={{ flex: 1, flexDirection: "column" }}>
            <View style={styles.containerText}>
              <Text style={{ fontSize: 16, color: "#000" }}>
                {receipt.title}
              </Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={balanceStyle}>${balance}</Text>
                <Text style={{ fontSize: 16, color: "#aaa" }}>
                  /{this.setToFix(receipt.total, digits)}
                </Text>
              </View>
            </View>
            <View style={styles.containerText}>
              <Text style={{ fontSize: 10, color: "#aaa" }}>
                {receipt.place}
              </Text>
              {paymentInfo}
            </View>
            <View style={styles.containerText}>
              <View style={statusStyle} className="itemOnwerStatus">
                <Text
                  style={{
                    fontSize: 10,
                    color: "#ffffff"
                  }}
                >
                  {status}
                </Text>
              </View>
              <Text style={{ fontSize: 10, color: "#aaa" }}>
                {receipt.time}
              </Text>
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
      receiptList: this.props.receiptHistory
    };
  }

  componentDidMount() {
    if (this.props.onRef)
      this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  setReceiptHistory(receiptHistory) {
    this.setState({
      receiptList: []
    });

    setTimeout(() => {
      this.setState({
        receiptList: receiptHistory
      });
    }, 0);
  }

  renderList() {
    let content;
    let keyword = this.props.keyword;
    let receiptHistory = this.state.receiptHistory
    if (receiptHistory !== undefined && receiptHistory !== null &&
      receiptHistory.length > 0) {
      content = (
        <FlatList
          data={receiptHistory}
          extraData={this.state}
          renderItem={({ item: receipt, index }) => {
            if (keyword.length > 0) {
              if (
                !receipt.title
                  .toLowerCase()
                  .includes(this.props.keyword.toLowerCase()) &&
                !receipt.place
                  .toLowerCase()
                  .includes(this.props.keyword.toLowerCase())
              )
                return null;
            }
            return (
              ///////////////// DATA DEFINE ///////////////////
              <ReceiptListItem
                index={index}
                onPressRecord={this.props.onPressRecord}
                listTitle={this.props.listTitle}
                receipt={receipt}
              />
            );
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      );
    } else {
      content = this.renderPrompt();
    }

    return content;
  }

  renderPrompt() {
    return <Text className="prompt">{this.props.prompt}</Text>;
  }

  render() {
    let content = this.renderList();
    return (
      <View>
        <View style={styles.listTitleContainer}>
          <Text style={styles.listTitle}>{this.props.listTitle}</Text>
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
  greenText: {
    fontSize: 16,
    color: "#00aa00"
  },
  redText: {
    fontSize: 16,
    color: "#aa0000"
  },
  yellowText: {
    fontSize: 16,
    color: "#aaaa00"
  },
  greenSharerText: {
    fontSize: 12,
    color: "#00aa00"
  },
  redSharerText: {
    fontSize: 12,
    color: "#aa0000"
  },
  yellowSharerText: {
    fontSize: 12,
    color: "#aaaa00"
  },
  listTitle: {
    fontWeight: "bold",
    backgroundColor: "#ffffff",
    color: "#000000",
    padding: 3
  },
  listTitleContainer: {
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
  sharerTagContainer: {
    backgroundColor: "steelblue",
    borderRadius: 2,
    width: 40,
    alignItems: "center",
    marginTop: 3
  },
  payerTagContainer: {
    backgroundColor: "green",
    borderRadius: 2,
    width: 40,
    alignItems: "center",
    marginTop: 3
  }
});
