import {App} from 'src/App';
import {LayoutMain} from './LayoutMain.js';
import {LayoutList} from './LayoutList.js';

const app = new App();
app.loadRouteMap({
    '/': LayoutMain,
    '/list': LayoutList,
    '/recipes': {
        layout: LayoutList,
        '/:id': LayoutList
    }
});
