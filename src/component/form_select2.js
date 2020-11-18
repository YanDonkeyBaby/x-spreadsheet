import { h } from './element';
import Suggest from './suggest';
import { cssPrefix } from '../config';

export default class FormSelect2 {
  constructor(key, items, width, change = () => {}) {
    this.key = key;
    this.items = items;
    this.vchange = () => {};
    this.el = h('div', `${cssPrefix}-form-select`);
    this.suggest = new Suggest(items, (it) => {
      this.itemClick(it.key);
      change(it.key);
      this.vchange(it.key);
    }, width, this.el);
    this.el.children(
      this.itemEl = h('div', 'input-text').html(this.getTitle(key)).css('width', width),
      this.suggest.el,
    ).on('click', () => this.show());
  }

  getTitle(key) {
    let title = '';
    for (let item of this.items) {
      if (item.key.toString() === key.toString()) {
        title = item.title;
      }
    }
    return title;
  }

  show() {
    this.suggest.search('');
  }

  itemClick(it) {
    this.key = it;
    this.itemEl.html(this.getTitle(it));
  }

  val(v) {
    if (v !== undefined) {
      this.key = v;
      this.itemEl.html(this.getTitle(v));
      return this;
    }
    return this.key;
  }
}
