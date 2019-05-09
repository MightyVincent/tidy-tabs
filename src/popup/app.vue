<template lang="pug">
  el-row
    el-row
      el-container
        el-aside
          el-tabs(class="tabs-no-content" stretch type="card" v-model="activeView")
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
      el-tabs(class="tabs-no-header" type="card" :value="activeView"
      )
        el-tab-pane(name="folder")
          tab-folder(:bookmark-data="bookmarkData" :height="windowHeight - 40")

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
            el-aside aside
            el-main

</template>
<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { ElTree } from 'element-ui/types/tree'
import { AppState } from '@typings'
import TabFolder from '@/components/tabs/folder.vue'
import { Store } from 'vuex'
import { SET_ACTIVE_VIEW } from '@/store/mutation-types'
import BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode

const __ = chrome.i18n.getMessage

@Component({
  components: {
    TabFolder,
  },
})
export default class App extends Vue {
  //---------------------------------------------
  // annotate type

  $refs!: {
  }
  $store!: Store<AppState>

  //---------------------------------------------
  // data

  windowHeight = window.innerHeight
  filterText = ''
  bookmarkData: BookmarkTreeNode[] = []

  //---------------------------------------------
  // computed

  get activeView() {
    return this.$store.state.activeView
  }

  set activeView(val) {
    if (val !== this.$store.state.activeView) {
      this.$store.commit(SET_ACTIVE_VIEW, val)
    }
  }

  //---------------------------------------------
  // watcher


  //---------------------------------------------
  // lifecycle hook

  created() {
    Object.assign(window, { vm: this, Vue: Vue })
    window.onresize = () => this.windowHeight = window.innerHeight
  }

  mounted() {
    this.loadBookmarks()
  }

  //---------------------------------------------
  // events


  //---------------------------------------------
  // method

  loadBookmarks() {
    chrome.bookmarks.getTree((tree: BookmarkTreeNode[]) => {
      let rootChildren = tree[0].children
      this.bookmarkData = rootChildren ? rootChildren as BookmarkTreeNode[] : []
    })
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
html {
  overflow: hidden;
}

body {
  overflow: hidden;
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
