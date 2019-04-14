import {ServiceDOMEvents} from 'src/Service/ServiceDOMEvents';
import {ServiceCustomEvents} from 'src/Service/ServiceCustomEvents';

export class UIUnit {
    constructor(dom) {
        this.__ = {};
        this.__.container = dom;
        this.render();
        this.__.subscriptions = new WeakMap();
        this.__.dataSources = [];
    }

    get template() {
        return '';
    }

    destroy() {
        this.__.dataSources.forEach((dataSource) => {
            ServiceCustomEvents.unsubscribe(dataSource, this);
        })
    }

    trigger(source, evtData) {
        this.__.subscriptions.get(source).forEach((fn)=>{
            fn(evtData);
        });
    }

    render() {
        if (this.__.dom) {
            this.__.dom.insertAdjacentHTML('afterEnd', this.template);
            const prevNode = this.__.dom;
            this.__.dom = this.__.dom.nextElementSibling;
            this.__.container.removeChild(prevNode);
            ServiceDOMEvents.addEventScope(this.__.dom, this);
            return;
        }
        this.__.container.insertAdjacentHTML('beforeEnd', this.template);
        this.__.dom = this.__.container.lastElementChild;
        ServiceDOMEvents.addEventScope(this.__.dom, this);
    }

    subscribe(dataSource, fn) {
        ServiceCustomEvents.subscribe(dataSource, this);
        if (!this.__.subscriptions.has(dataSource)) {
            this.__.subscriptions.set(dataSource, []);
        }
        this.__.subscriptions.get(dataSource).push(fn);
        this.__.dataSources.push(dataSource);
    }
}
