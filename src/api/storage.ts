import { AppState } from '@types'

export default {
  loadAppState: function(): Promise<AppState> {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.sync.get(['state'], (result) => {
          resolve(result.state as AppState)
        })
      } catch (e) {
        reject(e)
      }
    })
  },
  saveAppState: function(appState: AppState): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.sync.set({ state: appState }, () => {
          resolve()
        })
      } catch (e) {
        reject(e)
      }
    })
  },
}
