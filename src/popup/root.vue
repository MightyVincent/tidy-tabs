<template lang="pug">
el-container()
  el-header()
    el-input(placeholder="输入关键字进行过滤" v-model="filterText")
  el-container
    el-aside
      el-tabs(v-model="activeName" @tab-click="handleClick")

        el-tab-pane(label="书签栏" name="folders")
          el-tree(ref="foldersTree" highlight-current node-key="id"
              @current-change="handleFolderChange"
              :expand-on-click-node="false" :props="treeProps" :default-expanded-keys="barOpenedFolders" :data="barFolderTree")
            span(slot-scope="{ node, data }")
              font-awesome-icon(v-if="$refs.foldersTree.getCurrentKey() == data.id" icon="folder-open" size="lg" class="blue")
              font-awesome-icon(v-else icon="folder" size="lg")
              span &nbsp;{{node.label}}
            
        el-tab-pane(label="暂存" name="staged") 暂存

        el-tab-pane(name="tags")
          span(slot="label")
            font-awesome-icon(icon="tags" class="blue")
            // span &nbsp;标签
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
        
        el-tab-pane(label="历史" name="history") 历史
      // el-row(class="bar")
        el-button(type="text" icon="el-icon-star-on")
        el-button(type="text" icon="el-icon-time")
        el-button(type="text" icon="el-icon-search")
      // el-row(class="panel")
    el-main
      el-table(highlight-current-row :data="tableData")
        el-table-column(
          prop="title"
          label="标题"
          width="180")
        el-table-column(
          prop="url"
          label="URL")
</template>
<script>
import _ from "lodash";
// const __ = chrome.i18n.getMessage

export default {
  data: () => {
    return {
      height: '',
      activeName: "folders",
      treeProps: {
        label: "title",
        children: "children"
      },
      filterText: "",
      barBookmarkTree: null,
      barFolderTree: null,
      barOpenedFolders: [],
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
    document.vm = this;
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
      this.barBookmarkTree = rootNode.children[0].children;
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
    handleOpenTab(data, node, el) {
      if (node.isLeaf) alert("node opening");
    },
    handleClick() {},
    handleFolderChange(data, node) {
      chrome.bookmarks.getChildren(data.id, (children) => {
        this.tableData = children
      })
    }
  }
};
</script>
<style lang="scss">
body {
  width: 47rem;
  height: 36rem;
}

.bar {
  height: 3rem;
}

.tree {
  height: 33rem;
  overflow-y: scroll;
}

.el-tooltip__popper {
  max-width: 60%;
}

.blue {
  color: #4285F4;
}
</style>
