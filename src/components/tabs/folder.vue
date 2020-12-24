<template>
  <el-container>
    <el-aside>
      <el-collapse accordion="accordion">
        <el-tree :current-node-key="currentFolderKey" :data="folderTreeData" :default-expanded-keys="expandedFolderKeys"
                 :expand-on-click-node="false"
                 :props="bookmarkTreeProps" :style="{height: cssHeight}" @current-change="handleFolderChange"
                 @node-collapse="handleFolderCollapse"
                 @node-expand="handleFolderExpand" highlight-current="highlight-current" node-key="id"
                 ref="folderTree">
          <template v-slot="{ node, data }">
            <div @dblclick="handleFolderDblclick(data, node, $event)" class="folder-tree-item">
              <font-awesome-icon :icon="`folder${currentFolderKey === data.id ? '-open' : ''}`"></font-awesome-icon>
              &nbsp;{{ node.label }}
            </div>
          </template>
        </el-tree>
      </el-collapse>
    </el-aside>
    <el-main>
      <el-table :data="bookmarkTableData" :show-header="false" :style="{height: cssHeight}"
                @row-click="handleBookmarkLeftClick"
                @row-contextmenu="handleBookmarkContextMenu" @row-dblclick="handleBookmarkLeftDblclick"
                highlight-current-row="highlight-current-row"
                ref="bookmarkTable" row-key="id">
        <el-table-column label="标题" prop="title">
          <template v-slot="scope">
            <div :title="scope.row.url" @click.middle.exact="handleBookmarkMiddleClick(scope.row, $event)">
              <span class="bookmark-icon">
                <font-awesome-icon v-if="!scope.row.url" icon="folder"/>
                <img v-else :src="`chrome://favicon/size/16@1x/${scope.row.url}`" alt=""/>
              </span>
              {{ scope.row.title }}
              <!--<el-dropdown trigger="click">
                <span class="el-dropdown-link"><i class="el-icon-arrow-down el-icon&#45;&#45;right"></i></span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item icon="el-icon-plus">黄金糕</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-circle-plus">狮子头</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>-->
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import Vue from 'vue'
import { AppState, TreeNodeExt as TreeNode } from 'types'
import { ElTree } from 'element-ui/types/tree'
import { ElTableColumn } from 'element-ui/types/table-column'
import { mapMutations, Store } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import { addExpandedFolderKey, deleteExpandedFolderKey } from '@/store/mutation-types'
import { ElTable } from 'element-ui/types/table'
import BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode

@Component({
  components: {},
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
  // ---------------------------------------------
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

  // ---------------------------------------------
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

  // ---------------------------------------------
  // computed

  get cssHeight () {
    return `${this.height}px`
  }

  get folderTreeData () {
    if (this.bookmarkTreeData) {
      const mapper = (bookmark: BookmarkTreeNode) => Object.assign({}, bookmark)
      const filter = (bookmark: BookmarkTreeNode) => !!bookmark.children

      const result = this.bookmarkTreeData.map(mapper)

      const queue = [...result]
      while (queue.length > 0) {
        const current = queue.shift()
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

  // ---------------------------------------------
  // watcher

  @Watch('currentFolderKey')
  onCurrentFolderKeyChange (val: string, oldVal: string) {
    if (val) {
      this.$refs.folderTree.setCurrentKey(val)
      chrome.bookmarks.getChildren(val, results => {
        this.bookmarkTableData = results
      })
    }
  }

  // ---------------------------------------------
  // lifecycle hook

  mounted () {
    this.$nextTick(() => {
      setTimeout(() => {
        const folderTree = this.$refs.folderTree
        if (folderTree.getCurrentKey() == null) {
          folderTree.setCurrentKey(this.currentFolderKey)
        }
      }, 200)
    })
  }

  // ---------------------------------------------
  // events

  handleFolderExpand (data: BookmarkTreeNode, node: TreeNode<string, BookmarkTreeNode>, el?: Vue) {
    this.addExpandedFolderKey(data.id)
  }

  handleFolderCollapse (data: BookmarkTreeNode, node: TreeNode<string, BookmarkTreeNode>, el?: Vue) {
    this.deleteExpandedFolderKey(data.id)
  }

  handleFolderChange (data: BookmarkTreeNode, node: TreeNode<string, BookmarkTreeNode>) {
    this.currentFolderKey = data.id
  }

  handleFolderDblclick (data: BookmarkTreeNode, node: TreeNode<string, BookmarkTreeNode>, e: MouseEvent) {
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

  handleBookmarkLeftClick (row: BookmarkTreeNode, column: ElTableColumn, e: MouseEvent) {
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

  handleBookmarkLeftDblclick (row: BookmarkTreeNode, column: ElTableColumn, cell: HTMLTableCellElement, e: MouseEvent) {
    if (row.url) {
      // bookmark
      chrome.tabs.create({ url: row.url })
    } else {
      // folder
      const folderTree = this.$refs.folderTree
      const parentNode = folderTree.getNode(row.id).parent
      if (parentNode && !parentNode.expanded) {
        this.addExpandedFolderKey(parentNode.key)
      }
      this.currentFolderKey = row.id
    }
  }

  handleBookmarkMiddleClick (row: BookmarkTreeNode, e: MouseEvent) {
    if (row.url) {
      // bookmark
      chrome.tabs.create({ url: row.url, active: false })
    }
  }

  handleBookmarkContextMenu (row: BookmarkTreeNode, column: ElTableColumn, e: MouseEvent) {
    // TODO
    e.preventDefault()
    e.stopPropagation()
    console.log(arguments)
  }

  // ---------------------------------------------
  // method
}
</script>

<style scoped>

</style>
