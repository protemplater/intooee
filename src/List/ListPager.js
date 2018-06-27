export default function ListPager(params) {
    class Pager {
        constructor(list, {limit = 3, offset = 0} = {}) {
            this.__ = {};
            this.__.list = list;
            this.__.limit = limit;
            this.__.offset = offset;
            this.render();
        }

        render() {
            this.__.list.emit('pagerUpdate', {
                params: {
                    key: this.__.offset / this.__.limit,
                }
            });
        }

        get limit() {
            return this.__.limit;
        }

        get offset() {
            return this.__.offset;
        }

        set offset(val) {
            if (val < 0) {
                this.__.offset = (Math.ceil(this.__.list.__.totalCount / this.__.limit) - 1) * this.__.limit;
            } else {
                this.__.offset = val;
            }
            this.render();
            this.__.list.emitUpdate();
        }
    }

    return function (list) {
        list.__.pager = new Pager(list, {limit: 4, offset: 0});
        list.__.modifiers.add(3, (prevList) => {
            const result = prevList.slice(list.__.pager.offset, list.__.pager.offset + list.__.pager.limit);
            if (result.length === 0) {
                list.__.pager.offset = -1;
                return prevList.slice(list.__.pager.offset, list.__.pager.offset + list.__.pager.limit);
            }
            return result;
        });

        Object.defineProperty(list, 'pager', {
            get: function () {
                return list.__.pager;
            }
        });
        Object.defineProperty(list, 'pagerItems', {
            get: function () {
                return Array.from(new Array(Math.ceil(this.__.totalCount / this.__.pager.limit))).map((i, ind) => ({_id: ind}))
            }
        });
    }
}
