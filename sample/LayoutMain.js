import {LayoutBase} from 'src/Layout/LayoutBase'
import {ServiceRouter} from 'src/Service/ServiceRouter'

export class LayoutMain extends LayoutBase {
    constructor(dom = document.body) {
        super(dom);
    }

    click(a) {
        ServiceRouter.go('/recipes/12');
    }

    template() {
        return `
            <div><h2>asdfasdf</h2></div>
        `
    }
}
