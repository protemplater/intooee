export class ModelDataSourceRequest {
    constructor(params) {
        this.__ = {};
        this.__.promise = params.promise;
    }

    set executor(fn) {
        this.__.executorFn = fn;
    }

    get result() {
        return this.__.result;
    }

    destroy() {

    }

    exec() {
        this.__.executorFn && this.__.executorFn();
    }

    sync(fn){
        fn && fn(this);
        return this;
    }

    then(fn){
        this.__.promise
            .then(fn);
        return this;
    }
}