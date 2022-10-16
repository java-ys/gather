<!--
 * @Author: Evil Cheng
 * @Date: 2021-11-02 16:42:18
 * @LastEditTime: 2021-12-10 10:40:47
 * @Description:
-->
<template>
  <div class="search-box flex">
    <div class="search-item flex">
      <div class="search-item-label">城市：</div>
      <Cascader
        v-model="searchData.cityData"
        :data="cityList"
        placeholder="请选择城市"
        trigger="hover"
        filterable
        style="width: 200px; display: inline-block"
        @on-change="handleCityChange"
      ></Cascader>
    </div>
    <div class="search-item flex">
      <div class="search-item-label">区县：</div>
      <Select
        v-model="searchData.areaCode"
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
    </div>
    <div class="search-item flex">
      <div class="search-item-label">业务线：</div>
      <Select
        v-model="searchData.expandBizLine"
        style="width: 200px"
        placeholder="请选择业务线"
      >
        <Option
          v-for="item in businessGradeList"
          :key="item.value"
          :value="item.value"
        >
          {{item.label}}
        </Option>
      </Select>
    </div>
    <div class="search-item flex">
      <div class="search-item-label">车型等级：</div>
      <Cascader
        v-model="searchData.cascader"
        :data="partProductLine"
        placeholder="请选择车型等级"
        trigger="hover"
        filterable
        style="width: 200px; display: inline-block"
      ></Cascader>
    </div>
    <div class="search-item flex">
      <div class="search-item-label">范围类型：</div>
      <Select
        v-model="searchData.scopeType"
        style="width: 200px"
        placeholder="请选择范围类型"
      >
        <Option
          v-for="item in scopeTypeList"
          :key="item.value"
          :value="item.value"
        >
          {{item.label}}
        </Option>
      </Select>
    </div>
    <div class="search-item flex">
      <div class="search-item-label">状态：</div>
      <Select
        v-model="searchData.status"
        style="width: 200px"
        placeholder="请选择状态"
      >
        <Option
          v-for="item in statusList"
          :key="item.value"
          :value="item.value"
        >
          {{item.label}}
        </Option>
      </Select>
    </div>
    <div class="search-item flex">
      <Button
        type="primary"
        style="margin-right: 20px;"
        @click="search"
      >
        搜索
      </Button>
      <Button @click="clear">
        清空
      </Button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex"
import {
  getAreaInfoByCityCode
} from "_o/api/configData.js"
import { statusList } from "./fields"
export default {
  props: {
    cityList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      searchData: {
        cityData: [],
        provinceCode: "",
        cityCode: "",
        areaCode: "",
        cascader: [],
        businessType: "",
        carLevel: "",
        scopeType: "",
        expandBizLine: ""
      },
      cityLists: this.cityList,
      areaList: [],
      partProductLine: [], // 车型等级级联菜单
      scopeTypeList: [
        {
          label: "基础类",
          value: 1
        },
        {
          label: "范围类",
          value: 2
        }
      ],
      statusList
    }
  },
  computed: {
    ...mapState({
      bizTypeList: (state) => state.common.bizTypeList,
      businessGradeList: (state) => state.common.businessGradeList,
    }),
    ...mapGetters({
      businessGradeName: "getBusinessGradeName"
    }),
  },
  mounted() {
    // 重新梳理产品线
    this.partProductLine = this.bizTypeList.map(v => {
      v.children = v.children.map(vv => {
        return {
          ...vv,
          label: vv.vehicleName,
          value: vv.vehicleLevel,
          children: []
        }
      })
      return v
    })
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
        this.searchData.areaCode = ""
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
      const [businessType, carLevel] = this.searchData.cascader
      const [provinceCode, cityCode] = this.searchData.cityData
      this.$emit("search", {
        provinceCode,
        cityCode,
        areaCode: this.searchData.areaCode,
        businessType,
        carLevel,
        scopeType: this.searchData.scopeType,
        expandBizLine: this.searchData.expandBizLine,
        status: this.searchData.status
      })
    },
    clear() {
      this.searchData = {
        cityData: [],
        cityCode: "",
        areaCode: "",
        cascader: [],
        businessType: "",
        carLevel: "",
        scopeType: "",
        expandBizLine:""
      }
      this.$emit("reset")
    },
  },
}
</script>

<style scoped>
.flex{
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.search-box{
  margin-bottom: 16px;
}
.search-item{
  min-width:300px;
  margin-right: 16px;
  margin-bottom: 12px;
}

</style>