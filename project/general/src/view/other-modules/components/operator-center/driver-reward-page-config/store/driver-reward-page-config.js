import { recommendAdd, recommendEdit, recommendDetail, getRecommendList } from "_o/api/operator-carrier"
import { tableColumns } from "_o/components/operator-center/driver-configure/conf";
import router from '@/router'
import { CREATE } from "../constant";
import { EventBus } from "@/libs/util.js"

const SET_BASIC_CONFIG_EDIT_PARAMS = 'SET_BASIC_CONFIG_EDIT_PARAMS'
const SET_SHARE_CONFIG_EDIT_PARAMS = 'SET_SHARE_CONFIG_EDIT_PARAMS'
const SET_MOBILE_PAGE_EDIT_PARAMS = 'SET_MOBILE_PAGE_EDIT_PARAMS'

export default {
  namespaced: true,
  name: "operator-center/dirver-reward-page-config",
  state: {
    basicConfigEditParams: {},
    shareConfigEditParams: {},
    mobilePageEditParams: {},
    tableConfig: {
      searchParams: {},
      current: 1,
      total: 0,
      pageSize: 10,
      tableData: []
    }
  },
  getters: {
    basicConfigEditParams(state) {
      return state.basicConfigEditParams
    },
    shareConfigEditParams(state) {
      return state.shareConfigEditParams
    },
    mobilePageEditParams(state) {
      return state.mobilePageEditParams
    }
  },
  mutations: {
    [SET_BASIC_CONFIG_EDIT_PARAMS](state, data) {
      state.basicConfigEditParams = data
    },
    [SET_SHARE_CONFIG_EDIT_PARAMS](state, data) {
      state.shareConfigEditParams = data
    },
    [SET_MOBILE_PAGE_EDIT_PARAMS](state, data) {
      state.mobilePageEditParams = data
    },
  },
  actions: {
    async getDriverRewardPageConfig({ commit, state, dispatch }, { id }) {
      const { data } = await recommendDetail({ id })
      if (!data.success) return this._vm.$Message.error(data.msg)
      const { basicConfigEditParams, shareConfigEditParams, mobilePageEditParams } = data.data
      
      commit(SET_BASIC_CONFIG_EDIT_PARAMS, basicConfigEditParams)
      commit(SET_SHARE_CONFIG_EDIT_PARAMS, shareConfigEditParams)
      commit(SET_MOBILE_PAGE_EDIT_PARAMS, mobilePageEditParams)
    },
    async submitDriverRewardPageConfig({ commit, state, dispatch }, { type, id }) {
      const params = {
        ...state.basicConfigEditParams,
        ...state.shareConfigEditParams,
        ...state.mobilePageEditParams,
      }
      
      const { data } = (type === CREATE)
        ? await recommendAdd(params)
        : await recommendEdit({ ...params, id })
  
      if (!data.success) return this._vm.$Message.error(data.msg)
      
      this._vm.$Message.success("配置成功")
      dispatch('clearDriverRewardPageConfig')
      router.replace({ name: 'driver-configure' })
      const  info  = await getRecommendList({ currPage: state.tableConfig.current, pageSize: state.tableConfig.pageSize });
      if (!info.data.success) return this._vm.$Message.error(info.data.msg)
      state.tableConfig.tableData = info.data.data.list;
      state.tableConfig.total = info.data.data.totalCount;
    },
    async clearDriverRewardPageConfig({ commit }) {
      commit(SET_BASIC_CONFIG_EDIT_PARAMS, {})
      commit(SET_SHARE_CONFIG_EDIT_PARAMS, {})
      commit(SET_MOBILE_PAGE_EDIT_PARAMS, {})
    },
  }
};
