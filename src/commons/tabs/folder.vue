<template lang="pug">
  el-container
    el-aside
      el-tree(ref="folderTree" highlight-current node-key="id" :expand-on-click-node="false"
        :style="{height: mainHeight}" :props="bookmarkTreeProps"
        :current-node-key="state.currentFolderKey" :default-expanded-keys="state.expandedFolderKeys"
        :data="folderTreeData" @current-change="handleFolderChange"
        @node-expand="handleFolderExpand" @node-collapse="handleFolderCollapse")
        div(class="folder-tree-item" slot-scope="{ node, data }" @dblclick="handleFolderDblclick(data, node, $event)")
          font-awesome-icon(:icon="`folder${state.currentFolderKey === data.id ? '-open' : ''}`")
          | &nbsp;{{node.label}}
    el-main
      el-table(ref="bookmarkTable" highlight-current-row row-key="id" :show-header="false"
        :style="{height: mainHeight}" :data="bookmarkTableData"
        @row-click="handleBookmarkLeftClick" @row-dblclick="handleBookmarkDblclick"
        @row-contextmenu="handleBookmarkContextMenu")
        el-table-column(prop="title" label="标题")
          template(slot-scope="scope")
            div(:title="scope.row.url" @click.middle.exact="handleBookmarkMiddleClick(scope.row, $event)" )
              span(class="bookmark-icon")
                font-awesome-icon(v-if="!scope.row.url" icon="folder")
                img(v-else :src="`chrome://favicon/size/16@1x/${scope.row.url}`")
              | {{scope.row.title}}
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import Vue from 'vue'
import { TabFolderState, TreeNodeExt as TreeNode } from '@@/typings'
import { ElTree } from 'element-ui/types/tree'
import { ElTableColumn } from 'element-ui/types/table-column'
import BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode

@Component
export default class App extends Vue {
  //---------------------------------------------
  // data

  @Prop()
  readonly height!: number

  @Prop()
  readonly state!: TabFolderState

  @Prop()
  readonly bookmarkData!: BookmarkTreeNode[]

  bookmarkTreeProps = {
    label: 'title',
    children: 'children',
  }
  bookmarkTableData: BookmarkTreeNode[] = []

  //---------------------------------------------
  // annotate refs type

  $refs!: {
    folderTree: ElTree<string, BookmarkTreeNode>
  }

  //---------------------------------------------
  // computed

  get mainHeight() {
    return `${this.height}px`
  }

  get folderTreeData() {
    return this.toFolders(this.bookmarkData)
  }

  //---------------------------------------------
  // watcher

  @Watch('state.currentFolderKey')
  onCurrentFolderKeyChange(val: string, oldVal: string) {
    if (this.$refs.folderTree.getCurrentKey() == null) {
      this.$refs.folderTree.setCurrentKey(val)
    }
    chrome.bookmarks.getChildren(val, results => this.bookmarkTableData = results)
  }

  //---------------------------------------------
  // lifecycle hook

  mounted() {
  }

  //---------------------------------------------
  // events

  handleFolderExpand(data: BookmarkTreeNode, node: TreeNode<string, BookmarkTreeNode>, el: Vue) {
    let expandedFolderKeys = this.state.expandedFolderKeys
    if (!expandedFolderKeys.includes(data.id)) {
      expandedFolderKeys.push(data.id)
    }
  }

  handleFolderCollapse(data: BookmarkTreeNode, node: TreeNode<string, BookmarkTreeNode>, el: Vue) {
    let expandedFolderKeys = this.state.expandedFolderKeys
    while (expandedFolderKeys.includes(data.id)) {
      expandedFolderKeys.splice(expandedFolderKeys.indexOf(data.id), 1)
    }
  }

  handleFolderChange(data: BookmarkTreeNode, node: TreeNode<string, BookmarkTreeNode>) {
    this.state.currentFolderKey = data.id
  }

  handleFolderDblclick(data: BookmarkTreeNode, node: TreeNode<string, BookmarkTreeNode>, e: MouseEvent) {
    if (node.expanded) {
      node.collapse()
    } else {
      node.expand()
    }
  }

  handleBookmarkLeftClick(row: BookmarkTreeNode, column: ElTableColumn, e: MouseEvent) {
    console.log('handleBookmarkLeftClick', arguments)
    if (e.ctrlKey) {
      console.log('handleBookmarkCtrlLeftClick', arguments)
    }
  }

  handleBookmarkDblclick(row: BookmarkTreeNode, column: ElTableColumn, cell: HTMLTableCellElement, e: MouseEvent) {
    if (row.url) {
      // bookmark
      chrome.tabs.create({ url: row.url }, tab => {
      })
    } else {
      // folder
      this.$refs.folderTree.setCurrentKey(row.id)
      this.state.currentFolderKey = row.id
    }
  }

  handleBookmarkMiddleClick(row: BookmarkTreeNode, e: MouseEvent) {
    if (row.url) {
      // bookmark
      chrome.tabs.create({ url: row.url, active: false })
    }
  }

  handleBookmarkContextMenu(row: BookmarkTreeNode, column: ElTableColumn, e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    console.log(arguments)
  }

  //---------------------------------------------
  // method

  toFolders(bookmarkData: BookmarkTreeNode[]) {
    let newList: BookmarkTreeNode[] = []
    if (bookmarkData) {
      bookmarkData.forEach((bookmark, index, arr) => {
        if (!bookmark.url) {
          // folder
          let folder: BookmarkTreeNode = Object.assign({}, bookmark, {
            children: bookmark.children ? this.toFolders(bookmark.children) : [],
          })
          newList.push(folder)
        }
      })
    }
    return newList
  }
}
</script>

<style scoped>

</style>
