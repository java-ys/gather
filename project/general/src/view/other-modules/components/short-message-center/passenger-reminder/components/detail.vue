<template>
  <div class="reminder-add">
      <Form :label-width="80" :model="reminderForm" ref="reminderForm">
         <Row type="flex" justify="center">
          <Col span="12">
            <FormItem label="策略名称：" prop="strategyName">
              <span>{{reminderForm.strategyName}}</span>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="产品线：" prop="businessLines">
                <span>{{reminderForm.businessLines}}</span>
            </FormItem>
          </Col>
        </Row>
         <Row type="flex" justify="center">
          <Col span="24">
            <FormItem
                label="城市：" prop="cityNames"
            >
                 <span>{{reminderForm.cityNames}}</span>
            </FormItem>
          </Col>
        </Row>
         <Row type="flex" justify="center">
          <Col span="24">
                <FormItem label="生效时段：">
                      <span>{{reminderForm.startTime +' 至 '+ reminderForm.endTime}}</span>
                </FormItem>
            </Col>
        </Row>
        </Form>

        <!-- *提醒节点Block  -->
        <div class="reminderBlock">
          <Form :label-width="120" :model="reminderNodeForm" ref="reminderNodeForm" >
            <Row>
              <Col span="14" :offset="2">
                <div class="remindB-title"> <span>*</span> 提醒节点：</div>
              </Col>
            </Row>
            <Row type="flex" justify="space-between">
              <Col span="24" style="background-color: transparent">
                <FormItem label="" prop="" class="reminderNode">
                   <span>{{ this.reminderNodeForm.reminderNode && (this.reminderNodeForm.reminderNode.join(" "))}}</span>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col span="20">
                  <div class="solidBorder"></div>
              </Col>
            </Row>
          </Form>

          <!-- 具体节点 司机接单 order-->
            <Form :label-width="120" :model="orderNodeForm" :hidden="!orderNodeToggle" ref="orderNodeForm">
              <Row>
                <Col span="14" :offset="2">
                  <div class="remindB-subTitle"> <span>*</span> 司机接单：</div>
                </Col>
              </Row>
              <Row type="flex" justify="center">
                <Col span="22">
                    <FormItem
                    label="弹窗图片"
                    prop="popupImgUrl"
                  >
                   <div class="uploadImg">
                     <img width="120" height="100" :src="orderNodeForm.popupImgUrl" alt="" style="    object-fit: cover;" />
                   </div>
                  </FormItem>
                </Col>
              </Row>
              <Row type="flex" justify="center">
              <Col span="22">
                <FormItem label="按钮文案" prop="buttonText">
                    <span>{{orderNodeForm.buttonText}}</span>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center" v-if="orderUrl">
              <Col span="22">
                <FormItem label="跳转链接" prop="linkUrl">
                   <span>{{orderNodeForm.linkUrl}}</span>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center" v-if="orderTitle">
              <Col span="22">
                <FormItem label="链接页标题" prop="linkTitle">
                   <span>{{orderNodeForm.linkTitle}}</span>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col span="20">
                  <div class="solidBorder"></div>
              </Col>
            </Row>
          </Form>

          <!-- 具体节点 司机即将到达起点 coming-->
            <Form :label-width="120" :model="comingNodeForm" :hidden="!comingNodeToggle" ref="comingNodeForm">
              <Row>
                <Col span="14" :offset="2">
                  <div class="remindB-subTitle"> <span>*</span> 司机即将到达起点：</div>
                </Col>
              </Row>
             <Row type="flex" justify="center">
                <Col span="22">
                    <FormItem
                    label="上传弹窗图片"
                    prop="popupImgUrl"
                  >
                   <div class="uploadImg">
                     <img width="120" height="100" :src="comingNodeForm.popupImgUrl" alt="" style="    object-fit: cover;" />
                   </div>
                  </FormItem>
                </Col>
              </Row>
              <Row type="flex" justify="center">
              <Col span="22">
                <FormItem label="按钮文案" prop="buttonText">
                    <span>{{comingNodeForm.buttonText}}</span>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center" v-if="comingUrl">
              <Col span="22">
                <FormItem label="跳转链接" prop="linkUrl">
                   <span>{{comingNodeForm.linkUrl}}</span>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center" v-if="comingTitle">
              <Col span="22">
                <FormItem label="链接页标题" prop="linkTitle">
                   <span>{{comingNodeForm.linkTitle}}</span>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col span="22">
                <FormItem label="距离目的地" prop="distance">
                   <span>{{comingNodeForm.distance}}</span>
                  <span>米提醒</span>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col span="20">
                  <div class="solidBorder"></div>
              </Col>
            </Row>
          </Form>
          <!-- 具体节点 乘客上车后 -->
            <Form :label-width="120" :model="goOnNodeForm" :hidden="!goOnNodeToggle" ref="goOnNodeForm">
              <Row>
                <Col span="14" :offset="2">
                  <div class="remindB-subTitle"> <span>*</span> 乘客上车后：</div>
                </Col>
              </Row>
             <Row type="flex" justify="center">
                <Col span="22">
                    <FormItem
                    label="上传弹窗图片"
                    prop="popupImgUrl"
                  >
                   <div class="uploadImg">
                     <img width="120" height="100" :src="goOnNodeForm.popupImgUrl" alt="" style="    object-fit: cover;" />
                   </div>
                  </FormItem>
                </Col>
              </Row>
              <Row type="flex" justify="center">
              <Col span="22">
                <FormItem label="按钮文案" prop="buttonText">
                    <span>{{goOnNodeForm.buttonText}}</span>
                </FormItem>
              </Col>
            </Row>

            <Row type="flex" justify="center" v-if="goOnUrl">
              <Col span="22">
                <FormItem label="跳转链接" prop="linkUrl">
                   <span>{{goOnNodeForm.linkUrl}}</span>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center" v-if="goOnTitle">
              <Col span="22">
                <FormItem label="链接页标题" prop="linkTitle">
                   <span>{{goOnNodeForm.linkTitle}}</span>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col span="20">
                  <div class="solidBorder"></div>
              </Col>
            </Row>
          </Form>
                    <!-- 具体节点 即将到达目的地 -->
            <Form :label-width="120" :model="destinationNodeForm" :hidden="!destinationNodeToggle" ref="destinationNodeForm">
              <Row>
                <Col span="14" :offset="2">
                  <div class="remindB-subTitle"> <span>*</span> 即将到达目的地：</div>
                </Col>
              </Row>
             <Row type="flex" justify="center">
                <Col span="22">
                    <FormItem
                    label="上传弹窗图片"
                    prop="popupImgUrl"
                  >
                   <div class="uploadImg">
                     <img width="120" height="100" :src="destinationNodeForm.popupImgUrl" alt="" style="    object-fit: cover;" />
                   </div>
                  </FormItem>
                </Col>
              </Row>
              <Row type="flex" justify="center">
              <Col span="22">
                <FormItem label="按钮文案" prop="buttonText">
                    <span>{{destinationNodeForm.buttonText}}</span>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center" v-if="destinationUrl">
              <Col span="22">
                <FormItem label="跳转链接" prop="linkUrl">
                   <span>{{destinationNodeForm.linkUrl}}</span>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center" v-if="destinationTitle">
              <Col span="22">
                <FormItem label="链接页标题" prop="linkTitle">
                   <span>{{destinationNodeForm.linkTitle}}</span>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col span="22">
                <FormItem label="距离目的地" prop="distance">
                   <span>{{destinationNodeForm.distance}}</span>
                  <span>米提醒</span>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col span="20">
                  <div class="solidBorder"></div>
              </Col>
            </Row>
          </Form>
                    <!-- 具体节点 乘客支付费用后 -->
            <Form :label-width="120" :model="payNodeForm" :hidden="!payNodeToggle" ref="payNodeForm">
              <Row>
                <Col span="14" :offset="2">
                  <div class="remindB-subTitle"> <span>*</span> 乘客支付费用后：</div>
                </Col>
              </Row>
             <Row type="flex" justify="center">
                <Col span="22">
                    <FormItem
                    label="上传弹窗图片"
                    prop="popupImgUrl"
                  >
                   <div class="uploadImg">
                     <img width="120" height="100" :src="payNodeForm.popupImgUrl" alt="" style="    object-fit: cover;" />
                   </div>
                  </FormItem>
                </Col>
              </Row>
              <Row type="flex" justify="center">
              <Col span="22">
                <FormItem label="按钮文案" prop="buttonText">
                    <span>{{payNodeForm.buttonText}}</span>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center" v-if="payUrl">
              <Col span="22">
                <FormItem label="跳转链接" prop="linkUrl">
                   <span>{{payNodeForm.linkUrl}}</span>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center" v-if="payTitle">
              <Col span="22">
                <FormItem label="链接页标题" prop="linkTitle">
                   <span>{{payNodeForm.linkTitle}}</span>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col span="20">
                  <div class="solidBorder"></div>
              </Col>
            </Row>
          </Form>
        </div>
    <import-fail-modal
      :show="isImportFail"
      :info="importFailInfo"
      @close="isImportFail=false">
    </import-fail-modal>
  </div>
</template>

<script>
import importFailModal from "../../components/import-fail-modal";
import { getOnLineCity } from "_g/api/common.js";
import { cpLabelValue } from "@/libs/tools";

export default {
  name: "detail",
  props:['theInfo'],
  components: {
    importFailModal
  },
  data() {
    return {
      loading: false,
      importFailInfo: {},
      isImportFail: false,
      orderNodeToggle: false,
      comingNodeToggle: false,
      goOnNodeToggle: false,
      destinationNodeToggle: false,
      payNodeToggle: false,
      orderTitle: true,
      orderUrl: true,
      comingTitle: true,
      comingUrl: true,
      goOnTitle: true,
      goOnUrl: true,
      destinationTitle: true,
      destinationUrl: true,
      payTitle: true,
      payUrl: true,
      reminderForm: { // 表头 form 1
        strategyName:'',
        businessLines:'',
        cityNames:'',
      },
      reminderNodeForm: { //提醒节点 form 复选框 2
        reminderNode: []
      },
      orderNodeForm: { //司机接单
        popupImgUrl:'',
        buttonText :'',
        linkUrl: '',
        linkTitle:''
      },
      comingNodeForm: { //司机即将到达
        popupImgUrl:'',
        buttonText :'',
        linkUrl: '',
        linkTitle:'',
        distance:0
      },
      goOnNodeForm:{ //乘客上车后
        popupImgUrl:'',
        buttonText :'',
        linkUrl: '',
        linkTitle:'',
      },
      destinationNodeForm:{ //即将到达目的地
        popupImgUrl:'',
        buttonText :'',
        linkUrl: '',
        linkTitle:'',
        distance:0
      },
      payNodeForm:{ //即将到达目的地
        popupImgUrl:'',
        buttonText :'',
        linkUrl: '',
        linkTitle:'',
      },

    };
  },
  watch: {
    theInfo(){
     if(JSON.stringify(this.theInfo) === '{}') return;
      this.showData_reminderForm() //表头数据回填
      this.showData_reminderNodeForm() // 提醒节点
    }
  },
  methods: {
    openAuthDownLoad(resObj){
      this.importFailInfo = {
        isLink: false,
        params: resObj.data||{},
        msg: resObj.msg,
        url: '/common/v1/downLoadFile',
        baseUrl: '/m2-admin'
      }
      this.isImportFail = true
    },
    chooseTime() {
      if (this.reminderForm.rangeTime && this.reminderForm.rangeTime.length) {
        const [startTime = "", endTime = ""] = this.reminderForm.rangeTime;
      } else {
      }
    },
    getImgUrl(url) {
      this.orderNodeForm.popupImgUrl = url;
    },
    //  ceshi  upload
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    handleReNodeClick(val){
      console.log(val)
    },
    handleReEachClick(val){
      console.log(val)
    },
    showData_reminderForm(){
      this.reminderForm = this.theInfo
      this.togglerTxt('businessLines')
      this.togglerTxt('cityNames')
    },
    togglerTxt(param){
      let bLines, newLines = [];
      this.theInfo[param].map((item, idx) => {
          if(param === 'businessLines'){  //
            newLines.push( item === "4" ? "快享" : "专享" )
          }else if(param === 'cityNames'){
            newLines.push(item)
          }
          bLines = newLines.join("、")
          this.reminderForm[param] = bLines
      });
    },
    clear(){
      this.reminderForm = {}
      this.reminderNodeForm = {}
      this.comingNodeForm = {}
      this.goOnNodeForm = {}
      this.destinationNodeForm = {}
      this.payNodeForm = {}
    },
    showData_reminderNodeForm(){
      let form1 = this.theInfo.strategyNodes
      if(form1.length === 0) return;
      this.reminderNodeForm.reminderNode = []
      form1.map((item, idx) => {
        this.splitData(item);
      })
    },
    splitData(item){
      if(item.routeNode === 1){  //
          this.reminderNodeForm.reminderNode.push('司机接单')
          this.orderNodeForm = {...item}
          this.orderTitle = this.orderNodeForm.linkTitle ? true : false
          this.orderUrl = this.orderNodeForm.linkUrl ? true : false
          this.orderNodeToggle = true
      }else if(item.routeNode === 2){  //
          this.reminderNodeForm.reminderNode.push('司机即将到达起点')
          this.comingNodeForm = {...item}

          this.comingTitle = this.comingNodeForm.linkTitle ? true : false
          this.comingUrl = this.comingNodeForm.linkUrl ? true : false
          this.comingNodeToggle = true
      }else if(item.routeNode === 3){  //
          this.reminderNodeForm.reminderNode.push('乘客上车后')
          this.goOnNodeForm = {...item}

          this.goOnTitle = this.goOnNodeForm.linkTitle ? true : false
          this.goOnUrl = this.goOnNodeForm.linkUrl ? true : false
          this.goOnNodeToggle = true
      }else if(item.routeNode === 4){  //
          this.reminderNodeForm.reminderNode.push('即将到达目的地')
          this.destinationNodeForm = {...item}

          this.destinationTitle = this.destinationNodeForm.linkTitle ? true : false
          this.destinationUrl = this.destinationNodeForm.linkUrl ? true : false
          this.destinationNodeToggle = true
      }else if(item.routeNode === 5){  //
          this.reminderNodeForm.reminderNode.push('乘客支付费用后')
          this.payNodeForm = {...item}

          this.payTitle = this.payNodeForm.linkTitle ? true : false
          this.payUrl = this.payNodeForm.linkUrl ? true : false
          this.payNodeToggle = true
      }

      // this.reminderNodeForm.reminderNode = this.reminderNodeForm.reminderNode.join(' ')
    },
  },
};
</script>

<style lang="less" scoped>
.reminder-add {
    width: 100%;
    margin: 0 auto;
    padding: 10px;
    .itemWidth {
        width:200px;
    }
    .itemWidth80 {
      width: 80px;
    }
    .reminderBlock {
      padding: 30px 0;
      border: 1px solid #ededed;
    }
    .remindB-title {
      font-size: 15px;
      font-weight: bold;
      span {
        color: red;
      }
    }
    .remindB-subTitle {
      font-size: 14px;
      margin-bottom: 15px;
      color: #333;
      span {
        color: red;
      }
    }
    .reminderNode {
      margin-bottom: 10px;
    }
    .solidBorder {
      border-bottom: 1px solid #ededed;
      margin-bottom: 20px;
    }
    .popHigh {
      height: 80px;
    }
}
</style>