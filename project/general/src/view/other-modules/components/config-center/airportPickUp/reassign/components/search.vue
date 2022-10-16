<!--
 * @Author: Evil Cheng
 * @Date: 2021-11-08 11:26:00
 * @LastEditTime: 2021-11-15 11:18:47
 * @Description:
-->
<template>
  <div class="search-box flex">
    <div class="search-item-list flex">
      <div class="search-item flex">
        <div class="search-item-label">城市：</div>
        <Cascader
          v-model="provinceCityCode"
          clearable
          :data="cityList"
          placeholder="请选择城市"
          trigger="hover"
          filterable
          style="width: 200px; display: inline-block"
        ></Cascader>
      </div>
      <div class="search-item flex">
        <div class="search-item-label">渠道：</div>
        <Select
          v-model="searchData.source"
          clearable
          filterable
          style="width: 200px"
          placeholder="请选择渠道"
        >
          <Option
            v-for="(item,index) in channelList"
            :key="index"
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
          clearable
          placeholder="请选择业务线"
        >
          <Option
            v-for="item in businessList"
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
          clearable
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
    </div>
    <div class="search-button">
      <Button type="primary" @click="handleSearch">查询</Button>
      <Button @click="handleReset">重置</Button>
    </div>
  </div>
</template>
<script>
import { ORDER_STATUS } from "../../nums"
import { mapState } from "vuex"
export default {
  props: {
    cityList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      statusList: ORDER_STATUS,
      provinceCityCode: [], // 城市
      searchData: {
        cityCode: "",
        expandBizLine: "",
        status: "",
        source: ""
      }
    };
  },
  computed: {
    ...mapState({
      channelList: state => state.common.channel,
      businessGradeList: state => state.common.businessGradeList
    }),
    businessList() {
      // 业务线： 过滤接送机业务线
      const list = this.businessGradeList.filter(v => v.expandBizLine === 8 || v.expandBizLine === 9)
      return list
    }
  },
  methods: {
    handleSearch() {
      const [provinceCode, cityCode] = this.provinceCityCode
      this.$emit("search", {
        ...this.searchData,
        provinceCode,
        cityCode
      })
    },
    handleReset() {
      this.searchData = {
        cityCode: "",
        expandBizLine: "",
        status: "",
        source: ""
      };
      this.$emit("search", this.searchData)
    }
  }
};
</script>

<style lang="less" scoped>
.search-box {
  height: 32px;
  margin-bottom: 16px;
  justify-content: space-between;
}
.flex {
  display: flex;
  align-items: center;
}
.search-item {
  margin-right: 8px;
}
</style>
