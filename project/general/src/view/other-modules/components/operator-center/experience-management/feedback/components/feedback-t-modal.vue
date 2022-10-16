<template>
  <Modal v-model="isModel" title="提报单评定" width="1000" @on-cancel="close">
    <Card>
      <Row>
        <Col span="24">
        <span>提报单类型: {{detail.feedbackTypeName}}</span>
        </Col>
        <Col span="24" style="margin-top: 10px">
        <span>提报单描述/建议方案: {{detail.feedbackContent}}
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
    <Card style="margin-top: 10px">
      <Row>
        <Col span="24">
        <span>是否采纳：{{statusMap[detail.assessStatus]}}</span>
        </Col>
        <Col span="24" style="margin-top: 10px">
        <span>
          评估等级：{{gradeMap[detail.assessLevel]}}</span>
        </Col>
        <Col span="24" style="margin-top: 10px">
        <span>
          处理方式：{{modeMap[detail.assessHandle]}}</span>
        </Col>
        <Col span="24" style="margin-top: 10px">
        <Form :model="tData" ref="tdata" :rules="ruleValidate">
          <FormItem label="发放额度：" prop="assessCoin">
            <InputNumber :min="1" v-model="tData.assessCoin"></InputNumber>个
          </FormItem>
        </Form>
        </Col>
      </Row>
    </Card>
    <div slot="footer">
      <Button type="text" @click="close">取消</Button>
      <Button type="primary" @click="send">确认</Button>
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
  import { feedbackDetail,feedbacksend } from '_o/api/experience.js';
  import { statusMap, gradeMap, modeMap, } from '../feedback-detail/fields.js'
  export default {
    props: {
      istModal: {
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
        isModel: false,
        tData: {
          assessCoin: null
        },
        detail: {},
        imgVisible: false,
        statusMap,
        gradeMap,
        modeMap,
        imgUrl: "",
        deg: 90,
        img: [],
        ruleValidate: {
          assessCoin: [
            { required: true, message: 'T币不能为空', type: 'number', }
          ],
        }
      };
    },
    methods: {
      close() {
        this.$emit("closeoff");
      },
      send() {
        this.$refs.tdata.validate((valid) => {
          this.tData.uuid = this.params.uuid;
          this.tData.userId = this.detail.userId;
          if (valid) {
            feedbacksend(this.tData).then(res =>{
               if(res.data.success){
                   this.$emit("close");
               }
             })
          } else {
            this.$Message.error('请输入T币个数');
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
            this.detail = res.data.data || {};
            if (this.detail.feedbackImgUrl) {
              this.img = this.detail.feedbackImgUrl.split(',').map(itm => {
                return { url: itm }
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
      istModal(newVal) {
        this.isModel = newVal;
        if (newVal) {
          this.tData.assessCoin = null;
          this.$refs.tdata.resetFields();
          this.getInfo()
        }
      }
    },
    created () {
      this.img = [];
    }
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