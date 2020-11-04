import Modal from './modal';
import FormInput from './form_input';
import FormSelect from './form_select';
import FormField from './form_field';
import Button from './button';
import { t } from '../locale/locale';
import { h } from './element';
import { cssPrefix } from '../config';

const fieldLabelWidth = 100;

export default class ModalRightMenu extends Modal {
  constructor() {
    // 是否表头
    const headers = new FormField(
      new FormSelect('false',
        ['false', 'true'],
        '150px',
        it => t(`rightMenu.headersType.${it}`)),
      { required: true },
      `${t('rightMenu.headers')}:`,
      fieldLabelWidth,
    );
    // 指标编码
    const zbbm = new FormField(
      new FormInput('150px', ''),
      { required: false },
      `${t('rightMenu.zbbm')}:`,
      fieldLabelWidth,
    );
    // 数据源
    const datasource = new FormField(
      new FormInput('150px', ''),
      { required: false },
      `${t('rightMenu.datasource')}:`,
      fieldLabelWidth,
    );
    // 表
    const tablename = new FormField(
      new FormInput('150px', ''),
      { required: false },
      `${t('rightMenu.tablename')}:`,
      fieldLabelWidth,
    );

    // 字段
    const fieldname = new FormField(
      new FormInput('150px', ''),
      { required: false },
      `${t('rightMenu.fieldname')}:`,
      fieldLabelWidth,
    );

    super(t('contextmenu.rightMenu'), [
      h('div', `${cssPrefix}-form-fields`).children(
        headers.el,
      ),
      h('div', `${cssPrefix}-form-fields`).children(
        zbbm.el,
      ),
      h('div', `${cssPrefix}-form-fields`).children(
        datasource.el,
      ),
      h('div', `${cssPrefix}-form-fields`).children(
        tablename.el,
      ),
      h('div', `${cssPrefix}-form-fields`).children(
        fieldname.el,
      ),
      h('div', `${cssPrefix}-buttons`).children(
        new Button('cancel').on('click', () => this.btnClick('cancel')),
        new Button('save', 'primary').on('click', () => this.btnClick('save')),
      ),
    ]);
    this.headers = headers;
    this.zbbm = zbbm;
    this.datasource = datasource;
    this.tablename = tablename;
    this.fieldname = fieldname;
    this.change = () => {};
  }

  btnClick(action) {
    if (action === 'cancel') {
      this.hide();
    } else if (action === 'save') {
      const headers = this.headers.val();
      const zbbm = this.zbbm.val();
      const datasource = this.datasource.val();
      const tablename = this.tablename.val();
      const fieldname = this.fieldname.val();
      this.change('save',
        {
          headers, zbbm, datasource, tablename, fieldname,
        });
      this.hide();
    }
  }

  // validation: { mode, ref, validator }
  setValue(v) {
    if (v) {
      const {
        headers, zbbm, datasource, tablename, fieldname,
      } = this;
      headers.val(v.headers || 'false');
      zbbm.val(v.zbbm || '');
      datasource.val(v.datasource || '');
      tablename.val(v.tablename || '');
      fieldname.val(v.fieldname || '');
    }

    this.show();
  }
}
