import 'jsdom-global/register';

import React from 'react';
import * as enzyme from 'enzyme';
import { shallow } from 'enzyme';

import Adapter from 'enzyme-adapter-react-16';

import ReceiptModal from '../components/receipt/ReceiptModal';

enzyme.configure({ adapter: new Adapter() });

const testItems = [{ id: 0, split: true, price: 5 },
    { id: 1, split: true, price: 4 },
    { id: 2, split: false, price: 10 }];

const testGroups = [ { group_id: 0, members: [{ id: 0 }, { id: 1 }] },
                     { group_id: 1, members: [{ id: 1 }, { id: 2 }, { id : 3} ]}]

const testReceipt = {
        title: "default", time: "today",
        items: testItems, image_url: "",
        status: "", group: testGroups[0]
}

describe('Checking the rendering of the modal', () => {

    it('A Modal should be rendered', () => {
        const wrapper = shallow(<ReceiptModal />)
        expect(wrapper.find('ReactNativeModal')).toHaveLength(1)
    })

    it('A Modal shows up when a modal launch ', () => {
        const wrapper = shallow(<ReceiptModal />)
        wrapper.instance().launch(testReceipt, testGroups, jest.fn())
        expect(wrapper.find('ReactNativeModal').prop('isVisible')).toBeTruthy()
    })

    it('Press either ok or cancel will shut down the modal', () => {
        const wrapper = shallow(<ReceiptModal />)
        wrapper.instance().launch(testReceipt, testGroups, jest.fn())

        let btn = wrapper.find('#ReceiptConfirm')
        btn.simulate('press')

        expect(wrapper.find('ReactNativeModal').prop('isVisible')).toBeFalsy()
    })

    it('Press either ok or cancel will shut down the modal', () => {
        const wrapper = shallow(<ReceiptModal />)
        wrapper.instance().launch(testReceipt, testGroups, jest.fn())

        let btn = wrapper.find('#ReceiptCancel')
        btn.simulate('press')

        expect(wrapper.find('ReactNativeModal').prop('isVisible')).toBeFalsy()
    })
})

describe('Checking group list', () => {

    it('When no group, a prompt should be rendered', () => {
        const wrapper = shallow(<ReceiptModal />)
        expect(wrapper.find('#NoGroupPrompt')).toHaveLength(1)
        expect(wrapper.find('#GroupList')).toHaveLength(0)
    })

    it('When at least one group exsit, a grouplist should be rendered', () => {
        const wrapper = shallow(<ReceiptModal />)
        wrapper.setState({ groups: [{ id: 0, numOfMems: 3 }]})
        expect(wrapper.find('#NoGroupPrompt')).toHaveLength(0)
        expect(wrapper.find('#GroupList')).toHaveLength(1)
    })

    it('When a group is selected, a checked icon should be rendered', () => {
        const wrapper = shallow(<ReceiptModal />)

        let group0 = testGroups[0];

        wrapper.setState({ groups: [group0],
                           group: group0})

        expect(wrapper.find('#selected')).toHaveLength(1)
    })
})

describe('Checking calculation', () => {

    it('Checking calculateTotal()', () => {

        let numOfMems = testGroups[0].members.length

        const wrapper = shallow(<ReceiptModal />)
        wrapper.setState({receiptItems: testItems, sharerCount: numOfMems})


        //Should be 0 before calculation
        expect(wrapper.state('total')).toEqual(0)

        wrapper.instance().calculateTotal()

        let sharerTotal = (5 + 4) / numOfMems
        let payerTotal = (5 + 4) / numOfMems + 10
        let total = 5 + 4 + 10
        expect(wrapper.state('total')).toEqual(total)
        expect(wrapper.state('sharerTotal')).toEqual(sharerTotal)
        expect(wrapper.state('payerTotal')).toEqual(payerTotal)

    })

    it('calculateTotal() is called when a modal is launched', () => {

        let numOfMems = testGroups[0].members.length

        const wrapper = shallow(<ReceiptModal
            onRef={jest.fn()}
            data={[]}
            friends={[]}
        />)

        //Checking preconditions
        expect(wrapper.state('total')).toEqual(0)

        wrapper.instance().launch(testReceipt, testGroups, jest.fn())

        //Post condition
        let sharerTotal = (5 + 4) / numOfMems
        let payerTotal = (5 + 4) / numOfMems + 10
        let total = 5 + 4 + 10
        expect(wrapper.state('total')).toEqual(total)
        expect(wrapper.state('sharerTotal')).toEqual(sharerTotal)
        expect(wrapper.state('payerTotal')).toEqual(payerTotal)
    })

})


describe('Checking memberList', () => {

    it('Two groups should be rendered', () => {
        const wrapper = shallow(<ReceiptModal />)
        wrapper.instance().launch(testReceipt, testGroups, jest.fn())
        expect(wrapper.find('.Group')).toHaveLength(2)
        // expect(wrapper.find("#splitTotal")).toHaveLength(1)
    })

    it('When anthoer group is selected, the group the receipt assigned to changes', () => {
        const wrapper = shallow(<ReceiptModal />)
        wrapper.instance().launch(testReceipt, testGroups, jest.fn())

        //Precondition
        expect(wrapper.state('group')).toEqual(testGroups[0])

        let avatars = wrapper.find(".Avatar")
        expect(avatars).toHaveLength(2)

        // let curAva = avatars.get(1)
        avatars.at(1).simulate('press')

        //Postcondition
        expect(wrapper.state('group')).toEqual(testGroups[1])
    })

    it('When anthoer group is selected, the split price changes', () => {
        const wrapper = shallow(<ReceiptModal />)
        wrapper.instance().launch(testReceipt, testGroups, jest.fn())

        let prevTotal = (5 + 4) / testGroups[0].members.length + 10
        let curTotal = (5 + 4) / testGroups[1].members.length + 10

        //Precondition
        expect(wrapper.find("#displayedTotal").render().text())
            .toEqual("$" + prevTotal.toFixed(2))

        //Action
        wrapper.find(".Avatar").at(1).simulate('press')

        //Postcondition
        expect(wrapper.find("#displayedTotal").render().text())
            .toEqual("$" + curTotal.toFixed(2))
    })
})
