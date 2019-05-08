import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import '@/store/mutation-types'
import { INIT, SET_ACTIVE_VIEW } from '@/store/mutation-types'
import { AppState } from '@typings'

Vue.use(Vuex)

export default new Store<AppState>({
  state: {
    activeView: 'folder',
    folder: {
      currentFolderKey: '',
      expandedFolderKeys: [],
    },
  },
  mutations: {
    [INIT](state, { appState }) {
      Object.assign(state, appState)
    },
    [SET_ACTIVE_VIEW](state, { activeView }) {
      state.activeView = activeView
    },
  },
})
