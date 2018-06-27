import Component from "../src/Component.js";
import Field from "../src/Field.js";
import List from "../src/List/List.js";
import ListSelect from "../src/List/ListSelect.js";
import ListPager from "../src/List/ListPager.js";
import ListOrder from "../src/List/ListOrder.js";
import {setStyleData} from '../src/UI/UI.js'

export class Users extends Component {
    constructor(app) {
        super(app);
        this.firstName = new Field({});
        this.lastName = new Field({});

        this.list = new List([], {
            ext: [
                ListSelect(),
                ListPager(),
                ListOrder([
                    'firstName,ASC',
                    'lastName,ASC',
                ])
            ],
        });

        /*this.on('click', '#listWrap tr', (evt) => {
            const ctx = this.getEventContext(evt);
            this.list.select(ctx[0].index);
        });*/

        this.on('click', '#textClick', () => {
            this.list.add([
                {
                    firstName: this.firstName.value,
                    lastName: this.lastName.value,
                    list: [1, 2, 3],
                }
            ]);
            this.firstName.value = '';
            this.lastName.value = '';
        })
    }

    onInit(){
        console.warn('init ', this.constructor.name);
    }

    selectUser = (evt) => {
        const ctx = this.getEventContext(evt);
        this.list.select(ctx[0].index);
    };

    deleteUser = (evt) => {
        const ctx = this.getEventContext(evt);
        this.list.remove((it) => it._id === ctx[0].listItem._id);
    };

    selectPage = (evt) => {
        const ctx = this.getEventContext(evt);
        this.list.pager.offset = (ctx[0].index * this.list.pager.limit);
    };

}