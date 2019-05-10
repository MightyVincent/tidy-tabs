import { Store } from 'vuex'
import { AppState } from '@typings'
import store from '@/store'
import storage from '@/api/storage'
import { init } from '@/store/mutation-types'

export default new Promise<Store<AppState>>(resolve => {
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
      resolve(store)
    })
})
