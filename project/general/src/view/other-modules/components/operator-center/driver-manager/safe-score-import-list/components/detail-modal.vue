<template>
  <div>
    <Modal
      v-model="isShow"
      :width="800"
      :title="isDetail?'详情':'编辑'"
      class="safe-score-detail-modal"
      :mask-closable="false"
      :footer-hide="isDetail?true:false"
      @on-cancel="$emit('close')"
    >
      <div class="detail-item">
        <div>
          <div class="item-tit">案件编码：</div>
          <div>{{addData.occurNo}}</div>
        </div>
        <div>
          <div class="item-tit">司机姓名：</div>
          <div>{{addData.name}}</div>
        </div>
      </div>
      <div class="detail-item">
        <div>
          <div class="item-tit">司机ID：</div>
          <div>{{addData.driverNo}}</div>
        </div>
        <div>
          <div class="item-tit">司机手机号：</div>
          <div>{{addData.mobile}}</div>
        </div>
      </div>
      <div class="detail-item">
        <div>
          <div class="item-tit">身份证号：</div>
          <div>{{addData.idCard}}</div>
        </div>
        <div>
          <div class="item-tit">入职日期：</div>
          <div>{{addData.entryTime}}</div>
        </div>
      </div>
      <div class="detail-item">
        <div>
          <div class="item-tit">车牌号：</div>
          <div>{{addData.plateNo}}</div>
        </div>
        <div>
          <div class="item-tit">城市：</div>
          <div>{{addData.cityName}}</div>
        </div>
      </div>
      <div class="detail-item">
        <div>
          <div class="item-tit">业务线：</div>
          <div>{{businessInfo.map[addData.businessType]}}</div>
        </div>
        <div>
          <div class="item-tit">运营商：</div>
          <div>{{addData.agentName}}</div>
        </div>
      </div>
      <div class="detail-item">
        <div>
          <div class="item-tit">订单号：</div>
          <div>{{addData.orderNo}}</div>
        </div>
        <div>
          <div class="item-tit">安全分违规类型：</div>
          <div>{{addData.violationType}}</div>
        </div>
      </div>
      <div v-if="isDetail">
        <div class="detail-item">
          <div>
            <div class="item-tit">事件来源：</div>
            <div>{{addData.source}}</div>
          </div>
          <div>
            <div class="item-tit">事发日期：</div>
            <div>{{addData.occurDate}}</div>
          </div>
        </div>
        <div class="detail-item">
          <div>
            <div class="item-tit">事发地点：</div>
            <div>{{addData.occurAddress}}</div>
          </div>
          <div>
            <div class="item-tit">交通事故责任：</div>
            <div>{{addData.determine}}</div>
          </div>
        </div>
        <div class="detail-item">
          <div>
            <div class="item-tit">创建日期：</div>
            <div>{{addData.createDate}}</div>
          </div>
          <div>
            <div class="item-tit">事件简述：</div>
            <div>{{addData.occurText}}</div>
          </div>
        </div>
        <div class="detail-item">
          <div>
            <div class="item-tit">操作人：</div>
            <div>{{addData.updater}}</div>
          </div>
          <div>
            <div class="item-tit">操作时间：</div>
            <div>{{addData.updateTime}}</div>
          </div>
        </div>
      </div>
      <div v-else class="top15">
        <Form ref="addForm" :model="addData" :rules="ruleValidate" :label-width="110">
          <FormItem label="事件来源：">
            <Select v-model="addData.source" placeholder="请选择" style="width:200px;">
              <Option v-for="(item,index) in originList" :key="index" :value="item.label">{{item.label}}</Option>
            </Select>
          </FormItem>
          <FormItem label="事发日期：">
            <DatePicker
              type="date"
              v-model="addData.occurDate"
              :clearable="true"
              :editable="false"
              placeholder="请选择"
              style="width: 200px"
            ></DatePicker>
          </FormItem>
          <FormItem label="事发地点：" prop="occurAddress">
            <Input
              v-model="addData.occurAddress"
              placeholder="请输入"
              :maxlength="40"
              style="width:400px;"
            ></Input>
            <span class="counter">( {{addData.occurAddress?addData.occurAddress.length:0}}/40 )</span>
          </FormItem>
          <FormItem label="交通事故责任：">
            <Select
              v-model="addData.determine"
              placeholder="请选择"
              style="width:200px;"
            >
              <Option value="全部责任">全部责任</Option>
              <Option value="主要责任">主要责任</Option>
              <Option value="同等责任">同等责任</Option>
              <Option value="次要责任">次要责任</Option>
              <Option value="无责任">无责任</Option>
              <Option value="责任待定">责任待定</Option>
            </Select>
          </FormItem>
          <FormItem label="创建日期：">
            <DatePicker
              type="date"
              v-model="addData.createDate"
              :clearable="true"
              :editable="false"
              placeholder="请选择"
              style="width: 200px"
            ></DatePicker>
          </FormItem>
          <FormItem label="事件简述：" prop="occurText">
            <Input
              v-model="addData.occurText"
              :maxlength="600"
              placeholder="请输入"
              type="textarea"
              :autosize="{minRows: 6,maxRows: 15}"
              style="width:500px"></Input>
            <span class="counter">( {{addData.occurText?addData.occurText.length:0}}/600 )</span>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" :loading="formLoading" @click="addSubmit('addForm')">
          <span v-if="!formLoading">确定</span>
          <span v-else>提交中</span>
        </Button>
        <Button type="text" @click="formReset('addForm')">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { businessInfo,originMap,originList } from "../fields";
import { ancValid } from '@m2-micro/validate'
import {
  axiosSafeScoreImportDetail,
  axiosSafeScoreImportEdit
} from "_o/api/driver.js";
export default {
  name: "add-left-menu",
  props: {
    show: {
      type: Boolean
    },
    uuid: {
      type: String
    },
    isDetail: {
      type: Boolean
    }
  },
  data() {
    return {
      businessInfo,
      originMap,
      originList,
      isShow: false,
      addData: {},
      formLoading:false,
      ruleValidate: {
        occurAddress: [
          { trigger: 'blur', validator: ancValid }
        ],
        occurText: [
          { trigger: 'blur', validator: ancValid }
        ],
      }
    };
  },
  methods: {
    addSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let that = this;
          let params = { ...this.addData };
          if(params.createDate) params.createDate = this.$moment(params.createDate).format('YYYY-MM-DD')
          if(params.eventDate) params.eventDate = this.$moment(params.eventDate).format('YYYY-MM-DD')
          if(params.occurDate) params.occurDate = this.$moment(params.occurDate).format('YYYY-MM-DD')
          this.formLoading = true
          axiosSafeScoreImportEdit(params).then(res => {
            this.formLoading = false
            that.$emit('refresh');
            that.$Message.success(`编辑成功！`);
            that.formReset(name);
          }).catch(err=>{
            this.formLoading = false
          })
        }
      });
    },
    getDetail(){
      axiosSafeScoreImportDetail({uuid: this.uuid}).then(res => {
        this.addData = res.data.data||{}
      })
    },
    formReset(name) {
      this.$refs[name].resetFields();
      this.$emit("close");
    }
  },
  watch: {
    show() {
      this.isShow = this.show;
      this.isShow && this.getDetail()
    }
  }
};
</script>
<style lang="less" scoped>
.safe-score-detail-modal {
  color: #222;
}
.detail-item {
  display: flex;
  margin-bottom: 14px;
  font-size: 13px;
  line-height: 1.8;
  & > div {
    width: 370px;
    padding-left:5px;
    div{
      min-height:23px;
    }
  }
}
.item-tit {
  color: #999;
}
</style>
