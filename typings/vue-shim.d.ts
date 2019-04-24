declare module "*.vue" {
  import Vue from "vue";
  import lodash from "lodash";
  export default Vue;
  global {
    const _: typeof lodash
  }
}
