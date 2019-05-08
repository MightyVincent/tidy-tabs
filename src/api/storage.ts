import { AppState } from '@typings'

export default {
  loadAppState: (): Promise<AppState> => new Promise((resolve, reject) => {
    try {
      chrome.storage.sync.get(['state'], (result) => {
        resolve(result.state as AppState)
      })
    } catch (e) {
      reject(e)
    }
  }),
  saveAppState: (appState: AppState) => new Promise((resolve, reject) => {
    try {
      chrome.storage.sync.set({ state: appState }, () => {
        resolve()
      })
    } catch (e) {
      reject(e)
    }
  }),
}
