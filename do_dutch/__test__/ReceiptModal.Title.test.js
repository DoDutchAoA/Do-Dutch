import 'jsdom-global/register';

import React from 'react';
import * as enzyme from 'enzyme';
import { shallow } from 'enzyme';

import Adapter from 'enzyme-adapter-react-16';

import { Title } from '../components/receipt/ReceiptModal';


enzyme.configure({ adapter: new Adapter() });

describe('Checking the rendering of the Title', () => {

    it('A TouchableOpacity is rendered when Title is initialized', () => {
        const wrapper = shallow(<Title
            title={""}
            changeTitleCallback={jest.fn()}
        />)

        // console.log(wrapper.debug())

        expect(wrapper.find('TouchableOpacity')).toHaveLength(1)
    })

    it('Title text checking', () => {
        const wrapper = shallow(<Title
            title={"I am a title"}
            changeTitleCallback={jest.fn()}
        />)

        expect(wrapper.find('TextElement').render().text()).toEqual("I am a title")
    })
})

describe('Checking the functionalities of the Title', () => {
    it('Title renders a textInput when it is editable', () => {
        const wrapper = shallow(<Title
            title={""}
            changeTitleCallback={jest.fn()}
        />)

        wrapper.setState({ isEditable: true })
        wrapper.update()

        expect(wrapper.find('TextInput')).toHaveLength(1)
    })

    it('Title becomes editable when TouchableOpacity is pressed', () => {
        const wrapper = shallow(<Title
            title={""}
            changeTitleCallback={jest.fn()}
        />)

        //Before it is uneditable
        expect(wrapper.state('isEditable')).toBeFalsy()

        let touchable = wrapper.find('TouchableOpacity')

        touchable.simulate('press')

        //Now it is editable
        expect(wrapper.state('isEditable')).toBeTruthy()
    })

    it('Pressed the checked Icon to save the Title change', () => {
        const wrapper = shallow(<Title
            title={"Old Title"}
            changeTitleCallback={jest.fn()}
        />)

        //Checking the pre-condition
        expect(wrapper.state('title')).toEqual("Old Title")

        //Set to be editable and the tmpText to be the new Title
        wrapper.setState({ isEditable: true})
        wrapper.setState({ tempText: "New Title"})
        wrapper.update()

        let checked = wrapper.find('.ChangeConfirmed')
        checked.simulate('press')

        expect(wrapper.state('title')).toEqual("New Title")
    })

    it('Pressed the times Icon to drop the Title change', () => {
        const wrapper = shallow(<Title
            title={"Old Title"}
            changeTitleCallback={jest.fn()}
        />)

        //Checking the pre-condition
        expect(wrapper.state('title')).toEqual("Old Title")

        //Set to be editable and the tmpText to be the new Title
        wrapper.setState({ isEditable: true})
        wrapper.setState({ tempText: "New Title"})
        wrapper.update()

        let times = wrapper.find('.ChangeDropped')
        times.simulate('press')

        expect(wrapper.state('title')).toEqual("Old Title")
    })
})
