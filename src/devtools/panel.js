import Vue from 'vue'
import app from './app.vue'
Vue.config.productionTip = false

// used in Vue rendering
Vue.prototype.__ = chrome.i18n.getMessage

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(app)
})
