<template>
  <div id="main-app">
    <router-view />
    <!--<Main></Main>-->
  </div>
</template>

<script>

export default {
  name: "App",
  created() {
    // 启动时加载产品线
    if (!this.$store.state.common.bizTypeMap.length) {
      // 启动时加载产品线
      this.$store.dispatch("getBizTypeMap")
    }
  }
}
</script>

<style lang="less">
.size {
  width: 100%;
  height: 100%;
}

html, body {
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

#main-app {
  .size;
}
</style>
