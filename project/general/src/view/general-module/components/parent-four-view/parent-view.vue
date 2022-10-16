<template>
    <router-view ref="child"/>
</template>
<script>
export default {
  name: 'ParentFourView',
  computed: {
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    notCacheName () {
      return [(this.$route.meta && this.$route.meta.notCache) ? this.$route.name : '']
    },
    cacheList () {
      return ['ParentFourView', ...this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []]
    }
  }
}
</script>
