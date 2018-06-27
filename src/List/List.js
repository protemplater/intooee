import {emit, getInnerProperty} from '../Common.js';


export default class List {
    constructor(defaultArray = [], {ext = null} = {}) {
        this.__ = {};
        this.__.autocount = 0;
        this.__.totalCount = defaultArray.length;
        this.__.uid = '_id';
        this.__.items = [];
        this.__.ext = ext;
        this.__.modifiers = {
            map: [],
            add: function (queueIndex, fn) {
                this.map = this.map.reduce((acc, item) => {
                    if (item.queueIndex > queueIndex) {
                        acc.push(item);
                    } else {
                        acc.unshift(item);
                    }
                    return acc;
                }, [{
                    queueIndex,
                    fn,
                }])
            },
            exec: () => {
                this.__.items = this.__.modifiers.map.reduce((acc, mod) => {
                    return mod.fn(acc);
                }, this.__.rawItems);

            }
        };
        this.__.rawItems = defaultArray;
        // emit('list', 'init', {list: this});
    }

    applyExtenders() {
        if (this.__.ext) {
            this.__.ext.forEach(fn => fn(this));
        }

    }

    verifyUID(arr, id) {
        const proper = arr.map((it, ind) => ({[id]: id in it ? it[id] : ind + this.__.autocount, ...it}));
        this.__.autocount += arr.length;
        return proper;
    }

    get items() {
        return this.__.items;
    }

    set items(val) {
        this.__.autocount = 0;
        const uidReady = this.verifyUID(val, this.__.uid);
        this.__.items = uidReady;
        emit('list', 'set', {data: uidReady, list: this});
    }

    add(data) {
        data = data instanceof Array ? data : [data];
        const uidReady = this.verifyUID(data, this.__.uid);
        this.__.rawItems = this.__.rawItems.concat(uidReady);
        this.__.totalCount += data.length;
        this.__.modifiers.exec();
        emit('list', 'add', {ref: this, list: this, data: uidReady, items: this.__.items});
    }

    emit(type, data) {
        emit('list', type, {list: this, ...data});
    }

    emitUpdate() {
        this.__.modifiers.exec();
        emit('list', 'set', {ref: this, list: this, items: this.__.items});
    }

    remove(data) {
        let items = null;
        if (data instanceof Function) {
            // TODO
            items = this.__.rawItems.filter(data);
            this.__.rawItems = this.__.rawItems.filter(par => !data(par));
            this.__.totalCount -= items.length;
        } else if (typeof data === 'number') {
            this.__.rawItems.splice(data, 1);
            this.__.totalCount -= 1;
        }
        this.__.modifiers.exec();
        emit('list', 'remove', {ref: this, list: this, index: data, items});


    }

    update() {
        emit('list', 'update', {list: this});

    }


    addItems(data) {
        this.items = this.items.concat(data);
    }

    deleteItems(data) {
        this.items = this.items.concat(data);
    }


    init(selector) {
        emit('pt', 'updateList', {list: this});
        const parentNode = document.querySelector(selector);
        this.__innerHTML = parentNode.innerHTML;
        console.warn('eee')
        parentNode.innerHTML = '';
        parentNode.insertAdjacentHTML('beforeEnd', this.items.map((item, index) => this.interpolate(parentNode, item, index)).join(''));
        Array.from(parentNode.children)
            .forEach((node) => {
                console.warn(node.querySelectorAll('[data-list]'), node.querySelectorAll('[data-list] [data-list]'));

            });
        this.__dom = parentNode;
    }

}
