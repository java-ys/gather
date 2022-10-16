<!--
 * @Author: Evil Cheng
 * @Date: 2021-11-04 13:52:59
 * @LastEditTime: 2021-11-11 15:57:46
 * @Description: 复制功能
-->
<template>
  <Form ref="basicForm" :model="formData" :label-width="120" :rules="ruleValidate">
    <Form-item label="规则名称：" prop="ruleName">
      <Input v-model="formData.ruleName" :disabled="disabled" type="text"></Input>
    </Form-item>
    <Form-item label="适用城市：" prop="provinceCityCode">
      <Cascader
        v-model="formData.provinceCityCode"
        :data="provinceCityList"
        trigger="hover"
        :disabled="disabled"
        @on-change="handleCityChange"
      ></Cascader>
    </Form-item>
    <FormItem
      label="区县："
      prop="areaCodeList"
    >
      <Select
        v-model="formData.areaCodeList"
        style="width: 200px"
        placeholder="请选择区县"
        :max-tag-count="1"
        :disabled="disabled"
        multiple
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
        v-model="formData.expandBizLine"
        placeholder="请选择"
        clearable
        :disabled="disabled"
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
        v-model="formData.productLine"
        placeholder="请选择"
        clearable
        :disabled="disabled"
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
    <FormItem
      label="车型等级："
      prop="carLevels"
    >
      <Select
        v-model="formData.carLevels"
        :max-tag-count="1"
        multiple
        :disabled="disabled"
        placeholder="请选择车型等级"
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
    <FormItem
      label="优先级策略："
      prop="ruleTypeList"
    >
      <Checkbox-group
        v-model="formData.ruleTypeList"
        @on-change="handleChangePriority"
      >
        <Checkbox v-for="item in priorityList" :key="item.value" :label="item.value">{{item.label}}</Checkbox>
      </Checkbox-group>
    </FormItem>
  </Form>
</template>

<script>
import { getWholeRegion } from "_g/api/common.js";
import { cpTranslate } from "@/libs/tools";
import {
  getAreaInfoByCityCode
} from "_o/api/configData.js";
import { mapState } from "vuex"
import {
  getCityObjByCityCode,
  getProvinceNameByCityUuid
} from "../fields.js";
const PRIORITY_LIST = [
  {
    label: "订单价值优先级",
    value: 11
  },
  {
    label: "订单来源优先级",
    value: 33
  },
  {
    label: "用户群相对优先派单",
    value: 35
  }
] // 订单优先级
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    infoData: {
      type: Object
    }
  },
  data() {
    return {
      provinceCityList: [], // 城市
      areaList: [], // 区县
      productLines: [], // 产品线下拉
      carLevelList: [], // 车型等级下拉
      formData: {
        ruleName: "",
        provinceCityCode: [],
        areaCodeList: [],
        expandBizLine: "",
        productLine: "",
        carLevels: [],
        ruleTypeList: []
      },
      priorityList: PRIORITY_LIST,
      ruleValidate: {
        ruleName: [
          {
            required: true,
            message: "规则名称不能为空"
          }
        ],
        // 城市
        provinceCityCode: [
          {
            required: true,
            message: "城市不能为空"
          }
        ],
        // areaCodeList: [
        //   {
        //     required: true,
        //     message: "区县不能为空"
        //   }
        // ],
        areaCode: [
          {
            required: true,
            message: "区县不能为空"
          }
        ],
        expandBizLine: [
          {
            required: true,
            message: "业务线不能为空"
          }
        ],
        productLine: [
          {
            required: true,
            message: "产品线不能为空"
          }
        ],
        carLevels: [
          {
            required: true,
            message: "车型等级不能为空"
          }
        ],
        ruleTypeList: [
          {
            required: true,
            message: "订单优先级策略不能为空"
          }
        ],
      }
    }
  },
  computed: {
    ...mapState({
      businessGradeList: (state) => state.common.businessGradeList,
      bizTypeList: (state) => state.common.bizTypeList
    })
  },
  watch: {
    infoData: {
      handler: function(obj) {
        // 用详情更新表单数据
        const { provinceCityCode, expandBizLine, productLine } = this.infoData
        this.$nextTick(async () => {
          await this.getAreaByCityCode(provinceCityCode[1] || "")
          const business = this.businessGradeList.find(v => v.value === expandBizLine)
          this.productLines = business ? business.children || [] : [] // 赋值产品线
          const product = this.productLines.find(v => v.bizType === productLine)
          this.carLevelList = product ? product.levels || [] : [] // 赋值车型等级
          this.formData = Object.assign(this.formData, obj)
        })

      },
      deep: true
    }
  },
  mounted() {

    this.getCityList()
  },
  methods: {
    // 获取城市数据
    async getCityList() {
      const res = await getWholeRegion({})

      if (res.data.success) {
        let list = cpTranslate(res.data.data, "", "", "citys");
        this.provinceCityList = list;
      }
    },
    // 城市变更
    handleCityChange(val) {
      const cityCode = val[1]
      this.getAreaByCityCode(cityCode)
    },
    // 获取区县
    async getAreaByCityCode(val) {
      if (!val) {
        return false
      }
      const res = await getAreaInfoByCityCode({ cityCode: val })
      if (res.data.success) {
        // 清空已选值
        this.formData.areaCodeList = []
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
        this.formData.productLine = ""
        this.formData.carLevels = []
        this.carLevelList = []
        this.productLines = business ? business.children || [] : [] // 赋值车型等级
      })
    },
    // 产品线下拉
    changeProduct(val) {
      const product = this.productLines.find(v => v.bizType === val)
      this.$nextTick(() => {
        this.formData.carLevels = []; // 清空下级
        this.carLevelList = product ? product.levels || [] : [] // 赋值车型等级
      })

    },
    // 为了兼容以前逻辑，这边优先级变化，下级其他元素有变化
    handleChangePriority(val) {
      this.$emit("update", val)
    },
    getFormData() {
      return new Promise((resolve, reject) => {
        this.$refs.basicForm.validate((valide) => {
          if (valide) {
            const [provinceCode, cityCode] = this.formData.provinceCityCode
            const { ruleName, areaCodeList, expandBizLine, productLine, carLevels, ruleTypeList } = this.formData
            const cityObj = getCityObjByCityCode(provinceCode, cityCode, this.provinceCityList)
            const cityName = cityObj.city;
            const cityUuid = cityObj.uuid;
            const provinceName = getProvinceNameByCityUuid(
              cityCode,
              this.provinceCityList
            );
            const params = {
              ruleName,
              provinceCode,
              provinceName,
              cityCode,
              cityName,
              cityUuid,
              areaCodeList,
              expandBizLine,
              productLine,
              carLevels,
              ruleTypeList
            }
            console.log(params, "params")
            resolve(params)
          } else {
            resolve(null)
          }
        })
      })
    }
  },
}
</script>

<style scoped>
.ivu-form-item{
  width: 320px;
}
</style>