/*
 * @Author: Evil Cheng
 * @Date: 2021-11-09 17:31:19
 * @LastEditTime: 2021-11-10 13:56:36
 * @Description: 业务线-产品线-车型等级 级联下拉功能mixins, 使用必须保证model 相同且初始化绑定数据相同！！！
 */
export default {
  data() {
    return {
      productList: [], // 产品线
      carLevelList: [], // 车型等级
    }
  },
  methods: {
    handleChangeBusiness(val) {
      const business = this.businessList.find(v => v.value === val)
      this.$nextTick(() => {
        this.productList = business.children
        // 清空数据
        this.formData.bizType = ""
        this.formData.carLevels = []
        this.carLevelList = []
      })
    },
    handleChangeProduct(val) {
      const product = this.productList.find(v => v.bizType === val)
      this.$nextTick(() => {
        this.carLevelList = product.levels
        // 清空数据
        this.formData.carLevels = []
      })
    }
  },
}