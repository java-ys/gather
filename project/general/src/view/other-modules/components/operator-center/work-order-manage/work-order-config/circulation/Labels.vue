<template>
  <div>
    <Button type="primary" style="margin-bottom: 20px;" @click="showModal = true">新增</Button>
    <m2-table
      :total="total"
      :current="query.currPage"
      :pageSize="query.pageSize"
      :parColumns="columns"
      :parTableData="list"
      @changePage="changePage"
      @changePageSize="changePageSize"
    >
        <!-- id <= 4 为预置标签，不可编辑删除 -->
      <template slot="action" slot-scope="{data: {row}}">
        <span v-if="row.isPreset" style="color: #999;">预置标签，不可操作</span>
        <template v-else>
          <Button type="primary" @click="onEdit(row)">编辑</Button>
          <Button type="error" style="margin-left: 10px;" @click="onDelete(row)">删除</Button>
        </template>
      </template>
    </m2-table>
    <ModalWrap v-model="showModal" :title="info.id?'编辑':'新增'" loading @on-ok="onSubmit" @on-cancel="showModal = false">
      <Form ref="form" :model="info" :rules="rules">
        <FormItem label="部门标签名称：" prop="designation">
          <Input v-model="info.designation" />
        </FormItem>
        <FormItem label="部门标签描述：" prop="detail">
          <Input v-model="info.detail" type="textarea" />
        </FormItem>
      </Form>
    </ModalWrap>
  </div>
</template>

<script>
import { queryLabelList, deleteLabel, postLabel, putLabel } from "_o/api/work-order/work-order-config";
import { listMixin } from "./mixin";
export default {
  name: "Labels",
  mixins: [listMixin],
  data: () => ({
    showModal: false,
    columns: [
      {
        title: "部门名称",
        key: "designation",
        minWidth: 120
      },
      {
        title: "部门描述",
        key: "detail",
        minWidth: 120
      },
      {
        title: "操作",
        key: "action",
        fixed: "right",
        width: 180,
        slot: "action"
      }
    ],
    info: {
      designation: "",
      detail: "",
    },
    rules: {
      designation: { required: true, message: "请填写名称", trigger: "blur" },
      detail: { required: true, message: "请填写描述", trigger: "blur" },
    },
    query: {
      isDel: 0
    }
  }),
  watch: {
    showModal(v) {
      if(!v) this.info = {};
    }
  },
  methods: {
    requestList: queryLabelList,
    onEdit(row) {
      this.info = { ...row };
      this.showModal = true;
    },
    onDelete(row) {
      this.$Modal.confirm({
        title: '确定删除？',
        onOk: () => deleteLabel({ id: row.id }).then(() => {
          this.$Message.success("已删除");
          this.updateList();
        }).catch(this.responseError),
      });
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        (this.info.id ? putLabel : postLabel)(this.info).then(() => {
          this.$Message.success("已提交");
          this.showModal = false;
          this.updateList();
        }).catch(this.responseError);
      })
    }
  }
};
</script>

<style lang="less" scoped>

</style>