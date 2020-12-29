import Modal from './modal';
import FormInput from './form_input';
import FormSelect from './form_select';
import FormSelect2 from './form_select2';
import FormField from './form_field';
import Button from './button';
import { t } from '../locale/locale';
import { h } from './element';
import { cssPrefix } from '../config';

const fieldLabelWidth = 100;

export default class ModalRightMenu extends Modal {
  constructor(zbbmData, cellPro, jizuData, shebeiData) {
    // 组织机组数据
    const jzData = [];
    if (jizuData.length > 0) {
      const jzsStr = jizuData.split(',');
      for (let i = 0; i < jzsStr.length; i++) {
        const jz = jzsStr[i].split(':');
        const jzObj = { key: jz[0], title: jz[1] };
        jzData.push(jzObj);
      }
    }

    // 组织设备数据
    const sbData = [];
    if (shebeiData.length > 0) {
      const sbsStr = shebeiData.split(',');
      for (let i = 0; i < sbsStr.length; i++) {
        const sb = sbsStr[i].split(':');
        const sbObj = { key: sb[0], title: sb[1] };
        sbData.push(sbObj);
      }
    }

    // 是否表头
    const headers = new FormField(
      new FormSelect('false',
        ['false', 'true'],
        '300px',
        it => t(`rightMenu.headersType.${it}`)),
      { required: true },
      `${t('rightMenu.headers')}:`,
      fieldLabelWidth,
    );
    // 机组或设备
    const jzOrSb = new FormField(
      new FormSelect('no',
        ['no', 'jz', 'sb'],
        '80px',
        it => t(`rightMenu.jzOrSbType.${it}`),
        it => this.jzOrSbSelected(it)),
      { required: true },
      `${t('rightMenu.jzOrSb')}:`,
      fieldLabelWidth,
    );
    // 机组内容
    const jizu = new FormField(
      new FormSelect2('', jzData,
        '100px'),
      { required: true },
      `${t('rightMenu.jzName')}:`,
      80,
    ).hide();

    // 设备内容
    const shebei = new FormField(
      new FormSelect2('', sbData,
        '100px'),
      { required: true },
      `${t('rightMenu.sbName')}:`,
      80,
    ).hide();

    // 指标编码
    const zbbm = new FormField(
      new FormSelect2('1', zbbmData,
        '300px'),
      { required: false },
      `${t('rightMenu.zbbm')}:`,
      fieldLabelWidth,
    );
    // 数据源
    const datasource = new FormField(
      new FormInput('300px', ''),
      { required: false },
      `${t('rightMenu.datasource')}:`,
      fieldLabelWidth,
    );
    // 表
    const table = new FormField(
      new FormInput('300px', ''),
      { required: false },
      `${t('rightMenu.tablename')}:`,
      fieldLabelWidth,
    );

    // 字段
    const field = new FormField(
      new FormInput('300px', ''),
      { required: false },
      `${t('rightMenu.fieldname')}:`,
      fieldLabelWidth,
    );

    super(t('contextmenu.rightMenu'), [
      h('div', `${cssPrefix}-form-fields`).children(
        headers.el,
      ),
      h('div', `${cssPrefix}-form-fields`).children(
        jzOrSb.el,
        jizu.el,
        shebei.el,
      ),
      h('div', `${cssPrefix}-form-fields`).children(
        zbbm.el,
      ),
      h('div', `${cssPrefix}-form-fields`).children(
        datasource.el,
      ),
      h('div', `${cssPrefix}-form-fields`).children(
        table.el,
      ),
      h('div', `${cssPrefix}-form-fields`).children(
        field.el,
      ),
      h('div', `${cssPrefix}-buttons`).children(
        new Button('cancel').on('click', () => this.btnClick('cancel')),
        new Button('remove').on('click', () => this.btnClick('remove')),
        new Button('save', 'primary').on('click', () => this.btnClick('save')),
      ),
    ]);


    this.headers = headers;
    this.zbbm = zbbm;
    this.datasource = datasource;
    this.table = table;
    this.field = field;
    this.change = () => {};
    this.cellPro = cellPro;
    this.jzOrSb = jzOrSb;
    this.jizu = jizu;
    this.shebei = shebei;
    this.jzData = jzData;
    this.sbData = sbData;
  }

  btnClick(action) {
    if (action === 'cancel') {
      this.hide();
    } else if (action === 'remove') {
      this.change('remove');
      this.hide();
    } else if (action === 'save') {
      const headers = this.headers.val();
      const zbbm = this.zbbm.val();
      const datasource = this.datasource.val();
      const table = this.table.val();
      const field = this.field.val();
      const jzOrSb = this.jzOrSb.val();
      const jizu = this.jizu.val();
      const shebei = this.shebei.val();
      this.change('save',
        {
          headers, zbbm, datasource, table, field, jzOrSb, jizu, shebei,
        });
      this.hide();
    }
  }

  setValue(v) {
    const {
      headers, zbbm, datasource, table, field, cellPro, jzOrSb, jizu, shebei,
    } = this;
    let jzOrSbValue = '';
    if (v && v.jzOrSb) {
      jzOrSbValue = v.jzOrSb;
    }
    if (jzOrSbValue === 'jz') {
      jizu.show();
      shebei.hide();
    } else if (jzOrSbValue === 'sb') {
      shebei.show();
      jizu.hide();
    } else {
      jizu.hide();
      shebei.hide();
    }
    if (v) {
      headers.val(v.headers || 'false');
      zbbm.val(v.zbbm || '');
      datasource.val(v.datasource || '');
      table.val(v.table || '');
      field.val(v.field || '');
      jzOrSb.val(v.jzOrSb || 'no');
      jizu.val(v.jizu || '');
      shebei.val(v.shebei || '');
    } else if (this.cellPro) {
      headers.val('false');
      zbbm.val('');
      datasource.val(cellPro.datasource || '');
      table.val(cellPro.table || '');
      field.val(cellPro.field || '');
      jzOrSb.val('no');
      jizu.val('');
      shebei.val('');
    } else {
      headers.val('false');
      zbbm.val('');
      datasource.val('');
      table.val('');
      field.val('');
      jzOrSb.val('no');
      jizu.val('');
      shebei.val('');
    }
    this.show();
  }

  jzOrSbSelected(it) {
    if (!it) return;
    const {
      jizu, shebei,
    } = this;
    if (it === 'jz') {
      jizu.show();
      shebei.hide();
    } else if (it === 'sb') {
      shebei.show();
      jizu.hide();
    }
  }
}
