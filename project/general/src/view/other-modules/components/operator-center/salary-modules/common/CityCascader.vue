<template>
  <el-form-item :label="label" :required="required" :label-width="labelWidth">
    <el-cascader
      v-model="state.selectCity"
      :style="'width:' + selectWidth"
      class="city-cascader"
      popper-class="city-cascader-pop"
      placeholder="城市"
      :options="state.filterCities"
      :props="cascaderProps"
      size="medium"
      :clearable="true"
      :before-filter="beforeFilter"
      :filterable="state.filterable"
      collapse-tags
      :show-all-levels="true"
      @visible-change="visibleChange"
      @change="change"
    ></el-cascader>
  </el-form-item>
</template>
<script>
import { reactive, ref, nextTick, watch } from "@vue/composition-api";
import { Message } from "element-ui";
import { queryCitiesWithAgent, getAreaInfoByCode } from "_o/api/salary/common";
export default {
  name: "CityCascader",
  props: {
    required: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ""
    },
    multiple: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: "城市"
    },
    hasAllOption: {
      type: Boolean,
      default: false
    },
    labelWidth: {
      type: String,
      default: ""
    },
    selectWidth: {
      type: String,
      default: "200px"
    }
  },
  setup: (props, ctx) => {
    const visible = ref(false);
    let lastSelectCity = [];
    const cascaderProps = {
      multiple: props.multiple,
      // checkStrictly: true,
      label: "orgName",
      value: "orgCode",
      lazy: true,
      lazyLoad(node, resolve) {
        if (!node.value || !node.hasChildren || node.value === "-1" || node.children.length > 0) {
          resolve([]);
          return;
        }
        getAreaInfoByCode({ cityCode: node.value }).then(res => {
          if (res.data.success && res.data.data && res.data.data.length !== 0) {
            res.data.data.forEach(item => (item.leaf = "leaf"));
            // 通过调用resolve将子节点数据返回，通知组件数据加载完成
            resolve(res.data.data);
            setCitiesChildren(node.value, res.data.data);
          } else {
            resolve([]);
            Message.error("暂无城市下区县信息，请先联系相关运营人员进行开通城市操作");
          }
        });
      }
    };
    const setCitiesChildren = (orgCode, children) => {
      state.cities.find(item => orgCode === item.orgCode).children = children;
    };
    const state = reactive({
      filterable: true,
      cities: [], // 城市
      filterCities: [],
      selectCity: [] // 选中集合
    });
    const check = value => {
      if (value.length == 0) {
        return true;
      }
      // 有不同的城市。则不允许勾选
      let flag = false;
      value.forEach((item, index) => {
        if (index !== 0 && item[0] !== value[0][0]) {
          flag = true;
        }
      });
      if (flag) {
        return false;
      }
      return true;
    };
    watch(
      () => state.selectCity,
      value => {
        if (value.length > 0) {
          state.filterable = false;
        } else {
          state.filterable = true;
        }
        state.filterCities = state.cities;
        emitChange(value);
      }
    );
    watch(
      () => props.value,
      value => {
        if (!value) {
          state.selectCity = [];
        }
      }
    );
    const emitChange = value => {
      if (props.multiple) {
        let cityCode = "";
        let areaCodeList = [];
        let currentCity = {};
        if (value.length > 0) {
          cityCode = value[0][0];
          // 非全部时
          if (cityCode !== "-1") {
            currentCity = state.cities.find(item => item.orgCode == cityCode);
            let length = currentCity.children ? currentCity.children.length : 0;
            // 城市全部勾选了则只返回城市
            if (length == value.length) {
              areaCodeList = [];
            } else {
              value.forEach(item => {
                areaCodeList.push(item[1] ? item[1] : "");
              });
            }
          }
        }
        ctx.emit("input", cityCode);
        ctx.emit("change", cityCode, areaCodeList, currentCity);
      } else {
        let cityCode = "";
        let areaCode = "";
        if (value.length > 1) {
          cityCode = value[0];
          areaCode = value[1];
        }
        let currentCity = state.cities.find(item => item.orgCode == cityCode);
        ctx.emit("input", cityCode);
        ctx.emit("change", cityCode, areaCode, currentCity);
      }
    };
    const visibleChange = value => {
      value ? (state.filterCities = state.cities) : "";
    };
    const change = value => {
      // 选择不同的城市则切换
      if (!check(value)) {
        let filterValue = value.filter(item => {
          let _arr = JSON.parse(lastSelectCity).find(item1 => {
            return item1.toString() == item.toString();
          });
          return _arr ? false : true;
        });
        state.selectCity = filterValue;
        lastSelectCity = JSON.stringify(filterValue);
      } else {
        lastSelectCity = JSON.stringify(value);
      }
    };
    const beforeFilter = keyword => {
      if (keyword == "") {
        state.filterCities = state.cities;
        return false;
      } else {
        state.filterCities = [];
        state.cities.forEach(item => {
          if (item.orgName.indexOf(keyword) > -1) {
            state.filterCities.push(item);
          }
        });
        return false;
      }
    };
    queryCitiesWithAgent({})
      .then(res => {
        if (
          res.data.success &&
          res.data.data &&
          res.data.data.cities.length !== 0
        ) {
          state.cities = res.data.data.cities;
          if (props.hasAllOption) {
            state.cities.unshift({ orgCode: "-1", orgName: "全部" });
          }
          state.filterCities = state.cities;
        } else {
          Message.error("暂无开通城市数据信息，请先联系相关运营人员进行开通城市操作");
        }
      })
      .catch(err => {
        Message.error("暂无开通城市数据信息，请先联系相关运营人员进行开通城市操作");
      });
    return {
      state,
      cascaderProps,
      change,
      beforeFilter,
      visibleChange
    };
  }
};
</script>
<style lang="scss">
.city-cascader-pop {
  .el-cascader-menu,
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
.city-cascader {
  &.el-cascader--medium,
  .el-input__icon {
    line-height: 28px;
  }
  &.el-cascader .el-input .el-input__inner {
    line-height: 28px !important;
    height: 28px !important;
  }
  .el-cascader__tags {
    flex-wrap: nowrap;
    .el-tag {
      max-width: calc(100% - 20px);
    }
  }
  .el-input--medium .el-input__icon{
    line-height: normal;
  }
}
</style>
