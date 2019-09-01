import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import '@/store/mutation-types'
import {
  addExpandedFolderKey,
  deleteExpandedFolderKey,
  init,
  setActiveView,
  setFolderExpandedFolderKey,
} from '@/store/mutation-types'
import { AppState } from '@typings'
import { getField, updateField } from 'vuex-map-fields'
import storage from '@/api/storage'

Vue.use(Vuex)

export default new Store<AppState>({
  strict: process.env.NODE_ENV !== 'production',
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
      // console.log(JSON.stringify(state));
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
  plugins: [
    store => {
      storage.loadAppState()
        .then((appState) => {
          if (appState) {
            store.commit(init, { appState })
          }
          store.subscribe((mutation, state) => {
            if (mutation.type !== init) {
              storage.saveAppState(state).then()
            }
          })
        })
    }
  ]
})
