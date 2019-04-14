import {ServiceCustomEvents} from 'src/Service/ServiceCustomEvents';
import {ModelDataSourceRequest} from 'src/Model/ModelDataSourceRequest';

export class DataSourceBase {
    constructor() {
        this.__ = {};
    }

    executor() {
        return new Promise();
    }

    request(...payload) {
        return new ModelDataSourceRequest({
            promise: this.executor(...payload),
            destroy: this.onRequestDestroy
        });
    }

    broadcast(evtData) {
        ServiceCustomEvents.broadcast(this, evtData);
    }
}
