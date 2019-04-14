import {ServiceDOMEvents} from 'src/Service/ServiceDOMEvents'

export class LayoutBase {
    constructor(domContainer = document.body) {
        this.__ = {};
        this.__.container = domContainer;
        ServiceDOMEvents.addEventScope(this.__.container, this);
    }

    render() {
        this.__.container.insertAdjacentHTML('beforeEnd', this.template());
        this.__.dom = this.__.container.lastElementChild;
    }

    template() {
        return '';
    }

    destroy() {
        this.__.container.removeChild(this.__.dom);
        this.__.dom = null;
    }
}
