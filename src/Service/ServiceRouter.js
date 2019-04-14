class ServiceRouterFactory {
    constructor() {
        this.__ = {};
        this.__.routeMap = null;
        this.__.currentLayout = null;
        this.__.basePath = null;
        window.onpopstate = this.handleRouteChange;
    }

    set basePath(val) {
        this.__.basePath = val;
    }
    set routeMap(map) {
        this.__.routeMap = map;
        this.handleRouteChange();
    }

    go(path) {
        console.warn([this.__.basePath, path].join(''));
        history.pushState({}, '', [this.__.basePath, path].join(''));
        this.handleRouteChange();
    }

    handleRouteChange = () => {
        if (this.__.routeMap) {
            const url = location.pathname.replace(this.__.basePath,'');
            const urlFragments = url.split('/').filter(it => it).length > 0 ? url.split('/').filter(it => it) : ['']; // non empty fragments only
            let routeConfig = {...this.__.routeMap};
            console.warn(urlFragments);
            while (
            (
                routeConfig &&
                typeof routeConfig === 'object' &&
                `/${urlFragments[0]}` in routeConfig
            ) || (
                Object.keys(routeConfig).filter(it => it.indexOf('/:'))[0] && urlFragments[0]
            )
                ) {
                if (!(`/${urlFragments[0]}` in routeConfig)) {
                    // try wildcards then
                    routeConfig = routeConfig[Object.keys(routeConfig).filter(it => it.indexOf('/:'))[0]];
                } else {
                    routeConfig = routeConfig[`/${urlFragments[0]}`];

                }
                urlFragments.splice(0, 1);
            }
            if (this.__.currentLayout) {
                this.__.currentLayout.destroy();
            }
            this.__.currentLayout = new routeConfig();
            this.__.currentLayout.render();
        }
    }
}
export const ServiceRouter = new ServiceRouterFactory();