// import Vue from 'vue'
// import app from './app.vue'
// Vue.config.productionTip = false

// // used in Vue rendering
// Vue.prototype.__ = chrome.i18n.getMessage

// new Vue({ // eslint-disable-line no-new
//   el: '#app',
//   render: h => h(app)
// })
import init from '../commons/init'
import app from './app.vue'
// import 'element-ui/lib/theme-chalk/index.css'
import { faTags } from '@fortawesome/free-solid-svg-icons'

init({ app, icons: [faTags] })
