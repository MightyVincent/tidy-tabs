declare module '*.vue' {
  import Vue from 'vue'
  import lodash from 'lodash'
  // noinspection JSDuplicatedDeclaration,JSUnusedGlobalSymbols
  export default Vue
  global {
    const _: typeof lodash
  }
}
