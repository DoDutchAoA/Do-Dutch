import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList
} from "react-native";
import { Button, Badge, FormInput } from "react-native-elements";

export default class GroupChat extends Component {
  constructor() {
    super();

    this.state = {
      group_id: -1,
      chatsData: [],
      nnew_comment: ""
    };
  }

  componentDidMount() {
    this.loadGroupChatData();
  }

  componentDidUpdate() {
    group_id = this.props.navigation.getParam("group_id", -1);

    if (group_id == this.state.group_id) {
      return;
    }

    this.loadGroupChatData();
  }

  loadGroupChatData() {
    this.state.group_id = this.props.navigation.getParam("group_id", -1);

    fetch("http://52.12.74.177:5000/getGroupChats", {
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
        this.setState({ chatsData: JSON.parse(response._bodyText) });
      })
      .catch(error => {
        console.error("Error: group chat fetch error." + error);
      });
  }

  addComment() {
    fetch("http://52.12.74.177:5000/addGroupChat", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        group_id: this.state.group_id,
        user_id: window.user_id,
        user_name: window.username,
        text: this.state.new_comment
      })
    })
      .then(response => {
        console.log(response._bodyText);
        if (response._bodyText == false) {
          alert("Fail to send the message.");
        }
      })
      .catch(error => {
        console.error("Error: group chat insert error." + error);
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
        <View>
          <FlatList
            data={this.state.chatsData}
            renderItem={({ item }) => (
              <Text style={styles.item} key={item.timestamp}>
                {item.text}
              </Text>
            )}
            ItemSeparatorComponent={this.renderSeparator}
          />
        </View>
        <View>
          <FormInput
            autoFocus={true}
            value={this.state.new_comment}
            onChangeText={text => this.setState({ new_comment: text })}
          />
          <Button
            large
            backgroundColor="#8e44ad"
            icon={{ name: "envira", type: "font-awesome" }}
            onPress={e => this.addComment()}
            title="Send"
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
    color: "#283747",
    fontWeight: "bold",
    fontSize: 25
  }
});
