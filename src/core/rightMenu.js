import { CellRange } from './cell_range';

class RightMenus {
  constructor() {
    this._ = [];
  }

  add(...args) {
    this._.push(...args);
  }

  get(ri, ci) {
    for (let i = 0; i < this._.length; i += 1) {
      const v = this._[i];
      if (v.ri === ri && v.ci === ci) return v;
    }
    return null;
  }

  getData() {
    return this._.map(it => it);
  }

  setData(d) {
    this._ = d.map(it => CellRange.valueOf(it));
  }
}

export default {};
export {
  RightMenus,
};
