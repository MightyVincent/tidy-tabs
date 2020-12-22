<template>
  <div>{{ _msg_('options') }}</div>
</template>
<script lang="ts">
const _msg_ = chrome.i18n.getMessage

export default {
  data: () => ({}),
  computed: {},
  created() {
    console.log(_msg_('options'))
  },
  mounted() {
  },
  methods: {},
}
</script>
<style>
div {
  color: blue;
}
</style>
