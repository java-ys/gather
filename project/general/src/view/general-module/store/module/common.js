import Vue from "vue";
import {
  getCitys,
  axiosAccessCityAgent,
  axiosAccessProvinceCity,
  getNationalCityInAuth,
  getDataDict,
  getBusinessGradeProduct,
  getGradeList, getBizList
} from "_g/api/common";
import { getMallDict } from "_g/api/mall.js";
import { normalBPCData } from "@/libs/tools";
import { isCustomer } from '@/libs/util'

export default {
  name: "common",
  state: {
    bizTypeMap: [],
    cityList: [],
    accessProvinceCityList: [], // 登录用户配置权限的城市
    accessCityList: [], // 登录用户配置权限的城市
    accessAgentList: [], // 登录用户配置权限的运营商
    authCityList: [], // 登录用户配置权限的城市
    authCityMap: {}, // 登录用户配置权限的城市map,{code:cityName}
    changeTab: false,
    closeTabInfo: {},
    dataDict: {},
    mallDict: {},
    gradeList: [],
    businessGradeList: [],
    bizTypeList: [],
    carLevelList: [],
    businessProductCarTree: [], // 三级数据列表
    businessProductCarEnum: {}, // 获取业务线（map['1']）,产品线map['#1']，车型map['##1'] 枚举表
    channel: [] // 渠道
  },
  getters: {
    getDataDict(state) {
      let data = JSON.parse(localStorage.getItem("dataDict"));
      if (Object.keys(state.dataDict).length) {
        data = state.dataDict;
      }
      return data;
    },
    getMallDict(state) {
      let data = JSON.parse(localStorage.getItem("mallDict")) || {};
      if (Object.keys(state.mallDict).length) {
        data = state.mallDict;
      }
      return data;
    },
    getProductLineByUsefulVal(state) {
      const usefulVal = state.gradeList.filter(it => it.businessCode !== 8);
      return usefulVal
    },
    getBusinessGradeName(state) {
      // 获取业务线,产品线,车型等级的名称
      // 转换成key-value形式 减少列表转换取值时遍历查询
      const businessKeyValue = {} // 业务线key-value
      const productKeyValue = {} // 产品线key-value
      const carLevelKeyValue = {}
      const productCarKeyValue = {} // key: 产品线#车型 value: 车型名称
      for (let item of state.businessGradeList) {
        businessKeyValue[item.value] = item.label
      }
      for (let item of state.bizTypeList) {
        productKeyValue[item.value] = item.label
      }
      for (let item of state.carLevelList) {
        // fix: vehicleLevel 枚举值不唯一, 直接使用有问题
        carLevelKeyValue[item.vehicleLevel] = item.vehicleName
      }
      state?.bizTypeList?.forEach(item => {
        item?.levels?.forEach(it => {
          productCarKeyValue[`${item.bizType}#${it.vehicleLevel}`] = it.vehicleName
        })
      })
      return {
        businessKeyValue,
        productKeyValue,
        carLevelKeyValue
        , productCarKeyValue
      }
    }
  },
  mutations: {
    setBizTypeMap(state, data) {
      Vue.set(state, "bizTypeMap", data);
    },
    getCityList(state, data) {
      Vue.set(state, "cityList", data);
    },
    setAccessList(state, data) {
      Vue.set(state, "accessCityList", data.cityList);
      Vue.set(state, "accessAgentList", data.agentList);
    },
    setAccessCityList(state, data) {
      Vue.set(state, "accessProvinceCityList", data);
    },
    setAuthCityList(state, data) {
      Vue.set(state, "authCityList", data);
    },
    setAuthCityMap(state, data) {
      Vue.set(state, "authCityMap", data);
    },
    clearCloseTabInfo(state) {
      state.closeTabInfo = {};
    },
    setChangeTab(state, data) {
      state.changeTab = !state.changeTab;
      Vue.set(state, "closeTabInfo", data);
    },
    setDataDict(state, data) {
      state.dataDict = data;
    },
    setMallDict(state, data) {
      state.mallDict = data;
    },
    setGradeList(state, data) {
      state.gradeList = data;
    },
    setBusinessProductCarTree(state, data) {
      state.businessProductCarTree = data;
    },
    setBusinessProductCarEnum(state, data) {
      state.businessProductCarEnum = data;
    },
    setBusinessGradeList(state, data) { // 业务线
      state.businessGradeList = data;
    },
    setBizTypeList(state, data) { // 产品线与车型等级
      state.bizTypeList = data;
    },
    setCarLevelList(state, data) {
      // 车型等级
      state.carLevelList = data
    },
    setChannel(state, data) {
      // 渠道下拉列表
      state.channel = data
    }
  },
  actions: {
    async getBizTypeMap({ commit }) {
      if (isCustomer()) return
      await getBizList({}).then(res => {
        commit("setBizTypeMap", res.data.data);
      });
    },
    getCityList({ commit }) {
      getCitys({}).then(res => {
        commit("getCityList", res.data.data);
      });
    },
    // 根据登录用户，获取该用户权限下拥有权限访问的城市列表和省市运营商级联列表
    getAccessAgentList({ commit }) {
      axiosAccessCityAgent({}).then(res => {
        commit("setAccessList", res.data.data);
      });
    },
    // 根据登录用户，获取该用户权限下拥有权限访问的省市级联列表
    getAccessCityList({ commit }) {
      axiosAccessProvinceCity({}).then(res => {
        commit("setAccessCityList", res.data.data);
      });
    },
    // 根据登录用户，获取该用户权限下拥有权限访问的c城市列表
    getAuthCityList({ commit }) {
      getNationalCityInAuth({}).then(res => {
        let resData = res.data.data || []
        let result = {}
        let list = []
        resData.forEach(item => {
          result[item.cityID] = item.city
          list.push({
            value: item.cityID,
            label: item.city,
            code: item.uuid,
            id: item.id
          })
        })
        commit("setAuthCityMap", result);
        commit("setAuthCityList", list);
      });
    },
    getDataDict({ commit }) {
      getDataDict().then(res => {
        let data = res.data.data;
        // 过滤状态只需要  生效和失效
        data["member_record_status"] = data["member_record_status"].filter(item => item.value < 3);
        commit("setDataDict", data);
        localStorage.setItem("dataDict", JSON.stringify(data));
      });
    },
    getMallDict({ commit }) {
      getMallDict().then(res => {
        if (res.data.success && res.data.data) {
          let data = res.data.data;
          commit("setMallDict", data);
          localStorage.setItem("mallDict", JSON.stringify(data));
        } else {
          let data = {};
          commit("setMallDict", data);
          localStorage.setItem("mallDict", JSON.stringify(data));
        }
      });
    },
    getGradeList({ commit }) {
      getGradeList().then(res => {
        if (res.data.success) {
          commit("setGradeList", res.data.data.businessTypeList || []);
        } else {
          commit("setGradeList", []);
        }
      });
    },
    getBusinessGradeProductList({ commit }) {
      if (isCustomer()) return
      getBusinessGradeProduct().then(res => {
        if (res.data.success) {
          const BPCData = normalBPCData(res.data.data.expandBizLineList, res.data.data.bizTypeList);
          commit("setBusinessGradeList", BPCData.simpleTreeData)
          commit("setBusinessProductCarTree", BPCData.treeData)
          commit("setBizTypeList", BPCData.bizTypeList)
          commit("setBusinessProductCarEnum", BPCData.enumMap)
          // commit("setBusinessGradeList", res.data.data.expandBizLineList.map(it => {
          //   return {
          //     label: it.expandBizLineName,
          //     value: it.expandBizLine,
          //     children: it.bizTypeList
          //   }
          // }));
          // commit("setBizTypeList", res.data.data.bizTypeList.map(it => {
          //   return {
          //     label: it.bizTypeName,
          //     value: it.bizType,
          //     children: it.levels
          //   }
          // }));
          const bizTypeList = res.data.data.bizTypeList || []
          const carLevelAllList = bizTypeList.map(v => v.levels)
          commit("setCarLevelList", carLevelAllList.flat())
        } else {
          commit("setBusinessGradeList", []);
          commit("setBizTypeList", [])
          commit("setCarLevelList", [])
        }
      });
    },
  }
};
