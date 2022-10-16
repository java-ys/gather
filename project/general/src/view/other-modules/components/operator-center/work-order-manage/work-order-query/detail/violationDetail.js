import { queryViolationDetail } from "_o/api/work-order/work-order-config";

export default {
  methods: {
    async getViolationDetail({ judgeTypeId, woCode }) {
      if(!judgeTypeId) return null
      try {
        const {data: {data, success}} = await queryViolationDetail({
          woCode,
          judgeTypeId
        });
        if(success) {
          return data
        }
        return null
      } catch(e) {
        return null
      }
    }
  }
}
