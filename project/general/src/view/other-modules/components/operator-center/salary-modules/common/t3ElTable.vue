<template>
  <div class="data-table">
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      size="mini"
      :row-style="targetOpt.rowStyle"
      :header-cell-style="targetOpt.headerCellStyle"
      :height="height"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
      <!-- 行选中 -->
      <el-table-column
        v-if="options.selection"
        type="selection"
        width="55"
      ></el-table-column>

      <!-- 行序号 -->
      <el-table-column
        v-if="options.sequence"
        label="序号"
        type="index"
        width="50"
        align="center"
      >
        <template slot-scope="scope">
          <!-- 有分页时，序号显示 -->
          <span v-if="pageObj">{{(pageObj.currentPage - 1) * pageObj.size + scope.$index + 1}}</span>
          <!-- 无分页时，序号显示 -->
          <span v-else>{{scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <template v-for="(col, index) in columns">
        <!-- 操作列/自定义列 -->
        <slot v-if="col.slot" :name="col.slot"></slot>
        <!-- 普通列 -->
        <el-table-column
          v-else
          :key="index"
          :prop="col.prop"
          :label="col.label"
          :width="col.width"
          :min-width="col.minWidth ? col.minWidth : 150"
          :formatter="col.formatter"
          align="center"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
      </template>
    </el-table>
    <!-- 分页 -->
    <!-- <el-pagination
      v-if="targetOpt.paginate"
      :layout="targetOpt.layout"
      :page-size="pageObj.size"
      :total="pageObj.total"
      :current-page="pageObj.currentPage"
      @current-change="currentChange"
    >
    </el-pagination> -->
    <!-- 没有totalCount的分页列表兼容 -->
    <NoTotalPagination
      v-if="useNoTotalPagination"
      :currPage="pageObj.currentPage"
      :pageSize="pageObj.size"
      :data-length="tableData.length"
      @currentChange="currentChange"
      @pageSizeChange="handleSizeChange"
    />
    <el-pagination
      v-else-if="targetOpt.paginate"
      background
      style="margin: 20px 20px 0 0; text-align: right;"
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="pageSizes"
      :page-size="pageObj.size"
      :total="pageObj.total"
      :current-page="pageObj.currentPage"
      @size-change="handleSizeChange"
      @current-change="currentChange"
    >
    </el-pagination>
    <div v-if="TotalVal.length > 0" class="totalVal">
      <div v-for="(item, index) in TotalVal" :key="index">
        <span>{{item.label}}:{{item.value}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import NoTotalPagination from "../noTotalPagination"
function mix(target, source) {
  let k; let
    key;
  for (key in source) {
    if ((k = source[key]) !== undefined) {
      target[key] = k;
    }
  }
  return target;
}
let baseOpt = {
  sequence: false, // 序号
  selection: false, // 行选中
  paginate: true, // 展示分页
  layout: "total, prev, pager, next",
  headerCellStyle: { background: "#F5F4F2" }
};
export default {
  name: "m2-el-table",
  components: {
    NoTotalPagination
  },
  props: {
    tableData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    columns: {
      type: Array,
      default: () => {
        return [];
      }
    },
    loading: Boolean,
    pageObj: {
      type: Object,
      default: () => {
        return {};
      }
    },
    options: {
      type: Object,
      default: () => {
        return {};
      }
    },
    height: {
      type: String,
      default: () => {
        return "515";
      }
    },
    useNoTotalPagination: {
      type: Boolean,
      default: false
    },
    pageSizes: {
      type: Array,
      default: () => {
        return [10, 20, 30, 40];
      }
    },
    TotalVal: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    targetOpt() {
      return { ...baseOpt, ...this.options };
    }
  },
  methods: {
    // 行选中
    handleSelectionChange(v) {
      this.$emit("on-selection", v);
    },
    // 改变当前页
    currentChange(v) {
      this.$emit("on-pagesize-change", v);
    },
    // 列排序
    sortChange(p) {
      this.$emit("on-sort-change", p);
    },
    handleSizeChange(val) {
      this.$emit("pagesizeChange", val);
    }
  }
};
</script>

<style scoped lang="scss">
::v-deep .el-pagination {
  margin: 20px 20px 0 0;
  text-align: right;
}
::v-deep .el-pagination__total {
  float: left;
}
.totalVal {
  font-size: 14px;
  color: red;
  display: flex;
  justify-content: space-around;
  margin: 15px 0;
}
</style>
