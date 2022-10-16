<!--
 * @Author: Evil Cheng
 * @Date: 2021-11-08 11:26:00
 * @LastEditTime: 2021-11-22 10:35:54
 * @Description:
-->
<template>
  <div class="search-box flex">
    <div class="search-item-list flex">
      <div class="search-item flex">
        <div class="search-item-label">业务线：</div>
        <Select
          v-model="searchData.expandBizLine"
          style="width: 200px"
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
          clearable
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
        <div class="search-item-label">订单类型：</div>
        <Select
          v-model="searchData.typeTime"
          style="width: 200px"
          clearable
          placeholder="请选择订单类型"
        >
          <Option
            v-for="item in typeList"
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
import { mapState } from "vuex";
import { ORDER_TYPES, PRICING_ORDER_STATUS } from "../../nums";
export default {
  props: {
    cityList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      statusList: PRICING_ORDER_STATUS,
      typeList: ORDER_TYPES,
      searchData: {
        status: "",
        typeTime: "",
        expandBizLine: ""
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
      const list = this.businessGradeList.filter(v => v.expandBizLine === 8 || v.expandBizLine === 9);
      // 默认第一个
      this.searchData.expandBizLine = list[0] ? list[0].value : ""
      return list;
    }
  },
  methods: {
    handleSearch() {
      this.$emit("search", this.searchData);
    },
    handleReset() {
      this.searchData = {
        status: "",
        typeTime: "",
        expandBizLine: this.businessList[0] ? this.businessList[0].value : ""
      };
      this.$emit("search", this.searchData);
    },
    getSearchData() {
      return this.searchData
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
