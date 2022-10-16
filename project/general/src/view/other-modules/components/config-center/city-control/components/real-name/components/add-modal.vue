<template>
  <div>
    <Modal
      v-model="isShow"
      :width="600"
      :title="modalTitle"
      :mask-closable="false"
      class="add-real-nale"
      @on-cancel="formReset()"
    >
      <Form class="top15" ref="adForm" :model="addData" :rules="ruleValidate" :label-width="90">
        <FormItem label="业务线：" prop="extendBizType">
          <Select
            v-model="addData.extendBizType"
            style="width: 200px"
            placeholder="请选择业务线"
          >
            <Option
              v-for="item in businessGradeList"
              :key="item.value"
              :value="item.value"
            >
              {{item.label}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="终端：" prop="terminal">
          <Select
            v-model="addData.terminal"
            placeholder="请选择终端"
            class="width200"
          >
            <Option
              v-for="item in terminalList"
              :key="item.value"
              :value="item.value"
            >{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="场景：" prop="scene">
          <Select
            v-model="addData.scene"
            placeholder="请选择场景"
            class="width200"
          >
            <Option
              v-for="item in sceneList"
              :key="item.value"
              :value="item.value"
            >{{item.label}}</Option>
          </Select>
        </FormItem>

      </Form>
      <div slot="footer">
        <Button type="primary" @click="addSubmit()">确定</Button>
        <Button type="text" @click="formReset()">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { terminalList,sceneList } from "../fields";
import {
  axiosRealNameSave,
  axiosRealNameUpdate
} from '_g/api/openCity'
import { mapState } from "vuex"
export default {
  name: "add-real-name-modal",
  props: {
    show: {
      type: Boolean
    },
    editInfo: {},
    isNew: {
      default: true
    },
  },
  data() {
    return {
      terminalList,
      sceneList,
      isShow:false,
      detaultAddData: {
        terminal: null,
        scene: null
      },
      addData: {
        ...this.detaultAddData
      },
      ruleValidate: {
        terminal: [
          { required: true, type:'number', message: '请选择终端', trigger: 'change' }
        ],
        scene: [
          { required: true, type:'number', message: '请选择场景', trigger: 'change' }
        ],
        extendBizType: [
          { required: true, type:'number', message: '请选择业务线' }
        ],
      }
    };
  },
  computed: {
    ...mapState({
      businessGradeList: (state) => state.common.businessGradeList
    }),
    // 弹窗标题
    modalTitle() {
      return this.isNew ? '新增' : '编辑'
    },
    paramsInfo(){
      return {
        cityCode: this.$route.query.cityId,
        businessLine: this.$route.query.expandBizLine
      }
    }
  },
  methods: {
    // 获取详情
    getDetail(value) {
      this.addData = {
        terminal: this.editInfo.terminal || null,
        scene: this.editInfo.scene || null,
        uuid: this.editInfo.uuid,
        extendBizType:this.editInfo.extendBizType
      }
    },
    // 新建&编辑-提交
    addSubmit() {
      this.$refs["adForm"].validate(valid => {
        if (valid) {
          let that = this;
          let params = JSON.parse(JSON.stringify(this.addData))
          params = {
            ...params,
            ...this.paramsInfo
          }
          let axiosFun = this.isNew ? axiosRealNameSave : axiosRealNameUpdate
          axiosFun(params).then(res => {
            that.$Message.success(`${this.modalTitle}成功！`);
            that.formReset(true);
          })
        }
      });
    },
    // isReload：是否重新加载列表页面数据
    formReset(isReload) {
      this.$refs["adForm"].resetFields();
      this.$emit("close", isReload);
    }
  },
  watch: {
    show() {
      this.isShow = this.show;
      if (this.isShow) {
        this.$refs["adForm"].resetFields();
        if(this.isNew) this.addData = { ...this.detaultAddData }
        else this.getDetail()
      }
    }
  }
};
</script>