import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList
} from "react-native";

import { Button } from "react-native-elements";

export default class GroupMain extends Component {
  constructor() {
    super();

    this.state = {
      user_id: window.user_id
    };
  }

  componentDidMount() {
    this.loadGroupsData();
  }

  componentDidUpdate() {
    if (this.state.user_id === this.props.screenProps) {
      return;
    }

    this.loadGroupsData();
  }

  loadGroupsData() {
    fetch("http://52.12.74.177:5000/getAllGroups", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: this.state.user_id
      })
    })
      .then(response => {
        this.setState({ groupsData: JSON.parse(response._bodyText) });
      })
      .catch(error => {
        console.error("Error: group list fetch error." + error);
      });
  }

  checkGroupDetail = group_id => {
    // fetch("http://52.12.74.177:5000/getAllGroups", {
    //     method: "POST",
    //     headers: {
    //         Accept: "application/json",
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({
    //         user_id: this.state.user_id
    //     })
    // })
    // .then(response => {
    //     this.setState({ groupsData: JSON.parse(response._bodyText) });
    // })
    // .catch(error => {
    //     console.error("Error: group list fetch error." + error);
    // });
  };

  _renderItem = ({ item, section }) => (
    <View>
      <Text key={item.group_id} style={styles.item}>
        {item.group_name}
      </Text>
    </View>
  );

  render() {
    return (
      <View>
        <Text> Group Main </Text>
        <Button
          onPress={() => {
            this.props.navigation.navigate("GroupCreate");
          }}
          title="Create a new group"
        />

        <View>
          <FlatList
            onPress={() => {
              this.checkGroupDetail(item.group_id);
            }}
            data={this.state.groupsData}
            renderItem={({ item }) => (
              <Text style={styles.item} key={item.group_id}>
                {item.group_name}
              </Text>
            )}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44
  }
});
