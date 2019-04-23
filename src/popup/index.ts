import init from '../commons/init'
import root from './root.vue'
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
init(root, {
  faTags,
  faFolder,
  faFolderOpen,
  faBookmark,
  faArchive,
  faHistory,
  faSearch,
})
