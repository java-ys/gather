<template>
  <div>
    <div class="top-info">
      <div>
        <strong class="fontsize16 right30">评价对象设置：</strong>
        <span class="top-item">司机：开启</span>
        <span class="top-item">平台：{{setInfo.platformSwitch===1?'开启':'关闭'}}</span>
        <span class="top-item">车辆：{{setInfo.carSwitch===1?'开启':'关闭'}}</span>
      </div>
      <Button type="primary" @click="isSetModal=true" v-hasAuth="isSpecial?'special-passenger-evaluate-edit':'passenger-evaluate-edit'">编辑评价对象</Button>
    </div>
    <div class="top20">
      <table
        v-for="(item,index) in dataList"
        :key="index"
        class="table-item"
        border="1"
        cellspacing="0"
        cellpadding="0"
        width="100%"
      >
        <tr class="table-head">
          <td class="lab-first">
            评价对象
          </td>
          <td class="lab-second">
            星级
          </td>
          <td class="lab-third">
            整体评价
          </td>
          <td class="lab-fourth">
            评价标签
          </td>
          <td class="lab-fifth">
            操作
          </td>
        </tr>
        <tr
          v-for="(obj,i) in item"
          :key="i"
        >
          <td
            v-if="i===0"
            class="lab-first"
            rowspan="5"
          >
            {{ targetMap[String(obj.evaluationTarget)] }}
          </td>
          <td class="lab-second">
            {{ obj.evaluationStar }} 星
          </td>
          <td class="lab-third">
            {{ obj.overallEvaluation }}
          </td>
          <td class="lab-fourth">
            <Tag
              v-for="lab in obj.labelList"
              :key="lab.uuid"
              type="border"
            >
              {{ lab.labelName }}
            </Tag>
          </td>
          <td class="lab-fifth">
            <Button
              v-hasAuth="isSpecial?'special-passenger-manage-control':'passenger-manage-control'"
              type="primary"
              size="small"
              @click="openEditModal(obj)"
            >
              管理标签
            </Button>
          </td>
        </tr>
      </table>
    </div>

    <Modal
      v-model="editLabel"
      footer-hide
      :width="900"
      :mask-closable="false"
      title="管理标签">
      <Form
        ref="editLabelData"
        :model="editLabelData"
        :rules="ruleValidate"
        :label-width="120"
      >
        <div class="flex-box">
          <FormItem
            label="评价对象："
            class="right30"
          >
            <span>{{ targetMap[String(editLabelData.evaluationTarget)] }}</span>
          </FormItem>
          <FormItem label="星级：">
            <span>{{ editLabelData.evaluationStar }} 星</span>
          </FormItem>
        </div>
        <FormItem
          label="整体评价："
          prop="overallEvaluation"
        >
          <Input
            v-model="editLabelData.overallEvaluation"
            :maxlength="10"
            placeholder="请输入整体评价"
            style="width:200px;"
          />
          <span
            class="counter"
          >( {{ editLabelData.overallEvaluation?editLabelData.overallEvaluation.length:0 }}/10 )</span>
        </FormItem>
        <FormItem
          label="标签属性："
          prop="evaluationQuality"
        >
          <Select
            v-model="editLabelData.evaluationQuality"
            placeholder="请选择标签属性"
            style="width:200px;"
          >
            <Option
              v-for="item in qualityList"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </Option>
          </Select>
        </FormItem>
        <FormItem
          label="选择标签："
          prop="labelList"
          style="margin-bottom:5px;"
        ></FormItem>
        <div>
          <transfer-box
            :params="params"
            :evaluationQuality="editLabelData.evaluationQuality"
            :isShow="editLabel"
            @chooseLabel="chooseLabel"
          >
          </transfer-box>
        </div>
        <Divider class="bottom10" />
        <div class="right-flex">
          <Button @click="cancelSubmit('editLabelData')">
            取消
          </Button>
          <Button
            type="primary"
            style="margin-left: 8px"
            @click="submitEdit('editLabelData')"
          >
            确定
          </Button>
        </div>
      </Form>
    </Modal>
    <set-modal
      :show="isSetModal"
      :info="setInfo"
      @close="isSetModal=false"
      @refresh="getSetInfo"
      >
    </set-modal>
  </div>
</template>
<script>
import transferBox from "./transfer-box/index.vue"
import setModal from "./set-modal.vue"
import {
  axiosListLabelSet,
  axiosLabelManage,
  axiosEvaluateTargetDetail
} from "_o/api/operator-carrier";
import { targetMap, qualityList } from "../label-pool/fields";
export default {
  name: "passenger-manage",
  components: {
    transferBox,
    setModal
  },
  props: {
    tabVal: {
      type: String,
      default: "tab1"
    },
    isSpecial:{}
  },
  data() {
    return {
      dataList: [],
      targetMap,
      editLabel: false,
      qualityList, // 标签属性列表
      editLabelData: {},
      ruleValidate: {
        overallEvaluation: [
          { required: true, message: "请填写整体评价", trigger: "blur" }
        ],
        evaluationQuality: [
          { required: true, type: "number", message: "请选择标签属性", trigger: "blur" }
        ],
        labelList: [
          { required: true, type: "array", min: 1, message: "请选择标签", trigger: "change" }
        ],
      },
      params: {},
      isSetModal: false,
      setInfo:{
        platformSwitch: 0,
        carSwitch: 0
      }
    };
  },
  watch: {
    tabVal(newVal) {
      if (newVal === "tab2") {
        this.init();
      }
    },
    $route(to, from) {
      if (to.path !== from.path) {
        this.init();
      }
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init(){
      this.getList();
      this.getSetInfo();
    },
    getSetInfo(){
      let params = {
        businessId: this.$route.name === "special-passenger-manage" ? 2 : 4
      }
      axiosEvaluateTargetDetail(params).then(res=>{
        this.setInfo = res.data.data || {}
      })
    },
    chooseLabel(list) {
      this.editLabelData.labelList = list
    },
    submitEdit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          axiosLabelManage(this.editLabelData).then(res => {
            this.$Message.success(res.data.msg || "操作成功")
            this.editLabel = false
            this.getList();
          })
        } else {
          this.editLabel = true;
        }
      });
    },
    cancelSubmit(name) {
      this.$refs[name].resetFields();
      this.editLabel = false;
    },
    // 打开管理标签弹窗
    openEditModal(obj) {
      let params = {
        uuid: obj.uuid,
        evaluationTarget: obj.evaluationTarget,
        evaluationStar: obj.evaluationStar,
        businessId: this.$route.name === "special-passenger-manage" ? 2 : 4
      };
      this.params = params
      this.editLabelData = {
        ...params,
        overallEvaluation: obj.overallEvaluation || "",
        evaluationQuality: obj.evaluationQuality,
        labelList: JSON.parse(JSON.stringify(obj.labelList))
      };
      this.editLabel = true
    },
    // 获取列表
    getList() {
      axiosListLabelSet({
        businessId: this.$route.name === "special-passenger-manage" ? 2 : 4
      }).then(res => {
        this.dataList = res.data.data || []
      });
    }
  }
};
</script>
<style lang="less" scoped>
.table-item {
  margin-bottom: 50px;
  line-height: 40px;
  border: none;
  border-collapse: collapse;
  box-shadow: 1px 1px 5px #ddd;
  min-width: 880px;
  &:hover{
    box-shadow: 0 1px 6px rgba(0,0,0,.2);
  }
  td {
    padding-left: 20px;
    border-color: #ccc;
  }
  .table-head {
    background: #efefef;
  }
  .lab-first {
    width: 8%;
  }
  .lab-second {
    width: 8%;
  }
  .lab-third {
    width: 15%;
  }
  .lab-fourth {
    width: 50%;
  }
  .lab-fifth {
    width: 8%;
  }
  /deep/ .ivu-tag-border {
    line-height: 22px;
    margin-right: 6px;
  }
}
.flex-box {
  display: flex;
  justify-content: flex-start;
}
.bottom10 {
  margin-bottom: 10px;
}
.counter {
  vertical-align: bottom;
  margin-left: 12px;
}
.right-flex {
  display: flex;
  justify-content: flex-end;
}
.top-info{
  display: flex;
  justify-content: space-between;
  padding:10px 40px 15px 5px;
  border-bottom:1px solid #ababab;
}
.top-item{
  min-width:170px;
  display: inline-block;
}
</style>
