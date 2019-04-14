import {PersistenceStrategyMemory} from 'src/DataSource/PersistenceStrategy/PersistenceStrategyMemory';
import {DataSourceBase} from 'src/DataSource/DataSourceBase';

export class DataSourceFormCustom extends DataSourceBase {
    constructor() {
        super();
        this.storage = new PersistenceStrategyMemory();
        this.storage.set({
            recipeName: 'Apple pie',
            cookTime: '15 min',
            description: 'Get prepared !!',
        });
    }

    async getData() {
        return this.storage.get();
    }

    async exec(evt) {
        this.storage.update(evt);
        this.broadcast(evt);
    }

    async executor(key) {
        const result = await this.storage.get();
        return result[key];
    }

    async setData(data) {
        this.storage.set(data);
        this.broadcast({
            type: 'set',
            data,
        });
    }

    async reset() {
        const data = {
            recipeName: '',
            cookTime: '',
            description: '',
        };
        this.storage.set(data);
        this.broadcast({
            type: 'set',
            data,
        });
    }
}

export const dataSourceFormCustom = new DataSourceFormCustom();