import { fetchAudioList, fetchSiChengAudioList, fetchRiskOrderList } from "_o/api/work-order/wo-detail";

// 司乘通话录音
export const scAudioList = {
  methods: {
    // currPage	integer
    // pageSize	integer
    // routePlanId
    async getSiChengAudios(params={}) {
      if(!params.routePlanId) return {list: [],
        total: 0}
      const {
        data: {
          success, data: { list, totalCount, currPage }
        },
        msg
      } = await fetchSiChengAudioList(params);
      let r = {success, msg}
      if (success) {
        // this.audioSiChengListInfo.tableData = list;
        // this.audioSiChengListInfo.total = totalCount;
        // this.audioSiChengListInfo.current = currPage;
        return {
          list,
          total: totalCount,
          ...r
        }
      } else {
        // this.$Message.error(msg);
        return {
          list: [],
          total: 0,
          ...r
        }
      }
    },
  }
}

// 带车加盟录音
export const audioList = {
  methods: {
    // currPage	integer
    // orderNo	string
    // pageSize	integer
    // queryEndTime	string
    // queryStartTime string
    async getAudios(params = {}) {
      const {
        data: {
          success, data: { list, totalCount, currPage }
        },
        msg
      } = await fetchAudioList(params);
      let r = {success, msg}

      if (success) {
        // this.audioListInfo.tableData = list;
        // this.audioListInfo.total = totalCount;
        // this.audioListInfo.current = currPage;
        return {
          list,
          total: totalCount,
          ...r
        }
      } else {
        // this.$Message.error(msg);
        return {
          list: [],
          total: 0,
          ...r
        }
      }
    },
  }
}

export const riskOrderList = {
  methods: {
    async getRiskOrderList(params = {}) {
      const {
        data: {
          data: list,
          success,
          msg
        },
      } = await fetchRiskOrderList(params);
      let r = {
        success,
        msg
      }

      if (success) {
        return {
          list,
          ...r
        }
      } else {
        // this.$Message.error(msg);
        return {
          list: [],
          ...r
        }
      }
    }
  }
}
