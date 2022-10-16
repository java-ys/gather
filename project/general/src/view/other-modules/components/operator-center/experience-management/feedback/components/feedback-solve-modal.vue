<template>
  <Modal v-model="isModel" title="提报单解决" width="1000" @on-cancel="close">
    <Form :label-width="120" :model="solveData" ref="solveData" :rules="ruleValidate">
      <FormItem label="解决人员：" prop='resolveUserName'>
        <Input v-model="solveData.resolveUserName" type="text" placeholder="请输入" :maxlength='maxlength' style="width: 180px" />
      </FormItem>
      <FormItem label="解决时间：" prop='date'>
        <DatePicker type="date" placeholder="" v-model="solveData.date" @on-change="change"></DatePicker>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="text" @click="close">取消</Button>
      <Button type="primary" @click="solve">确认</Button>
    </div>
  </Modal>
</template>
<script>
  import { feedbackResult} from '_o/api/experience.js';
  export default {
    props: {
      isSolveModal: {
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
        solveData: {},
        ruleValidate: {
          resolveUserName: [
            { required: true, message: '必填' }
          ],
          date: [
            { required: true, message: '必填' }

          ]
        },
        maxlength: 30
      };
    },
    methods: {
      close() {
        this.$emit("closeoff");
      },
      solve() {
        this.$refs.solveData.validate((valid) => {
          if (valid) {
            let data={
              uuid:this.solveData.uuid,
              assessStatus: 4,
              resolveUserName:this.solveData.resolveUserName,
              assessDate:this.solveData.assessDate,
            }
            feedbackResult(data).then(res =>{
               if(res.data.success){
                   this.$emit("close");
               }
             })
          }
        })
      },
      change(val){
        this.solveData.assessDate=val;
      }
    },
    watch: {
      isSolveModal(newVal) {
        this.isModel = newVal;
        if (newVal) {
          this.$refs.solveData.resetFields();
          this.solveData = this.params;
          this.solveData.date = this.$moment().format('YYYY-MM-DD');
          this.solveData.assessDate = this.$moment().format('YYYY-MM-DD')
        }
      }
    }
  };
</script>