<!-- 从运营商管理平台迁移而来 -->
<template>
  <div class="message-manager">
    <div class="tabeldata">
      <div class="create-btn">
        <Button type="primary" @click="conditionScreen">新建消息模板</Button>
      </div>
      <VTable
        :total="paramsData.total"
        :current="paramsData.current"
        :pageSize="paramsData.pageSize"
        :isLoading="paramsData.isLoading"
        :parColumns="paramsData.parColumns"
        :parTableData="paramsData.tableDataCom"
        @sort="sort"
        @selectObj="selectObj"
        @changePage="changePage"
        @changePageSize="changePageSize"
        :noColums="false"
      >
      </VTable>
    </div>
    <Modal v-model="add_modal" title="新增消息模板">
      <Form
        :model="add_form"
        label-position="right"
        :label-width="100"
        ref="add_form"
        :rules="ruleValidate"
      >
        <FormItem label="模板标题：" prop="title">
          <Input
            v-model.trim="add_form.title"
            :maxlength="40"
            style="width: 350px"
          ></Input>
        </FormItem>
        <FormItem label="模板内容：" prop="content">
          <Input
            v-model.trim="add_form.content"
            type="textarea"
            :rows="4"
            placeholder="请输入模板内容"
            :maxlength="200"
            style="width: 350px"
          />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="handelSave('add_form')">保存</Button>
        <Button type="default" @click="add_modal = false">取消</Button>
      </div>
    </Modal>
    <Modal v-model="edit_modal" title="消息模板详情">
      <Form
        :model="edit_form"
        label-position="right"
        :label-width="100"
        ref="edit_form"
        :rules="ruleValidate"
      >
        <FormItem label="模板标题：" prop="title">
          <Input
            v-model.trim="edit_form.title"
            :maxlength="40"
            style="width: 350px"
          ></Input>
        </FormItem>
        <FormItem label="模板内容：" prop="content">
          <Input
            v-model.trim="edit_form.content"
            type="textarea"
            :rows="4"
            placeholder="请输入模板内容"
            :maxlength="200"
            style="width: 350px"
          />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button
          type="primary"
          @click="handelUpdate('edit_form', edit_form.uuid)"
          >保存</Button
        >
        <Button type="default" @click="edit_modal = false">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { returnFieldsManage } from "./fields";
import {
  addMesModule,
  getMesModuleList,
  deleteMesModule,
  updateMesModule
} from "_o/api/message-tmp.js";
export default {
  name: "messageCenter",
  components: {},
  data() {
    return {
      add_modal: false,
      edit_modal: false,
      add_form: {
        title: "",
        content: ""
      },
      edit_form: {
        title: "",
        content: ""
      },
      messageTypeList: [
        {
          value: "3",
          label: "全部"
        },
        {
          value: "1",
          label: "发送成功"
        },
        {
          value: "2",
          label: "发送失败"
        }
      ],
      sreenCondition: {
        msgType: "3",
        sendTime: ""
      },
      paramsData: {
        total: 0,
        current: 1,
        pageSize: 20,
        isLoading: true,
        parColumns: [],
        tableDataCom: []
      },
      ruleValidate: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          { type: "string", max: 40, message: "最多40个字符", trigger: "blur" }
        ],
        content: [
          { required: true, message: "请输入内容", trigger: "blur" },
          {
            type: "string",
            max: 200,
            message: "最多200个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    Object.entries(returnFieldsManage(this)).forEach(([key, value]) => {
      this.paramsData.parColumns.push(value);
    });
  },
  mounted() {
    this.getList();
  },
  methods: {
    conditionScreen() {
      this.add_modal = true;
      this.$refs["add_form"].resetFields();
    },
    getTimeFormat(data) {
      this.sreenCondition.sendTime = data;
    },
    sendGroupMessage() {},
    messageModelManage() {},
    sort() {},
    selectObj() {},
    changePage(val) {
      this.paramsData.current = val;
      this.getList();
    },
    changePageSize(val) {
      this.paramsData.pageSize = val;
      this.getList();
    },
    //获取模板列表
    getList() {
      let data = {
        currPage: this.paramsData.current,
        pageSize: this.paramsData.pageSize
      };
      getMesModuleList(data).then(res => {
        if (res.data.success) {
          this.paramsData.total = res.data.data.totalCount;
          this.paramsData.tableDataCom = res.data.data.list;
          this.$store.commit('changeLoadingFlag', false);
        }
      });
    },
    //新增保存
    handelSave(name) {
      this.handleTrim();
      this.$refs[name].validate(valid => {
        if (valid) {
          let data = {
            title: this.$refs["add_form"].model.title,
            value: this.$refs["add_form"].model.content
          };
          addMesModule(data).then(res => {
            if (res.data.success) {
              this.$Message.success("保存成功！");
              this.getList();
              this.add_modal = false;
            } else {
              this.$Message.error(res.data.msg);
            }
          });
        } else {
          this.$Message.warning("请完成表单后添加");
        }
      });
    },
    //去除空格
    handleTrim() {
      let str = JSON.parse(JSON.stringify(this.add_form.title));
      str.trim();
      this.add_form.title = JSON.parse(JSON.stringify(str));
    },
    //更新
    handelUpdate(name, id) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let data = {
            title: this.$refs[name].model.title,
            value: this.$refs[name].model.content,
            uuid: id
          };
          updateMesModule(data).then(res => {
            if (res.data.success) {
              this.$Message.success("保存成功！");
              this.getList();
              this.edit_modal = false;
            } else {
              this.$Message.error(res.data.msg);
            }
          });
        } else {
          this.$Message.warning("请完成表单后添加");
        }
      });
    },
    handleDelete(id) {
      this.$Modal.confirm({
        title: "提示",
        content: "<p>确认要删除该条模板吗</p>",
        onOk: () => {
          let data = { uuid: id };
          deleteMesModule(data).then(res => {
            if (res.data.success) {
              this.$Message.success("删除成功");
              this.getList();
            } else {
              this.$Message.info(res.data.msg);
            }
          });
        },
        onCancel: () => {
          this.$Message.info("已取消");
        }
      });
    }
  }
};
</script>
<style lang="less">
.searchlines {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;
  .timeChoice {
    margin: 0 30px;
  }
}
.slectarea {
  margin-right: 60px;
}
.create-btn {
  margin: 15px 0;
}
</style>
