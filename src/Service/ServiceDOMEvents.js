class EventManager {
    constructor() {
        this.__ = {};
        this.__.handlersMap = new WeakMap();

        [
            'click',
            'change',
            'input',
            'focus',
        ]
            .forEach(it => this.initListener(it));
    }

    initListener(evtType) {
        // this.__.map[evtType] = new WeakMap();
        document.documentElement.addEventListener(evtType, (evt) => {
            const res = [];
            let target = evt.target;
            do {
                res.push(target);
                if (this.__.handlersMap.has(target) && this.__.handlersMap.get(target)[evtType]) {
                    this.__.handlersMap.get(target)[evtType](evt);
                    break;
                }
                target = target.parentNode;
            } while (target);
        }, true);
    }

    addEventScope(node, unit) {
        this.__.handlersMap.set(node, unit);
    }
}
export const ServiceDOMEvents = new EventManager();