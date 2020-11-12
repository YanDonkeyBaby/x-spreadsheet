import Validator from './validator';
import { CellRange } from './cell_range';

class Validation {
  constructor(mode, refs, validator) {
    this.refs = refs;
    this.mode = mode; // cell
    this.validator = validator;
  }

  includes(ri, ci) {
    const { refs } = this;
    for (let i = 0; i < refs.length; i += 1) {
      const cr = CellRange.valueOf(refs[i]);
      if (cr.includes(ri, ci)) return true;
    }
    return false;
  }

  addRef(ref) {
    this.remove(CellRange.valueOf(ref));
    this.refs.push(ref);
  }

  remove(cellRange) {
    const nrefs = [];
    this.refs.forEach((it) => {
      const cr = CellRange.valueOf(it);
      if (cr.intersects(cellRange)) {
        const crs = cr.difference(cellRange);
        crs.forEach(it1 => nrefs.push(it1.toString()));
      } else {
        nrefs.push(it);
      }
    });
    this.refs = nrefs;
  }

  getData() {
    const { refs, mode, validator } = this;
    const {
      type, required, operator, value,
    } = validator;
    return {
      refs, mode, type, required, operator, value,
    };
  }

  static valueOf({
    refs, mode, type, required, operator, value,
  }) {
    return new Validation(mode, refs, new Validator(type, required, value, operator));
  }
}
class Validations {
  constructor() {
    this._ = [];
    // ri_ci: errMessage
    this.errors = new Map();
  }

  getError(ri, ci) {
    return this.errors.get(`${ri}_${ci}`);
  }

  validate(ri, ci, text) {
    const v = this.get(ri, ci);
    const key = `${ri}_${ci}`;
    const { errors } = this;
    if (v !== null) {
      const [flag, message] = v.validator.validate(text);
      if (!flag) {
        errors.set(key, message);
      } else {
        errors.delete(key);
      }
    } else {
      errors.delete(key);
    }
    return true;
  }

  // type: date|number|phone|email|list
  // validator: { required, value, operator }
  add(mode, ref, {
    type, required, value, operator,
  }) {
    const validator = new Validator(
      type, required, value, operator,
    );
    const v = this.getByValidator(validator);
    if (v !== null) {
      v.addRef(ref);
    } else {
      this._.push(new Validation(mode, [ref], validator));
    }
  }

  getByValidator(validator) {
    for (let i = 0; i < this._.length; i += 1) {
      const v = this._[i];
      if (v.validator.equals(validator)) {
        return v;
      }
    }
    return null;
  }

  get(ri, ci) {
    for (let i = 0; i < this._.length; i += 1) {
      const v = this._[i];
      if (v.includes(ri, ci)) return v;
    }
    return null;
  }

  remove(cellRange) {
    this.each((it) => {
      it.remove(cellRange);
    });
  }

  insert(sri) {
    const ndata = [];
    for (let i = 0; i < this._.length; i += 1) {
      const v = this._[i];
      if (v && v.refs && v.refs[0]) {
        const ri = parseInt(v.refs[0].substring(1, 2), 10) - 1;
        if (ri < sri) {
          ndata.push(v);
        } else if (ri >= sri) {
          v.refs[0] = v.refs[0].substring(0, 1) + parseInt((ri + 2), 10);
          ndata.push(v);
        }
      }
    }
    this._ = ndata;
  }

  insertColumn(sci) {
    const ndata = [];
    for (let i = 0; i < this._.length; i += 1) {
      const v = this._[i];
      if (v && v.refs && v.refs[0]) {
        const len = v.refs[0].length;
        const ci = this.stringToCode(v.refs[0]);
        if (ci < sci) {
          ndata.push(v);
        } else if (ci >= sci) {
          const str = this.codeToString(ci + 1);
          v.refs[0] = str + v.refs[0].substring(len - 1, len);
          ndata.push(v);
        }
      }
    }
    this._ = ndata;
  }

  delete(sri, eri) {
    const n = eri - sri + 1;
    const ndata = [];
    for (let i = 0; i < this._.length; i += 1) {
      const v = this._[i];
      if (v && v.refs && v.refs[0]) {
        const ri = parseInt(v.refs[0].substring(1, 2), 10) - 1;
        if (ri < sri) {
          ndata.push(v);
        } else if (ri > eri) {
          v.refs[0] = v.refs[0].substring(0, 1) + parseInt((ri - n + 1), 10);
          ndata.push(v);
        }
      }
    }
    this._ = ndata;
  }

  deleteColumn(sci, eci) {
    const n = eci - sci + 1;
    const ndata = [];
    for (let i = 0; i < this._.length; i += 1) {
      const v = this._[i];
      if (v && v.refs && v.refs[0]) {
        const len = v.refs[0].length;
        const ci = this.stringToCode(v.refs[0]);
        if (ci < sci) {
          ndata.push(v);
        } else if (ci > eci) {
          const str = this.codeToString(ci - n);
          v.refs[0] = str + v.refs[0].substring(len - 1, len);
          ndata.push(v);
        }
      }
    }
    this._ = ndata;
  }

  stringToCode(str) {
    let num = 0;
    const str2 = str.split('');
    const len = str2.length;
    for (const [i, s] of str2.entries()) {
      if (len === 3) {
        if (i === 0) {
          num += (s.charCodeAt(0) - 64) * 26;
        } else if (i === 1) {
          num += s.charCodeAt(0) - 65;
        }
      } else if (len === 2) {
        if (i === 0) {
          num += s.charCodeAt(0) - 65;
        }
      }
    }
    return num;
  }

  codeToString(num) {
    let str = '';
    const num1 = Math.floor(num / 26);
    const num2 = num % 26;
    if (num1 > 0 && num1 < 26) {
      str += String.fromCharCode(num1 + 64);
    }
    if (num2 >= 0 && num2 < 26) {
      str += String.fromCharCode(num2 + 65);
    }
    return str;
  }

  each(cb) {
    this._.forEach(it => cb(it));
  }

  getData() {
    return this._.filter(it => it.refs.length > 0).map(it => it.getData());
  }

  setData(d) {
    this._ = d.map(it => Validation.valueOf(it));
  }
}

export default {};
export {
  Validations,
};
