import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import '@/store/mutation-types'
import { addExpandedFolderKey, deleteExpandedFolderKey, init, setActiveView } from '@/store/mutation-types'
import { AppState } from '@typings'
import { getField, updateField } from 'vuex-map-fields'

Vue.use(Vuex)

export default new Store<AppState>({
  state: {
    activeView: 'folder',
    folder: {
      currentFolderKey: '',
      expandedFolderKeys: [],
    },
  },
  getters: {
    getField,
  },
  mutations: {
    updateField,
    [init](state, { appState }) {
      Object.assign(state, appState)
    },
    [setActiveView](state, activeView) {
      state.activeView = activeView
    },
    [addExpandedFolderKey](state, key) {
      let keys = state.folder.expandedFolderKeys
      if (!keys.includes(key)) {
        keys.push(key)
      }
    },
    [deleteExpandedFolderKey](state, key) {
      let keys = state.folder.expandedFolderKeys
      while (keys.includes(key)) {
        keys.splice(keys.indexOf(key), 1)
      }
    },
  },
})
