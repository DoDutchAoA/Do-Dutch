import React from 'react';
import * as enzyme from 'enzyme';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

import ReactSixteenAdapter from 'enzyme-adapter-react-16';

import LogIn from '../components/login/login';

enzyme.configure({ adapter: new ReactSixteenAdapter() });

const setup = () => {
    const wrapper = shallow(<LogIn />)

    const props = {
        state: { username: "", password: ""},
        userLogin: jest.fn()
      }

      return {
        props,
        wrapper
      }
}

describe('LogIn', () => {

    const { props, wrapper } = setup();

    it('Two input areas should be rendered', () => {
        expect(wrapper.find('FormInput')).toHaveLength(2);
    })

    it('Button should be rendered', () => {
        expect(wrapper.find('Button').exists()).toBeTruthy();
    })

    //Fetch is not defined
    // it('A func should be called when the button is pressed', () => {
    //     const onPressEvent = jest.fn();
    //     // onPressEvent.mockReturnValue('Link on press invoked');
    //     // const wrapper = shallow(<Button onPress={ onPressEvent } text='CustomLink Component'/>);
    //     wrapper.find('Button').first().props().onPress();
    //     expect(onPressEvent.mock.calls.length).toBe(1);
    // })

})
