<template>
  <div>
    <div class="compensate-list">
      <search-list
        :inputList="inputList"
        @on-search="search"
        @on-reset="reset"
        @cascade-change="handleCityChange"
      ></search-list>
    </div>
    <div>
      <div class="in">
        <ExportFile
          :exportUrl="exportUrl"
          exportFileName="补偿数据.xlsx"
          :queryData="searchParams"
          baseUrlKey="_baseUrl4Driver"
        ></ExportFile>
      </div>
      <m2-table
        :total="total"
        :current="currPage"
        :pageSize="pageSize"
        :parColumns="columns"
        :parTableData="tableData"
        :isLoading="isLoading"
        :pageSizeOpts="pageSizeOpts"
        @changePage="changePage"
        @changePageSize="changePageSize"
      ></m2-table>

      <Modal v-model="detailModalShow" width="50%" :title="modalTitle" :mask-closable="false">
        <!-- <detail :detailObj="detailObj"></detail> -->
        <cancel
          :detailObj="detailObj"
          :isDetailOrCancel="isDetailOrCancel"
          v-if="isShowCancel"
        ></cancel>
        <div slot="footer">
          <Button type="primary" @click="detailModalShow = false" v-if="modalTitle === '时长补偿详情'">返回</Button>
          <!-- <Button type="primary" @click="compensateBtn" v-if="btnFlag">补偿取消</Button> -->
          <!-- <Button type="default" @click="detailModalShow = false" v-if="btnFlag">返回</Button> -->
        </div>
      </Modal>

      <!-- <Modal
        v-model="cancelModalShow"
        width="50%"
        title="时长补偿取消"
        :mask-closable="false"
        ok-text="补偿取消"
        cancel-text="返回"
        @on-ok="compensatebtn"
      >
        <cancel :detailObj="detailObj"></cancel>
      </Modal>-->
    </div>
  </div>
</template>

<script>
import { getProvinceCityList, getCityOperatorTree } from "_g/api/common.js";
import { getAgentByCity } from "_g/api/configData";
import m2Table from "_a/m2-table/v-table.vue";
import cancel from "./cancel.vue";
import ExportFile from "_a/export-file/exportFile";
import { compensateList, pageData } from "./index.js";
import { deepClone } from "./utils.js";
import { cpTranslate } from "@/libs/tools";
import {
  queryConfigType,
  getRecoupPage,
  queryDetail,
  cancelCompensate
} from "_o/api/compensate.js";
import { tool } from "_o/api/baseMixin.js";
import { logList } from "_o/api/rest.js"; // 日志请求
import { timeFormat } from "@/libs/util.js";
export default {
  components: {
    ExportFile,
    m2Table,
    cancel
  },
  mixins: [tool],
  data() {
    const { inputList, columns } = deepClone({}, compensateList);
    return {
      ...pageData,
      inputList,
      exportUrl: "/api/approve/info/compensate/export",
      columns: columns(this),
      detailModalShow: false,
      cancelModalShow: false,
      detailObj: {},
      searchParams: {},
      modalTitle: "",
      btnFlag: false,
      cityCode: "", // 当前城市code
      provinceCode: "",
      isLoading: true,
      isDetailOrCancel: 0, // 1 为详情页面 2 为取消页面
      remarkMsgFromSon: "",
      isShowCancel: false
    };
  },
  created() {
    this.getList();
    // 拿到子组件的remark数据
    this.busEvents.$on("sendRemarkMsg", val => {
      this.remarkMsgFromSon = val;
    });
  },
  mounted() {
    this.getCityList();
    this.getConfigType();
    this.$store.commit("changeLoadingFlag", false);
    this.isLoading = true;
  },
  methods: {
    // 补偿列表的获取
    async getList() {
      let params = {
        currPage: this.currPage,
        pageSize: this.pageSize,
        ...this.searchParams
      };
      this.isLoading = true;
      const [err, data] = await this.toResult(getRecoupPage(params));
      this.isLoading = false;
      if (err) return;
      if (data) {
        const { list, totalCount } = data;
        this.tableData = list;
        this.total = totalCount;
      }
    },
    // 获取省市
    async getCityList() {
      const [err, data] = await this.toResult(getProvinceCityList({}));
      if (err) {
        this.$Message.error(err.message);
        return;
      }
      let list = cpTranslate(data);
      this.inputList[0].cascaderList = list;
    },
    // 根据城市code 获取运营商列表
    async getAgentList(cityCode) {
      if (!cityCode) return;
      let [err, data] = await this.toResult(
        getAgentByCity({ cityCode: cityCode })
      );
      if (err || !data) return;
      let list = data;
      this.inputList[1].dropList = list.map(item => {
        return {
          label: item.name,
          value: item.uuid
        };
      });
    },
    // 停运类型
    async getConfigType() {
      const [err, data] = await this.toResult(queryConfigType({}));
      if (err || !data) return;

      const fd = this.inputList.find(it => it._uuid === "halt");
      if (fd) {
        fd.cascaderList = this.setValueAndLabel(data);
      }
    },
    changePage(page) {
      this.currPage = page;
      this.getList();
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getList();
    },
    // 补偿取消确认按钮
    // async compensateBtn() {
    //   // 取消补偿，取消补偿后，司机考勤重新计算，涉及薪酬部分再下一周期扣减
    //   console.log("补偿取消", this.remarkMsgFromSon);
    //   let params = {
    //     approveStatus: 3,
    //     id: this.detailObj.id,
    //     remark: this.remarkMsgFromSon
    //   };
    //   let { err, data } = await this.toResult(cancelCompensate({ params }));
    //   if (err) return;
    //   if (data) {
    //     console.log(data, "取消补偿返回的数据");
    //   }
    //   this.isShowCancel = false;
    //   this.detailModalShow = false;
    // },
    search(p) {
      if (p.applyTimeEnd) {
        p.applyTimeEnd = timeFormat(p.applyTimeEnd, "yyyy-mm-dd");
        p.applyTimeStart = timeFormat(p.applyTimeStart, "yyyy-mm-dd");
      }
      if (p.driverMobileList && !p.driverMobileList.length) delete p.driverMobileList
      if (p.driverUuidList && !p.driverUuidList.length) delete p.driverUuidList
      if (p.vinList && !p.vinList.length) delete p.vinList
      if (!p.type1) delete p.type1;
      this.searchParams = p;
      this.getList();
    },
    reset() {
      this.searchParams = {};
      this.currPage = 1;
      this.pageSize = 10;
      this.getList();
    },
    handleCityChange(value) {
      const [provinceCode, citycode] = value;
      if (!provinceCode) return;
      this.getAgentList(citycode);
    },
    setValueAndLabel(list) {
      if (!Array.isArray(list)) return [];
      return list.map(it => {
        it.value = it.id;
        it.label = it.categoryName;
        if (it.childList) {
          it.children = it.childList.map(im => ({
            label: im.categoryName,
            value: im.id
          }));
        }
        return it;
      });
    },
    // 详情按钮触发事件
    viewDetail(val) {
      this.modalTitle = "时长补偿详情";
      this.btnFlag = false;
      this.isShowCancel = true;
      this.handleDetailCancelPage(val);
      this.isDetailOrCancel = 1;
    }, // 取消按钮触发事件
    viewCancel(val) {
      this.modalTitle = "时长补偿取消";
      this.isShowCancel = true;
      this.btnFlag = true;
      this.handleDetailCancelPage(val);
      this.isDetailOrCancel = 2;
    },
    async handleDetailCancelPage(val) {
      this.detailObj.videoList = [];
      this.detailObj.imageList = [];
      let { id } = val;
      const [err, data] = await this.toResult(queryDetail({ applyId: id }));
      if (err) return;
      if (data) {
        this.detailObj = data;
      }
    }
  }
};
</script>

<style lang="less">
.in {
  margin: 10px;
}
.ml-10 {
  margin-left: 10px;
}
</style>
