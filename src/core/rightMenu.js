class RightMenus {
  constructor() {
    this._ = [];
  }

  add(...args) {
    this._.push(...args);
  }

  insert(sri) {
    const ndata = [];
    for (let i = 0; i < this._.length; i += 1) {
      const v = this._[i];
      if (v.ri < sri) {
        ndata.push(v);
      } else if (v.ri >= sri) {
        v.ri += 1;
        ndata.push(v);
      }
    }
    this._ = ndata;
  }

  delete(sri) {
    const ndata = [];
    for (let i = 0; i < this._.length; i += 1) {
      const v = this._[i];
      if (v.ri < sri) {
        ndata.push(v);
      } else if (v.ri > sri) {
        v.ri -= 1;
        ndata.push(v);
      }
    }
    this._ = ndata;
  }

  insertColumn(sci) {
    const ndata = [];
    for (let i = 0; i < this._.length; i += 1) {
      const v = this._[i];
      if (v.ci < sci) {
        ndata.push(v);
      } else if (v.ci >= sci) {
        v.ci += 1;
        ndata.push(v);
      }
    }
    this._ = ndata;
  }

  deleteColumn(sci) {
    const ndata = [];
    for (let i = 0; i < this._.length; i += 1) {
      const v = this._[i];
      if (v.ci < sci) {
        ndata.push(v);
      } else if (v.ci > sci) {
        v.ci -= 1;
        ndata.push(v);
      }
    }
    this._ = ndata;
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
    this._ = d.map(it => it);
  }
}

export default {};
export {
  RightMenus,
};
