<template>
  <div>
    <m2-table
      :total="total"
      :current="query.currPage"
      :pageSize="query.pageSize"
      :parColumns="columns"
      :parTableData="list"
      @changePage="changePage"
      @changePageSize="changePageSize"
    >
      <template slot="action" slot-scope="{data: {row}}">
        <Button :type="row.openCircularConfig?'warning':'primary'" @click="onEnable(row)">{{row.openCircularConfig ? '关闭' : '开启'}}</Button>
        <Button style="margin-left: 10px;" @click="onLook(row)">查看配置详情</Button>
      </template>
    </m2-table>
    <ModalWrap v-model="showModal" title="配置详情" foot-hide>
      <Tabs v-if="tabs" v-model="tab">
        <TabPane v-for="v of tabs" :key="v" :name="'tab'+v" :label="'第'+v+'节点'">
          <Table
            :columns="[{ type: 'index', title: '序号' }, { title: '名称', key: 'labelDesignation' }]"
            :data="modalData"
          />
        </TabPane>
      </Tabs>
    </ModalWrap>
  </div>
</template>

<script>
/* eslint-disable no-confusing-arrow,no-return-assign */
import { queryCirculationList, queryNotConfiguredList, patchCirculation } from "_o/api/work-order/work-order-config";
import { listMixin } from "./mixin";
export default {
  name: "Circulation",
  mixins: [listMixin],
  data: () => ({
    tab: '',
    tabs: 0,
    showModal: false,
    columns: [
      {
        title: "一级分类",
        key: "categoryFirstName",
        minWidth: 120
      },
      {
        title: "二级分类",
        key: "categorySecondName",
        minWidth: 120
      },
      {
        title: "三级分类",
        key: "categoryThirdName",
        minWidth: 120
      },
      {
        title: "四级分类",
        key: "categoryFourthName",
        minWidth: 120
      },
      {
        title: "处理人层级",
        key: "seq",
        minWidth: 100
      },
      {
        title: "总处理时长",
        key: "totalProcessTime",
        minWidth: 100
      },
      {
        title: "部门标签",
        key: "labelDesignation",
        minWidth: 120
      },
      {
        title: "往返次数",
        key: "numOfRoundTrips",
        minWidth: 100
      },
      {
        title: "操作",
        key: "action",
        fixed: "right",
        width: 220,
        slot: "action"
      }
    ],
    configs: [],
    selectId: '',
  }),
  computed: {
    modalData() {
      return this.configs.filter(v => v.seq == this.tab.replace('tab', ''))
    }
  },
  watch: {
    showModal(v) {
      if(!v) {
        this.tab = '';
        this.tabs = 0;
      }
    },
    selectId(id) {
      if(!id) return;
      queryNotConfiguredList({ id }).then(res => this.configs = res);
    }
  },
  methods: {
    requestList: queryCirculationList,
    onEnable(row) {
      const flag = row.openCircularConfig ? 0 : 1;
      patchCirculation({ id: row.id, openCircularConfig: flag }).then(() => {
        this.$Message.success("已" + (flag ? "开启" : "关闭"));
        this.updateList();
      }).catch(this.responseError);
    },
    onLook(row) {
      this.tab = 'tab1';
      this.tabs = row.seq;
      this.selectId = row.id;
      this.showModal = true;
    }
  }
};
</script>

<style lang="less" scoped>

</style>