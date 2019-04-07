// import Vue from 'vue'
// import root from './root.vue'
// Vue.config.productionTip = false

// // used in Vue rendering
// Vue.prototype.__ = chrome.i18n.getMessage

// new Vue({ // eslint-disable-line no-new
//   el: '#root',
//   render: h => h(root)
// })
import init from '../commons/init'
import root from './root.vue'
// import 'element-ui/lib/theme-chalk/index.css'
import { faTags } from '@fortawesome/free-solid-svg-icons'

init({root, icons: [faTags]})