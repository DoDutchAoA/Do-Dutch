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
      image_url: props.image_url,
      title: props.title,
      total: props.total,
      payerTotal: props.payerTotal,
      sharerTotal: props.sharerTotal,
      place: props.place,
      time: props.time,
      status: props.status,
      items: props.items,
      group: props.group
    };
  }

  render() {
    let balance = "$0.00";
    let unpaidCount = 0;
    let statusStyle, balanceStyle;
    if (this.state) {
      if (this.state.group != undefined) {
        this.state.group.members.forEach(member => {
          if (!member.paid) unpaidCount += 1;
        });
      }
      if (this.state.status == "Sharer") {
        statusStyle = styles.sharerTagContainer;
      } else {
        statusStyle = styles.payerTagContainer;
        balance = (-this.state.sharerTotal * unpaidCount).toFixed(2);
        if (unpaidCount == 0) balanceStyle = styles.greenText;
        else balanceStyle = styles.redText;
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
                  /{this.state.total.toFixed(2)}
                </Text>
              </View>
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
              <View style={statusStyle}>
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
      receiptHistory: this.props.receiptHistory
    };
  }

  componentDidMount() {
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

  render() {
    let content;
    let keyword = this.props.keyword;
    if (this.state.receiptHistory.length > 0) {
      content = (
        <FlatList
          data={this.state.receiptHistory}
          extraData={this.state}
          renderItem={({ item, index }) => {
            if (keyword.length > 0) {
              if (
                !item.title
                  .toLowerCase()
                  .includes(this.props.keyword.toLowerCase()) &&
                !item.place
                  .toLowerCase()
                  .includes(this.props.keyword.toLowerCase()) &&
                !item.status
                  .toLowerCase()
                  .includes(this.props.keyword.toLowerCase())
              )
                return;
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
                status={item.status}
                items={item.items}
                group={item.group}
                index={index}
              />
            );
          }}
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
  greenText: {
    fontSize: 16,
    color: "#00aa00"
  },
  redText: {
    fontSize: 16,
    color: "#aa0000"
  },
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
    width: 60,
    alignItems: "center",
    marginTop: 3
  }
});
