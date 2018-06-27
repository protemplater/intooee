import {emit, getInnerProperty} from '../Common.js';

export default function (orderMap) {

    return function (list) {
        list.__.modifiers.add(2, (prevList) => {
            return prevList.sort((a,b) => {
                return a.firstName.toLowerCase() > b.firstName.toLowerCase() ? 1 : (a.firstName.toLowerCase() < b.firstName.toLowerCase() ? -1 :
                a[list.__.uid] > b[list.__.uid] ? 1 : -1 // ensure sort is stable
                )
            },[]);
        });
    }
}
