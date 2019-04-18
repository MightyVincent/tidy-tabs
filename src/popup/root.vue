<template lang="pug">
el-row
  el-row
    el-input(prefix-icon="el-icon-search" clearable placeholder="输入关键字进行过滤" v-model="filterText")

  el-row
    el-tabs(class="tab-container" stretch tab-position="left" type="border-card" v-model="config.activeTabName" @tab-click="handleClick")
      el-tab-pane(name="folders")
        div(slot="label" title="目录")
          font-awesome-icon(icon="bookmark" class="fa-fw")
        div(class="tab-body")
          el-col(:xs="6" :sm="6" :md="6" :lg="4" :xl="4")
            el-tree(ref="$foldersTree" highlight-current node-key="id"
                :expand-on-click-node="false" :props="bookmarkTreeProps" :default-expanded-keys="config.openedBarFolders" :data="barFolderTree"
                @current-change="handleFolderChange")
              span(slot-scope="{ node, data }")
                font-awesome-icon(v-show="$refs.$foldersTree.getCurrentKey() == data.id" icon="folder-open" class="fa-fw")
                font-awesome-icon(v-show="$refs.$foldersTree.getCurrentKey() != data.id" icon="folder" class="fa-fw")
                span &nbsp;{{node.label}}
          el-col(:xs="18" :sm="18" :md="18" :lg="20" :xl="20")
            el-table(:show-header="false" highlight-current-row :data="tableData")
              el-table-column(prop="title" label="标题")
                template(slot-scope="scope")
                  font-awesome-icon(v-if="!scope.row.url" icon="folder" class="fa-fw bookmark-icon")
                  span(v-else class="bookmark-icon" :style="favicon(scope.row.url)")
                  span {{scope.row.title}}
          
      el-tab-pane(name="tags")
        div(slot="label" title="标签")
          font-awesome-icon(icon="tags" class="fa-fw")
        div(class="tab-body")
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
        div(slot="label" title="暂存")
          font-awesome-icon(icon="archive" class="fa-fw")
        div(class="tab-body")
      
      el-tab-pane(name="history")
        div(slot="label" title="历史")
          font-awesome-icon(icon="history")
        div(class="tab-body")
</template>
<script>
import _ from "lodash";
// const __ = chrome.i18n.getMessage

export default {
  data: () => {
    return {
      config: {
        activeTabName: "folders",
        openedBarFolders: [],
      },
      bookmarkTreeProps: {
        label: "title",
        children: "children"
      },
      filterText: "",
      barBookmarkTree: null,
      barFolderTree: null,
      etcBookmarks: null,
      history: null,
      tableData: null,
    };
  },
  computed: {},
  // methods: {
  //   tab() {
  //     chrome.tabs.create({ url: "pages/app.html" });
  //   }
  // },

  watch: {
    filterText(val) {
      this.$refs.bookmarkTree.filter(val);
    }
  },
  // created() {
  //   console.log(__("popup"));
  // },
  mounted() {
    window.vm = this;
    chrome.bookmarks.getTree(tree => {
      this.loadBookmarks(tree[0]);
    });
    chrome.history.search({ text: "" }, list => {
      this.history = list;
    });
  },

  methods: {
    loadBookmarks(rootNode) {
      // 书签栏
      this.barBookmarkTree = rootNode.children;
      this.barFolderTree = this.recursivelyConvertToFolders(
        this.barBookmarkTree
      );
      // 其它书签
      this.etcBookmarks = rootNode.children[1].children;
    },
    recursivelyConvertToFolders(bookmarkTree) {
      let newList = [];
      bookmarkTree.forEach((bookmark, index, arr) => {
        if (!bookmark.url) {
          // folder
          let folder = _.extend({}, bookmark);
          folder.children = this.recursivelyConvertToFolders(bookmark.children);
          newList.push(folder);
        }
      });
      return newList;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.title.indexOf(value) !== -1;
    },
    // commons
    favicon(url) {
      return `background-image: -webkit-image-set(url(\"chrome://favicon/size/16@1x/${url}\") 1x, url(\"chrome://favicon/size/16@2x/${url}\") 2x);`
    },

    // events
    handleOpenTab(data, node, el) {
      if (node.isLeaf) alert("node opening");
    },
    handleClick() {},
    handleFolderChange(data, node) {
      chrome.bookmarks.getChildren(data.id, (children) => {
        this.tableData = children
      })
    },
  }
};
</script>
<style lang="scss">
body {
  margin: 0;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  font-size: 0.9rem;
}

/* scrollbar */
div::-webkit-scrollbar{/*滚动条整体样式*/
    width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
}
div::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 5px;
    box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.2);
}
div::-webkit-scrollbar-track {/*滚动条里面轨道*/
    border-radius: 0;
    box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.1);
}

/* tabs table tree */
.tab-container {
  width: 48rem;
  height: 34rem;
}
.el-tabs__header,
.el-tabs__content {
  margin: 0 !important;
  padding: 0 !important;
}

.el-tabs__content,
.el-tree,
.el-table {
  height: fill-available;
}

.el-tree,
.el-table {
  overflow-y: auto;
}

.el-tabs__content {
  user-select: none;
}

.el-table::before {
  height: 0;
}

.el-table td, .el-table th {
  padding: 3px 0;
}

/* others */
.bookmark-icon {
  height: 1rem;
  width: 1.25rem;
  float: left;
  line-height: 1rem;
  margin: 0.2rem;
  padding: 0;
  background-position: center;
  background-repeat: no-repeat;
}


</style>
