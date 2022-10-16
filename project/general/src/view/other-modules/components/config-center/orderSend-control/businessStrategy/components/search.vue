
<template>
  <Form
    inline="inline"
    :label-width="72"
  >
    <FormItem
      label="适用城市："
      prop="city"
    >
      <Cascader
        v-model="provinceCityCode"
        :data="cityList"
        placeholder="请选择城市"
        trigger="hover"
        filterable
        style="width: 200px; display: inline-block"
        @on-change="handleCityChange"
      ></Cascader>
    </FormItem>
    <FormItem
      label="区县："
      prop="areaCode"
    >
      <Select
        v-model="areaCode"
        style="width: 200px"
        placeholder="请选择区县"
        clearable
      >
        <Option
          v-for="item in areaList"
          :key="item.value"
          :value="item.value"
        >
          {{item.label}}
        </Option>
      </Select>
    </FormItem>
    <FormItem
      label="状态："
      prop="expandBizLine"
    >
      <Select
        v-model="ruleStatus"
        style="width: 200px"
        placeholder="请选择状态"
        clearable
      >
        <Option
          v-for="item in statusDataList"
          :key="item.value"
          :value="item.value"
        >
          {{item.label}}
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
      <Button @click="clear">
        清空
      </Button>
    </FormItem>
  </Form>
</template>

<script>
import {
  getAreaInfoByCityCode
} from "_o/api/configData.js";

import { statusDataList } from "../fields.js"
export default {
  props: {
    cityList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      ruleStatus: null,
      statusDataList, // 状态数组
      provinceCityCode: [],
      areaCode: "",
      areaList: [], // 区县
    }
  },
  computed: {
  },
  methods: {
    // 城市变更
    handleCityChange(val) {
      if (val.length === 0) {
        this.areaCode = "";
        this.areaList = [];
        return;
      }
      const areaCode = val[1];
      this.getAreaByCityCode(areaCode)
    },
    // 获取区县
    async getAreaByCityCode(val) {
      const res = await getAreaInfoByCityCode({ cityCode: val })
      if (res.data.success) {
        // 清空已选值
        this.areaCode = ""
        const list = res.data.data.map(it => {
          return {
            label: it.orgName,
            value: it.orgCode
          };
        })
        this.$nextTick(() => {
          this.areaList = list
        })
      }
    },
    search() {
      const [provinceCode, cityCode] = this.provinceCityCode
      const params = {
        provinceCode,
        cityCode,
        areaCode: this.areaCode,
        ruleStatus: this.ruleStatus,
      }
      this.$emit("search", params)
    },
    clear() {
      this.provinceCityCode = []
      this.areaCode = ""
      this.areaList = [] // 区县
      this.ruleStatus = null;
      this.$emit("reset", {})
    }
  },
}
</script>
