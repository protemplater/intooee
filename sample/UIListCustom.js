
import {UIList} from 'src/UI/UIList';

export class UIListCustom extends UIList {
    constructor(dom) {
        super(dom);
    }

    templateItem({recipeName, cookTime}) {
        return `<li>${recipeName} - ${cookTime}</li>`;
    }

    get template() {
        return '<ul class="wrap"></ul>';
    }


    async addDataSource(dataSourceRef) {
        this.subscribeDataSource(dataSourceRef);
        dataSourceRef
            .request([0, 10])
            .sync(() => {

            })
            .then((result) => {
                this.render();
                result.forEach(it => {
                    this.__.dom.insertAdjacentHTML('beforeEnd', this.templateItem(it));
                })
            })

    }

    subscribeDataSource(dataSource) {
        this.subscribe(dataSource, (evtData) => {
            console.warn(evtData);
            if (evtData.type === 'insert') {
                this.__.dom.insertAdjacentHTML('beforeEnd', this.templateItem(evtData.data));
            }
        })
    }
}