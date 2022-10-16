<template>
  <Modal v-model="show" width="80%" title="选择奖励" footer-hide>
    <select-reward
      v-if="show"
      :limitType="limitType"
      :selected="rewardSelected"
      grantEventId="30000010"
      @close="selectDown"
    ></select-reward>
  </Modal>
</template>

<script>
import SelectReward from "./selectReward/index";
export default {
  components: { SelectReward },
  data() {
    return {
      show: false,
      limitType: [],
      rewardSelected: {},
    };
  },
  methods: {
    init() {
      this.show = true;
    },
    selectDown(row) {
      this.$emit("select", row);
      this.show = false;
    },
  },
};
</script>

<style scoped lang="less">
</style>