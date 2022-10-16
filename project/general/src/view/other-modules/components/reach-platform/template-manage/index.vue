<template>
  <div class="template-manage">
    <SearchList ref="searches" :inputList="inputList" @on-search="search" @on-reset="search" />
    <router-link v-if="!fromOther" v-hasAuth="'template-manage-add'" to="create" append>
      <Button type="primary" style="margin-bottom:20px">新建模板</Button>
      <!-- @click="e => fromOther ? (e.preventDefault(),$emit('create')) : null" -->
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
        <Button v-if="params.data.row.tempStatus < 3 && !fromOther" v-hasAuth="'template-manage-enable'" class="tableBtn" @click="toggleEnable(params.data.row)">{{params.data.row.tempStatus === 1 ? '停用' : '启用'}}</Button>
        <router-link v-if="!fromOther" v-hasAuth="'template-manage-update'" :to="params.data.row.uuid + '?type=edit'" append>
          <Button class="tableBtn">修改</Button>
          <!-- @click="e => fromOther ? (e.preventDefault(),$emit('edit', params.data.row.uuid)) : null" -->
        </router-link>
        <router-link v-if="!fromOther" v-hasAuth="'template-manage-detail'" :to="params.data.row.uuid" append><Button class="tableBtn" style="margin-right: 0;">详情</Button></router-link>
        <Button v-else-if="params.data.row.tempStatus === 1" class="tableBtn" style="margin-right: 0;" @click="$emit('use', params.data.row)">使用</Button>
      </template>
    </m2-table>
  </div>
</template>

<script>
import { queryTemplateList, queryAppList, patchTemplate } from "_o/api/reach-platform";
import { indexMixin } from "../mixin";
import { REACH_WAY_LIST, TEMPLATE_TYPE_LIST, TEMPLATE_STATUS_LIST } from "../field";
import { throttle } from "../util";

export default {
  name: "template-manage",
  mixins: [indexMixin],
  props: {
    appCode: String,
    fromOther: Boolean, // 是否来自其他方组件引用，是则删减部分功能
  },
  data: () => ({
    searchData: { tempStatus: 1 },
    inputList: [
      {
        name: "drop-input",
        bind_key: "appCode",
        value: "",
        dropList: [],
        title: "应用名称",
        titleWidth: 60,
        ref: "app"
      },
      {
        name: "text-input",
        bind_key: "templateCode",
        value: "",
        title: "模板编码",
        titleWidth: 60,
      },
      {
        name: "drop-input",
        bind_key: "templateType",
        value: "",
        dropList: TEMPLATE_TYPE_LIST,
        title: "模板类型",
        titleWidth: 60,
      },
      {
        name: "drop-input",
        bind_key: "tempStatus",
        value: 1,
        dropList: TEMPLATE_STATUS_LIST,
        title: "模板状态",
        titleWidth: 60,
      },
      {
        name: "drop-input",
        bind_key: "protocol",
        value: "",
        dropList: REACH_WAY_LIST,
        title: "触达方式",
        titleWidth: 60,
      },
      {
        name: "text-input",
        bind_key: "templateName",
        value: "",
        title: "模板名称",
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
        title: "触达方式",
        key: "protocol",
        minWidth: 80,
        render: (h, params) => h("span", REACH_WAY_LIST.map(v => v.label)[params.row.protocol])
      },
      {
        title: "模板类型",
        key: "templateType",
        minWidth: 80,
        render: (h, params) => h("span", TEMPLATE_TYPE_LIST.map(v => v.label)[params.row.templateType])
      },
      {
        title: "业务场景",
        key: "secneName",
        ellipsis: true,
        minWidth: 80
      },
      {
        title: "模板编码",
        key: "templateCode",
        ellipsis: true,
        tooltip: true,
        minWidth: 80,
      },
      {
        title: "模板名称",
        key: "templateName",
        ellipsis: true,
        tooltip: true,
        minWidth: 120,
      },
      {
        title: "模板内容",
        key: "content",
        minWidth: 170,
        render: (h, params) => h("tooltip", {
          scopedSlots: {
            content: () => h("span", { style: "white-space: normal" }, params.row.content)
          }
        }, [h("div", {style: "display: -webkit-box; overflow: hidden; -webkit-line-clamp: 2; -webkit-box-orient: vertical;"}, params.row.content)])
      },
      {
        title: "更新时间",
        key: "updateTime",
        minWidth: 150,
      },
      {
        title: "模板状态",
        key: "tempStatus",
        minWidth: 80,
        render: (h, params) => h("span", ["有效", "无效", "待审批", "审批不通过", "删除"][params.row.tempStatus - 1])
      },
      {
        title: "创建人",
        key: "creatorName",
        minWidth: 120,
        ellipsis: true,
        tooltip: true,
      },
      {
        title: "操作",
        key: "action",
        fixed: "right",
        width: 245,
        slot: "action"
      }
    ],
  }),
  mounted() {
    if (this.fromOther) {
      this.columns[this.columns.length - 1].width = 100;
      this.inputList = [this.inputList.find(v => v.bind_key === "templateName"), this.inputList.find(v => v.bind_key === "tempStatus")];
    } else {
      this.updateAppList();
      this.$refs.searches.$refs.app[0].$refs.dropdown.$el.addEventListener("scroll", e => {
        const scroller = e.target;
        const el = scroller.querySelector(".ivu-select-item:last-child");
        if (scroller.scrollTop + scroller.offsetHeight >= el.offsetTop) this.updateAppList();
      })
    }
  },
  methods: {
    request(params) {
      if (this.fromOther) params.appCode = this.appCode;
      return queryTemplateList(params);
    },
    updateAppList: throttle(function() {
      const item = this.inputList.find(v => v.bind_key === "appCode");
      const appList = item.dropList;
      if (appList.length % 20) return;
      queryAppList({ currPage: 1 + (appList.length / 20 | 0), pageSize: 20 }).then(res => {
        item.dropList = appList.concat(res.list.map(v => ({ label: v.appName, value: v.appCode })));
      })
    }),
    toggleEnable(data) {
      const text = data.tempStatus === 1 ? "停用" : "启用"
      this.$Modal.confirm({
        title: `${text}该模板？`,
        onOk: () => patchTemplate({ uuid: data.uuid, tempStatus: data.tempStatus === 1 ? 2 : 1, templateCode: data.templateCode }).then(() => {
          this.$Message.success("已" + text);
          this.updateList();
        }).catch(err => this.$Message.error(err.msg)),
      })
    }
  }
};
</script>

<style lang="less" scoped>

</style>