<template lang="pug">
  el-container
    el-aside
      el-tree(ref="folderTree" highlight-current node-key="id" :expand-on-click-node="false"
        :style="{height: cssHeight}" :props="bookmarkTreeProps"
        :current-node-key="currentFolderKey" :default-expanded-keys="expandedFolderKeys"
        :data="folderTreeData" @current-change="handleFolderChange"
        @node-expand="handleFolderExpand" @node-collapse="handleFolderCollapse")
        div(class="folder-tree-item" slot-scope="{ node, data }" @dblclick="handleFolderDblclick(data, node, $event)")
          font-awesome-icon(:icon="`folder${currentFolderKey === data.id ? '-open' : ''}`")
          | &nbsp;{{node.label}}
    el-main
      el-table(ref="bookmarkTable" highlight-current-row row-key="id" :show-header="false"
        :style="{height: cssHeight}" :data="bookmarkTableData"
        @row-click="handleBookmarkLeftClick" @row-dblclick="handleBookmarkLeftDblclick"
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
import { AppState, TreeNodeExt as TreeNode } from '@typings'
import { ElTree } from 'element-ui/types/tree'
import { ElTableColumn } from 'element-ui/types/table-column'
import { Store } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode

@Component({
  computed: {
    ...mapFields({
      currentFolderKey: 'folder.currentFolderKey',
      expandedFolderKeys: 'folder.expandedFolderKeys',
    }),
  },
})
export default class App extends Vue {
  //---------------------------------------------
  // annotate type

  $refs!: {
    folderTree: ElTree<string, BookmarkTreeNode>
  }
  $store!: Store<AppState>

  currentFolderKey!: string
  expandedFolderKeys!: string[]

  //---------------------------------------------
  // data

  @Prop()
  readonly height!: number

  @Prop()
  readonly bookmarkData!: BookmarkTreeNode[]

  bookmarkTreeProps = {
    label: 'title',
    children: 'children',
  }
  bookmarkTableData: BookmarkTreeNode[] = []

  //---------------------------------------------
  // computed

  get cssHeight() {
    return `${this.height}px`
  }

  get folderTreeData() {
    return this.toFolders(this.bookmarkData)
  }

  get state() {
    return this.$store.state.folder
  }

  set state(val) {
    console.log('set state', arguments)
  }

  //---------------------------------------------
  // watcher

  @Watch('currentFolderKey', { immediate: true })
  onCurrentFolderKeyChange(val: string, oldVal: string) {
    console.log('onCurrentFolderKeyChange', val, oldVal)
    chrome.bookmarks.getChildren(val, results => this.bookmarkTableData = results)
  }

  //---------------------------------------------
  // lifecycle hook

  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        if (this.$refs.folderTree.getCurrentKey() == null) {
          this.$refs.folderTree.setCurrentKey(this.currentFolderKey)
        }
      }, 100)
    })
  }

  //---------------------------------------------
  // events

  handleFolderExpand(data: BookmarkTreeNode, node: TreeNode<string, BookmarkTreeNode>, el?: Vue) {
    let expandedFolderKeys = this.expandedFolderKeys
    if (!expandedFolderKeys.includes(data.id)) {
      expandedFolderKeys.push(data.id)
    }
  }

  handleFolderCollapse(data: BookmarkTreeNode, node: TreeNode<string, BookmarkTreeNode>, el?: Vue) {
    let expandedFolderKeys = this.expandedFolderKeys
    while (expandedFolderKeys.includes(data.id)) {
      expandedFolderKeys.splice(expandedFolderKeys.indexOf(data.id), 1)
    }
  }

  handleFolderChange(data: BookmarkTreeNode, node: TreeNode<string, BookmarkTreeNode>) {
    this.currentFolderKey = data.id
  }

  handleFolderDblclick(data: BookmarkTreeNode, node: TreeNode<string, BookmarkTreeNode>, e: MouseEvent) {
    if (!node.isLeaf) {
      if (node.expanded) {
        node.collapse()
        // this.handleFolderCollapse(data, node)
      } else {
        node.expand()
        // this.handleFolderExpand(data, node)
      }
    }
  }

  handleBookmarkLeftClick(row: BookmarkTreeNode, column: ElTableColumn, e: MouseEvent) {
    console.log('handleBookmarkLeftClick', arguments)
    if (e.ctrlKey && !e.shiftKey && !e.altKey) {
      // multi
      console.log('multi', arguments)
    } else if (!e.ctrlKey && e.shiftKey && !e.altKey) {
      // section
      console.log('section', arguments)
    } else if (!e.ctrlKey && !e.shiftKey && !e.altKey) {
      // single
      console.log('single', arguments)
    }
  }

  handleBookmarkLeftDblclick(row: BookmarkTreeNode, column: ElTableColumn, cell: HTMLTableCellElement, e: MouseEvent) {
    if (row.url) {
      // bookmark
      chrome.tabs.create({ url: row.url }, tab => {
      })
    } else {
      // folder
      this.$refs.folderTree.setCurrentKey(row.id)
      this.currentFolderKey = row.id
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
