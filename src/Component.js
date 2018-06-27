class UID {
    static get(prefix) {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < 16; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return ( prefix || '') + text;
    }
}

export default class Component {
    constructor(app) {
        this.__app = app;
        console.warn(Object.getOwnPropertyNames(this), this.constructor.name);
    }

    bind(module, selector) {
        this.__app.attach(this.constructor.name, module, selector);
    }

    on(evtName, selector, fn){
        this.__app.on(this.constructor.name, evtName, selector, fn);
    }

    getEventContext(evt){
        return this.__app.getEventContext(evt, this.__app, this.constructor.name);
    }

}
