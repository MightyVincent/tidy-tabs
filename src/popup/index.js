import init from '../commons/init'
import root from './root.vue'
import {
  faTags,
  faFolder,
  faFolderOpen,
  faBookmark,
} from '@fortawesome/free-solid-svg-icons'
/*
folder
folder-plus
folder-open
folder-minus
*/
init({
  root,
  icons: [
    faTags,
    faFolder,
    faFolderOpen,
    faBookmark,
  ]
})