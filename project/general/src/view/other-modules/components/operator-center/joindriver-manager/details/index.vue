<template>
  <div>
    <baseInfo :changeCarOrderUuid="changeCarOrderUuid"></baseInfo>
  </div>
</template>

<script>
import baseInfo from "../components/info";
export default {
  components: {
    baseInfo
  },
  data() {
    return {
      changeCarOrderUuid: ""
    };
  },
  mounted() {
    this.changeCarOrderUuid = this.$route.query.changeCarOrderUuid
  },
  methods: {
  }
};
</script>
<style lang="less" scoped>
.change-car-base{
  padding:16px ;
}
.title {
  font-weight: 700;
}
.ivu-col {
  padding: 3px;
}
</style>
