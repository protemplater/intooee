import {PersistenceStrategyMemory} from 'src/DataSource/PersistenceStrategy/PersistenceStrategyMemory';
import {DataSourceList} from 'src/DataSource/DataSourceList';

export class DataSourceListCustom extends DataSourceList {
    constructor() {
        super();
        this.storage = new PersistenceStrategyMemory();

        this.storage.set([]);
    }

    async getData(range) {
        if (range === undefined){
            return this.storage.get();
        }
        const data = await this.storage.get();
        return data[range];
    }

    async executor(range) {
        return this.storage.get();
    }

    async push(data) {
        const temp = await this.storage
            .get();
        await temp
            .push(data);
        this.broadcast({
            type: 'insert',
            data,
        })
    }
}

export const dataSourceListCustom = new DataSourceListCustom();