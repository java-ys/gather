<template>
  <div>
    <SearchList :inputList="inputList" @cascade-change="cityChange" @on-search='search' @on-reset="reset"></SearchList>
    <Button type="primary" @click="handleItem(1)" v-hasAuth="'driver-orderFlow-setting-add'">新增规则</Button>
    <div class="mt-10">
      <v-table ref="driverOrderList" :current="tableConfig.current" :total="tableConfig.total" :pageSize="tableConfig.pageSize" :parColumns="tableColumns" :parTableData="tableConfig.tableData" @changePage="tablePageChange" @changePageSize="tablePageSizeChange">
        <template slot-scope="params" slot="action">
          <Button ghost size="small" type="primary" style="margin-right: 15px;" v-hasAuth="'driver-orderFlow-setting-enable'" v-if="params.data.row.confStatus == 0 || params.data.row.confStatus == 2" @click="operation(1, params.data.row)">启用</Button>
          <Button ghost size="small" type="primary" style="margin-right: 15px;" v-hasAuth="'driver-orderFlow-setting-stop'" v-if="params.data.row.confStatus == 1" @click="operation(2, params.data.row)">停用</Button>
          <Button ghost size="small" type="primary" style="margin-right: 15px;" v-hasAuth="'driver-orderFlow-setting-edit'" v-if="params.data.row.confStatus == 0" @click="handleItem(2, params.data.row)">编辑</Button>
          <Button ghost size="small" type="primary" style="margin-right: 15px;" v-hasAuth="'driver-orderFlow-setting-detail'" @click="handleItem(3, params.data.row)">详情</Button>
          <Button ghost size="small" type="primary" style="margin-right: 15px;" v-hasAuth="'driver-orderFlow-setting-del'" v-if="params.data.row.confStatus == 0" @click="operation(3, params.data.row)">删除</Button>
        </template>
      </v-table>
    </div>
    <Modal v-model="openAddModal" :title="title" width="550px" :mask-closable="false" @on-cancel="closeAddModal" footer-hide>
      <add-modal v-if="openAddModal" ref="add" :handleType="handleType" :cityList="cityList" :salaryTypeList="salaryTypeList" :editInfo="editInfo" @close="closeAddModal"></add-modal>
    </Modal>
  </div>
</template>

<script>
import { inputList, tableColumns } from "./fields";
import {
  getDriverOrderList,
  getDicItemByDicCode,
  getAgentByCity,
  orderUpdateStatus,
  driverOrderDel
} from "_o/api/configData";
import { getProvinceCityList } from "_g/api/common.js";
import { cpTranslate } from "@/libs/tools";
import addModal from "./components/add";
import { mapState } from "vuex";

export default {
  name: "cdriver-orderFlow-setting",
  components: { addModal },
  data() {
    return {
      inputList: JSON.parse(JSON.stringify(inputList)),
      tableColumns: tableColumns(this),
      handleType: 1, // 1：新增 2：编辑 3：详情
      title: "",
      openAddModal: false,
      editInfo: {},
      cityList: [],
      agentList: [],
      salaryTypeList: [],
      tableConfig: {
        searchParams: {},
        current: 1,
        total: 0,
        pageSize: 10,
        tableData: []
      }
    };
  },
  computed: {
    ...mapState({
      bizTypeList: state => state.common.bizTypeList,
    }),
  },
  created(){
    this.inputList[3].dropList = this.bizTypeList;
  },
  methods: {
    // 初始省、市级联列表
    getProvinceCityList() {
      getProvinceCityList().then(res => {
        this.cityList = cpTranslate(res.data.data);
        this.inputList[0].cascaderList = this.cityList;
      });
    },
    // 初始司机工资类别
    getDicItemByDicCode() {
      getDicItemByDicCode().then(res => {
        if (res.data.success) {
          this.salaryTypeList = res.data.data || [];
          if (this.salaryTypeList) {
            this.inputList[4].dropList = this.salaryTypeList.map(item => {
              return {
                label: item.itemvalue,
                value: item.itemcode
              };
            });
          }
        }
      });
    },
    // 根据城市code获取运营商
    cityChange(value) {
      this.inputList[1].value = [];
      const [provinceCode, cityCode] = value;
      if (!provinceCode) {
        this.inputList[1].dropList = [];
        return;
      }
      this.getAgentList(cityCode);
    },
    getAgentList(cityCode) {
      if (!cityCode) return;
      getAgentByCity({ cityCode: cityCode }).then(res => {
        this.agentList = res.data.data || [];
        this.inputList[1].dropList = this.agentList.map(item => {
          return {
            label: item.name,
            value: item.uuid
          };
        });
      });
    },
    // 条件搜索
    search(params) {
      this.tableConfig.searchParams = this.deleteEmptyProps(params);
      this.tableConfig.current = 1;
      this.getTableConfigData();
    },
    // type:1-新增 2-编辑 3-详情
    handleItem(type, item) {
      this.handleType = type;
      switch (type) {
        case 1:
          this.title = "新增规则";
          this.editInfo = {};
          break;
        case 2:
          this.title = "编辑规则";
          this.editInfo = item;
          break;
        case 3:
          this.title = "规则详情";
          this.editInfo = item;
          break;
      }
      this.openAddModal = true;
    },
    saveData() {
      this.$refs.add.saveData();
      this.closeAddModal();
    },
    // 0：初始，1：启用，2停用 3:删除
    operation(type, info) {
      const { id, confStatus } = info;
      let msg =
        type == 1 ? "启用" : type == 2 ? "停用" : type == 3 ? "删除" : "";
      this.$Modal.confirm({
        title: msg + "提醒",
        content: "确认" + msg + "此订单流水展示规则吗?",
        onOk: () => {
          switch (type) {
            case 1:
              this.orderUpdate(id, 1);
              break;
            case 2:
              this.orderUpdate(id, 2);
              break;
            case 3:
              this.orderDel(id);
              break;
          }
        },
        onCancel: () => {
          this.$Message.info("已取消");
        }
      });
    },
    orderUpdate(id, confStatus) {
      orderUpdateStatus({ id: id, confStatus: confStatus }).then(res => {
        if (res.data.success) {
          this.$Message.info("操作成功！");
          this.getTableConfigData();
        }
      });
    },
    orderDel(id) {
      driverOrderDel({ id: id }).then(res => {
        if (res.data.success) {
          this.$Message.info("操作成功！");
          this.getTableConfigData();
        }
      });
    },
    setAgent(list) {
      let data = [];
      if (list) {
        this.agentList.forEach(it => {
          list.forEach(ig => {
            if (it.uuid == ig) {
              data.push({ agentName: it.name, agentUuid: it.uuid });
            }
          });
        });
      }
      return data;
    },
    // 删除提交的查询表单空值属性
    deleteEmptyProps(form) {
      for (let paramName in form) {
        if (form.hasOwnProperty(paramName)) {
          if (form[paramName].length <= 0) delete form[paramName];
        }
      }
      return form;
    },
    reset() {
      this.tableConfig.current = 1;
      this.tableConfig.searchParams = {};
      this.inputList[1].dropList = [];
      this.getTableConfigData();
    },
    tablePageChange(page) {
      this.tableConfig.current = page;
      this.getTableConfigData();
    },
    tablePageSizeChange(pageSize) {
      this.tableConfig.pageSize = pageSize;
      this.getTableConfigData();
    },
    // 获取列表数据
    getTableConfigData(params = this.tableConfig.searchParams) {
      let conf = {
        currPage: this.tableConfig.current,
        pageSize: this.tableConfig.pageSize
      };
      params = Object.assign(conf, params);
      getDriverOrderList(params).then(res => {
        let list = res.data.data.list;
        this.tableConfig.tableData = list;
        this.tableConfig.total = res.data.data.totalCount;
      });
      this.$store.commit("changeLoadingFlag", false);
    },
    closeAddModal() {
      this.openAddModal = false;
      this.getTableConfigData();
    }
  },
  mounted() {
    this.getTableConfigData();
    this.getProvinceCityList();
    this.getDicItemByDicCode();
  }
};
</script>

<style lang="less" scoped>
.mt-10 {
  margin-top: 10px;
}
</style>