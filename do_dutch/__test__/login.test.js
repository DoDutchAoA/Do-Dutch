import React from 'react';
import * as enzyme from 'enzyme';
import { shallow, mount } from 'enzyme';

import renderer from 'react-test-renderer';
// import 'whatwg-fetch'
// import fetchMock from 'fetch-mock';

import ReactSixteenAdapter from 'enzyme-adapter-react-16';

import LogIn from '../components/login/login';

enzyme.configure({ adapter: new ReactSixteenAdapter() });

// const dummyUser = {

// }

describe('Checking rendering', () => {

    it('Two input areas should be rendered', () => {
        const wrapper = shallow(<LogIn />)
        expect(wrapper.find('#username')).toHaveLength(1);
        expect(wrapper.find('#password')).toHaveLength(1);
    })

    it('Button should be rendered', () => {
        const wrapper = shallow(<LogIn />)
        expect(wrapper.find('Button').exists()).toBeTruthy();
    })
})

describe('Checking functionalities', () => {

    it('Username is set as the user input in the FormInput', () => {
        const wrapper = shallow(<LogIn />)
        const nameInput = wrapper.find("#username")

        //Precondition
        expect(wrapper.state('username')).toEqual("")

        //Action
        nameInput.simulate('change', { target: { value: 'Dutchers' } })

        //Setstate is aysnc
        setTimeout(() => {
            expect(wrapper.state('username')).toEqual("Dutchers")
            wrapper.unmount();
            done();
          }, 1000);
    })

    it('Password is set as the user input in the FormInput', () => {
        const wrapper = shallow(<LogIn />)
        const nameInput = wrapper.find("#password")

        //Precondition
        expect(wrapper.state('password')).toEqual("")

        //Action
        nameInput.simulate('change', { target: { value: 'Dutchers' } })

        //Setstate is aysnc
        setTimeout(() => {
            expect(wrapper.state('password')).toEqual("Dutchers")
            wrapper.unmount();
            done();
          }, 1000);
    })

    // it('A func should be called when the ActionButtonItem is pressed', () => {
    //     const wrapper = shallow(<LogIn />)

    //     wrapper.setState({
    //         username: "Dutchers",
    //         password: "Dutchers"
    //     })

    //     const onPressEvent = jest.fn()
    //     console.log(wrapper.state('username'))

    //     wrapper.find('Button').props().onPress()

    //     setTimeout(() => {
    //         expect(onPressEvent.mock.calls.length).toBe(1)
    //         wrapper.unmount();
    //         done();
    //     }, 1000);
    // })

})
