import React, { Component } from "react";
import { AppRegistry, Image } from "react-native";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView
} from "react-native";

export default class ReceiptScreen extends Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    return (
      <ScrollView>
        <Text>
          {" "}
          Total price: {this.props.navigation.getParam(
            "receipt_total",
            "0"
          )}{" "}
        </Text>
        <FlatList
          data={this.props.navigation.getParam("receipt_items", [])}
          renderItem={({ item }) => (
            <View>
              <Text>{item.display}</Text>
              <Text>{item.price}</Text>
            </View>
          )}
        />
      </ScrollView>
    );
  }
}
