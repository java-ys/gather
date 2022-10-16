<template>
  <div>
    <SearchList
      ref="searchList"
      :inputList="inputList"
      @on-search="queryData"
      @on-reset="clearQueryData"
      @cascade-change="handleCityChange"
    ></SearchList>
    <div>
      <div class="clearfix">
        <Button
          class="new-add"
          type="primary"
          @click="addSetting"
          v-hasAuth="'open-manage-add'"
        >新建配置</Button>
      </div>
      <m2-table
        class="mt-20"
        :total="total"
        :current="current"
        :pageSize="pageSize"
        :isLoading="isLoading"
        :parColumns="tableColumns"
        :parTableData="tableData"
        @changePage="changePage"
        @changePageSize="changePageSize"
      ></m2-table>
    </div>
    <!-- 新建配置 -->
    <settting :visible="showSet" :modal-data="currentRow" @close="hideSetting"></settting>
    <!-- 操作记录 -->
    <record :visible="onRecord" :modal-data="currentRow" @close="hideRecord"></record>
  </div>
</template>

<script>
import { getProvinceCityList } from "_g/api/common.js";
import { getAgentByCity } from "_g/api/configData";
import { cpTranslate } from "@/libs/tools";
import { inputList, tableTitle } from "./fields.js";
import { tool } from "_o/api/baseMixin.js";
import m2Table from "_a/m2-table/v-table";
import settting from "./setting.vue";
import record from "./record.vue";
import common from "../common";
import { listService, openService, closeService } from "_o/api/coupon-manage";

export default {
  mixins: [tool, common],
  components: {
    m2Table,
    settting,
    record
  },
  provide() {
    return {
      getCityList: () => {
        return this.cascaderList;
      }
    };
  },
  data() {
    return {
      inputList,
      tableColumns: tableTitle(this),
      currentRow: null,
      showSet: false,
      onRecord: false,
      cascaderList: []
    };
  },
  created() {
    this.func = listService;
    this.getList();
  },
  mounted() {
    this.getCityList();
  },
  methods: {
    // 获取省市
    async getCityList() {
      const [err, data] = await this.toResult(getProvinceCityList({}));
      if (err) {
        this.$Message.error(err.message);
        return;
      }
      let list = cpTranslate(data);
      this.cascaderList = list;
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
    handleCityChange(value) {
      const [provinceCode, citycode] = value;
      if (!provinceCode) {
        this.inputList[1].dropList = [];
        return;
      }
      this.getAgentList(citycode);
    },
    addSetting() {
      this.currentRow = {};
      this.truy("showSet");
    },
    hideSetting(refresh) {
      this.falsy("showSet");
      if (refresh) this.getList();
    },
    toEdit(row) {
      this.currentRow = row;
      this.truy("showSet");
    },
    toDetail(row) {
      this.$router.push({
        name: "promote-ticket-detail",
        query: {
          id: row.id,
          agentUuid: row.agentUuid
        }
      });
    },
    toOpenOrClose(row, buttonDesc) {
      this.currentRow = row;
      const tips =
        buttonDesc === "启用"
          ? "确认启用配置，启用后不可编辑。"
          : buttonDesc === "停用"
          ? "是否确认停用配置，停用后不可再次启用，停用后将自动发送短信通知已申请的司机。"
          : "";
      if (!tips) return;
      this.$Modal.confirm({
        title: "提示",
        content: tips,
        onOk: () => {
          const func =
            buttonDesc === "启用"
              ? openService
              : buttonDesc === "停用"
              ? closeService
              : "";
          if (!func) return;
          const { agentUuid, id, status } = row;
          func({ agentUuid, id, status }).then(res => {
            if (res.data.success) {
              this.$Message.success(`${buttonDesc}成功`);
              this.getList();
            } else {
              this.$Message.error(`${buttonDesc}失败`);
            }
          });
        }
      });
    },
    toRecord(row) {
      this.currentRow = row;
      this.showRecord();
    },
    hideRecord() {
      return this.falsy("onRecord");
    },
    showRecord() {
      return this.truy("onRecord");
    }
  }
};
</script>

<style scoped lang="less">
/deep/ .ivu-select-dropdown {
  min-width: 165px;
}
.mt-20 {
  margin-top: 20px;
}
.new-add {
  float: right;
  padding-left: 30px;
  padding-right: 30px;
}
</style>