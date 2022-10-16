import { getDicItemByDicCode } from "_o/api/salary/common";

const SET_DRIVER_TYPE_LIST = "SET_DRIVER_TYPE_LIST"

export default {
  namespaced: true,
  name: "salary",
  state: {
    driverTypeList: []
  },
  getters: {
    driverTypeList(state) {
      return state.driverTypeList
    }
  },
  mutations: {
    [SET_DRIVER_TYPE_LIST](state, data) {
      state.driverTypeList = data
    }
  },
  actions: {
    async getDicItemByDicCode({ commit, state, getters }) {
      // if (state.driverTypeList.length > 0) return
      const res = await getDicItemByDicCode();

      if (!res.data.success) return this.$message({ message: res.data.msg, type: "success" });

      commit(SET_DRIVER_TYPE_LIST, res.data.data);
    },
  }
};
