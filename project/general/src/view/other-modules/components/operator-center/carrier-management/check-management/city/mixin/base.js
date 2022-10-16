export default {
  methods: {
    // 主策略
    isMainStrategy(v) {
      return `${v}` === '0'
    },
    // 辅策略
    isDeputyStrategy(v) {
      return `${v}` === '2'
    },
    // 扣减项
    isDeduct(v) {
      return `${v}` === '1'
    }
  }
}
