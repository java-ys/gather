
<template>
  <Modal v-model="showModal" :title="title" width="1100">
    <v-table
      :current="current"
      :total="total"
      :pageSize="pageSize"
      :parColumns="columns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    ></v-table>
    <div slot="footer">
      <Button type="primary" @click="showModal = false">关闭</Button>
    </div>
  </Modal>
</template>

<script>
import { queryLogPage } from "_o/api/guide-config";

const logTypeMap = {
  1: '新增',
  2: '编辑',
  3: '停用',
  4: '删除'
}
const getLogType = (i) => {
  return logTypeMap[i];
}

const logColumns = {
  columns(_this) {
    return [{
      title: 'ID',
      width: 80,
      render(h, params) {
        return h('span', {}, (_this.current - 1) * _this.pageSize + params.index + 1);
      }
    },
      // {
      //   title: '操作类型',
      //   minWidth: 100,
      //   key: 'operateType',
      //   render: (h, params) => {
      //     return h('div', getLogType(params.row.handleType))
      //   }
      // },
      {
        title: '操作内容',
        minWidth: 100,
        key: 'operateContent'
      },
      {
        title: '操作时间',
        minWidth: 170,
        render: (h, params) => {
          return h('div', `${_this.$moment(params.row.createTime).format("YYYY-MM-DD HH:mm:ss")}`)
        }
      },
      {
        title: '操作人',
        minWidth: 80,
        key: 'operator'
      },
      // {
      //   title: 'IP',
      //   minWidth: 130,
      //   key: 'ipAddress'
      // }
    ];
  }
}


export default {
  data() {
    let { columns } = logColumns;
    return {
      title: "日志信息",
      showModal: false,
      columns: columns(this),
      tableData: [{}],
      current: 1,
      total: 0,
      pageSize: 10
    };
  },
  methods: {
    init(val) {
      this.current = 1;
      this.total = 0;
      this.pageSize = 10;
      this.tableData = [{}];
      this.showModal = true;
      this.id = val.id;
      this.operatorType = val.type
      this.getTableList();
    },
    getTableList() {
      let params = {
        currPage: this.current,
        pageSize: this.pageSize,
        id: this.id,
        operatorType: this.operatorType,
      };
      queryLogPage(params).then(res => {
        let data = res.data.data || {};
        this.tableData = data.list;
        this.total = data.totalCount;
      });
    },
    changePage(page) {
      this.current = page;
      this.getTableList();
    },
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.getTableList();
    }
  }
};
</script>

<style></style>
