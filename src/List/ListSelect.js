import {emit} from '../Common.js';

export default function ListSelect(params) {
    return function(list){
        list.__.selected = {};
        list.select = function (itemInd) {
            list.__.selected = itemInd;
            const item = list.__.items[itemInd];
            emit('list', 'select', {list: this, item, params: {
                key: item._id,
            }});
        }
    }
}