<!--
 * @Author: Evil Cheng
 * @Date: 2021-11-22 15:27:31
 * @LastEditTime: 2021-11-24 14:14:22
 * @Description: 常见问题配置
-->
<template>
  <div class="container">
    <div class="add-copywrit">
      <Button type="primary" @click="handleAdd">新建问题</Button>
    </div>
    <Table border :columns="columns" :data="tableList" :loading="loading">
      <template slot="description" slot-scope="{ row }">
        <div class="html-content" v-html="row.description"></div>
      </template>
      <template slot="action" slot-scope="{ row, index }">
        <Button
          class="action-btn"
          type="text"
          style="color:#2b85e4"
          @click="handleEdit(row)"
        >
          编辑
        </Button>
        <Button
          class="action-btn"
          type="text"
          style="color:#2b85e4"
          @click="handleDelete(row)"
        >
          删除
        </Button>
        <!-- 第一条数据不能上移 -->
        <Button
          v-if="index !== 0"
          class="action-btn"
          type="text"
          style="color:#2b85e4"
          @click="handleMoveUp(row)"
        >
          上移
        </Button>
        <!-- 最后一条数据不能下移 -->
        <Button
          v-if="index !== tableList.length - 1"
          class="action-btn"
          type="text"
          style="color:#2b85e4"
          @click="handleMoveDown(row)"
        >
          下移
        </Button>
      </template>
    </Table>
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
    <Modal
      v-model="addModel"
      title="新增文案"
      width="800"
      footer-hide
      :closable="false"
      :mask-closable="false"
    >
      <div>
        <addForm
          v-if="addModel"
          :type="type"
          @close="addModel = false"
          @update="refreshTable"
        />
      </div>
    </Modal>
    <Modal v-model="editModel" title="编辑问题" width="800" footer-hide @on-visible-change="handleDetailVisible">
      <div>
        <editForm :uuid="uuid" @close="editModel = false" @update="refreshTable" />
      </div>
    </Modal>
  </div>
</template>

<script>
import addForm from "./addForm.vue";
import editForm from "./editForm.vue";
import { queryEquityText, deleteEquityText, sortEquityText } from "_o/api/airportConfig.js";
/**
 * 1 ：接机权益文案配置
 * 2 ：送机权益文案配置
 * 3 ：一口价预定须知
 * 4 ：常见问题配置
 * */
const TYPE = 4
export default {
  components: { addForm, editForm },
  props: {
    active: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      addModel: false,
      editModel: false,
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
          key: "title",
          ellipsis: true
        },
        {
          title: "回答",
          key: "description",
          ellipsis: true,
          slot: "description"
        },
        {
          title: "操作",
          slot: "action",
          width: 200,
          align: "center"
        }
      ],
      tableList: [],
      uuid: "",
      type: TYPE || 4
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
        currPage,
        type: this.type
      };
      this.loading = true;
      try {
        const res = await queryEquityText(params);
        this.loading = false;
        const { data, success } = res.data;
        if (success) {
          this.pageInfo.total = data.totalCount;
          this.tableList = data.list;
        }
      } catch (error) {
        this.loading = false;
      }
    },
    handleAdd() {
      this.addModel = true;
    },
    refreshTable() {
      this.addModel = false;
      this.editModel = false
      this.pageInfo.currPage = 1;
      this.getTableList();
    },
    changePage(val) {
      this.pageInfo.currPage = val;
      this.getTableList();
    },
    // 编辑
    handleEdit(row) {
      this.uuid = row.uuid
      this.editModel = true
    },
    // 删除
    async handleDelete(row) {
      try {
        this.$Spin.show();
        const params = {
          uuid: row.uuid
        }
        const res = await deleteEquityText(params);
        const { data, success } = res.data;
        if (success) {
          this.$Spin.hide();
          this.$Message.success("删除成功");
          this.getTableList()
        }
      } catch (error) {
        this.$Spin.hide();
      }
    },
    // 上移
    handleMoveUp(row) {
      const params = {
        uuid: row.uuid,
        direction: 2  // 1：向下移动  2：向上移动
      }
      this.handleMove(params)
    },
    // 下移
    handleMoveDown(row) {
      const params = {
        uuid: row.uuid,
        direction: 1  // 1：向下移动  2：向上移动
      }
      this.handleMove(params)
    },
    // 处理移动
    async handleMove(params) {
      try {
        this.$Spin.show();
        const res = await sortEquityText(params);
        const { data, success } = res.data;
        if (success) {
          this.$Spin.hide();
          this.$Message.success("移动成功");
          this.getTableList()
        }
      } catch (error) {
        this.$Spin.hide();
      }
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
.action-btn {
  padding: 5px;
}
.html-content {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
