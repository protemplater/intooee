import {UIUnit} from 'src/UI/UIUnit'

export class UIFieldText extends UIUnit {
    constructor(dom, params) {
        super(dom);
        this.__.key = params.key || '';
    }

    input() {
        this.__.dataSources.forEach((dataSource) => {
            dataSource.exec({
                type: 'update',
                key: this.__.key,
                value: this.__.dom.value,
            })
        })
    }

    get template() {
        return '<input type="text"/>';
    }

    async addDataSource(dataSourceRef) {

        this.subscribeDataSource(dataSourceRef);
        dataSourceRef
            .request(this.__.key)
            .then((res) => {
                this.__.dom.value = res;
            })
    }

    subscribeDataSource(dataSource) {
        this.subscribe(dataSource, (evtData) => {
            if (evtData.type === 'set' && this.__.key in evtData.data && this.__.dom.value !== evtData.data[this.__.key]) {
                this.__.dom.value = evtData.data[this.__.key];
            } else if (evtData.type === 'update' && evtData.key === this.__.key && this.__.dom.value !== evtData.value) {
                this.__.dom.value = evtData.value;
            }
        })
    }
}