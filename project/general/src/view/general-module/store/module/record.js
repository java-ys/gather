export default {
  name: "record",
  state: {
    uuid: "",
    wrapData: null || JSON.parse(sessionStorage.getItem("wrapData"))
  },
  mutations: {
    ONADDUUID(state, val) {
      state.uuid = val;
    },
    ADDWRAPDATA(state, val) {
      state.wrapData = val;
    },
    ONDELUUID(state) {
      state.uuid = "";
    }
  },
  actions: {
    handleAddUuid({ commit }, val) {
      commit("ONADDUUID", val);
    },
    handleDelUuid({ commit }) {
      commit("ONDELUUID");
    }
  }
};
