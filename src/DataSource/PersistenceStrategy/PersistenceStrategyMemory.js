export class PersistenceStrategyMemory {
    constructor() {
        this.__ = {};
        this.__.data = null;
    }

    async set(data) {
        this.__.data = data;
    }

    async get() {
        return this.__.data;
    }

    async update(updateMap) {
        updateMap = updateMap instanceof Array ? updateMap : [updateMap];
        updateMap.forEach((updateInstruction) => {
            if ('index' in updateInstruction && this.__.data instanceof Array) {
                this.__.data[updateInstruction.index] = updateInstruction.newValue;
            } else if ('key' in updateInstruction) {
                if (updateInstruction.key in this.__.data) {
                    if ('value' in updateInstruction) {
                        this.__.data[updateInstruction.key] = updateInstruction.value;
                    }
                }
            }
        })
    }

    async delete() {

    }
}