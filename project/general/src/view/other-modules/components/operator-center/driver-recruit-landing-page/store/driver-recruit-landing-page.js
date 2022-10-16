import { recruitAdd, recruitEdit, recruitDetail } from "_o/api/operator-carrier"
import router from '@/router'
import { CREATE } from "../constant";

const SET_RECRUIT_PARAMS = 'SET_RECRUIT_PARAMS'

const defaultRecruitParams = {
  cityConf: {},
  pageConfList: [{}]
}

export default {
  namespaced: true,
  name: "operator-center/driver-recruit-landing-page",
  state: {
    recruitParams: defaultRecruitParams
  },
  getters: {
    recruitParams(state) {
      return state.recruitParams
    },
  },
  mutations: {
    [SET_RECRUIT_PARAMS](state, data) {
      state.recruitParams = data
    },
  },
  actions: {
    async getRecruitConfig({ commit, state, dispatch }, { cityConfId }) {
      const { data } = await recruitDetail({ cityConfId })
      if (!data.success) return this._vm.$Message.error(data.msg)
      const params = data.data || defaultRecruitParams
      
      if (!params.cityConf || !params.pageConfList || !params.pageConfList.length)
        return commit(SET_RECRUIT_PARAMS, defaultRecruitParams)
      
      commit(SET_RECRUIT_PARAMS, params)
    },
    async submitRecruitConfig({ commit, state, dispatch }, { type }) {
      const isCreate = (type === CREATE)
      const params = {
        ...state.recruitParams,
      }
      
      const { data } = isCreate
        ? await recruitAdd(params)
        : await recruitEdit(params)
  
      if (!data.success) return this._vm.$Message.error(data.msg)
      
      this._vm.$Message.success(isCreate ? "创建完成" : "编辑完成")
      dispatch('clearRecruitConfig')
      router.replace({ name: 'driver-recruit-landing-page' })
    },
    async clearRecruitConfig({ commit }) {
      commit(SET_RECRUIT_PARAMS, defaultRecruitParams)
    },
  }
};
