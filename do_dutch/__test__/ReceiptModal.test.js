import 'jsdom-global/register';

import React from 'react';
import * as enzyme from 'enzyme';
import { shallow } from 'enzyme';

import Adapter from 'enzyme-adapter-react-16';

import ReceiptModal from '../components/receipt/ReceiptModal';

enzyme.configure({ adapter: new Adapter() });

describe('Checking the rendering of the modal', () => {

    it('A Modal should be rendered', () => {
        const wrapper = shallow(<ReceiptModal />)
        expect(wrapper.find('ReactNativeModal')).toHaveLength(1)
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

        let group0 = { id: 0, members: [{id: 0, paid: 5}] };

        wrapper.setState({ groups: [group0],
                           group: group0})

        expect(wrapper.find('#selected')).toHaveLength(1)
    })

})

describe('Checking calculation', () => {

    it('Checking calculateTotal()', () => {

        let items = [{id: 0, split: true, price: 5},
            {id: 1, split: true, price: 4},
            {id: 2, split: false, price: 10}];

        const wrapper = shallow(<ReceiptModal />)
        wrapper.setState({receiptItems: items, sharerCount: 1})

        //Should be 0 before calculation
        expect(wrapper.state('total')).toEqual(0)

        wrapper.instance().calculateTotal()

        let sharerTotal = (5 + 4) / 2
        let payerTotal = (5 + 4) / 2 + 10
        let total = 5 + 4 + 10
        expect(wrapper.state('total')).toEqual(total)
        expect(wrapper.state('sharerTotal')).toEqual(sharerTotal)
        expect(wrapper.state('payerTotal')).toEqual(payerTotal)

    })

    it('calculateTotal() is called when a modal is launched', () => {
        const wrapper = shallow(<ReceiptModal
            onRef={jest.fn()}
            data={[]}
            friends={[]}
        />)

        let items = [{ id: 0, split: true, price: 5 },
        { id: 1, split: true, price: 4 },
        { id: 2, split: false, price: 10 }];

        let groups = [{
            id: 0,
            members: [{ id: 0}, { id: 1 }]
        }]

        let receipt = {
            title: "default", time: "today",
            items: items, image_url: "",
            status: "", group: groups[0]
        }

        //Checking preconditions
        expect(wrapper.state('total')).toEqual(0)


        wrapper.instance().launch(receipt, groups, jest.fn())

        //Post condition
        let sharerTotal = (5 + 4) / 2
        let payerTotal = (5 + 4) / 2 + 10
        let total = 5 + 4 + 10
        expect(wrapper.state('total')).toEqual(total)
        expect(wrapper.state('sharerTotal')).toEqual(sharerTotal)
        expect(wrapper.state('payerTotal')).toEqual(payerTotal)
    })


})
