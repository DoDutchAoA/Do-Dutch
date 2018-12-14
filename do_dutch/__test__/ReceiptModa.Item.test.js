import 'jsdom-global/register';

import React from 'react';
import * as enzyme from 'enzyme';
import { shallow, mount } from 'enzyme';

import Adapter from 'enzyme-adapter-react-16';

import { Item } from '../components/receipt/ReceiptModal';


enzyme.configure({ adapter: new Adapter() });

describe('Checking the rendering of the Item', () => {

    it('A container ListItem is rendered when Item is initialized', () => {
        const wrapper = shallow(<Item
            data={""}
            key={"0"}
            sharerCount={3}
            updateReceipt={jest.fn()}
        />)

        // console.log(wrapper.debug())

        expect(wrapper.find('ListItem')).toHaveLength(1)
    })
})

describe('Checking the functionalities of the editable Item name', () => {

    it('Item name becomes editable when TouchableOpacity is pressed', () => {
        const wrapper = shallow(<Item
            data={""}
            key={"0"}
            sharerCount={3}
            updateReceipt={jest.fn()}
        />)

        //Before it is uneditable
        expect(wrapper.state('isEditable')).toBeFalsy()

        let touchable = wrapper.dive().find('TouchableOpacity')

        touchable.simulate('press')

        //Now it is editable
        expect(wrapper.state('isEditable')).toBeTruthy()
    })

    it('Pressed the checked Icon to save the Item name change', () => {
        const wrapper = shallow(<Item
            data={{name: "Old Item Name"}}
            key={"0"}
            sharerCount={3}
            updateReceipt={jest.fn()}
        />)

        //Set to be editable and the tmpText to be the new Title
        wrapper.setState({ isEditable: true})
        wrapper.setState({ tempText: "New Item Name"})
        wrapper.update()

        let checked = wrapper.dive().find('.ChangeConfirmed')
        checked.simulate('press')

        expect(wrapper.state('data').name).toEqual("New Item Name")
    })

    it('Pressed the times Icon to drop the Title change', () => {
        const wrapper = shallow(<Item
            data={{name: "Old Item Name"}}
            key={"0"}
            sharerCount={3}
            updateReceipt={jest.fn()}
        />)

        //Set to be editable and the tmpText to be the new Title
        wrapper.setState({ isEditable: true})
        wrapper.setState({ tempText: "New Item Name"})
        wrapper.update()

        let times = wrapper.dive().find('.ChangeDropped')
        times.simulate('press')

        expect(wrapper.state('data').name).toEqual("Old Item Name")
    })
})

describe('Checking the functionalities of the SplitButton', () => {

    it('If an item owned by one person, only a "All" btn is rendered', () => {
        const wrapper = mount(<Item
            data={{name: ""}}
            key={"0"}
            sharerCount={1}
            updateReceipt={jest.fn()}
        />)

        expect(wrapper.find('ButtonGroup').prop('buttons')).toHaveLength(1)
    })

    it('If an item owned by more one person, "All" and "Split" are rendered', () => {
        const wrapper = mount(<Item
            data={{name: ""}}
            key={"0"}
            sharerCount={3}
            updateReceipt={jest.fn()}
        />)

        expect(wrapper.find('ButtonGroup').prop('buttons')).toHaveLength(2)
    })

    it('Pressed on the ButtonGroup will change the data.split status', () => {
        const wrapper = mount(<Item
            data={{name: ""}}
            key={"0"}
            sharerCount={3}
            updateReceipt={jest.fn()}
        />)

        let splitbtn = wrapper.find('ButtonGroup')

        splitbtn.props().onPress()

        expect(wrapper.prop('data').split).not.toBe(undefined)

    })

    it('Test round to 2 digits', () => {
        const wrapper = mount(<Item
            data={{name: "Apple",
                  price: 2.398,
                  split: undefined}}
            key={"0"}
            sharerCount={1}
            updateReceipt={jest.fn()}
        />)

        expect(wrapper.find('Text').find('#processed').text()).toEqual("2.40")

    })

    it('Press btn wont change the price of this item if num_owner == 1', () => {
        const wrapper = mount(<Item
            data={{name: "Apple",
                  price: 5,
                  split: undefined}}
            key={"0"}
            sharerCount={1}
            updateReceipt={jest.fn()}
        />)

        expect(wrapper.find('Text').find('#processed').text()).toEqual("5.00")

        let splitbtn = wrapper.find('ButtonGroup')
        splitbtn.props().onPress('press')

        //Unchanged
        expect(wrapper.find('Text').find('#processed').text()).toEqual("5.00")

    })

    it('Press btn change the price of this item paid by a sharer if num_owner > 1', () => {
        const wrapper = mount(<Item
            data={{name: "Apple",
                  price: 5,
                  split: 0}}
            key={"0"}
            sharerCount={3}
            updateReceipt={jest.fn()}
        />)

        expect(wrapper.find('Text').find('#processed').text()).toEqual("5.00")

        let splitbtn = wrapper.find('ButtonGroup')
        splitbtn.props().onPress(0)

        wrapper.update()

        console.log('split status = ', wrapper.state('data').split)

        //Changed!
        expect(wrapper.find('Text').find('#processed').text()).toEqual("1.67")

    })
})
