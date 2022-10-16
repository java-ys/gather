<template>
  <Modal v-model="isModel" title="提报单评定" width="1000"  @on-cancel="close">
    <Card>
      <Row>
        <Col span="24">
        <span>提报单类型: {{evaluateDetail.feedbackTypeName}}</span>
        </Col>
        <Col span="24">
        <span>提报单描述/建议方案: {{evaluateDetail.feedbackContent}}
        </span>
        </Col>
      </Row>
    </Card>
    <Card style="margin-top: 10px">
      <Row>
        <Col span="24">
          <span>图片：</span>
          </Col>
          <Col span="24">
            <img :src="item.url" alt="" v-for="(item, index) in img" :key="index"  class="image" @click="viewImg(item.url)">
          </Col>
      </Row>
    </Card>
    <Card style="margin-top: 10px;margin-bottom: 20px">
      <Row>
        <Col span="5">
        <span>手机号码：{{evaluateDetail.userMobile}}</span>
        </Col>
        <Col span="10">
        <span>提交时间：{{evaluateDetail.feedbackDate}}</span>
        </Col>
      </Row>
    </Card>
    <Form :model="evaluateData" ref="evaluateData" :label-width="90" :rules="ruleValidate"> 
      <FormItem label="是否采纳：" prop="assessStatus">
        <Select v-model="evaluateData.assessStatus" clearable style="width:200px" >
          <Option v-for="item in valueList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="评估等级：" prop="assessLevel" v-if="evaluateData.assessStatus == 3">
        <Select v-model="evaluateData.assessLevel" clearable style="width:200px">
          <Option v-for="item in gradeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="处理方式：" prop="assessHandle" v-if="evaluateData.assessStatus == 3">
          <Select v-model="evaluateData.assessHandle" clearable style="width:200px">
              <Option v-for="item in modeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
      </FormItem>
      <FormItem label="未采纳原因：" v-if="evaluateData.assessStatus == 2">
          <Input v-model="evaluateData.assessReason" type="text" placeholder="请输入" :maxlength='maxlength' style="width: 300px" />
      </FormItem>
    </Form>
    </Col>
    </Row>
    </Card>
    <div slot="footer">
      <Button type="text" @click="close">取消</Button>
      <Button type="primary" @click="submit">确认</Button>
    </div>
    <Modal title="查看图片" v-model="imgVisible "  :mask-closable= false>
      <img :src="imgUrl" v-if="imgVisible" style="width: 100%" id="viewimg">
      <Button type="primary" @click="rotate" style="margin-top: 15px">旋转</Button>
      <div slot="footer">
      </div>
   </Modal>
  </Modal>
</template>
<script>
  import { feedbackDetail, feedbackEvaluate} from '_o/api/experience.js';
  export default {
    props: {
      isEvaluateModal: {
        type: Boolean,
        default: false
      },
      params: {
        type: Object,
        default: () => {
          return {}
        }
      },
    },
    data() {
      return {
        maxlength:30,
        isModel: false,
        ruleValidate: {
          assessStatus: [
            { required: true, message: '必选', type: 'number', }
          ],
          assessLevel: [
            { required: true, message: '必选', type: 'number', }
          ],
          assessHandle: [
            { required: true, message: '必选', type: 'number', }
          ],
        },
        evaluateData:{
          assessStatus:'',
          assessLevel:'',
          assessHandle:'',
          assessReason:''
        },
        imgUrl:"",
        imgVisible:false,
        deg:90,
        img:[],
        evaluateDetail:{},
        valueList: [
          {
            label: '采纳',
            value: 3
          },
          {
            label: '不采纳',
            value: 2
          },
        ],
        modeList: [
          {
            label: '产品优化',
            value: 2
          },
          {
            label: '修复漏洞',
            value: 1
          },
        ],
        gradeList: [
          {
            label: '无影响',
            value: 1
          },
          {
            label: '低级',
            value: 2
          },
          {
            label: '中级',
            value: 3
          },
          {
            label: '高级',
            value: 4
          },
          {
            label: '严重',
            value: 5
          }
        ]
      };
    },
    methods: {
      close() {
        this.$emit("closeoff");
      },
      submit(){
        this.$refs.evaluateData.validate((valid) => {
          this.evaluateData.uuid = this.params.uuid;
          if (valid) {
             feedbackEvaluate(this.evaluateData).then(res =>{
               if(res.data.success){
                   this.$emit("close");
               }
             })
          }
        })
      },
      viewImg(url){
        this.imgVisible=true;
        this.imgUrl=url;
        this.deg=0;
      },
      rotate(){
            this.deg += 90;
            document.getElementById("viewimg").style.transform = "rotate(" + this.deg + "deg)";
      },
      getInfo() {
        this.isLoading = true
        feedbackDetail(this.params).then(res => {
          if (res.data.success) {
            this.evaluateDetail = res.data.data || {}
            if(this.evaluateDetail.feedbackImgUrl){
              this.img = this.evaluateDetail.feedbackImgUrl.split(',').map(itm=>{
                return {url:itm}
              })
            }
            this.isLoading = false
          } else {
            this.isLoading = false
            this.$Message.error('请求数据出错')
          }
        })
      }
    },
    watch: {
      isEvaluateModal(newVal) {
        this.isModel = newVal;
        if (newVal) {
          this.$refs.evaluateData.resetFields();
          this.getInfo()
        }
      }
    },
    created() {
      this.img = [];
    },
  };
</script>
<style scoped>
  .image{
   width: 300px;
   height:200px;
   margin-right: 8px;
   border: 1px solid;
   cursor: pointer; 
  }
 </style>