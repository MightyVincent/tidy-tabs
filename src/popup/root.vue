<template lang="pug">
    el-container
      - //el-button(type="primary" @click="tab") {{ __('popup') }}
      el-header
        el-button(type="text" icon="el-icon-star-on")
        el-button(type="text" icon="el-icon-time")
        el-button(type="text" icon="el-icon-search")
        el-button(type="text" icon="el-icon-sort")
        // el-menu(default-active="1" class="el-menu-vertical-demo" mode="horizontal" @open="handleOpen" @close="handleClose" collapse)
        //   el-submenu(index="1")
        //     template(slot="title")
        //       i(class="el-icon-location")
        //       span(slot="title") 导航一
      el-main
        el-input(placeholder="输入关键字进行过滤" v-model="filterText")
        el-tree(class="bookmark-tree" highlight-current ref="bookmarkTree"
          :data="bookmarks" :props="treeProps" :filter-node-method="filterNode"
            @node-click="handleOpenTab")
          span(slot-scope="{ node, data }")
            el-tooltip(class="bookmark-tooltip" effect="dark" placement="top-start" enterable="false"
              v-if="node.isLeaf" :content="data.url")
              span() {{node.label}}
            span(v-else) {{node.label}}
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
    }
  }
};
</script>
<style lang="scss">
body {
  margin: 0;
  width: 36rem;
  height: 36rem;
}
</style>
