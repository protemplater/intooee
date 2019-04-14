import {emit} from './Common.js';

export default class Field {
    constructor({name = '', value = '', options = []}) {
        this.__ = {};
        this.__.value = '';
        this.__.name = name;
    }

    get value() {
        return this.__.value;
    }

    set value(val) {
        this.__.value = val;
        emit('field', 'update', {ref: this, field: this, value: val});
    }
}