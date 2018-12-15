import 'jsdom-global/register';
import React from 'react';
import * as enzyme from 'enzyme';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

import Adapter from 'enzyme-adapter-react-16';

import HomeScreen from '../components/home_screen';
// import { View, StyleSheet, ScrollView } from "react-native";

enzyme.configure({ adapter: new Adapter() });

describe('Checking the rendering of the HomeScreen', () => {

    it('A parent container should be rendered', () => {
        const wrapper = shallow(<HomeScreen />)
        // console.log("hs shallow", wrapper.debug())
        expect(wrapper.find('Component.Container')).toHaveLength(1)
    })
})

// describe('Checking the rendering of the container', () => {

//     const wrapper = mount(<HomeScreen  />)

//     it('A SearchBar should be rendered', () => {
//         expect(wrapper.find('Search')).toHaveLength(1)
//     })

//     // it('A ScrollableView should be rendered', () => {
//     //     expect(wrapper.find('ScrollView')).toHaveLength(1);
//     // })

//     it('A View.Modal should be rendered', () => {
//         expect(wrapper.find('Component.Modal')).toHaveLength(1);
//     })

//     it('A Spinner should be rendered', () => {
//         expect(wrapper.find('Spinner')).toHaveLength(1);
//     })

//     it('An actionButton should be rendered', () => {
//         expect(wrapper.find('ActionButton')).toHaveLength(1)
//     })
// })

// describe('Checking the rendering of the SearchBar', () => {

//     it('This searchBar should contain the placeholder msg', () => {

//         const wrapper = shallow(  <SearchBar
//             containerStyle={{ backgroundColor: "#fff" }}
//             lightTheme
//             placeholder="Search receipt name, merchant, or status..."
//             onChangeText={text => {
//               this.setState({ searchText: text });
//               if (this.searchList !== undefined && text.length > 0)
//                 this.searchList.setReceiptHistory(this.state.receiptHistory);
//             }}
//           />)
//         // const searchBar = wrapper.find('Search')

//         console.log("wrapper", wrapper.debug())

//         // console.log("wrapper props:", wrapper.prop('placeholder'));

//         // expect(searchBar.prop('placehoder')).toEqual("Search receipt name, merchant, or status...")
//         // expect(wrapper.find('Search')).toHaveLength(1)
//         // console.log(wrapper.placeholder)
//         expect(wrapper.prop('placeholder')).toEqual("Search receipt name, merchant, or status...")
//     })
// })

// describe('Receipt part', () => {
//     const wrapper = setup()

//     it('Search bar should be rendered', () => {
//         expect(wrapper.find('Search').exists()).toEqual(true);
//     })

//     it('ReceiptList should be rendered', () => {
//         expect(wrapper.find('ReceiptList').exists()).toEqual(true);
//     })

//     it('Action button should be rendered', () => {
//         expect(wrapper.find('ActionButton').exists()).toEqual(true);
//     })

//     it('3 action buttons should be rendered', () => {   //tag name?
//         expect(wrapper.find('ActionButtonItem')).toHaveLength(2);
//     })

//     // it('A func should be called when the ActionButtonItem is pressed', () => {
//     //     const onPressEvent = jest.fn();
//     //     wrapper.find('ActionButtonItem').first().props().onPress();
//     //     expect(onPressEvent.mock.calls.length).toBe(1);
//     // })

    // it('Clicking on refresh a navigation func should be called ', () => {
    //     expect(renderer.create(<ActionButtonItem buttonColor="#1abc9c" title="Refresh"
    //     onPress={jest.fn()} />)).toMatchSnapshot();
    //   });

//   })
