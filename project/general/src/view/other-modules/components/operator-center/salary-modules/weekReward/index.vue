<template>
  <div class="app-container">


    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="A模式" name="modeA">
        <modeA v-if="AVisible" />
      </el-tab-pane>
      <el-tab-pane label="UP模式" name="modeUP">
        <modeUP v-if="UPVisible" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import modeA from "./modeA/index";
import modeUP from "./modeUP/index";
export default {
  name: "weekReward",
  components: {
    modeA,
    modeUP
  },
  data() {
    return {
      activeName: "modeA",
      AVisible: true,
      UPVisible: false
    };
  },
  methods: {
    handleClick(tab, event) {
      switch (tab.name) {
        case "modeA":
          this.AVisible = true;
          this.UPVisible = false;
          break;
        case "modeUP":
          this.UPVisible = true;
          this.AVisible = false;
          break;
      }
    }
  }
};
</script>

<style>
</style>
