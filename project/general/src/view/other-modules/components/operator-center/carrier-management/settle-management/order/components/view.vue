<template>
  <div>
    <Modal
      v-model="visible"
      :title="title"
      width="700"
      :mask-closable="false"
      :closable="false"
    >
      <Form
        ref="_form"
        :model="addForm"
        :label-width="150"
      >
        <Row>
          <FormItem label="指标名称：" prop="indexUuid">
            <span>{{addForm.indexName}}</span>
          </FormItem>
        </Row>
        <Row>
          <FormItem label="指标说明：" prop="remark">
            <span>{{addForm.remark}}</span>
          </FormItem>
        </Row>
        <Row>
          <FormItem label="考核月份：" prop="assessTime">
            <span>{{addForm.assessTime}}</span>
          </FormItem>
        </Row>
        <Row>
          <FormItem label="实际达成：" prop="assessScore">
            <span>{{addForm.actualAchievement}}</span>
          </FormItem>
        </Row>
        <Row>
          <FormItem label="考核得分说明：" prop="indexRemark">
            <Input
              v-model="addForm.indexRemark"
              type="textarea"
              :rows="4"
              :maxlength="2000"
              class="textarea-con"
              placeholder="请输入"
              disabled
            />
          </FormItem>
        </Row>
        <p>该考核指标中的明细项目</p>
        <Row>
          <Col v-for="(item,index) in addForm.assessDetail" :key="index" span="12">
            <FormItem :label="item.label" prop="asses">
              <span>{{item.value}}</span>
            </FormItem>
          </Col>

        </Row>
      </Form>
      <div slot="footer">
        <Button type="primary" ghost @click="cancel">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { tool } from "_o/api/baseMixin.js";
import ModalMixin from "@/mixins/modal"
export default {
  name: "custom-add",
  mixins: [tool, ModalMixin],
  data() {
    return {
      title: "查看考核指标得分说明",
      addForm: {
        cityCodeList: [],
        agentUuid: [],
        businessType: [],
        indexUuid: "",
        assessTime: "", // 考核月份
        operateType: [], // 运营模式
        assessScore: "",
        remark: ""
      },
      allowChange: false,
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      let assessDetail = [];
      (this.detail.indexDetail ? JSON.parse(this.detail.indexDetail) : []).map(v => {
        Object.keys(v).forEach(it => {
          assessDetail.push({
            label: it,
            value: v[it]
          })
          return
        })
      })
      this.addForm = {
        ...this.detail,
        assessDetail
      }
    },

    cancel() {
      this.$emit("close");
    },
  },
};
</script>


<style scoped lang="less">
/deep/ textarea.ivu-input {
  height: 140px;
  resize: none;
}
/deep/ .textarea-con .ivu-input {
  height: 180px;
  resize: none;
}
.textarea-con {
  width: 310px;
  padding-right: 12px;
}
.sym {
  margin: 0 10px;
}
.row-c {
  margin-bottom: 8px;
}
.opt-content {
  background-color: rgba(238, 238, 238, 0.3);
  position: relative;
  padding: 20px 0;
  margin: 0 40px 20px;

  .delete {
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
    z-index: 99;
    padding: 10px;
    &:hover {
      color: #2d8cf0;
    }
  }
}
.reg-text {
  color: #2d8cf0;
  margin: 0 8px;
  cursor: pointer;
}
.agent-list {
  margin-left: 160px;
  height: 160px;
  overflow-y: scroll;
  margin-bottom: 20px;
}
.a-l {
  margin: 0 6px 10px;
}
.item-width {
  width: 300px;
}

.opi {
  margin: 0 80px;
}
.title {
  line-height: 44px;
  font-weight: bold;
  font-size: 18px;
  border-bottom: 1px solid #ececec;
  margin-bottom: 28px;
}

.desc-con {
  width: 600px;
  margin-top: 20px;
}
.dd {
  margin-top: 10px;
}
.rela {
  position: relative;
}
._mask {
  z-index: 99;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: 0;
  background-color: transparent;
}
.base_mask {
  z-index: 99;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: 0;
  background-color: transparent;
}

.sub-con {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.sub-item {
  padding: 6px 10px;
  cursor: pointer;
  line-height: 22px;
  max-height: 90px;
  margin-right: 12px;
  margin-bottom: 12px;
  display: inline-block;
  background: #fff;
  width: 220px;
  border: 1px solid #dcdee2;
  border-radius: 4px;
  &.active {
    background-color: #2d8cf0;
    color: #fff;
  }
}
.pr {
  position: relative;
}
.close-ic {
  position: absolute;
  right: -6px;
  top: -6px;
  border-radius: 50%;
  background-color: #bbb8b8;
  z-index: 9;
}
.rule-width {
  width: 60px;
}
</style>
