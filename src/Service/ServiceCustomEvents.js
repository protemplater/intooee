class CustomEventManager {
    constructor() {
        this.__ = {};
        this.__.handlersMap = new WeakMap();
    }

    subscribe(source, target) {
        if (!this.__.handlersMap.has(source)) {
            this.__.handlersMap.set(source, []);
        }
        this.__.handlersMap.get(source).push(target);
    }

    unsubscribe(source, target) {
        if (this.__.handlersMap.has(source)) {
            this.__.handlersMap.set(source, this.__.handlersMap.get(source).filter(it => target !== it));
        }
    }

    broadcast(source, evtData) {
        if (this.__.handlersMap.has(source)) {
            this.__.handlersMap.get(source).forEach((it) => {
                it.trigger(source, evtData);
            });
        }
    }
}
export const ServiceCustomEvents = new CustomEventManager();