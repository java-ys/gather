<template>
  <Modal
    id="logs-dialog"
    :title="currentLog+ '的日志信息'"
    :value="logVisible"
    @on-cancel="closeDialog"
    @on-ok="closeDialog"
    width="70%">
    <v-table
      :isSimple="true"
      :current="logCurrPage"
      :total="logTotalCount"
      :pageSize="logPageSize"
      :parColumns="tableColumns"
      :parTableData="logTableData"
      @changePage="handleCurrent"
    ></v-table>
  </Modal>
</template>

<script>
  import {parseTime} from "@/libs/util";
  export default {
    props: {
      currentLog: {type: String, required: false},
      logVisible: {type: Boolean, required: false},
      logTableData: {type: Array, required: false},
      logTotalCount: {type: Number, required: false, default: 0},
      currentId: {type: String, required: false},
      operator: {type: String, default: 'operator'},
    },
    data() {
      return {
        logCurrPage: 1,
        logPageSize: 10,
        tableColumns: [
          {
            title: 'ID',
            key: 'index',
            minWidth: 80,
            align: 'center',
            fixed: 'left',
            render: (h, params) => {
              return h('span', {}, (this.logCurrPage - 1) * this.logPageSize + params.index + 1);
            }
          },
          {
            title: '操作类型',
            key: 'operateType',
            align: 'center',
            minWidth: 140
          },
          {
            title: '操作内容',
            key: 'operateContent',
            align: 'center',
            minWidth: 140
          },
          { 
            title: '操作时间',
            key: 'operateTime',
            align: 'center',
            minWidth: 140
          },
          { 
            title: '操作人',
            key: 'operator',
            align: 'center',
            minWidth: 140
          },
          { 
            title: 'IP地址',
            key: 'ipAddr',
            align: 'center',
            minWidth: 140
          }
        ]
      }
    },
    methods: {
      closeDialog() {
        console.log('close------------');
        this.$emit('closeDialogHandle', 'log');
      },
      handleCurrent(val) {
        let params = {currentId: this.currentId, currentLog: this.currentLog, currPage: val, pageSize: this.pageSize};
        this.$emit('handleLogsPage', params);
        // this.getData({currPage: val, pageSize: this.pageSize});
      },
      timeFormatter(row) {
        return parseTime(row.operateTime);
      },
      operatorFormatter(row) {
        return '1';
      }
    }
  }
</script>
