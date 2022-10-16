<template>
  <div class="table-wrap">
    <a-locale-provider :locale="zhCN">
      <a-table
        v-show="!isLoading"
        bordered
        :columns="columns"
        :rowKey="record => record.uuid"
        :dataSource="list"
        :pagination="page"
        @change="handlePageChange"
        :scroll="{ x: scrollX, y: scrollY }"
      >
        <template
          slot-scope="text, record"
          :slot="item.slot || item.key"
          v-for="item in columns"
        >
          <slot :name="item.slot || item.key" :data="record"></slot>
        </template>
      </a-table>
    </a-locale-provider>
    <div v-show="isLoading" style="height: 600px" class="table-spin-wrap">
      <Spin fix>
        <Icon type="ios-loading" size="20" class="table-spin-icon-load"></Icon>
        <div style="margin-top: 5px;">加载中...</div>
      </Spin>
    </div>
  </div>
</template>

<script>
import { Table, LocaleProvider } from "ant-design-vue";
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import "ant-design-vue/dist/antd.css";

export default {
  name: 'FTable',
  components: {
    Table,
    LocaleProvider
  },
  props: {
    columns: Array,
    // isLoading: {
    //   type: Boolean,
    //   default: true
    // },
    list: {
      type: Array,
      default: () => []
    },
    page: {
      type: Object,
      default: () => {
        return {
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: total => `共${total}条`,
          total: 0,
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30', '40']
        }
      }
    },
    scrollX: {
      type: Number,
      default: 2300
    },
    scrollY: {
      type: Number,
      default: 600
    }
  },
  data () {
    return {
      zhCN
    }
  },
  computed: {
    isLoading: function () {
      return this.$store.getters.getLoadingFlag
    }
  },
  methods: {
    handlePageChange (pagination, filters, sorter) {
      this.$store.commit('changeLoadingFlag', true)
      this.$emit('change', pagination, filters, sorter)
    }
  }
}
</script>

<style scoped lang="less">
.table-wrap {
  position: relative;
  .ant-table-row:nth-child(2n) td {
    background-color: #f8f8f9;
  }

  .table-spin-wrap {
    position: relative;
    border: 1px solid #e8eaec;
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
}
</style>
