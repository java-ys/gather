<template>
  <div>
    <Modal v-model="show" width="80%" :title="title" :mask-closable="false" @on-cancel="cancel">
      <Form :model="formData" ref="_form" label-position="top">
        <FormItem label="考试任务名称：">
          <Input
            class="item-style"
            v-model="formData.examTaskName"
            :maxlength="200"
            disabled
            placeholder="请输入考试任务名称"
          />
        </FormItem>
        <FormItem label="主题图：">
          <img :src="formData.pictureUrl" alt class="main-img" />
        </FormItem>
        <FormItem label="发布时间：">
          <DatePicker
            v-model="formData.publishTime"
            type="datetime"
            disabled
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择发布时间"
            class="item-style"
          ></DatePicker>
        </FormItem>
        <FormItem label="及格题数：">
          <Input
            v-model="formData.passNumber"
            class="item-style"
            :maxlength="200"
            disabled
            placeholder="请输入"
          />
        </FormItem>
        <FormItem label="不及格是否影响上线：">
          <div class="mb-20">
            <RadioGroup v-model="formData.onlineStatus">
              <Radio label="1" disabled>是</Radio>
              <Radio label="2" disabled>否</Radio>
            </RadioGroup>
          </div>
        </FormItem>
        <FormItem label="考试对象：">
          <div>
            <RadioGroup v-model="types">
              <Radio label="1" disabled>指定司机</Radio>
              <Radio label="2" disabled>指定运营商</Radio>
            </RadioGroup>
          </div>
        </FormItem>
        <FormItem v-if="isForDriver">
          <Input type="textarea" v-model="formData.person" disabled placeholder="可只输入司机id, 英文逗号隔开" />
        </FormItem>
        <FormItem v-if="isForAgent">
          <Input type="textarea" v-model="formData.agentUuid" disabled placeholder />
        </FormItem>
        <!-- <FormItem v-if="isForAgent">
          <Select v-model="formData.agentUuid" multiple disabled class="agent-select">
            <Option
              v-for="item in agentList"
              :value="item.anentUuid"
              :key="item.agentUuid"
            >{{ item.agentName }}</Option>
          </Select>
        </FormItem>-->
        <FormItem label="试题：">
          <div class="area-style mt-20">
            <m2-table
              ref="selection"
              class="mt-20"
              :total="total"
              :current="current"
              :pageSize="pageSize"
              :isLoading="isLoading"
              :parColumns="tableColumns"
              :parTableData="tableData"
            ></m2-table>
          </div>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="cancel">取消</Button>
        <Button type="primary" v-lazy-click="cancel">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { tool } from "_o/api/baseMixin.js";
import m2Table from "_a/m2-table/v-table";
import s from "_o/api/study-exam";
import common, { getImageUrl } from "../common";
import { selectTitle } from "../fields";

const formParams = {
  examTaskName: "",
  pictureUrl: "",
  pictureUuid: "",
  passNumber: 0,
  onlineStatus: "", // 1 是 2 否
  person: "",
  agentUuid: [],
  topicList: [] // 试题
};
export default {
  props: ["visible", "modalData"],
  components: {
    m2Table
  },
  mixins: [tool, common],
  data() {
    return {
      agentList: [],
      title: "详情",
      show: this.visible,
      types: "1",
      tableColumns: selectTitle(this).slice(1),
      formData: this.deepCopy({}, formParams)
    };
  },
  watch: {
    visible() {
      this.show = this.visible;
      if (this.show) {
        if (this.modalData && this.modalData.id) {
          this.getDetail();
          this.getTaskTopicList();
        }
      } else {
        this.initData();
      }
    }
  },
  computed: {
    isForDriver() {
      return !!this.formData.person;
    },
    isForAgent() {
      return this.formData.agentUuid && this.formData.agentUuid.length;
    }
  },
  methods: {
    async getDetail() {
      const { id } = this.modalData;
      if (!id) return;
      const [err, data] = await this.toResult(s.taskDetail({ id }));
      if (err) {
        return;
      }
      if (data) {
        const {
          examTaskName,
          onlineStatus,
          passNumber,
          publishTime,
          themeFileName,
          themeFileUuid,
          driverNoList,
          agentIdList,
          agentNameList
        } = data;
        this.formData.examTaskName = examTaskName;
        this.fetchImage({ uuid: themeFileUuid });
        this.formData.publishTime = publishTime;
        this.formData.passNumber = passNumber;
        this.formData.onlineStatus = `${onlineStatus}`;
        if (driverNoList && driverNoList.length) {
          this.formData.person = driverNoList.join(",");
          this.types = "1";
        }
        if (agentNameList && agentNameList.length) {
          this.formData.agentUuid = agentNameList.join(",");
          this.types = "2";
        }
      }
    },
    fetchImage(p) {
      getImageUrl({ baseUrl: this._uploadUrl, ...p }, ({ data }) => {
        if (data.success) {
          this.formData.pictureUrl = data.data;
        } else {
          this.$Message.error(data.msg);
        }
      });
    },
    getTaskTopicList() {
      this.func = s.taskQueryExamQuestions;
      this.extraParams.id = this.modalData.id;
      this.getList();
    },
    initData() {
      this.formData = this.deepCopy({}, formParams);
    },
    cancel() {
      this.$emit("close");
    }
  }
};
</script>

<style scoped lang="less">
.agent-select /deep/ .ivu-select-selection {
  height: 120px;
}
.item-style {
  width: 280px;
}
.main-img {
  display: inline-block;
  overflow: hidden;
  width: 527px;
  height: 243px;
}
</style>
