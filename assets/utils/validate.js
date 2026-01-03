/**
 * 表单验证工具类
 */
export default class Validate {
  static isValidName(name) {
    return this.minlength(name, 2);
  }

  static isValidMobile(mobile) {
    return /^0\d{9,10}$/.test(mobile);
  }

  static firstNumberValid(mobile) {
    return /^0/.test(mobile);
  }

  static hasHyphen(mobile) {
    return typeof mobile === 'string' && mobile.includes('-');
  }

  static hasAtMark(value) {
    return typeof value === 'string' && value.includes('@');
  }

  /**
   * 入力値が空かどうかを判断する
   */
  static required(value) {
    if (typeof value === 'number') {
      value = value.toString();
    } else if (typeof value === 'boolean') {
      return !0;
    }
    return value && value.length > 0;
  }

  /**
   * 重複検証
   */
  static noDuplicate(values) {
    for (let i = 0; i < values.length; i++) {
      for (let j = 0; j < values.length; j++) {
        if (values[i] == values[j] && i != j) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * メールアドレスの形式を確認する
   */
  static email(value) {
    return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
  }

  /**
   * 携帯電話の形式を確認する
   */
  static tel(value) {
    return /^(070|080|090)\d{8}$/.test(value.replace(/-/g, ""));
  }

  /**
   * 電話の形式を確認する
   */
  static phone(value) {
    return /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/.test(value);
  }

  /**
   * 連絡先の形式を確認する（固定電話＆携帯電話）
   */
  static call(value) {
    return /(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^((\(\d{3}\))|(\d{3}\-))?(1[358]\d{9})$)/.test(value);
  }

  /**
   * ファックスの形式を確認する
   */
  static fax(value) {
    return /^(\d{3,4}-)\d{7,8}$/.test(value);
  }

  /**
   * URLの形式を確認する
   */
  static url(value) {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
  }

  /**
   * 日付の形式を確認する
   */
  static date(value) {
    return !/Invalid|NaN/.test(new Date(value).toString());
  }

  /**
   * ISO形式の日付の形式を確認する
   */
  static dateISO(value) {
    return /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(value);
  }

  /**
   * 10進数の数字を確認する
   */
  static number(value) {
    return  /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
  }

  /**
   * 整数を確認する
   */
  static digits(value) {
    return /^\d+$/.test(value);
  }

  /**
   * 正の整数を確認する
   */
  static amount(value) {
    return /^[1-9]\d*$/.test(value);
  }

  /**
   * 身分証番号の形式を確認する
   */
  static idcard(value) {
    return /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value);
  }

  /**
   * 内容が同じかどうかを確認する
   */
  static equalTo(value, param) {
    return value == param;
  }

  /**
   * ある値を含んでいるかどうかを確認する
   */
  static contains(value, param) {
    return value.indexOf(param) >= 0;
  }

  /**
   * 最小の長さを確認する
   */
  static minlength(value, param) {
    return value.length >= param;
  }

  /**
   * 最大の長さを確認する
   */
  static maxlength(value, param) {
    return value.length <= param;
  }

  /**
   * 長さの範囲を確認する[min, max]
   */
  static rangelength(value, param) {
    return (value.length >= param[0] && value.length <= param[1]);
  }

  /**
   * 最小値を確認する
   */
  static min(value, param) {
    return Number(value) >= Number(param);
  }

  /**
   * 最大値を確認する
   */
  static max(value, param) {
    return Number(value) <= Number(param);
  }

  /**
   * 値の範囲を確認する[min, max]
   */
  static range(value, param) {
    return (value >= param[0] && value <= param[1]);
  }

  /**
   * 最小価格が最大価格より小さいか確認する
   */
  static minPrice(minValue, maxValue) {
    // 値が存在しない場合はtrue（バリデーションスキップ）
    if (!minValue || !maxValue) {
      return true;
    }
    // 最小価格が最大価格以下であればtrue
    return Number(minValue) <= Number(maxValue);
  }

  static numberError(value) {
    if (!this.number(value)) {
      return '数字を入力してください';
    }
  }

  static overShopNameNumber(value) {
    if (value.length > 5) {
      return '店舗名は50文字以内で入力してください';
    }
    return '';
  }
}
