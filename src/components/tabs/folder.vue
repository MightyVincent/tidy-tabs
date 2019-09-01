<template lang="pug">
  el-container
    el-aside
      el-collapse( accordion)
        el-tree(ref="folderTree" highlight-current node-key="id" :expand-on-click-node="false"
          :style="{height: cssHeight}" :props="bookmarkTreeProps"
          :current-node-key="currentFolderKey" :default-expanded-keys="expandedFolderKeys"
          :data="folderTreeData" @current-change="handleFolderChange"
          @node-expand="handleFolderExpand" @node-collapse="handleFolderCollapse")
          template(v-slot="{ node, data }")
            div(class="folder-tree-item" @dblclick="handleFolderDblclick(data, node, $event)")
              font-awesome-icon(:icon="`folder${currentFolderKey === data.id ? '-open' : ''}`")
              | &nbsp;{{node.label}}
    el-main
      el-table(ref="bookmarkTable" highlight-current-row row-key="id" :show-header="false"
        :style="{height: cssHeight}" :data="bookmarkTableData"
        @row-click="handleBookmarkLeftClick" @row-dblclick="handleBookmarkLeftDblclick"
        @row-contextmenu="handleBookmarkContextMenu")
        el-table-column(prop="title" label="标题")
          template(v-slot="scope")
            div(:title="scope.row.url" @click.middle.exact="handleBookmarkMiddleClick(scope.row, $event)" )
              span(class="bookmark-icon")
                font-awesome-icon(v-if="!scope.row.url" icon="folder")
                img(v-else :src="`chrome://favicon/size/16@1x/${scope.row.url}`")
              | {{scope.row.title}}
              el-dropdown(trigger="click")
                span(class="el-dropdown-link")
                  i(class="el-icon-arrow-down el-icon--right")
                el-dropdown-menu(slot="dropdown")
                  el-dropdown-item(icon="el-icon-plus") 黄金糕
                  el-dropdown-item(icon="el-icon-circle-plus") 狮子头
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import Vue from 'vue'
import { AppState, TreeNodeExt as TreeNode } from '@typings'
import { ElTree } from 'element-ui/types/tree'
import { ElTableColumn } from 'element-ui/types/table-column'
import { mapMutations, Store } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import { addExpandedFolderKey, deleteExpandedFolderKey } from '@/store/mutation-types'
import { ElTable } from 'element-ui/types/table'
import BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode

@Component({
  components: {
  },
  computed: {
    ...mapFields({
      currentFolderKey: 'folder.currentFolderKey',
      expandedFolderKeys: 'folder.expandedFolderKeys',
    }),
  },
  methods: {
    ...mapMutations([
      addExpandedFolderKey,
      deleteExpandedFolderKey,
    ]),
  },
})
export default class App extends Vue {
  //---------------------------------------------
  // annotate type

  $refs!: {
    folderTree: ElTree<string, BookmarkTreeNode>,
    bookmarkTable: ElTable,
  }
  $store!: Store<AppState>

  currentFolderKey!: string
  expandedFolderKeys!: string[]

  addExpandedFolderKey!: (key: string) => void
  deleteExpandedFolderKey!: (key: string) => void

  //---------------------------------------------
  // data

  @Prop()
  readonly height!: number

  @Prop()
  readonly bookmarkTreeData!: BookmarkTreeNode[]

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
    if (this.bookmarkTreeData) {
      let mapper = (bookmark: BookmarkTreeNode) => Object.assign({}, bookmark)
      let filter = (bookmark: BookmarkTreeNode) => !!bookmark.children

      let result = this.bookmarkTreeData.map(mapper)

      let queue = [...result]
      while (queue.length > 0) {
        let current = queue.shift()
        if (current) {
          if (current.children) {
            current.children = current.children.filter(filter).map(mapper)
            queue.push(...current.children)
          } else {
            current.children = []
          }
        }
      }
      return result
    } else {
      return []
    }
  }

  // get bookmarkTableData() {

  // }

  //---------------------------------------------
  // watcher

  @Watch('currentFolderKey')
  onCurrentFolderKeyChange(val: string, oldVal: string) {
    if (val) {
      this.$refs.folderTree.setCurrentKey(val)
      chrome.bookmarks.getChildren(val, results => this.bookmarkTableData = results)
    }
  }

  //---------------------------------------------
  // lifecycle hook

  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        let folderTree = this.$refs.folderTree
        if (folderTree.getCurrentKey() == null) {
          folderTree.setCurrentKey(this.currentFolderKey)
        }
      }, 200)
    })
  }

  //---------------------------------------------
  // events

  handleFolderExpand(data: BookmarkTreeNode, node: TreeNode<string, BookmarkTreeNode>, el?: Vue) {
    this.addExpandedFolderKey(data.id)
  }

  handleFolderCollapse(data: BookmarkTreeNode, node: TreeNode<string, BookmarkTreeNode>, el?: Vue) {
    this.deleteExpandedFolderKey(data.id)
  }

  handleFolderChange(data: BookmarkTreeNode, node: TreeNode<string, BookmarkTreeNode>) {
    this.currentFolderKey = data.id
  }

  handleFolderDblclick(data: BookmarkTreeNode, node: TreeNode<string, BookmarkTreeNode>, e: MouseEvent) {
    if (!node.isLeaf) {
      if (node.expanded) {
        // default-expanded-keys删除的元素不会执行collapse
        this.deleteExpandedFolderKey(data.id)
        node.collapse()
      } else {
        // default-expanded-keys已有的元素会执行expand
        this.addExpandedFolderKey(data.id)
        // node.expand()
      }
    }
  }

  handleBookmarkLeftClick(row: BookmarkTreeNode, column: ElTableColumn, e: MouseEvent) {
    // TODO
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
      chrome.tabs.create({ url: row.url })
    } else {
      // folder
      let folderTree = this.$refs.folderTree
      let parentNode = folderTree.getNode(row.id).parent
      if (parentNode && !parentNode.expanded) {
        this.addExpandedFolderKey(parentNode.key)
      }
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
    // TODO
    e.preventDefault()
    e.stopPropagation()
    console.log(arguments)
  }

  //---------------------------------------------
  // method

}
</script>

<style scoped>

</style>
