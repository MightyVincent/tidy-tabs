<template>
  <div>{{ __('devtools') }}</div>
</template>
<script>
const __ = chrome.i18n.getMessage

export default {
  data: () => ({}),
  computed: {},
  created() {
    console.log(__('devtools'))
  },
  mounted() {},
  methods: {},
}
</script>
<style lang="scss">
div {
  color: blue;
}
</style>
