import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList
} from "react-native";
import { Button, Badge } from "react-native-elements";

export default class GroupDetail extends Component {
  constructor() {
    super();

    this.state = {
      group_id: -1,
      group_name: "",
      owner_id: -1,
      groupsData: [],
      force_reload: -1
    };
  }

  componentDidMount() {
    this.loadGroupsData();
  }

  componentDidUpdate() {
    if (
      this.state.group_id === this.props.navigation.getParam("group_id", -1) &&
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

  loadOwnerButtons() {
    if (window.user_id == this.state.owner_id && this.state.owner_id !== -1) {
      return (
        <View>
          <Text> {"\n"} </Text>
          <Button onPress={() => this.deleteGroup()} title="delete group" />

          <Button
            onPress={() =>
              this.props.navigation.navigate("GroupAddMembers", {
                group_id: this.state.group_id
              })
            }
            title="add more members"
          />
        </View>
      );
    }
  }

  loadGroupsData() {
    this.state.group_id = this.props.navigation.getParam("group_id", -1);
    this.state.group_name = this.props.navigation.getParam("group_name", "");
    this.state.owner_id = this.props.navigation.getParam("owner_id", -1);

    fetch("http://52.12.74.177:5000/getAllMembersByGroupId", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        group_id: this.state.group_id
      })
    })
      .then(response => {
        console.log(response._bodyText);
        this.setState({ groupsData: JSON.parse(response._bodyText) });
      })
      .catch(error => {
        console.error("Error: group list fetch error." + error);
      });
  }

  deleteGroup() {
    fetch("http://52.12.74.177:5000/removeGroup", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        groupId: this.state.group_id
      })
    })
      .then(response => {
        console.log(response._bodyText);
        if (response._bodyText == "true") {
          alert("The group is deleted.");
        } else {
          alert("Fail to delete the group.");
        }
        this.props.navigation.navigate("GroupMain", { force_reload: 0 });
      })
      .catch(error => {
        console.error("Error: group list fetch error." + error);
      });
  }

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
        <Badge containerStyle={{ backgroundColor: "#58D68D" }}>
          <Text style={styles.groupinfo}> {this.state.group_name} </Text>
        </Badge>

        {this.loadOwnerButtons()}

        <View>
          <FlatList
            data={this.state.groupsData}
            renderItem={({ item }) => (
              <Text style={styles.item} key={item.member_id}>
                {item.member_name}
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
  },
  groupinfo: {
    color: "#F7F9F9",
    fontWeight: "bold",
    fontSize: 25
  }
});
