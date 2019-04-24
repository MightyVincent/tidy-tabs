<template lang="pug">
    div {{ __('options') }}
</template>
<script lang="js">
const __ = chrome.i18n.getMessage

export default {
  data: () => ({
  }),
  computed: { },
  created () {
    console.log(__('options'))
  },
  mounted () { },
  methods: { }
}
</script>
<style>
div {
  color: blue;
}
</style>
