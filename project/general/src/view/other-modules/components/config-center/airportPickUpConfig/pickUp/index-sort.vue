<!--
 * @Author: Evil Cheng
 * @Date: 2021-11-22 15:27:31
 * @LastEditTime: 2021-11-23 13:53:10
 * @Description: 接机文案配置
-->
<template>
  <div class="container">
    <div class="add-copywrit">
      <Button type="primary" @click="handleAdd">添加文案</Button>
    </div>
    <div class="fake-table" :loading="loading">
      <div class="fake-item fake-table-header">
        <div class="fake-item-column fake-item-handle">排序</div>
        <div class="fake-item-column fake-item-index">序号</div>
        <div class="fake-item-column fake-item-title">问题</div>
        <div class="fake-item-column fake-item-desc">描述</div>
        <div class="fake-item-column fake-item-control">操作</div>
      </div>
      <draggable
        tag="div"
        :list="tableList"
        class="list-group"
        handle=".handle"
        :sort="sortable"
      >
        <div v-for="(item, index) in tableList" :key="index" class="fake-item">
          <div class="fake-item-column fake-item-handle">
            <Icon class="handle" size="24" type="md-reorder" />
          </div>
          <div class="fake-item-column fake-item-index">序号</div>
          <div class="fake-item-column fake-item-title">{{item.title}}</div>
          <div class="fake-item-column fake-item-desc">
            {{item.description}}
          </div>
          <div class="fake-item-column fake-item-control">
            <Button type="text" style="color:#2b85e4" @click="showDetail(row)">
              编辑
            </Button>
          </div>
        </div>
      </draggable>
    </div>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page
          :total="pageInfo.total"
          :page-size="pageInfo.pageSize"
          :current="pageInfo.currPage"
          @on-change="changePage"
        ></Page>
      </div>
    </div>
    <!-- <Modal v-model="addModel" title="新增定价策略" width="800" footer-hide>
      <div>
        <addForm :cityList="cityList" @close="addModel = false" @update="refreshTable" />
      </div>
    </Modal>
    <Modal v-model="detailModel" title="定价策略详情" width="800" footer-hide @on-visible-change="handleDetailVisible">
      <div>
        <detailForm :uuid="uuid" :cityList="cityList" @close="detailModel = false" />
      </div>
    </Modal> -->
  </div>
</template>

<script>
import draggable from "vuedraggable";
export default {
  components: {
    draggable
  },
  props: {
    active: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      sortable: true, // 是否可排序
      pageInfo: {
        total: 0,
        pageSize: 10,
        currPage: 1
      },
      columns: [
        {
          title: "序号",
          type: "index",
          width: 68,
          align: "center"
        },
        {
          title: "问题",
          width: 208,
          key: "title"
        },
        {
          title: "描述",
          key: "description"
        },
        {
          title: "操作",
          slot: "action",
          width: 150,
          align: "center"
        }
      ],
      tableList: [
        {
          title:
            "接机如何收费接机如何收费接机如何收费接机如何收费接机如何收费接机如何收费接机如何收费接机如何收费？",
          description:
            "接机如何收费？接机如何收费？接机如何收费？接机如何收费？接机如何收费？接机如何收费？接机如何收费？接机如何收费？接机如何收费？接机如何收费？接机如何收费？接机如何收费？接机如何收费？接机如何收费？接机如何收费？接机如何收费？接机如何收费？接机如何收费？接机如何收费？接机如何收费？接机如何收费？接机如何收费？"
        },
        {
          title: "接机如何收费？11111",
          description:
            "接机如何收费？接机如何收费？接机如何收费？接机如何收费？接机如何收费？接机如何收费？"
        },
        {
          title:
            "接机如何收费接机如何收费接机如何222222222",
          description:
            "接机如何收费？接机如何收费？接机如何收费？接机如何收费？接机如何收费？接机如何收费？接机如何收费？接机如何收费？接机如何收费？接机如何收费？接机如何收费？接机如何收费？接机如何收费？接机如何收费？接机如何收费？接机如何收费？接机如何收费？接机如何收费？接机如何收费？接机如何收费？接机如何收费？接机如何收费？"
        },
      ]
    };
  },
  computed: {},
  watch: {
    active: {
      handler: function(val) {
        if (val) {
          this.pageInfo.currPage = 1;
          this.getTableList();
        }
      },
      immediate: true
    }
  },
  methods: {
    // 查询列表
    async getTableList() {
      const { pageSize, currPage } = this.pageInfo;
      const params = {
        pageSize,
        currPage
      };
      this.loading = true;
      try {
        const res = await queryPricingStrategy(params);
        this.loading = false;
        const { data, success } = res.data;
        if (success) {
          const { pageResult } = data; // 垃圾后端多加了一个层级数据
          this.pageInfo.total = pageResult.totalCount;
          this.tableList = pageResult.list;
        }
      } catch (error) {
        this.loading = false;
      }
    },
    handleAdd() {
      this.addModel = true;
    },
    changePage(val) {
      this.pageInfo.currPage = val;
      this.getTableList();
    },
    // 查看
    showDetail(row) {
      this.detailModel = true;
      this.uuid = row.uuid;
    },
    handleDetailVisible(val) {
      if (!val) {
        this.uuid = "";
      }
    }
  }
};
</script>

<style lang="less" scoped>
.add-copywrit {
  margin-bottom: 16px;
}
.fake-table {
  border: 1px solid #e8eaec;
  margin-bottom: 24px;
  .fake-item {
    display: flex;
    align-items: center;
    height: 40px;
    border-bottom: 1px solid #e8eaec;
    &:last-child {
      border-bottom: none;
    }
    &.fake-table-header {
      background-color: #f8f8f9;
    }
    .fake-item-column {
      height: 100%;
      line-height: 40px;
      padding: 0 8px;
      border-right: 1px solid #e8eaec;
      &.fake-item-handle {
        text-align: center;
        width: 58px;
        .handle {
          width: 24px;
          height: 24px;
          line-height: 24px;
          cursor: pointer;
        }
      }
      &.fake-item-index {
        text-align: center;
        width: 58px;
      }
      &.fake-item-title {
        width: 338px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      &.fake-item-desc {
        flex: 1;
        width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      &.fake-item-control {
        text-align: center;
        width: 100px;
      }
    }
  }
}
</style>
