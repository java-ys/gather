/*
 * @Author: Evil Cheng
 * @Date: 2021-11-12 10:42:27
 * @LastEditTime: 2021-11-17 09:30:46
 * @Description: 公共方法
 */
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({
      businessGradeName: "getBusinessGradeName"
    }),
  },
  methods: {
    filterBusinessName(val) {
      const { businessKeyValue } = this.businessGradeName
      return businessKeyValue[val] || "--"
    },
    filterBizName(val) {
      const { productKeyValue } = this.businessGradeName
      return productKeyValue[val] || "--"
    },
    filterCarLevelName(vals, bizType) {
      const { productCarKeyValue } = this.businessGradeName
      if (Object.prototype.toString.call(vals) === "[object Array]") {
        const arr = vals.map(v => productCarKeyValue[`${bizType}#${v}`])
        return arr.join(",") || "--"
      }
      return productCarKeyValue[`${bizType}#${vals}`] || "--"
    }
  },
}
