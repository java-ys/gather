<template>
  <!-- Hau5DEMunP>R -->
  <div>
    <div>
      <div
        v-if="filterCol"
        class="filter-col"
      >
        <Dropdown trigger="click">
          <Button href="javascript:void(0)">
            选择列
            <Icon type="md-apps" />
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem>
              <Checkbox
                :indeterminate="indeterminate"
                :value="checkAll"
                @click.stop.prevent.native="handleCheckAll"
              >
                全选
              </Checkbox>
            </DropdownItem>
            <CheckboxGroup
              v-model="indexArr"
              @on-change="changeCol"
            >
              <DropdownItem
                v-for="col in parColumns"
                :key="col.key"
              >
                <div @click.stop="preventEvent">
                  <Checkbox :label="col.key">
                    <span>{{ col.title }}</span>
                  </Checkbox>
                </div>
              </DropdownItem>
            </CheckboxGroup>
            <!--            <DropdownItem>驴打滚</DropdownItem>-->
            <!--            <DropdownItem>炸酱面</DropdownItem>-->
            <!--            <DropdownItem disabled>-->
            <!--              豆汁儿-->
            <!--            </DropdownItem>-->
            <!--            <DropdownItem>冰糖葫芦</DropdownItem>-->
            <!--            <DropdownItem divided>-->
            <!--              北京烤鸭-->
            <!--            </DropdownItem>-->
          </DropdownMenu>
        </Dropdown>
      </div>
      <Table
        v-if="!getLoadingFlag"
        ref="vtable"
        :border="border"
        stripe
        highlight-row
        :row-class-name="rowClassName"
        :width="width"
        :height="height"
        :columns="columns"
        :data="parTableData"
        :no-data-text="nodatatext"
        @on-sort-change="sortChange"
        @on-selection-change="onSelect"
        @on-row-click="onRowClick"
      >
        <template
          v-for="item in columns"
          :slot="item.slot"
          slot-scope="params"
        >
          <slot
            :name="item.slot"
            :data="params"
          ></slot>
        </template>
      </Table>
      <div
        v-else
        :style="{ height: height + 'px' }"
        class="table-spin-wrap"
      >
        <Spin fix>
          <Icon
            type="ios-loading"
            size="20"
            class="table-spin-icon-load"
          ></Icon>
          <div style="margin-top: 5px;">
            加载中...
          </div>
        </Spin>
      </div>
    </div>
    <div
      v-if="isShowPage"
      style="margin: 10px; padding: 10px; overflow: hidden"
    >
      <div style="float: right;">
        <Page
          show-total
          show-elevator
          :simple="isSimple"
          :show-sizer="isShowSizer"
          :total="total"
          :current="current"
          :page-size="pageSize"
          :page-size-opts="pageSizeOpts"
          @on-change="changePage"
          @on-page-size-change="changePageSize"
        >
        </Page>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "VTable",
  props: {
    // 新增一个可以过滤列的功能
    // 功能待保留，持久化能力还未完成。
    filterCol: {
      type: Boolean,
      default: false
    },
    total: Number,
    current: Number,
    pageSize: Number,
    isLoading: Boolean,
    pageSizeOpts: Array,
    isShowSizer: {
      type: Boolean,
      default: true
    },
    isShowLoading: {
      type: Boolean,
      default: true
    },
    isSimple: {
      type: Boolean,
      default: false
    },
    isShowPage: {
      type: Boolean,
      default: true
    },
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 550
      // default: 666
    },
    parColumns: {
      type: Array,
      default: []
    },
    parTableData: Array,
    nodatatext: {
      type: String,
      default: "暂无数据"
    },
    highLigntIndex: {
      type: Number,
      default: 999999999999
    },
    setRowClassName: {
      type: Function,
      default() {
      }
    },
    border: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      checkAll: true,
      indeterminate: false,
      indexArr: this.parColumns.map(item => item.key),
      columns: this.parColumns.slice(0)
    }
  },
  computed: {
    getLoadingFlag() {
      return this.$store.getters.getLoadingFlag;
    }
  },
  watch: {
    parColumns(value = []) {
      this.columns = value.slice(0);
      this.indexArr = value.map(item => item.key);
    }
  },
  methods: {
    preventEvent(e) {
      e.stopImmediatePropagation();
    },
    /**
     * checkboxgroup 改变columns的值，来显示和隐藏列表的值
     * 同时需要处理全选按钮的状态。
     * 最少保留一列
     * @param val
     */
    changeCol(val) {
      if (!val || !val.length) {
        this.$Message.error("最少保留一列。");
        this.indexArr = [this.parColumns[0].key];
      }
      this.columns = this.parColumns.filter(item => {
        return this.indexArr.indexOf(item.key) > -1;
      });
      if (this.indexArr.length === this.parColumns.length) {
        this.checkAll = true;
        this.indeterminate = false;
      } else {
        this.checkAll = false;
        this.indeterminate = this.indexArr.length > 0;
      }
    },
    handleCheckAll() {
      // if (this.indeterminate) {
      //   this.checkAll = false;
      // } else {
      this.checkAll = !this.checkAll;
      // }
      this.indeterminate = false;

      if (this.checkAll) {
        this.indexArr = this.parColumns.map(item => item.key);
      } else {
        this.$Message.error("最少保留一列。");
        this.indexArr = [this.parColumns[0].key];
      }
      this.changeCol(this.indexArr);
    },
    changePage(val) {
      this.$store.commit("changeLoadingFlag", true);
      this.$emit("changePage", val);
    },
    changePageSize(val) {
      this.$store.commit("changeLoadingFlag", true);
      this.$emit("changePageSize", val);
    },
    sortChange(obj) {
      this.$emit("sortHandle", obj);
    },
    onSelect(obj) {
      this.$emit("selectHandle", obj);
    },
    onRowClick(obj, index) {
      this.$emit("rowClickHandle", obj, index);
    },
    handelSelectAll(status) {
      this.$refs.vtable.selectAll(status);
    },
    rowClassName(row, index) {
      if (this.setRowClassName(row, index)) {
        return this.setRowClassName(row, index)
      }
      if (index === this.highLigntIndex) {
        return "highLightClass";
      } else {
        if (row.className) {
          return row.className;
        } else {
          return "";
        }
      }
    }
  }
};
</script>
<style scoped lang="less">
.table-spin-wrap {
  position: relative;
  border: 1px solid #e8eaec;
}

.filter-col {
  text-align: right;
  margin-bottom: 10px;

  .ivu-dropdown {
    text-align: left;

    .ivu-dropdown-item {
      padding: 0;

      .ivu-checkbox-wrapper {
        padding: 7px 16px;
      }
    }
  }
}

.table-spin-icon-load {
  animation: ani-table-spin 1s linear infinite;
}

@keyframes ani-table-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
