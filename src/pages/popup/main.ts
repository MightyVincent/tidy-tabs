import init from '@/pages/init'
import app from './app.vue'
import {
  faArchive,
  faBookmark,
  faFolder,
  faFolderOpen,
  faHistory,
  faSearch,
  faTags,
} from '@fortawesome/free-solid-svg-icons'
/*
folder
folder-plus
folder-open
folder-minus
*/
init(app, {
  faTags,
  faFolder,
  faFolderOpen,
  faBookmark,
  faArchive,
  faHistory,
  faSearch,
})

/*import Vue from 'vue'
import App from './App.vue'
import router from '../../router'
import store from '../../store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')*/
