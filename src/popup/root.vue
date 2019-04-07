<template lang="pug">
  el-container
    el-header() this is header
    el-container
      el-aside
        el-row(class="bar")
          el-input(placeholder="输入关键字进行过滤" v-model="filterText")
          el-button(type="text" icon="el-icon-star-on")
          el-button(type="text" icon="el-icon-time")
          el-button(type="text" icon="el-icon-search")
          el-button(type="text" icon="el-icon-sort")
            font-awesome-icon(icon="tags" @click="handleClick" size="lg")
        el-row(class="tree")
          el-tree(class="bookmark-tree" highlight-current ref="bookmarkTree"
            :data="bookmarks" :props="treeProps" :filter-node-method="filterNode"
              @node-click="handleOpenTab")
            span(slot-scope="{ node, data }")
              el-tooltip(v-if="node.isLeaf" class="bookmark-tooltip" effect="dark" :enterable="false"
                :content="data.url")
                span() {{node.label}}
              span(v-else) {{node.label}}
      el-main this is main
</template>
<script>
// const __ = chrome.i18n.getMessage

export default {
  data: () => {
    return {
      bookmarks: null,
      treeProps: {
        label: "title",
        children: "children"
      },
      history: null,
      filterText: ""
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
    chrome.bookmarks.getTree(tree => {
      this.bookmarks = tree[0].children;
    });
    chrome.history.search({ text: "" }, list => {
      this.history = list;
    });
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.title.indexOf(value) !== -1;
    },
    handleOpenTab(data, node, el) {
      if (node.isLeaf) alert("node opening");
    },
    handleClick() {
      alert(arguments)
    },
  }
};
</script>
<style lang="scss">
body {
  /* margin: 0; */
  width: 47rem;
}

.bar {
  height: 5rem;
}

.tree {
  height: 25rem;
  overflow-y: scroll;
}

/*.el-tooltip__popper {
  max-width: 80%;
}*/
</style>
