interface Window {
  _MSG_: typeof chrome.i18n.getMessage;
}

declare module '*.vue' {
  import Vue from 'vue'
  import lodash from 'lodash'
  global {
    const _: typeof lodash
    const _MSG_: typeof chrome.i18n.getMessage
  }
  export default Vue
}
