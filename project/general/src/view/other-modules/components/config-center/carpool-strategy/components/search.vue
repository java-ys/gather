<template>
  <Form inline="inline" :label-width="72">
    <FormItem label="城市：">
      <Cascader
        v-model="provinceCityCode"
        :data="cityList"
        placeholder="请选择城市"
        trigger="hover"
        filterable
        style="width: 280px; display: inline-block"
        @on-change="handleCityChange"
      ></Cascader>
    </FormItem>
    <FormItem label="状态：">
      <Select
        v-model="status"
        style="width: 200px"
        placeholder="请选择状态"
        clearable
      >
        <Option
          v-for="item in statusList"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </Option>
      </Select>
    </FormItem>
    <!-- 车型等级 -->
    <FormItem label="拼车场景：" :label-width="100">
      <Select
        v-model="scene"
        style="width: 160px"
        placeholder="请选择拼车场景"
        clearable
      >
        <Option
          v-for="item in carpoolScenes"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </Option>
      </Select>
    </FormItem>

    <FormItem :label-width="0">
      <Button
        type="primary"
        style="margin-right: 20px; margin-left: 40px"
        @click="search"
      >
        搜索
      </Button>
      <Button @click="clear"> 清空 </Button>
    </FormItem>
  </Form>
</template>
<script>
import { statusList, carpoolScenes } from "../fields.js";
export default {
  name: "carpool-search",
  props: {
    cityList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      provinceCityCode: [],
      cityCode: "",
      status: null,
      scene: null,
      statusList,
      carpoolScenes
    };
  },
  methods: {
    // 城市变更
    handleCityChange(val) {
      this.cityCode = val[1] || "";
    },
    /**
     * 搜索
     */
    search() {
      let params = {
        cityCode: this.cityCode, // 城市code
        status: this.status, // 状态
        scene: this.scene // 拼车场景
      };
      this.$emit("searchCarpool", params);
    },
    /**
     * 清空
     */
    clear() {
      this.provinceCityCode = [];
      this.cityCode = "";
      this.status = null;
      this.scene = null;
      this.$emit("resetCarpool", {});
    },
  },
};
</script>
<style lang="less" scoped></style>
