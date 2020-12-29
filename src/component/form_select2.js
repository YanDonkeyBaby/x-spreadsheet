import { h } from './element';
import Suggest from './suggest';
import { cssPrefix } from '../config';

export default class FormSelect2 {
  constructor(key, items, width, change = () => {}) {
    this.key = key;
    this.items = items;
    this.vchange = () => {};
    this.el = h('div', `${cssPrefix}-form-select2`);
    this.suggest = new Suggest(items, (it) => {
      this.itemClick(it.key);
      change(it.key);
      this.vchange(it.key);
    }, width, '170px', this.el);
    this.el.children(
      this.itemEl = h('input', 'input-text').html(this.getTitle(key)).css('width', width)
        .on('input', e => this.show(e.target.value)),
      this.suggest.el,
    ).on('click', () => this.show(this.itemEl.val()));
  }

  getTitle(key) {
    let title = '';
    for (const item of this.items) {
      if (item.key.toString() === key.toString()) {
        title = item.title;
      }
    }
    return title;
  }

  show(word) {
    this.suggest.search(word);
  }

  itemClick(it) {
    this.key = it;
    this.itemEl.val(this.getTitle(it));
  }

  val(v) {
    if (v !== undefined) {
      this.key = v;
      this.itemEl.val(this.getTitle(v));
      return this;
    }
    return this.key;
  }
}
