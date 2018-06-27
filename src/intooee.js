import {listen, getInnerProperty, Renderer} from './Common.js';
import Field from './Field.js';
import List from './List/List.js';

class EventManager {
    constructor(app) {
        this.__listeners = {};
        this.__dispatchers = {};
        this.__eventMap = new WeakMap();

        document.body.addEventListener('input', (evt) => {
            if (evt.target.closest('[data-input]')) {
                const node = evt.target.closest('[data-input]');
                const fld = getInnerProperty(app, node.dataset.input);
                fld.value = node.value;
                // this.__listeners.input.filter(it => (node.matches(it.selector)))
                //     .forEach(({module}) => {
                //         module.value = node.value;
                //     });
            }
        }, true);

        [
            'click',
            'keyup',
            'keydown',
            'keypress',
            'change',
            'contextmenu',
        ]
            .forEach((evtType) => {
                document.body.addEventListener(evtType, (evt) => {
                    const node = evt.target.closest(`[data-${evtType}]`);
                    if (node) {
                        if (node.dataset[evtType]) {
                            getInnerProperty(app, node.dataset[evtType])(evt);
                        } else {
                            this.__listeners[evtType] && this.__listeners[evtType].filter(it => (node.matches(it.selector)))
                                .forEach(({module}) => {
                                    module(evt);
                                });
                        }
                    }
                }, true);
            });
        listen('list', 'init', ({ref, list, data, items}) => {
            Renderer.renderList({name: this.__eventMap.get(list), list});
        });
        listen('list', 'add', ({ref, list, data, items}) => {
            Renderer.renderList({name: this.__eventMap.get(ref), list, data, items});
        });
        listen('list', 'set', ({ref, list, data, items}) => {
            Renderer.renderList({name: this.__eventMap.get(ref), list, data, items});
        });
        listen('list', 'remove', ({ref, list, index = null}) => {
            Renderer.renderList({name: this.__eventMap.get(ref), list});
        });
        listen('list', 'select', ({ref, list, params, item = null}) => {
            Renderer.setStyleData({name: this.__eventMap.get(ref), ext: "ListSelect", list, item, params});
        });
        listen('list', 'pagerUpdate', ({ref, list, params, item = null}) => {
            Renderer.setStyleData({name: this.__eventMap.get(list), ext: "ListPager", list, item, params});
        });

        listen('field', 'update', ({ref, value = null}) => {
            Array.from(document.querySelectorAll(`[data-input="${this.__eventMap.get(ref)}"]`))
                .forEach((node) => {
                    if (node) {
                        node.value = value;
                    }
                });
        });
    }

    get eventMap() {
        return this.__eventMap;
    }

    on(componentName, evtName, selector, fn) {
        if (!(evtName in this.__listeners)) this.__listeners[evtName] = [];
        this.__listeners[evtName].push({componentName, selector, module: fn});
    }
}

export class App {
    constructor(params = {}) {
        const {components} = params;
        this.__eventManager = new EventManager(this);
        this.__storage = {};
        this.sendRequest = sendRequest;
        this.init(components);
    }

    init(componentMap = [], reinit = false) {
        componentMap
            .forEach((com) => {
                const comName = com.name;
                this[comName] = new com(this);

                Object.getOwnPropertyNames(this[comName])
                    .forEach((com) => {
                        if (this[comName][com] instanceof Field || this[comName][com] instanceof List) {
                            this.__eventManager.eventMap.set(this[comName][com], `${this[comName].constructor.name}.${com}`);
                            this[comName][com].applyExtenders && this[comName][com].applyExtenders();
                            Renderer.renderList({
                                name: `${this[comName].constructor.name}.${com}`,
                                list: this[comName][com]
                            });
                        }
                    });


                if (!reinit && this[comName].onInit) {
                    this[comName].onInit(this);
                }
            })
    }

    on(componentName, evtName, selector, fn) {
        this.__eventManager.on(componentName, evtName, selector, fn);
    }

    rebind() {
        Object.keys(this.__storage).forEach((name) => {
            Object.keys(this.__storage[name]).forEach((key) => {
                const data = this.__storage[name][key];
                if (data instanceof Field) {
                    const prev = data.value;
                    // data.value = !data.value;
                    data.value = prev;
                }
                if (data instanceof List) {
                    const prev = data.items;
                    // data.value = !data.value;
                    data.items = prev;
                }
            });
        });
    }

    unbind() {
    }

    clear(name) {
        this.__eventManager.__listeners.click = (this.__eventManager.__listeners.click || []).filter(it => it.componentName !== name);
    }

    reinit(data, name) {
        if ((name in this.__storage )) {
            Object.keys(this.__storage[name]).forEach((key) => {
                if (data[key] instanceof Field)
                    data[key].value = this.__storage[name][key].value;
                if (data[key] instanceof List)
                    data[key].items = this.__storage[name][key].items;
            });
        }
        this.__storage[name] = data;
    }

    getEventContext(evt, app, comName) {
        const listAncestors = closestAll(evt.target, '[data-list]').reverse();
        let listItem = null;
        return listAncestors
            .map((ancestor, ind) => {
                const node = parentUntil(evt.target, ancestor);
                const index = geNodeIndexAmongSiblings(node);

                listItem = ind === 0 ?
                    (listAncestors[0].dataset.list.indexOf('pagerItems') !== -1 ? getInnerProperty(this, listAncestors[0].dataset.list)[index] : getInnerProperty(this, listAncestors[0].dataset.list).items[index]) :
                    getInnerProperty(listItem, ancestor.dataset.list)[index];
                return {
                    node,
                    index,
                    listItem,
                };
            });
    }
}

function sendRequest(path) {
    return new Promise((resolve) => {
        fetch(path, {
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
            .then((resp) => {
                resp.json()
                    .then((json) => {
                        resolve(json)
                    })
            });
    })
}

function parentUntil(node, parentNode) {
    let resultNode = node;
    while (resultNode !== document && !parentNode.isSameNode(resultNode.parentNode)) {
        resultNode = resultNode.parentNode;
    }
    return resultNode;
}

function geNodeIndexAmongSiblings(node) {
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
document.addEventListener("DOMContentLoaded", function (event) {
    Object.defineProperties(window, {
        __intooee: {
            value: new App(),
            configurable: false,
            enumerable: false,
            writable: false
        },
        Field: {
            value: Field,
            configurable: false,
            enumerable: false,
            writable: false
        },
        List: {
            value: List,
            configurable: false,
            enumerable: false,
            writable: false
        },
    });
});
