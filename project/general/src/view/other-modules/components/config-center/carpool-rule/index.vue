<!--
 * @Author: Evil Cheng
 * @Date: 2021-11-22 15:27:31
 * @LastEditTime: 2022-03-17 17:37:41
 * @Description: 接机文案配置
-->
<template>
  <div class="container">
    <div class="add-copywrit">
      <Button type="primary" @click="handleAdd">添加文案</Button>
    </div>
    <Table border :columns="columns" :data="tableList" :loading="loading">
      <template slot="rule" slot-scope="{ row }">
        <div class="html-content" v-html="row.rule"></div>
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
        <!-- 第一页第一条数据不能上移 -->
        <Button
          v-if="showUp(index)"
          class="action-btn"
          type="text"
          style="color:#2b85e4"
          @click="handleMoveUp(row)"
        >
          上移
        </Button>
        <!-- 最后一页最后一条数据不能下移 -->
        <Button
          v-if="showDown(index)"
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
          :count="pageInfo.total"
          @close="addModel = false"
          @update="refreshTable"
        />
      </div>
    </Modal>
    <Modal v-model="editModel" title="编辑文案" width="800" footer-hide @on-visible-change="handleDetailVisible">
      <div>
        <editForm v-if="editModel" :id="id" :count="pageInfo.total" @close="editModel = false" @update="refreshTable" />
      </div>
    </Modal>
  </div>
</template>

<script>
import addForm from "./addForm.vue";
import editForm from "./editForm.vue";
import { queryRuleList, deleteRule, moveRuleDown, moveRuleUp } from "_o/api/vehicleRule.js";
const TYPE = 3
export default {
  components: { addForm, editForm },
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
          title: "标题",
          width: 208,
          key: "title",
          ellipsis: true
        },
        {
          title: "描述",
          key: "rule",
          ellipsis: true,
          slot: "rule"
        },
        {
          title: "操作",
          slot: "action",
          width: 200,
          align: "center"
        }
      ],
      tableList: [
      ],
      id: ""
    };
  },
  computed: {},
  mounted() {
    this.getTableList()
  },
  methods: {
    // 查询列表
    async getTableList() {
      const { pageSize, currPage } = this.pageInfo;
      const params = {
        pageSize,
        currPage,
        qaType: TYPE
      };
      this.loading = true;
      try {
        const res = await queryRuleList(params);
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
      this.id = row.id
      this.editModel = true
    },
    // 删除
    async handleDelete(row) {
      try {
        this.$Spin.show();
        const params = {
          id: row.id
        }
        const res = await deleteRule(params);
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
    async handleMoveUp(row) {
      const params = {
        id: row.id,
      }
      try {
        this.$Spin.show();
        const res = await moveRuleUp(params);
        const { msg, success } = res.data;
        if (success) {
          this.$Spin.hide();
          this.$Message.success("移动成功");
          this.getTableList()
        } else {
          this.$Spin.hide();
          this.$Message.error(msg)
        }
      } catch (error) {
        this.$Spin.hide();
      }
    },
    // 下移
    async handleMoveDown(row) {
      const params = {
        id: row.id,
      }
      try {
        this.$Spin.show();
        const res = await moveRuleDown(params);
        const { msg, success } = res.data;
        if (success) {
          this.$Spin.hide();
          this.$Message.success("移动成功");
          this.getTableList()
        } else {
          this.$Spin.hide();
          this.$Message.error(msg)
        }
      } catch (error) {
        this.$Spin.hide();
      }
    },
    handleDetailVisible(val) {
      if (!val) {
        this.id = "";
      }
    },
    showUp(index) {
      return !(index === 0 && this.pageInfo.currPage === 1)
    },
    showDown(index) {
      return this.pageInfo.pageSize * (this.pageInfo.currPage - 1) + index + 1 !== this.pageInfo.total
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
