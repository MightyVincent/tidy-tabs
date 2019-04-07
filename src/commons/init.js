import { extend } from 'lodash'
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false

// used in Vue rendering
Vue.prototype.__ = chrome.i18n.getMessage

Vue.use(ElementUI)

export default function ({root, options = {}, icons = []}) {
  library.add(icons)
  // eslint-disable-line no-new
  new Vue(extend({
    el: '#root',
    render: h => h(root)
  }, options))
}