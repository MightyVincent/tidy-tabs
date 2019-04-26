<template lang="pug">
  el-row
    el-row
      el-container
        el-aside
          el-tabs(class="tabs-no-content" stretch type="card" v-model="config.activeTabName")
            el-tab-pane(name="folders")
              div(class="tab-header" slot="label" title="目录")
                i(class="el-icon-folder")
            el-tab-pane(name="tags")
              div(class="tab-header" slot="label" title="标签")
                i(class="el-icon-tag")
            el-tab-pane(name="staged")
              div(class="tab-header" slot="label" title="暂存")
                i(class="el-icon-takeaway-box")
        el-main(class="no-scroll")
          el-input(class="" prefix-icon="el-icon-search" clearable placeholder="输入关键字进行过滤" v-model="filterText")
    el-row
      el-tabs(class="tabs-no-header" type="card" v-model="config.activeTabName"
        :style="{height: mainHeight}")
        el-tab-pane(name="folders")
          el-container
            el-aside
              el-tree(ref="$foldersTree" highlight-current node-key="id" empty-text="无标题"
                :expand-on-click-node="false" :style="{height: mainHeight}"
                :props="bookmarkTreeProps" :default-expanded-keys="config.openedBarFolders" :data="barFolderTree"
                @current-change="handleFolderChange")
                span(slot-scope="{ node, data }")
                  font-awesome-icon(v-show="$refs.$foldersTree.getCurrentKey() === data.id" icon="folder-open" class="fa-fw")
                  font-awesome-icon(v-show="$refs.$foldersTree.getCurrentKey() !== data.id" icon="folder" class="fa-fw")
                  span &nbsp;{{node.label}}
            el-main
              el-table(highlight-current-row empty-text="无标题" :show-header="false"
                :style="{height: mainHeight}" :data="tableData")
                el-table-column(prop="title" label="标题")
                  template(slot-scope="scope")
                    span(:title="scope.row.url")
                      span(class="bookmark-icon")
                        font-awesome-icon(v-if="!scope.row.url" icon="folder" class="fa-fw")
                        img(v-else :src="`chrome://favicon/size/16@1x/${scope.row.url}`")
                      span {{scope.row.title}}

        el-tab-pane(name="tags")
          el-container
          // el-tree(class="bookmark-tree" highlight-current ref="bookmarkTree"
          //   :data="bookmarks" :props="treeProps" :filter-node-method="filterNode"
          //     @node-click="handleOpenTab")
          //   span(width="300" slot-scope="{ node, data }" v-popover:popover) {{node.label}}
          //     el-popover(v-if="node.isLeaf"
          //       ref="popover"
          //       placement="right"
          //       :title="node.label"
          //       width="200"
          //       trigger="hover"
          //       :content="data.url")

        el-tab-pane(name="staged")
          el-container

</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { ElTree, TreeNode } from 'element-ui/types/tree'
import BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode

const __ = chrome.i18n.getMessage

@Component
export default class App extends Vue {
  //---------------------------------------------
  // inital data

  config = {
    activeTabName: 'folders',
    openedBarFolders: [],
  }
  bookmarkTreeProps = {
    label: 'title',
    children: 'children',
  }
  filterText = ''
  barBookmarkTree: BookmarkTreeNode[] = []
  barFolderTree: BookmarkTreeNode[] = []
  etcBookmarks: BookmarkTreeNode[] = []
  tableData: BookmarkTreeNode[] = []
  innerHeight = window.innerHeight

  //---------------------------------------------
  // annotate refs type

  $refs!: {
    bookmarkTree: ElTree
  }

  //---------------------------------------------
  // lifecycle hook

  mounted() {
    this.innerHeight = window.innerHeight
    Object.assign(window, { vm: this })
    chrome.bookmarks.getTree((tree: BookmarkTreeNode[]) => {
      this.loadBookmarks(tree[0])
    })
  }

  // created() {
  //   console.log(__("popup"))
  // }

  //---------------------------------------------
  // computed
  get mainHeight() {
    return `${this.innerHeight - 40}px`
  }

  //---------------------------------------------
  // method

  loadBookmarks(rootNode: BookmarkTreeNode) {
    let rootChildren = rootNode.children
    if (!rootChildren) {
      return
    }
    // 书签栏
    this.barBookmarkTree = rootChildren as BookmarkTreeNode[]
    this.barFolderTree = this.recursivelyConvertToFolders(this.barBookmarkTree)
    // 其它书签
    this.etcBookmarks = rootChildren[1].children as BookmarkTreeNode[]
  }

  recursivelyConvertToFolders(bookmarkTree: BookmarkTreeNode[]) {
    let newList: BookmarkTreeNode[] = []
    if (bookmarkTree) {
      bookmarkTree.forEach((bookmark, index, arr) => {
        if (!bookmark.url) {
          // folder
          let folder: BookmarkTreeNode = Object.assign({}, bookmark, {
            children: this.recursivelyConvertToFolders(bookmark.children as BookmarkTreeNode[]),
          })
          newList.push(folder)
        }
      })
    }
    return newList
  }

  filterNode(value, data) {
    console.log(arguments)
    if (!value) return true
    return data.title.indexOf(value) !== -1
  }

  //---------------------------------------------
  // events

  handleFolderChange(data: BookmarkTreeNode, node: TreeNode<string, BookmarkTreeNode>) {
    chrome.bookmarks.getChildren(data.id, children => {
      this.tableData = children
    })
  }

  handleOpenTab(data: BookmarkTreeNode, node: TreeNode<string, BookmarkTreeNode>, el: any) {
    if (node.isLeaf) alert('node opening')
  }

  @Watch('filterText')
  onFilterTextChange(val: string, oldVal: string) {
    this.$refs.bookmarkTree.filter(val)
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

.el-tree-node.is-current .fa-fw.fa-folder-open {
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

\
