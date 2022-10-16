<template>
  <div>
    <Form
      inline="inline"
      :label-width="85"
    >
      <FormItem label="名称:">
        <Input
          v-model="sendName"
          clearable="clearable"
          style="width:200px"
          :maxlength="50"
        />
      </FormItem>
      <FormItem label="状态:">
        <Select
          v-model="sendStatus"
          clearable
          style="width:150px"
        >
          <Option
            v-for="(value, key) in sendStatusMap"
            :key="key"
            :value="key"
          >
            {{value}}
          </Option>
        </Select>
      </FormItem>
      <FormItem label="人群分类:">
        <Select
          v-model="userType"
          clearable
          style="width:150px"
        >
          <Option
            v-for="(value, key) in personGroupMap"
            :key="key"
            :value="key"
          >
            {{value}}
          </Option>
        </Select>
      </FormItem>
      <FormItem :label-width="0">
        <Button
          type="primary"
          style="margin-right:20px;margin-left:40px"
          @click="search"
        >
          查询
        </Button>
        <Button @click="init">
          重置
        </Button>
      </FormItem>
    </Form>
    <Form
      inline="inline"
      align="right"
      :label-width="85"
    >
      <FormItem :label-width="0">
        <Button
          type="primary"
          style="margin-right:20px;margin-left:40px;width:120px"
          @click="newTask"
        >
          新建
        </Button>
      </FormItem>
    </Form>
    <v-table
      :current="current"
      :total="total"
      :pageSize="pageSize"
      :parColumns="columns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    ></v-table>

    <!-- 沉默逻辑设置弹框 -->
    <Modal
      v-model="isShowSilenceModal"
      title="沉默逻辑设置"
    >
      <Form ref="formValidate" :label-width="185" :model="formSlience">
        <FormItem
          v-for="(item, index) in slienceItem"
          :key="index"
          :label="item.label"
          :prop="item.propName"
          :rules="{ validator: validateNumber, required: true, trigger: 'blur' }"
        >
          <Input
            v-model="formSlience[item.propName]"
            number
            clearable="clearable"
            style="width:200px"
          />&nbsp;&nbsp;{{item.unit}}
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="isShowSilenceModal = false">取消</Button>
        <Button type="primary" size="large" @click="confirmSilence">确定</Button>
      </div>
    </Modal>
    <log
      ref="log"
      @reload="init"
    />
  </div>
</template>

<script>
import { listColumns, slienceItem } from "./fields";
import { getSends, stopUseUrl, silentQuery, silentEdit } from "_o/api/nps/app.js";

import log from "./log";
// import ExportFile from "_a/export-file/exportFile";
// import DetailForm from "./detail";
import { getPersonGroup, getTaskStatusName, personGroupMap, sendStatusMap } from "../fields";

// import silence from "./silence/index";

export default {
  components: {
    log,
    // ExportFile,
    // DetailForm
  },
  data() {
    let { columns } = listColumns;
    const validateNumber = (rule, value, callback) => {
      let reg = /^[0-9]*$/
      let flag = reg.test(value)
      if (!value && value !== 0) {
        callback(new Error("请输入对应的设置"));
      } else if (!flag) {
        callback(new Error("请输入整数"));
      } else {
        callback();
      }
    };
    return {
      sendName: "", // 发送名称
      userType: "", // 人群种类
      sendStatus: "", // 状态
      columns: columns(this),
      tableData: [],
      current: 1,
      total: 0,
      pageSize: 10,
      personGroupMap,
      sendStatusMap,

      isShowSilenceModal: false, // 沉默逻辑设置弹框
      slienceItem,
      formSlience: {},
      validateNumber
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    getPersonGroup,
    getTaskStatusName,

    init() {
      this.sendName = "";
      this.userType = "";
      this.sendStatus = "";
      this.current = 1;
      this.total = 0;
      this.pageSize = 10;
      this.getTableList();
    },
    getTableList() {
      let params = {
        name: this.sendName,
        userType: this.userType,
        queryType : 2,
        onlineState: this.sendStatus,
        currPage: this.current,
        pageSize: this.pageSize
      };
      getSends(params).then(res => {
        let data = res.data.data || {};
        this.tableData = data.list;
        this.total = data.totalCount;
      });
    },
    search() {
      this.current = 1;
      this.getTableList();
    },
    changePage(page) {
      this.current = page;
      this.getTableList();
    },
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.getTableList();
    },
    // 日志
    goLog(val) {
      this.$refs.log.init(val);
    },

    // 新建
    newTask(val) {
      this.$router.push({ name: "fixed-url-ques-add" });
    },

    // 停用
    handleStopUse(row) {
      this.$Modal.confirm({
        title: "停用问卷",
        content: `确认停用${row.configName}？`,
        onOk: () => {
          stopUseUrl({ configId: row.configId }).then(res => {
            if (res.data.success) {
              this.getTableList();
            }
          });
        },
      })
    },

    // 复制
    handleCopy(row) {
      this.$Modal.confirm({
        title: "复制",
        content: `确认复制问卷${row.configName}？`,
        onOk: () => {
          this.$router.push({
            name: "fixed-url-ques-edit",
            query: {
              configId: row.configId,
              copyFlag: true
            }
          })
        },
      })
    },

    // 沉默设置
    confirmSilence() {
      this.isShowSilenceModal = true
      this.$refs["formValidate"].validate((valid) => {
        if (valid) {
          silentEdit(this.formSlience).then(res => {
            // console.log('沉默设置编辑', res)
            if (res.data.success) {
              this.isShowSilenceModal = false
            }
          });
        }
      })
    },
    silenceSetting(val) {
      this.isShowSilenceModal = true
      silentQuery().then(res => {
        // console.log('沉默设置查询', res)
        if (res.data.success) {
          this.formSlience = res.data.data || {}
        }
      });
    },
  }
};
</script>

