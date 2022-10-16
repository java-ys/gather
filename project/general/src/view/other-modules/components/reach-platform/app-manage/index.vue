<template>
  <div class="app-manage">
    <SearchList :inputList="inputList" @on-search="search" @on-reset="search" />
    <router-link v-hasAuth="'app-manage-add'" to="create" append>
      <Button type="primary" style="margin-bottom:20px">新增应用</Button>
    </router-link>
    <m2-table
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :parColumns="columns"
      :parTableData="list"
      @changePage="changePage"
      @changePageSize="changePageSize"
    >
      <template slot="action" slot-scope="params">
        <Button v-hasAuth="'app-manage-copy'" class="tableBtn" @click="copy(params.data.row.secretKey)">复制密钥</Button>
        <Button v-hasAuth="'app-manage-enable'" class="tableBtn" style="margin-right:0" @click="onChangeStatus(params.data.row)">修改状态</Button>
      </template>
    </m2-table>
  </div>
</template>

<script>
import { queryAppList, patchApp } from "_o/api/reach-platform";
import { indexMixin } from "../mixin";

export default {
  name: "app-manage",
  mixins: [indexMixin],
  data: () => ({
    inputList: [
      {
        name: "text-input",
        bind_key: "appName",
        value: "",
        title: "应用名称",
        titleWidth: 60,
      },
      {
        name: "drop-input",
        bind_key: "appStatus",
        value: "",
        dropList: [{ label: "启用", value: 1 }, { label: "关闭", value: 2 }],
        title: "应用状态",
        titleWidth: 60,
      },
    ],
    columns: [
      {
        title: "应用名称",
        key: "appName",
        minWidth: 120
      },
      {
        title: "应用编码",
        key: "appCode",
        minWidth: 120
      },
      {
        title: "应用密钥",
        key: "secretKey",
        tooltip: true,
        ellipsis: true,
        minWidth: 120,
      },
      {
        title: "应用简介",
        key: "appDesc",
        ellipsis: true,
        tooltip: true,
        minWidth: 120
      },
      {
        title: "应用状态",
        key: "appStatus",
        minWidth: 120,
        render: (h, params) => h("span", params.row.appStatus === 1 ? "启用" : "关闭")
      },
      {
        title: "操作",
        key: "action",
        fixed: "right",
        width: 218,
        slot: "action"
      }
    ]
  }),
  methods: {
    request: queryAppList,
    copy(value) {
      const el = document.createElement("input");
      el.value = value;
      el.style.cssText = "position: fixed;opacity: 0;"
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      this.$Message.success("已复制至剪贴板");
      el.remove();
    },
    onChangeStatus(item) {
      const status = item.appStatus === 1 ? 2 : 1;
      this.$Modal.confirm({
        title: "是否确认修改该应用状态？",
        onOk: () => patchApp({ uuid: item.uuid, appStatus: status}).then(() => {
          this.$Message.success("已修改");
          item.appStatus = status;
        }).catch(err => this.$Message.error(err.msg)),
      })
    }
  }
};
</script>

<style lang="less" scoped>

</style>