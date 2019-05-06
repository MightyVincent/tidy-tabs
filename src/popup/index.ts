import init from '@/commons/init'
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
