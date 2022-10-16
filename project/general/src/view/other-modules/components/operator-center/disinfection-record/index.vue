<template>
  <div>
    <searchList
      :inputList="inputList"
      :spreadStatus="true"
      :showNumber="4"
      @on-search="searchData"
      @on-reset="resetData"
    >
      <div
        slot="extendInput"
        class="text-input"
      >
        <span
          class="title-name"
          style="width: 90px"
        >
          消毒时间：
        </span>
        <DatePicker
          v-model="searchParamsTime"
          clearable
          type="datetimerange"
          class="search-input"
          placement="bottom-start"
          :options="options||{}"
          placeholder="请选择消毒时间"
          :style="{'width': 200 + 'px'}"
          :editable="false"
          @on-clear="enterSearch"
        >
        </DatePicker>
      </div>
    </searchList>
    <Row>
      <Col class="export-bt">
      <export-file
        v-hasAuth="'disinfection-record-export'"
        type="primary"
        :isDisabled="tableData.length === 0"
        exportUrl="/admin/driver/disinfect/export"
        exportFileName="消毒记录列表.xls"
        :queryData="queryData"
        btnText="批量导出"
      ></export-file>
      </Col>
    </Row>
    <t-table
      :total="total"
      :isLoading="isLoading"
      :current="current"
      :pageSize="pageSize"
      :parColumns="tableColumns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    ></t-table>
  </div>
</template>

<script>
import { formatTime, inputList, tableColumns } from "./fileds";
import ExportFile from "_a/export-file/exportFile";
import { DisinfectionRecordKeyMap } from "_o/components/operator-center/disinfection-record/mapping";
import { disinfectPageList } from "_o/api/disinfection-record";
import moment from "moment";
import { queryOpenCityList } from "_o/api/task-manager";

export default {
  name: "disinfection-record",
  components: { ExportFile },
  data() {
    return {
      inputList: JSON.parse(JSON.stringify(inputList)),
      searchParams: {},
      total: 0,
      current: 1,
      pageSize: 10,
      tableColumns: tableColumns(this),
      tableData: [],
      isLoading: false,
      searchParamsTime: [],
      options: {
        disabledDate(date) {
          let startTime = moment().add(-3, "M").valueOf();
          let endTime = moment().valueOf();
          return moment(date).valueOf() > endTime || moment(date) < startTime;
        }
      },
      // es分页查询最大条数
      limitNum: 10000
    };
  },
  computed: {
    queryData() {
      return {
        ...this.searchParams,
        ...this.searchTime
      }
    },
    pageParams() {
      return {
        currPage: this.current,
        pageSize: this.pageSize,
      };
    },
    searchTime() {
      let startKey = DisinfectionRecordKeyMap.serviceStartTime;
      let endKey = DisinfectionRecordKeyMap.serviceEndTime;
      let startTime = this.initFormatTime(this.searchParamsTime[0], startKey);
      let endTime = this.initFormatTime(this.searchParamsTime[1], endKey);
      return {
        ...startTime, ...endTime
      }
    },
    params() {
      return { ...this.searchParams, ...this.pageParams, ...this.searchTime };
    },
  },
  created() {
    this.getProvinceCityList();
    this.getTableData();
  },
  methods: {
    initFormatTime(data, key) {
      if (data) {
        return {
          [key]: formatTime(data),
        };
      } else {
        return {};
      }
    },
    async getProvinceCityList() {
      let temp = [{
        value: "",
        label: "全部"
      }]
      queryOpenCityList({}).then(res => {
        if (res.data.code === 200 && res.data.success) {
          let list = (res && res.data && res.data.data) || [];
          let formatList = list.map(item => {
            return {
              value: item.cityId,
              label: item.city
            }
          });
          this.inputList[0].dropList = [...temp, ...formatList];
        } else {
          this.inputList[0].dropList = temp;
        }
      }).catch(() => {
        this.inputList[0].dropList = temp;
      })
    },
    resetData() {
      this.current = 1;
      this.searchParams = {};
      this.searchParamsTime = [];
      this.getTableData();
    },
    changePage(v) {
      this.current = v;
      this.getTableData();
    },
    async getTableData() {
      this.isLoading = true;
      disinfectPageList(this.params)
        .then((res) => {
          this.isLoading = false;
          if (res.errCode === 200 && res.success) {
            // 处理es查询为空时展示-1的情况
            // es最大限制1w条数据查询，当数据大于1w时也只展示1w条
            this.total = res.data.data.totalCount === -1 ? 0 : res.data.data.totalCount > this.limitNum ? this.limitNum : res.data.data.totalCount;
            this.tableData = res.data.data.list;
          }
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    changePageSize(pageSize) {
      this.current = 1;
      this.pageSize = pageSize;
      this.getTableData();
    },
    searchData(params) {
      this.current = 1;
      this.searchParams = params;
      this.getTableData();
    },
    enterSearch() {
      this.searchParamsTime = [];
      this.getTableData();
    },
  },
};
</script>

<style scoped lang="less">
.export-bt {
  padding-bottom: 10px;
  display: flex;
  justify-content: flex-end;
}
/deep/ .input-list-wrap {
  .input-list-wrap {
    margin: 0;
  }
}
</style>
