<!--
 * @Author: Evil Cheng
 * @Date: 2021-11-04 19:38:03
 * @LastEditTime: 2021-11-04 20:05:16
 * @Description:
-->
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
      label="业务线："
      prop="expandBizLine"
    >
      <Select
        v-model="expandBizLine"
        style="width: 200px"
        placeholder="请选择业务线"
        clearable
        @on-change="changeBusiness"
      >
        <Option
          v-for="item in businessGradeList"
          :key="item.value"
          :value="item.value"
        >
          {{item.label}}
        </Option>
      </Select>
    </FormItem>
    <FormItem
      label="产品线："
      prop="productLine"
    >
      <Select
        v-model="productLine"
        style="width: 200px"
        placeholder="请选择产品线"
        clearable
        @on-change="changeProduct"
      >
        <Option
          v-for="item in productLines"
          :key="item.bizType"
          :value="item.bizType"
        >
          {{item.bizTypeName}}
        </Option>
      </Select>
    </FormItem>
    <!-- 车型等级 -->
    <FormItem
      label="车型等级："
      :label-width="100"
    >
      <Select
        v-model="carLevel"
        style="width:160px"
        placeholder="请选择车型等级"
        clearable
      >
        <Option
          v-for="item in carLevelList"
          :key="item.vehicleLevel"
          :value="item.vehicleLevel"
        >
          {{item.vehicleName}}
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
import { mapState } from "vuex";
export default {
  props: {
    cityList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      provinceCityCode: [],
      areaCode: "",
      expandBizLine: "", // 业务线
      productLine: "", // 产品线
      carLevel: "", // 车型
      areaList: [], // 区县
      productLines: [], // 产品线
      carLevelList: [] // 车型
    }
  },
  computed: {
    ...mapState({
      businessGradeList: (state) => state.common.businessGradeList,
      bizTypeList: state => state.common.bizTypeList,
    }),
  },
  methods: {
    // 城市变更
    handleCityChange(val) {
      const areaCode = val[1]
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
    // 业务线下拉
    changeBusiness(val) {
      const business = this.businessGradeList.find(v => v.value === val)
      this.$nextTick(() => {
        // 清空下级
        this.productLine = "" // 产品线
        this.carLevel = "" // 车型
        this.carLevelList = []
        this.productLines = business ? business.children || [] : [] // 赋值车型等级
      })
    },
    // 产品线下拉
    changeProduct(val) {
      const product = this.bizTypeList.find(v => v.bizType === val)
      this.$nextTick(() => {
        this.carLevel = "" // 清空下级
        this.carLevelList = product ? product.levels || [] : [] // 赋值车型等级
      })
    },
    search() {
      const [provinceCode, cityCode] = this.provinceCityCode
      const params = {
        provinceCode,
        cityCode,
        areaCode: this.areaCode,
        expandBizLine: this.expandBizLine, // 业务线
        productLine: this.productLine || null, // 产品线
        carLevel: this.carLevel // 车型
      }
      this.$emit("search", params)
    },
    clear() {
      this.provinceCityCode = []
      this.areaCode = ""
      this.expandBizLine = "" // 业务线
      this.productLine = "" // 产品线
      this.carLevel = "" // 车型
      this.areaList = [] // 区县
      this.productLines = [] // 产品线
      this.carLevelList = [] // 车型
      this.$emit("reset", {})
    }
  },
}
</script>
