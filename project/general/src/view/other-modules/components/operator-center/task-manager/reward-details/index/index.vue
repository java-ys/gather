<template>
  <div>
    <div>
      <div class="input-list-wrap">
        <div class="text-input">
          <span class="title-name">自然周：</span>
          <el-date-picker
            style="width: 342px"
            v-model="weeks"
            type="week"
            :format="'yyyy 第WW周(' + beginTimeDesc + ')'"
            placeholder="请选择"
            :picker-options="pickerOptions"
            @change="beginTimeDescFormatter"
          >
          </el-date-picker>
        </div>
      </div>
      <div class="input-list-wrap">
        <div class="text-input">
          <span class="title-name">城市：</span>
          <Select
            v-model="queryParams.cityCode"
            class="search-input"
            placeholder="请选择"
          >
            <Option
              v-for="(dropItem, dropIndex) in cityList"
              :key="'item.dropList' + dropIndex"
              :value="dropItem.label"
              :bind_key="dropItem.label"
              >{{ dropItem.label }}</Option
            >
          </Select>
        </div>
      </div>
      <div class="input-list-wrap">
        <div class="text-input">
          <span class="title-name">司机姓名：</span>
          <Input
            clearable
            v-model="queryParams.driverName"
            placeholder="请输入"
            class="search-input"
          />
        </div>
      </div>
      <div class="input-list-wrap">
        <div class="text-input">
          <span class="title-name" style="width: 80px">司机手机号：</span>
          <Input
            clearable
            v-model="queryParams.driverPhone"
            placeholder="请输入"
            class="search-input"
          />
        </div>
      </div>
      <div class="input-list-wrap">
        <div class="text-input">
          <span class="title-name">司机ID：</span>
          <Input
            clearable
            v-model="queryParams.driverUuid"
            placeholder="请输入"
            class="search-input"
          />
        </div>
      </div>
      <div class="btn-wrap">
        <Button style="margin-right: 15px" type="primary" @click="search"
          >搜索</Button
        >
        <Button @click="reset">清空</Button>
      </div>
    </div>
    <div style="position: relative; height: 32px"  v-hasAuth="'driver-reward-export'">
      <export-file
        style="position: absolute; right: 10px"
        exportUrl="/download/driverTask/export"
        exportFileName="司机任务奖励明细.xls"
        baseUrlKey="_base4Task"
        :queryData="{...queryParams,cityUuid : cityList.find(item=>item.label == queryParams.cityCode).cityUuid}"
        ajaxMethod="get"
        btnText="导出"
        :disabled="!total || total === 0"
      ></export-file>
    </div>
    <TTable
      style="margin-top: 20px"
      class="task-table-container"
      :total="total"
      :current="current"
      :isLoading="isLoading"
      :pageSize="pageSize"
      :parColumns="tableColumns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    >
    </TTable>
    <!-- 话题 新建/编辑/详情 -->
    <dialogDetail
      :visible="showDetail"
      :detailsObj="detailsObj"
      @on-confirm="confirm"
      @on-close="hideAdd"
    ></dialogDetail>
  </div>
</template>

<script>
import dialogDetail from "./components/dialogDetail";
import { timeFormat } from "@/libs/util";

import { listPageData, tableTitle } from "./fields";
import { tool } from "_o/api/baseMixin.js";
import ExportFile from "_a/export-file/exportFile";
import {
  listByPage,
  queryOpenCityList
} from "_o/api/task-manager";
export default {
  name: "task-reward-details",
  mixins: [tool],
  data() {
    return {
      pickerOptions: {
        firstDayOfWeek: 1,
      },
      cityList: [],
      showDetail: false,
      isLoading: false,
      ...listPageData,
      weeks: "",
      beginTimeDesc: "",
      queryParams: {
        cityCode: "",
        driverName: "",
        driverPhone: "",
        driverUuid: "",
        startTime: "",
        endTime: ""
      },
      tableTitle,
      detailsObj: {},
    };
  },
  components: {
    dialogDetail,
    ExportFile,
  },
  created() {
    this.tableColumns = tableTitle(this);
    let date = new Date();
    var dateTime = date.getTime(); // 获取现在的时间
    var dateDay = date.getDay();
    var oneDayTime = 24 * 60 * 60 * 1000;
    var proWeekList = [];

    for (var i = 0; i < 7; i++) {
      var time = dateTime - (dateDay + (7 - 1 - i)) * oneDayTime;
      proWeekList[i] = this.$moment(new Date(time)).format("YYYY-MM-DD");
    }
    this.weeks = proWeekList[0];
    console.log(this.weeks)
    this.setStartAndEnd(proWeekList[0], proWeekList[6]);
    this.getCityList()
    // this.getList();
  },
  mounted() {},
  methods: {
    // 获取城市列表
    async getCityList() {
      const res = await queryOpenCityList({});
      if (!res) {
        this.cityList = [];
        this.$Message.error("获取城市失败");
        return false;
      }
      if (res.data && res.data.data && res.data.success) {
        this.cityList = res.data.data.map((item) => ({
          value: item.cityId,
          label: item.city,
          cityUuid:item.cityId
        }));
        this.queryParams.cityCode = this.cityList[0].label
        // if (this.cityList.length > 0) {
        //   this.cityList.unshift({
        //     value: '',
        //     label: "全部",
        //   });
        // }
        // this.inputList[2].dropList = this.cityList;
      } else {
        this.cityList = [];
        this.$Message.error(res.data.msg);
      }
      this.getList();
    },
    // 开始时间回显包装
    beginTimeDescFormatter(val) {
      if (val) {
        let begin = timeFormat(
          new Date(val.getTime() - 1000 * 60 * 60 * 24),
          "yyyy-MM-dd"
        );
        let end = timeFormat(
          new Date(val.getTime() + 1000 * 60 * 60 * 24 * 5),
          "yyyy-MM-dd"
        );
         console.log(begin, end)
        this.setStartAndEnd(begin, end);
      }
    },
    setStartAndEnd(start, end) {
      this.beginTimeDesc = start + " - " + end;
      this.queryParams.startTime = new Date(start + " 00:00:00").getTime();
      this.queryParams.endTime = new Date(end + " 23:59:59").getTime();
    },
    goDetail(row) {
      this.showSet();
      let driverDetials = JSON.parse(JSON.stringify(row));
      let {startTime, endTime } = this.queryParams;
      this.detailsObj = {
        ...driverDetials,
        startTime,
        endTime,
        beginTimeDesc:this.beginTimeDesc
      };
    },
    getList() {
      this.isLoading=true
      let params = JSON.parse(JSON.stringify(this.queryParams));
      params.cityUuid = this.cityList.find(item=>item.label == this.queryParams.cityCode).cityUuid
      params.pageSize = this.pageSize;
      params.currPage = this.current;
      listByPage(params).then((res) => {
        if (res.data.success) {
          let data = res.data.data;
          this.tableData = (data && data.list) || [];
          this.total = data.totalCount || 0;
          this.current = data.currPage !== 0 ? data.currPage : 1;
          this.pageSize = data.pageSize || 10;
          this.isLoading = false;
        }
      });
    },
    handleSelectChange() {},
    search(data) {
      this.current = 1;
      this.searchParams = data;
      this.getList();
    },
    reset() {
      // this.queryParams.weeks = "";
      // this.queryParams.beginTimeDesc = "";
      // this.queryParams.cityCode = "";
      this.queryParams.driverName = "";
      this.queryParams.driverPhone = "";
      this.queryParams.driverUuid = "";
      this.getList();
    },
    exports() {},
    hideAdd() {
      this.hideSet();
    },
    showSet() {
      this.truy("showDetail");
    },
    hideSet() {
      this.falsy("showDetail");
    },
    // 确认新增
    confirm() {
      this.getList();
      this.onAdd = false;
    },
    changePage(val) {
      this.current = val;
      this.getList();
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getList();
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../../../../../general-module/components/search-list/index.css";

.btn-wrap {
  text-align: right;
}
/deep/ .el-input__inner {
  height: 30px;
  line-height: 30px;
}
/deep/.el-input__icon {
  line-height: 30px;
}
</style>
