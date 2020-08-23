<template>
  <div>{{ __('options') }}</div>
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
