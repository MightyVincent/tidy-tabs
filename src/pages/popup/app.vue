<template>
  <div id="app">
    <el-row>
      <el-row>
        <el-container>
          <el-aside>
            <el-tabs class="tabs-no-content" stretch="stretch" type="card" v-model="activeView">
              <el-tab-pane name="folder">
                <div class="tab-header" slot="label" title="目录"><i class="el-icon-folder"></i></div>
              </el-tab-pane>
              <el-tab-pane name="tag">
                <div class="tab-header" slot="label" title="标签"><i class="el-icon-collection-tag"></i></div>
              </el-tab-pane>
              <el-tab-pane name="archive">
                <div class="tab-header" slot="label" title="暂存"><i class="el-icon-takeaway-box"></i></div>
              </el-tab-pane>
            </el-tabs>
          </el-aside>
          <el-main class="no-scroll">
            <el-input clearable="clearable" placeholder="输入关键字进行过滤" prefix-icon="el-icon-search"
                      v-model="filterText"></el-input>
          </el-main>
        </el-container>
      </el-row>
      <el-row>
        <el-tabs :value="activeView" class="tabs-no-header" type="card">
          <el-tab-pane name="folder">
            <tab-folder :bookmark-tree-data="bookmarkTreeData" :height="windowHeight - 40"></tab-folder>
          </el-tab-pane>
          <el-tab-pane name="tag">
            <el-container>
              <!--<el-tree :data="bookmarks" :filter-node-method="filterNode" :props="treeProps" class="bookmark-tree"
                       highlight-current="highlight-current" ref="bookmarkTree"><span slot-scope="{ node, data }" v-popover:popover="v-popover:popover"
                                                                                 width="300">{{node.label}}<el-popover
                :content="data.url" :title="node.label" placement="right" ref="popover" trigger="hover" v-if="node.isLeaf"
                width="200"></el-popover></span></el-tree>-->
            </el-container>
          </el-tab-pane>
          <el-tab-pane name="archive">
            <el-container>
              <el-aside>aside</el-aside>
              <el-main></el-main>
            </el-container>
          </el-tab-pane>
        </el-tabs>
      </el-row>
    </el-row>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { AppState } from '@types'
import TabFolder from '@/components/tabs/folder.vue'
import { Store } from 'vuex'
import { setActiveView } from '@/store/mutation-types'
import BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode

// const __ = chrome.i18n.getMessage

@Component({
  components: {
    TabFolder,
  },
})
export default class App extends Vue {
  //---------------------------------------------
  // annotate type

  $refs!: Record<string, Element>
  $store!: Store<AppState>

  //---------------------------------------------
  // data

  windowHeight = window.innerHeight
  filterText = ''
  bookmarkTreeData: BookmarkTreeNode[] = []

  //---------------------------------------------
  // computed

  get activeView(): string {
    return this.$store.state.activeView
  }

  set activeView(val: string) {
    if (val !== this.$store.state.activeView) {
      this.$store.commit(setActiveView, val)
    }
  }

  //---------------------------------------------
  // watcher


  //---------------------------------------------
  // lifecycle hook

  created(): void {
    Object.assign(window, { vm: this, Vue: Vue })
    window.onresize = () => this.windowHeight = window.innerHeight
  }

  mounted(): void {
    this.loadBookmarks()
  }

  //---------------------------------------------
  // events


  //---------------------------------------------
  // method

  loadBookmarks(): void {
    chrome.bookmarks.getTree((tree: BookmarkTreeNode[]) => {
      console.log(tree)
      let rootChildren = tree[0].children
      this.bookmarkTreeData = rootChildren ? rootChildren as BookmarkTreeNode[] : []
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
