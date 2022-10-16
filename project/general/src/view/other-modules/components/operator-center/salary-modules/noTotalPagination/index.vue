<template>
      <!-- 后台count过大，暂时这样处理 -->
      <el-pagination
        background
        style="margin: 20px 20px 0 0; text-align: right;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="sizes, prev, next"
        :total="currPage === 1 && pageSize >  dataLength ? dataLength : (currPage > 1 && !dataLength ? currPage * pageSize : 100000)"
      >
      </el-pagination>
</template>

<script>
/**
 * @Desc: m2-driver-offer-ui
 * @Author: zhangke
 * @CreateTime: 2021/10/15 1:52 PM
 */
export default {
  name: "NoTotalPagination",
  props: {
    currPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 40]
      }
    },
    dataLength: {
      type: Number,
      default: 0
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.$emit('currentChange', val)
    },
    handleSizeChange(val) {
      this.$emit('pageSizeChange', val)
    }
  }
}
</script>

<style scoped>

</style>
