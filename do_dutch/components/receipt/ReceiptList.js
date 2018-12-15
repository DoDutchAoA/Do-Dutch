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
      image_url: props.image_url,
      title: props.title,
      total: props.total,
      payerTotal: props.payerTotal,
      sharerTotal: props.sharerTotal,
      place: props.place,
      time: props.time,
      items: props.items,
      group: props.group,
      creator: props.creator,
      listTitle: props.listTitle
    };
  }

  setToFix(number, digits) {
    return (number !== undefined) ? number.toFixed(digits) : number;
  }

  render() {
    let balance = "$0.00",
      status;
    let unpaidCount = 0,
      totalCount = 0;
    let statusStyle, balanceStyle, sharerStyle;
    if (this.state.group != undefined) {
      this.state.group.members.forEach(member => {
        if (!member.paid) unpaidCount += 1;
        totalCount += 1;
      });
    } else {
      unpaidCount = 0;
      totalCount = 0;
    }
    if (
      (this.state.listTitle == "ONGOING" && unpaidCount == 0) ||
      (this.state.listTitle == "PAST" && unpaidCount > 0)
    ) {
      return <View />;
    }

    if (this.state.creator == window.user_id) {
      status = "Payer";
      statusStyle = styles.payerTagContainer;
      balance = this.setToFix(-this.state.sharerTotal * unpaidCount, digits);
      // (-this.state.sharerTotal * unpaidCount).toFixed(2);
      if (unpaidCount == 0) {
        balanceStyle = styles.greenText;
        sharerStyle = styles.greenSharerText;
      } else {
        balanceStyle = styles.redText;
        sharerStyle = styles.redSharerText;
      }
    } else {
      status = "Sharer";
      statusStyle = styles.sharerTagContainer;
      balance = this.setToFix(-this.state.sharerTotal * unpaidCount, digits);
      (-this.state.sharerTotal * unpaidCount).toFixed(2);
      if (unpaidCount == 0) {
        balanceStyle = styles.greenText;
        sharerStyle = styles.greenSharerText;
      } else {
        balanceStyle = styles.redText;
        sharerStyle = styles.redSharerText;
      }
    }

    return (
      <TouchableOpacity
        onPress={() => this.props.onPressRecord(this.props.index)}
      >
        <View style={styles.rowContainer}>
          <Image source={{ uri: this.state.image_url }} style={styles.photo} />
          <View style={{ flex: 1, flexDirection: "column" }}>
            <View style={styles.containerText}>
              <Text style={{ fontSize: 16, color: "#000" }}>
                {this.state.title}
              </Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={balanceStyle}>${balance}</Text>
                <Text style={{ fontSize: 16, color: "#aaa" }}>
                  /{ this.setToFix(this.state.total, digits) }
                </Text>
              </View>
            </View>
            <View style={styles.containerText}>
              <Text style={{ fontSize: 10, color: "#aaa" }}>
                {this.state.place}
              </Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={sharerStyle}>{totalCount - unpaidCount}</Text>
                <Text style={{ fontSize: 12, color: "#aaa" }}>
                  /{totalCount} Sharers Paid
                </Text>
              </View>
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
                {this.state.time}
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
      receiptHistory: this.props.receiptHistory,
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
      receiptHistory: []
    });

    setTimeout(() => {
      this.setState({
        receiptHistory: receiptHistory
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
          renderItem={({ item, index }) => {
            if (keyword.length > 0) {
              if (
                !item.title
                  .toLowerCase()
                  .includes(this.props.keyword.toLowerCase()) &&
                !item.place
                  .toLowerCase()
                  .includes(this.props.keyword.toLowerCase())
              )
                return null;
            }
            return (
              ///////////////// DATA DEFINE ///////////////////
              <ReceiptListItem
                onPressRecord={this.props.onPressRecord}
                image_url={item.image_url}
                title={item.title}
                total={item.total}
                payerTotal={item.payerTotal}
                sharerTotal={item.sharerTotal}
                place={item.place}
                time={item.time}
                creator={item.creator}
                items={item.items}
                group={item.group}
                index={index}
                listTitle={this.props.listTitle}
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
  greenSharerText: {
    fontSize: 12,
    color: "#00aa00"
  },
  redSharerText: {
    fontSize: 12,
    color: "#aa0000"
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
    width: 60,
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
