<template lang="pug">
  el-row
    el-row
      el-container
        el-aside
          el-tabs(class="tabs-no-content" stretch type="card" v-model="store.activeView")
            el-tab-pane(name="folder")
              div(class="tab-header" slot="label" title="目录")
                i(class="el-icon-folder")
            el-tab-pane(name="tag")
              div(class="tab-header" slot="label" title="标签")
                i(class="el-icon-tag")
            el-tab-pane(name="archive")
              div(class="tab-header" slot="label" title="暂存")
                i(class="el-icon-takeaway-box")
        el-main(class="no-scroll")
          el-input(prefix-icon="el-icon-search" clearable placeholder="输入关键字进行过滤" v-model="filterText")
    el-row
      el-tabs(class="tabs-no-header" type="card" v-model="store.activeView"
        :style="{height: mainHeight}")
        el-tab-pane(name="folder")
          el-container
            el-aside
              el-tree(ref="folderTree" highlight-current node-key="id" :expand-on-click-node="false"
                :style="{height: mainHeight}" :props="bookmarkTreeProps"
                :current-node-key="store.currentFolderKey" :default-expanded-keys="store.expandedFolderKeys"
                :data="folderTreeData" @current-change="handleFolderChange"
                @node-expand="handleFolderExpand" @node-collapse="handleFolderCollapse")
                div(class="folder-tree-item" slot-scope="{ node, data }" @dblclick="handleFolderDblclick(data, node, $event)")
                  font-awesome-icon(:icon="`folder${store.currentFolderKey === data.id ? '-open' : ''}`")
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

        el-tab-pane(name="tag")
          el-container
          // el-tree(class="bookmark-tree" highlight-current ref="bookmarkTree"
          //   :data="bookmarks" :props="treeProps" :filter-node-method="filterNode")
          //   span(width="300" slot-scope="{ node, data }" v-popover:popover) {{node.label}}
          //     el-popover(v-if="node.isLeaf"
          //       ref="popover"
          //       placement="right"
          //       :title="node.label"
          //       width="200"
          //       trigger="hover"
          //       :content="data.url")

        el-tab-pane(name="archive")
          el-container

</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { ElTree } from 'element-ui/types/tree'
import { ElTableColumn } from 'element-ui/types/table-column'
import { AppStore, TreeNodeExt as TreeNode } from '../../typings'
import BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode

const __ = chrome.i18n.getMessage

@Component
export default class App extends Vue {
  //---------------------------------------------
  // inital data

  innerHeight = window.innerHeight
  bookmarkTreeProps = {
    label: 'title',
    children: 'children',
  }
  store: AppStore = {
    activeView: 'folder',
    currentFolderKey: '',
    expandedFolderKeys: [],
  }
  filterText = ''
  bookmarkData: BookmarkTreeNode[] = []
  bookmarkTableData: BookmarkTreeNode[] = []

  //---------------------------------------------
  // annotate refs type

  $refs!: {
    folderTree: ElTree<string, BookmarkTreeNode>
  }

  //---------------------------------------------
  // computed

  get mainHeight() {
    return `${this.innerHeight - 40}px`
  }

  get folderTreeData() {
    return this.toFolders(this.bookmarkData)
  }

  //---------------------------------------------
  // watcher

  @Watch('store', { deep: true })
  onStoreChange(val: AppStore, oldVal: AppStore) {
    chrome.storage.sync.set({ store: val }, function() {
    })
  }

  @Watch('store.currentFolderKey')
  onCurrentFolderKeyChange(val: string, oldVal: string) {
    chrome.bookmarks.getChildren(val, results => this.bookmarkTableData = results)
  }

  //---------------------------------------------
  // lifecycle hook

  mounted() {
    this.innerHeight = window.innerHeight
    Object.assign(window, { vm: this })
    this.loadStore()
    this.loadBookmarks()
  }

  //---------------------------------------------
  // events

  handleFolderExpand(data: BookmarkTreeNode, node: TreeNode<string, BookmarkTreeNode>, el: Vue) {
    let store = this.store.expandedFolderKeys
    if (!store.includes(data.id)) {
      store.push(data.id)
    }
  }

  handleFolderCollapse(data: BookmarkTreeNode, node: TreeNode<string, BookmarkTreeNode>, el: Vue) {
    let store = this.store.expandedFolderKeys
    while (store.includes(data.id)) {
      store.splice(store.indexOf(data.id), 1)
    }
  }

  handleFolderChange(data: BookmarkTreeNode, node: TreeNode<string, BookmarkTreeNode>) {
    console.log('handleFolderChange')
    this.store.currentFolderKey = data.id
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
      chrome.tabs.create({ url: row.url }, tab => {})
    } else {
      // folder
      this.$refs.folderTree.setCurrentKey(row.id)
      this.store.currentFolderKey = row.id
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

  loadStore() {
    chrome.storage.sync.get(['store'], (result) => {
      if (result.store) {
        this.store = result.store
        this.$refs.folderTree.setCurrentKey(this.store.currentFolderKey)
      }
    })
  }

  loadBookmarks() {
    chrome.bookmarks.getTree((tree: BookmarkTreeNode[]) => {
      let rootChildren = tree[0].children
      this.bookmarkData = rootChildren ? rootChildren as BookmarkTreeNode[] : []
    })
  }

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
<style lang="scss">
/*********************************************/
/* scrollbar */
::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 7px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 7px;
}

::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}

::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  border-radius: 0;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.1);
}

/*********************************************/
/* commons */
body {
  margin: 0;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial,
  sans-serif;
  font-size: 0.9rem;
}

.el-main {
  padding: 0;
}

@media screen and (max-width: 900px) {
  body {
    width: 48rem;
    height: 36rem;
  }
}

.no-scroll {
  overflow: hidden;
}

/*tabs*/
.el-tabs__content {
  margin: 0 !important;
  padding: 0 !important;
  user-select: none;
}

.el-tree,
.el-table {
  overflow-y: auto;
  /*height: stretch;*/
}

.el-table::before {
  height: 0;
}

.el-table td,
.el-table th {
  padding: 3px 0;
}

.el-tree-node.is-current .fa-folder-open {
  color: #409EFF;
}

.tabs-no-header > .el-tabs__header,
.tabs-no-content > .el-tabs__content {
  display: none;
}

.tabs-no-content > .el-tabs__header .el-tabs__nav {
  border: none;
}

.tabs-no-content > .el-tabs__header {
  margin: 0;
}

.folder-tree-item {
  width: 100%;
}

/*main*/
.bookmark-icon {
  height: 1rem;
  width: 1rem;
  float: left;
  line-height: 1rem;
  margin: 0.2rem;
}

/*others*/
</style>
