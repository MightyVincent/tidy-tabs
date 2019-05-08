import Vue, { Component } from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { IconPack, library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { merge } from 'lodash'
import 'reflect-metadata'
import initStore from '@/store/init'

// 全局禁用鼠标中键滚动开关
// block scroll trigger globally
document.onmousedown = (e) => {
  if (e.button == 1) {
    e.preventDefault()
    e.stopPropagation()
    // return false
  }
}

Vue.prototype.__ = chrome.i18n.getMessage
// process.env.NODE_ENV === 'development'
Vue.config.devtools = false
Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.component('font-awesome-icon', merge(FontAwesomeIcon, { props: { fixedWidth: { default: true } } }))

export default function(app: Component, icons: IconPack) {
  initStore.then(store => {
    console.log(JSON.stringify(store.state));
    library.add(icons)
    new Vue({
      el: '#app',
      store,
      render: h => h(app),
    })
  })
}
