<template>
  <div class="fatigue-manage">
    <SearchList :inputList="inputList" @on-search="search" @on-reset="search" />
    <router-link v-hasAuth="'fatigue-manage-add'" to="create" append>
      <Button type="primary" style="margin-bottom:20px">新增规则</Button>
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
        <Button v-hasAuth="'fatigue-manage-enable'" class="tableBtn" @click="toggleEnable(params.data.row)">{{params.data.row.ruleStatus === 1 ? '停用' : '启用'}}</Button>
        <router-link v-hasAuth="'fatigue-manage-update'" :to="params.data.row.uuid + '?type=edit'" append><Button class="tableBtn" style="margin-right: 0;">修改</Button></router-link>
      </template>
    </m2-table>
  </div>
</template>

<script>
import { queryFatigueRuleList, putFatigueRule } from "_o/api/reach-platform";
import { indexMixin } from "../mixin";
import { REACH_WAY_LIST, TEMPLATE_TYPE_LIST, TARGET_LIST } from "../field"

export default {
  name: "fatigue-manage",
  mixins: [indexMixin],
  data: () => ({
    inputList: [
      {
        name: "drop-input",
        bind_key: "protocol",
        value: "",
        dropList: REACH_WAY_LIST,
        title: "通道类型",
        titleWidth: 60,
      },
      {
        name: "drop-input",
        bind_key: "templateType",
        value: "",
        dropList: TEMPLATE_TYPE_LIST,
        title: "消息类型",
        titleWidth: 60,
      },
      {
        name: "drop-input",
        bind_key: "ruleStatus",
        value: "",
        dropList: [{ label: "启用", value: 1 }, { label: "关闭", value: 2 }],
        title: "状态",
        titleWidth: 60,
      },
      {
        name: "drop-input",
        bind_key: "target",
        value: "",
        dropList: TARGET_LIST,
        title: "发送对象",
        titleWidth: 60,
      },
    ],
    columns: [
      {
        title: "规则名称",
        key: "ruleName",
        minWidth: 120,
      },
      {
        title: "发送对象",
        key: "target",
        minWidth: 120,
        render: (h, params) => h("span", TARGET_LIST.map(v => v.label)[params.row.target])
      },
      {
        title: "通道类型",
        key: "protocol",
        minWidth: 120,
        render: (h, params) => h("span", REACH_WAY_LIST.map(v => v.label)[params.row.protocol])
      },
      {
        title: "消息类型",
        key: "templateType",
        minWidth: 120,
        render: (h, params) => h("span", TEMPLATE_TYPE_LIST.map(v => v.label)[params.row.templateType])
      },
      {
        title: "疲劳度规则",
        key: "fatigueRuleFront",
        ellipsis: true,
        tooltip: true,
        minWidth: 120
      },
      {
        title: "防打扰时段",
        key: "disturbTimeFront",
        ellipsis: true,
        tooltip: true,
        minWidth: 120,
      },
      {
        title: "更新时间",
        key: "updateTime",
        minWidth: 120,
      },
      {
        title: "状态",
        key: "ruleStatus",
        minWidth: 120,
        render: (h, params) => h("span", params.row.ruleStatus === 1 ? "启用" : "关闭")
      },
      {
        title: "操作",
        key: "action",
        fixed: "right",
        width: 170,
        slot: "action"
      }
    ]
  }),
  methods: {
    request: queryFatigueRuleList,
    toggleEnable(data) {
      const text = data.ruleStatus === 1 ? "停用" : "启用"
      this.$Modal.confirm({
        title: `${text}该规则？`,
        onOk: () => putFatigueRule({ uuid: data.uuid, ruleStatus: data.ruleStatus === 1 ? 2 : 1 }).then(() => {
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