import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import '@/store/mutation-types'
import { ADD_EXPANDED_FOLDER_KEYS, DELETE_EXPANDED_FOLDER_KEYS, INIT, SET_ACTIVE_VIEW } from '@/store/mutation-types'
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
    [INIT](state, { appState }) {
      Object.assign(state, appState)
    },
    [SET_ACTIVE_VIEW](state, activeView) {
      console.log(SET_ACTIVE_VIEW, arguments)
      state.activeView = activeView
    },
    [ADD_EXPANDED_FOLDER_KEYS](state, key) {
      let keys = state.folder.expandedFolderKeys
      if (!keys.includes(key)) {
        keys.push(key)
      }
    },
    [DELETE_EXPANDED_FOLDER_KEYS](state, key) {
      let keys = state.folder.expandedFolderKeys
      while (keys.includes(key)) {
        keys.splice(keys.indexOf(key), 1)
      }
    },
  },
})
