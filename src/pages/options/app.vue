<template>
  <div>{{ _MSG_('options') }}</div>
</template>
<script lang="ts">
export default {
  data: () => ({}),
  computed: {},
  created() {
    console.log(_MSG_('options'))
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
