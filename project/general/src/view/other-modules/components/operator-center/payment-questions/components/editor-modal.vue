<template>
  <div>
    <Form class="pay-editor" ref="payQSData" :model="payQSData" :rules="ruleValidate" :label-width="100">
      <FormItem label="问题：" prop="question">
        <Input v-model="payQSData.question" :maxlength="30" placeholder="请输入问题"></Input>
      </FormItem>
      <FormItem label="问题排序：" prop="sortNumber">
        <Select filterable v-model="payQSData.sortNumber" placeholder="请选择问题排序" style="width:150px;">
          <Option v-for="item in total" :value="item" :key="item">{{item}}</Option>
        </Select>
      </FormItem>
      <FormItem label="回答：" prop="answer">
        <editor :cache="false" ref="editor" :menu="editorMenu" :color="editorColor" :value="payQSData.content"></editor>
      </FormItem>
      <Divider />
      <FormItem class="right-flex">
        <Button @click="handleReset('payQSData')">取消</Button>
        <Button type="primary" v-lazy-click="{fn:handleSubmit,params:{payQSData:'payQSData'}}" style="margin-left: 8px">确定</Button>
      </FormItem>
    </Form>

  </div>
</template>
<script>
import editor from '_c/editor'
import {
  axiosPaymentQuestionInsert,
  axiosPaymentQuestionEdit
} from "_o/api/operator-carrier";
let Base64 = require( 'js-base64' ).Base64

export default {
  props:{
    editData: {
      type: Object,
      default: ()=>{}
    },
    isShow: {
      type: Boolean,
      default: false
    },
    total:{
      type: Number,
      default: 1
    }
  },
  data(){
    return {
      payQSData:{
        uuid:'',
        question: '',
        answer:'',
        sortNumber: null
      },
      isNew: true,
      ruleValidate: {
        question: [
          { required: true, message: '请输入问题', trigger: 'blur' }
        ],
        answer: [
          { required: true, message: '请输入回答', trigger: 'blur' }
        ],
        sortNumber: [
          { required: true,type:'number', message: '请选择排序问题', trigger: 'blur' }
        ],
      },
      editorMenu:[
        'bold',  // 粗体
        'italic',  // 斜体
        'underline', // 下划线
        'foreColor' // 文字颜色
      ],
      editorColor: [
        '#000000',
        '#0332ff',
        '#aa7942',
        '#00fdfe',
        '#00f900',
        '#fe40ff',
        '#ff9300',
        '#942191',
        '#fe2600',
        '#fffb05',
        '#ffffff'
      ]
    }
  },
  components: {
    editor
  },
  methods: {
    handleSubmit (name) {
      if(typeof name === "object" && name.payQSData){
        name = name.payQSData;
      }
      this.payQSData.answer = this.$refs.editor.editor.txt.text()
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.payQSData.answer = this.$refs.editor.editor.txt.html()
          let params = {
            question:this.payQSData.question,
            sortNumber:this.payQSData.sortNumber,
            answer: Base64.encode(this.payQSData.answer),
          }
          if(this.payQSData.uuid){
            params.uuid = this.payQSData.uuid
            params.oldSort = this.payQSData.oldSort
          }
          let axiosFun = this.isNew?axiosPaymentQuestionInsert:axiosPaymentQuestionEdit
          axiosFun(params).then(res => {
            this.$Message.success(res.data.msg||'操作成功')
            this.$emit('close')
            this.$emit('getTableList',true)
          })
        } else {
          this.$Message.warning('请将表单部分填写完整');
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields();
      this.$emit('close')
    }
  },
  watch:{
    isShow(){
      this.$refs['payQSData'].resetFields();
      this.isNew=this.editData.uuid?false:true
      Object.keys(this.payQSData).forEach(key=>{
        this.payQSData[key]=this.editData[key]
      })
      !this.isNew && (this.payQSData.oldSort = this.editData.sortNumber)
      this.$refs.editor.setHtml(Base64.decode(this.editData.answer))
    }
  }
}
</script>
<style lang="less">
  .pay-editor .ivu-select-dropdown{
    z-index: 20000;
  }
  .right-flex{
    display: flex;
    justify-content:flex-end;
  }
</style>
