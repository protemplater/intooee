import {LayoutBase} from 'src/Layout/LayoutBase';
import {UIFieldText} from 'src/UI/UIFieldText';
import {parentUntil, geNodeIndexAmongSiblings} from 'src/Utils/Common';

import {UIListCustom} from './UIListCustom.js';
import {dataSourceListCustom} from './DataSourceListCustom.js';
import {dataSourceFormCustom} from './DataSourceFormCustom.js';

export class LayoutList extends LayoutBase {
    constructor(dom = document.body) {
        super(dom);
    }

    render() {
        super.render();

        this.list = new UIListCustom(window.listContainer);
        this.list.addDataSource(dataSourceListCustom);
        this.list.click = async (evt) => {
            const index = geNodeIndexAmongSiblings(parentUntil(evt.target, this.list.__.dom));
            const data = await dataSourceListCustom.getData(index);
            console.warn(data);
            dataSourceFormCustom.setData(data);
        };


        this.field = new UIFieldText(this.__.dom, {
            key: 'recipeName'
        });
        this.field.addDataSource(dataSourceFormCustom);

        this.field1 = new UIFieldText(this.__.dom, {
            key: 'cookTime'
        });
        this.field1.addDataSource(dataSourceFormCustom);
        this.field2 = new UIFieldText(this.__.dom, {
            key: 'recipeName'
        });
        this.field2.addDataSource(dataSourceFormCustom);
    }

    async click(evt) {
        if (evt.target.closest('button')) {
            const data = await dataSourceFormCustom.getData();
            dataSourceListCustom.push(data);
            console.warn(data);
            console.warn(dataSourceListCustom);
            dataSourceFormCustom.reset();
        }
    }

    destroy() {
        super.destroy();
        this.list.destroy();
        this.field.destroy();
    }

    template() {
        return `
            <div>
                <button>Click</button>  
                <div id="listContainer"></div>
            </div>
        `
    }
}
