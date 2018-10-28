/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */


import React, {Component} from 'react';
import {
  Platform, 
  StyleSheet, 
  Text, 
  View,
  FlatList,
  Image,
  ActivityIndicator
} from 'react-native';

 

export default class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      isLoading: true
    }
  }

  componentDidMount() {

    fetch('http://facebook.github.io/react-native/movies.json')
      .then(res => res.json())
      .then(result =>{
        this.setState({
          items:result.movies,
          isLoading: false
        })
      });
  }
 
  render() {
    return (
      this.state.isLoading
      ?
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
      :
      <View style={styles.container}>
        <FlatList
          data={this.state.items}
          renderItem={({item}) =>
            <View style={{flex:1, flexDirection:'row', marginBottom:8, marginTop: 7}}>
              <Image 
                style={{width:80, height:80}}
                source={require('./ItemIcon/item.jpg')}  
              />
              <View style={{flex:1, justifyContent: 'center'}}>
                <Text style={{fontSize: 18, color: 'blue', marginBottom: 5}}>
                  {item.title}
                </Text>
                <Text style={{fontSize: 14, color: 'red'}}>
                  {"Release year: "+item.releaseYear}
                </Text>
              </View>
            </View>
          }
          ItemSeparatorComponent={() => 
            <View style={{height:2, width: '100%', backgroundColor: 'black'}}>
            </View>
          }
        />
      </View>
      );

  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#f5fcff' 
  }
});