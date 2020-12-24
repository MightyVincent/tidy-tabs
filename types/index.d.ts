import { TreeNode } from 'element-ui/types/tree'

declare type TabFolderState = {
  currentFolderKey: string,
  expandedFolderKeys: string[]
}

declare type AppState = {
  activeView: string,
  folder: TabFolderState,
}

declare interface TreeNodeExt<K, D> extends TreeNode<K, D> {
  collapse: () => void
  expand: () => void
}
