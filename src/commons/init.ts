import Vue, { Component } from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { IconPack, library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { merge } from 'lodash'
import 'reflect-metadata'

// 全局禁用鼠标中键滚动开关
// block scroll trigger globally
document.onmousedown = (e) => {
  if (e.button == 1) {
    e.preventDefault()
    e.stopPropagation()
    // return false
  }
}

Vue.component('font-awesome-icon', merge(FontAwesomeIcon, { props: { fixedWidth: { default: true } } }))
Vue.config.productionTip = false

// used in Vue rendering
Vue.prototype.__ = chrome.i18n.getMessage

Vue.use(ElementUI)

export default function(app: Component, icons: IconPack) {
  library.add(icons)
  // eslint-disable-line no-new
  new Vue({
    el: '#app',
    render: h => h(app),
  })
}
