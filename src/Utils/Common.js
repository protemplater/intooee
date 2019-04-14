// import {setStyleData} from './UI/UI.js';

export function dispatch(type, data, origEvent) {
    const event = new CustomEvent(type, {
        detail: {data, origEvent},
    });
    this.dispatchEvent(event);
}

export function emit(namespace, type, data) {
    const event = new CustomEvent(`${namespace}:${type}`, {
        detail: {data},
    });
    window.dispatchEvent(event);
}

export function listen(namespace, type, fn) {
    window.addEventListener(`${namespace}:${type}`, (evt) => {
        fn && fn(evt.detail.data, evt.detail.origEvent);
    })
}

export function getInnerProperty(o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    let a = s.split('.');
    for (let i = 0, n = a.length; i < n; ++i) {
        let k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}

const listItemMap = new WeakMap();
const listtemplateMap = new WeakMap();
const listNameMap = new WeakMap();

export class Renderer {

    static interpolate(node, item, index, itemHTML) {
        return (this.__innerHTML || itemHTML)
            .replace(/\{\{([^}]+)\}\}/gi, (find, store1) => {
                if (store1 === '$index') {
                    return index;
                }
                else if (store1 === '$item') {
                    return item;
                } else if (item instanceof Object) {
                    return getInnerProperty(item, store1);
                } else {
                    return '';
                }
            });
    }

    static renderList({name, list, data, items}) {
        listNameMap.set(list, name);
        Array.from(document.querySelectorAll(`[data-list="${name}"]`))
            .forEach((node) => {
                if (node) {
                    if (!listItemMap.has(node)) {
                        listItemMap.set(node, node.innerHTML);
                        node.innerHTML = '';
                    }
                    node.innerHTML = '';
                    this.render(node, listItemMap.get(node), list.items);
                }
            });
        Array.from(document.querySelectorAll(`[data-list="${name}.pagerItems"]`))
            .forEach((node) => {
                if (node) {
                    if (!listItemMap.has(node)) {
                        listItemMap.set(node, node.innerHTML);
                        node.innerHTML = '';
                    }
                    node.innerHTML = '';
                    this.render(node, listItemMap.get(node), list.pagerItems);
                }
            });
    }
    static render(parentNode, itemHTML, data) {
        if (listtemplateMap.has(parentNode)) {
            listtemplateMap.set(parentNode, parentNode.innerHTML);
        }

        const sampleDiv = document.createElement('div');
        sampleDiv.innerHTML = (this.__innerHTML || itemHTML);
        const sampleLists = Array.from(sampleDiv.querySelectorAll('[data-list]'));
        // parentNode.insertAdjacentHTML('beforeEnd', data.map((item, index) => this.interpolate(parentNode, item, index, itemHTML)).join(''));
        data
            .forEach((item, ind) => {
                parentNode.insertAdjacentHTML('beforeEnd', this.interpolate(parentNode, item, ind, itemHTML));
                const node = parentNode.lastElementChild;
                if(item && '_id' in item) {
                    node.dataset.key = item._id;
                }
                const overall = Array.from(node.querySelectorAll('[data-list]'));
                const proper = overall.filter(item => !item.querySelector('[data-list]'));

                proper.forEach((sublist) => {
                    const html = sampleLists[Array.prototype.indexOf.call(node.querySelectorAll('[data-list]'), sublist)].innerHTML;
                    sublist.innerHTML = '';
                    sublist.insertAdjacentHTML('beforeEnd', getInnerProperty(item, sublist.dataset.list).map((subitem, index) => this.interpolate(sublist, subitem, index, html)).join(''));
                })

            });
        this.__dom = parentNode;
    }
    static setStyleData({name:name1, ext, list, params}) {
        if(!listNameMap.get(list)){

            listNameMap.set(list, name1);
        }
        console.warn(listNameMap.get(list), name1);
        const name = listNameMap.get(list);
        setStyleData(
            name,ext,
            `#listWrap [data-key="{{key}}"] {
            background: red;
        }`, params);
    }
}
export function parentUntil(node, parentNode) {
    let resultNode = node;
    while (resultNode !== document && !parentNode.isSameNode(resultNode.parentNode)) {
        resultNode = resultNode.parentNode;
    }
    return resultNode;
}

export function geNodeIndexAmongSiblings(node) {
    return Array.prototype.indexOf.call(node.parentNode.children, node);
}

function closestAll(node, sel) {
    // get all parent DOM ancestors for selector
    let currentNode = node;
    let parentNodes = [];
    while (currentNode) {
        currentNode = currentNode.closest(sel) && currentNode.closest(sel).isSameNode(currentNode) ? currentNode.parentNode.closest(sel) : currentNode.closest(sel); // prevent recursion
        if (currentNode) {
            parentNodes.push(currentNode);
        }
    }
    return parentNodes;
}

function getPrototypeChainOf(object) {
    let proto = object.constructor.prototype;
    let result = [];
    while (proto) {
        result.push(proto.constructor.name);
        proto = Object.getPrototypeOf(proto)
    }
    return result;
}
