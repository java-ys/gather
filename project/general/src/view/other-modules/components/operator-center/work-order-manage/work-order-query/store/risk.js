export default {
  name: "riskList",
  state: {
    riskList: []
  },
  getters: {
    getRiskList: state => state.riskList
  },
  mutations: {
    setRiskList(state, list) {
      state.riskList = list
    }
  },
  actions: {
  }
}
