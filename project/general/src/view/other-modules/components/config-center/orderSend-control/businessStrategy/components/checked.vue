<template>
  <Modal
    v-model="showModal"
    title="司机群选择"
    width="960px"
  >
    <Form
      inline="inline"
      :label-width="84"
    >
      <FormItem label="司机群名称：">
        <Input
          v-model="crowdName"
          clearable
          placeholder="请输入名称"
          :maxlength="100"
          style="width: 120px; display: inline-block"
        ></Input>
      </FormItem>
      <FormItem label="司机群编码：">
        <Input
          v-model="crowdCode"
          clearable
          placeholder="请输入编码"
          :maxlength="100"
          trigger="hover"
          style="width: 120px; display: inline-block"
        ></Input>
      </FormItem>
      <FormItem
        label="创建人："
        prop="city"
      >
        <Input
          v-model="createBy"
          clearable
          placeholder="请输入创建人"
          style="width: 120px; display: inline-block"
        ></Input>
      </FormItem>
      <FormItem :label-width="0">
        <Button
          type="primary"
          style="margin-right: 20px; margin-left: 40px"
          @click="search"
        >
          搜索
        </Button>
        <Button @click="clear">
          清空
        </Button>
      </FormItem>
    </Form>
    <v-table
      :current="current"
      :total="total"
      :pageSize="pageSize"
      :parColumns="columns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
      @selectHandle="changeSelected"
    ></v-table>
    <div slot="footer">
      <Button @click="showModal = false">取消</Button>
      <Button v-lazy-click="save" type="primary">保存</Button>
    </div>
  </Modal>
</template>

<script>
import {
  queryCrowdList
} from "_o/api/operationAdmin.js";
import { getCrowStateName } from "../fields.js"
import { filterBlankProperty } from "@/libs/tools";

export default {
  data() {
    return {
      showModal: false,
      tableData: [],
      selectedData: [],
      hasSelectedNos: [], // 外面已经选中的
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "司机群名称",
          key: "groupName",
          tooltip: true,
          minWidth: 140,
        },
        {
          title: "司机群编码",
          key: "groupNo",
          tooltip: true,
          minWidth: 220,
        },
        {
          title: "状态",
          key: "crowdState",
          minWidth: 100,
          tooltip: true,
          render: (h, params) => {
            return h("span", {}, getCrowStateName(params.row.crowdState))
          }
        },
        {
          title: "是否动态更新",
          key: "effectiveTime",
          tooltip: true,
          width: 80,
          render: (h, params) => {
            return h("div", params.row.isDynamic === 1 ? "是" : "否")
          }
        },
        {
          title: "司机群人数",
          key: "groupUserNum",
          tooltip: true,
          width: 120,
        },
        {
          title: "创建人",
          key: "createBy",
          tooltip: true,
          width: 90,
        },
        {
          title: "更新时间",
          key: "updateTime",
          width: 160,
          tooltip: true,
          render: (h, params) => {
            return h("div", this.$moment(params.row.createTime).format("YYYY-MM-DD HH:mm:ss"))
          }
        }],
      crowdName: "",
      crowdCode: "",
      createBy: "",
      current: 1,
      pageSize: 10,
      total: 0,
      index: 0
    }
  },
  methods: {
    init(groupsNo, index) {
      this.index = index;
      this.showModal = true;
      this.tableData = [];
      this.hasSelectedNo = groupsNo || [];
      // this._cityUuid = cityUuid
      this.getTableList();
    },
    clear() {
      this.crowdName = "";
      this.crowdCode = ""
      this.createBy = "";
      this.current = 1;
      this.total = 0;
      this.pageSize = 10;
      this.getTableList();
    },
    getTableList() {
      this.$store.commit("changeLoadingFlag", true);
      let params = {
        currPage: this.current,
        pageSize: this.pageSize,
        crowdType: 2,
        crowdName: this.crowdName,
        crowdCode: this.crowdCode,
        createBy: this.createBy
        // cityCode: this._cityUuid
      };
      this.selectedData = [];
      queryCrowdList(filterBlankProperty(params))
        .then(res => {
          const hasSelectedNo = this.hasSelectedNo;
          let data = res.data.data || {};
          this.tableData = data.list.map(item => {
            // 选中的不可选
            if (hasSelectedNo.includes(item.groupNo)) {
              item._disabled = true;
            }
            let { groupNo, groupName, groupUserNum } = item;
            item.crowdCode = groupNo,
            item.crowdName = groupName,
            item.userNum = groupUserNum
            return item;
          });
          this.total = data.totalCount;
          this.$store.commit("changeLoadingFlag", false);
        })
        .catch((error) => {
          this.$store.commit("changeLoadingFlag", false);
          this.tableData = [];
          this.total = 0;
        });
    },
    search() {
      this.current = 1;
      this.getTableList();
    },
    changePage(page) {
      this.current = page;
      this.getTableList();
    },
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.getTableList();
    },
    changeSelected(selectedData) {
      this.selectedData = selectedData;

    },

    save() {
      const { selectedData, index } = this;
      const data = {
        selectedData,
        index
      }
      this.$emit("updateDriverGroup", data);
      this.showModal = false;
    }
  }
}
</script>
