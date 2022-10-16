<template>
  <div>
    <searchList
      ref="searchList"
      :inputList="inputList"
      :spreadStatus="true"
      :showNumber="4"
      :selectNumber="4"
      @cascade-change="handleCascadeChange"
      @on-search="handleSearch"
      @on-reset="handleReset"
      @loadData="loadData"
    >
    </searchList>
    <div class="action">
      <Button type="primary" @click="exportData">批量导出</Button>
    </div>
    <VTable
      :total="table.total"
      :current="table.pageNum"
      :pageSize="table.pageSize"
      :parColumns="tableColumn"
      :parTableData="tableData"
      @changePage="handleChangePage"
      @changePageSize="handleChangePageSize"
      @selectHandle="handleSelectingRow"
    >
    </VTable>
  </div>
</template>

<script>
import fileDownload from "js-file-download";
import { inputList, tableColumn, workOrderClassMap } from "./fields";
import { getAgentList, getOpenAreaAll,getOrderSource } from "_o/api/work-order/common";
import { fetchCityList } from "_o/api/work-order/work-order-config";
import { fetchViolationTpyes } from "_o/api/work-order/wo-detail";
import {
  fetchWorkOrderIllegal,
  exportWorkOrderIllegalData
} from "_o/api/work-order/work-order-illegal";
import { queryDriverTypeList } from "_o/api/task-manager";
import woType from "../mixins/woType.js";
import baseMixin from '@/mixins/orderMixin'
export default {
  name: "work-order-illegal",
  mixins:[woType,baseMixin],
  data() {
    return {
      runStateLabelMapList:{},
      inputList: inputList(this),
      tableColumn: tableColumn(this),
      driverTypeList: [],
      search: {},
      table: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      tableSelectRow: []
    };
  },

  created() {
    this.init();
  },
  async mounted() {
    this.inputList.find(item =>item.bind_key === "bizState").dropList =  await this.fetchOptions({appId:"520315b4d7524001a27a3bde5d052c51"})
    this.runStateLabelMapList = this.runStateLabelMap
 },
  methods: {
    init() {
      this.queryList({ startTime: this.$moment().subtract(3, "days").format("YYYY-MM-DD HH:mm:ss"), endTime: this.$moment().format("YYYY-MM-DD HH:mm:ss") });
      this.queryDriverTypeList();
      this.getOptions();
      this.inputIndex = 7
      this.loadData(null,()=>{},true);
    },

    async getOptions() {
      this.queryOptions()
      const [
        {
          data: { data: agentList }
        },
        // {
        //   data: { data: openAreaList }
        // },
        {
          data: { data: orderSourceList}
        }
      ] = await Promise.all([getAgentList(),getOrderSource()]);
      const agentInput = this.inputList.find(
        item => item?.bind_key === "agentId"
      );
      // const cityInput = this.inputList.find(
      //   item => item.bind_key === "cityCode"
      // );
      agentInput.dropList = agentList;
      // cityInput.dropList = openAreaList;

      const orderSourceInput = this.inputList.find(item => item.bind_key === "orderSource");
      orderSourceInput.dropList = orderSourceList.map(it =>{
          let tempObj = {
          ...it,
          label:it.desc,
          value:it.code
        }
        return tempObj
      });
    },

    async queryOptions() {
      let param = {
        bizTypes:[1, 2, 4, 6, 7]
      }
      const { data: { success, data } } = await fetchCityList(param);
      if (success) {
        this.cityList = data.map(it => {
          return {
            label:it.cityName,
            value:it.cityCode
          }
        });
        const idx = this.inputList.findIndex(input => input.bind_key === 'cityCode')
        this.inputList[idx].dropList = data.map(it => {
          return {
            label:it.cityName,
            value:it.cityCode
          }
        })
      }
    },

    async queryList(args={}) {
      const {
        search,
        table: { pageNum, pageSize }
      } = this;
      const params = {
        currPage: pageNum,
        pageSize,
        ...args,
        ...search
      };
      if (Math.abs(this.$moment(params.startTime).diff(this.$moment(params.endTime), "days")) > 30) {
        this.$store.commit("changeLoadingFlag", false);
        return this.$Message.error({ content: "创建时间仅限间隔31天内" });
      }
      this.$store.commit("changeLoadingFlag", true);
      try {
        const {
          data: {
            success,
            data: { list, totalCount }
          }
        } = await fetchWorkOrderIllegal(params);
        if (success) {
          this.tableData = list;
          this.table.total = totalCount;
        }
      } catch (error) {
        console.log(error);
      }
      this.$store.commit("changeLoadingFlag", false);
    },

    async queryDriverTypeList() {
      const {
        data: { success, data }
      } = await queryDriverTypeList();
      if (success) {
        const target = this.inputList.find(
          item => item.bind_key === "driverTypes"
        );
        target.dropList = data.map(item => {
          return {
            value: item.driverType.toString(),
            label: item.driverTypeDesc
          };
        });
      }
    },

    handleCascadeChange(val, selected, item) {
      if (item.bind_key[0] === "categoryFirst") {
        this.WoCategoryChange(val);
      }
    },

    async WoCategoryChange(val) {
      const workOrderClass = this.inputList.find(
        item => item.title === "判责类型"
      );
      if (val.length < 2) {
        return (workOrderClass.cascaderList = [],workOrderClass.value = []);
      }
      workOrderClass.cascaderList = [];
      workOrderClass.value = [];
      const list = workOrderClassMap.map(item => item.children).flat();
      const { type } = list.find(item => item.value === val[1]);
      try {
        const {
          data: { success, data }
        } = await fetchViolationTpyes({ woType: type, woWay: "1" });
        if (success) {
          //   workOrderClass.cascaderList = data;
          workOrderClass.cascaderList =
            type === "FK" ? this.handleFmt(data, true, 0) : data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    handleFmt(val, isRoot, index, isSub) {
      if (isRoot) {
        let res = val;
        for (let i = 0; i < res.length; i++) {
          res[i] = this.handleFmt(
            res[i],
            false,
            index,
            res[i].children.legnth ? true : false
          );
        }
        return res;
      }
      if (val.children.length) {
        return {
          ...val,
          children: this.handleFmt(val.children, true, index + 1),
          label:
            index > 0 || isSub
              ? `${val.label[0]}****${val.label[val.label.length - 1]}`
              : val.label
        };
      }
      return {
        ...val,
        label:
          index > 0 || isSub
            ? `${val.label[0]}****${val.label[val.label.length - 1]}`
            : val.label
      };
    },
    handleSearch(val) {
      const {
        judgeType0,
        judgeType1,
        judgeType2,
        judgeType3,
        startTime,
        endTime
      } = val;
      const judgeType = [judgeType0, judgeType1, judgeType2, judgeType3]
        .filter(Boolean)
        .join("/");
      this.search = val;
      if (judgeType) {
        this.search.judgeType = judgeType;
      }
      if (startTime) {
        this.search.startTime = this.$moment(startTime).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }
      if (endTime) {
        this.search.endTime = this.$moment(endTime).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }
      this.table.pageNum = 1;
      this.queryList();
    },

    handleReset() {
      this.search = {};
      this.table.pageNum = 1;
      this.queryList();
    },

    handleChangePage(val) {
      this.table.pageNum = val;
      this.queryList();
    },

    handleChangePageSize(val) {
      this.table.pageSize = val;
      this.queryList();
    },

    handleSelectingRow(val) {
      console.log(val);
      this.tableSelectRow = val;
    },

    async exportData() {
      const { search } = this;
      const { tableSelectRow = [] } = this;
      const isBatchExport =
        Object.keys(search).every(item => !search[item]) &&
        tableSelectRow.length === 0;
      try {
        await exportWorkOrderIllegalData({
          batchExport: isBatchExport,
          codeList: tableSelectRow.map(item => item.woCode),
          ...(tableSelectRow.length === 0 ? search : {})
        });
      } catch (res) {
        const head = res.headers["content-disposition"];
        if (head) {
          let name;
          if (head.split(";")[1]) {
            name = head.split(";")[1].split("=")[1];
          }
          fileDownload(res.data, decodeURIComponent(name));
          this.$Message.success("成功");
        } else {
          this.$Message.error("无可导出内容!");
        }
      }
    },
    // 1224
    // queryData(row) {
    //   debugger

    // },
  }
};
</script>

<style lang="less" scoped>
.action {
  margin: 0 0 15px;
}
</style>
