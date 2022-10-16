<template>
    <div>
      <el-pagination
        background
        style="margin: 20px 20px 0 0; text-align: right;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
</template>
<script>
export default {
	name: '',
	props:{
        currPage: {
            type: Number,
            default: 1
        },
        pageSize: {
            type: Number,
            default: 10
        },
        total: {
            type: Number,
            default: 10
        },
		pageSizes: {
            type: Array,
            default: () => {
                return [10, 20, 30, 40]
            }
        }
	},
    data() {
        return {
        }
    },
    methods: {
        handleCurrentChange(val) {
            this.$emit('currentChange', val)
        },
        handleSizeChange(val) {
            this.$emit('pagesizeChange', val)
        }
    }
}
</script>
<style scoped lang='scss'>
::v-deep .el-pagination__total{
    float: left;
}
</style>
