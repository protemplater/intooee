import {ServiceDOMEvents} from "src/Service/ServiceDOMEvents"
import {ServiceRouter} from "src/Service/ServiceRouter"

export class App {
    set basePath(val){
        ServiceRouter.basePath = val;
    }
    loadRouteMap(map){
        ServiceRouter.routeMap = map;
    }
}