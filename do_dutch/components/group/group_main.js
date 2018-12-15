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
      user_id: window.user_id,
      force_reload: -1
    };
  }

  componentDidMount() {
    this.loadGroupsData();
  }

  componentDidUpdate() {
    if (
      this.state.user_id === this.props.screenProps &&
      this.props.navigation.getParam("force_reload", -1) ==
        this.state.force_reload
    ) {
      if (this.state.force_reload === 0) {
        this.state.force_reload = -1;
      }
      return;
    }

    this.state.force_reload = this.props.navigation.getParam(
      "force_reload",
      -1
    );
    this.loadGroupsData();
  }

  forceReload() {
    this.setState({ force_reload: this.state.force_reload + 1 });
  }

  loadGroupsData() {
    fetch("http://52.12.74.177:5000/getAllGroups", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: this.props.screenProps
      })
    })
      .then(response => {
        this.state.user_id = this.props.screenProps;
        this.setState({ groupsData: JSON.parse(response._bodyText) });
      })
      .catch(error => {
        console.error("Error: group list fetch error." + error);
      });
  }

  _renderItem = ({ item, section }) => (
    <View>
      <Text key={item.group_id} style={styles.item}>
        {item.group_name}
      </Text>
    </View>
  );

  renderSeparator = () => (
    <View
      style={{
        backgroundColor: "#ABB2B9",
        height: 0.5
      }}
    />
  );

  render() {
    return (
      <View>
        <Button
          large
          icon={{ name: "group" }}
          onPress={() => {
            this.props.navigation.navigate("GroupCreate");
          }}
          titleStyle={{ fontWeight: "700" }}
          buttonStyle={{
            backgroundColor: "#16A085",
            width: 370,
            height: 45,
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 5
          }}
          title="Create New Group"
        />
        <View>
          <FlatList
            data={this.state.groupsData}
            renderItem={({ item }) => (
              <Text
                onPress={() => {
                  this.props.navigation.navigate("GroupDetail", {
                    group_id: item.group_id,
                    group_name: item.group_name,
                    owner_id: item.owner_id
                  });
                }}
                style={styles.item}
                key={item.group_id}
              >
                {item.group_name}
              </Text>
            )}
            ItemSeparatorComponent={this.renderSeparator}
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
