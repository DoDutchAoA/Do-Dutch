import React, { Component } from 'react';
import { AppRegistry, Image } from 'react-native'; 
import {Platform, StyleSheet, Text, View, TextInput} from 'react-native'; 
import { Button } from 'react-native-elements'; 

export default class Signup extends Component { 

  userSignUp() { 
    if (this.state.password != this.state.password_confirm) {
        alert("Password not match!"); 
        return; 
    }

    RNFetchBlob.fetch('POST', 'http://www.example.com/upload-form', {
      'Content-Type' : 'application/json',
    }, [
    { 
        username: this.state.username, 
        password: this.state.password
    },
    ]).then((resp) => {

    }).catch((err) => {

    })
  }

  render() { 
    this.state = {
      username: "", 
      password: "", 
      password_confirm: "", 
      text: 'Useless Placeholder' 
    }; 

    return ( 
    	<View> 
    		<Text> Sign Up </Text>  

            <TextInput  
            autoFocus={true} 
            keyboardType='email-address' 
            onChangeText={(text) => this.setState({username: text})}/> 

            <TextInput 
            placeholder='password' 
            secureTextEntry={true} 
            onChangeText={(text) => this.setState({password: text})} /> 

            <TextInput 
            placeholder='password_confirm' 
            secureTextEntry={true} 
            onChangeText={(text) => this.setState({password_confirm: text})} /> 

          <Button onPress={(e) => this.userSignUp(e)} title='sign up'/> 
    	</View> 
    );
  }
} 
