<!--
 * @description: 营运管理-考勤管理-停运补偿规则-类型配置
 * @author: huanglin
 * @date: 2020-03-27
!-->
<template>
  <div>
    <Modal
      v-model="showModal"
      title="类型配置"
      width="50%"
      :mask-closable="false"
      :closable="false"
      @on-cancel="cancelData"
      footer-hide
    >
      <Form ref="form" :model="formData" :label-width="100">
        <FormItem style="margin:0 0 0 64px;" label="分类名称"></FormItem>
        <div v-for="(item, index) in formData.typeList" :key="index">
          <div style="display: flex; padding-left:89px;" v-if="!item.deleteMark">
            <FormItem
              style="margin-bottom: 20px;"
              :prop="'typeList.' + index + '.categoryName'"
              :rules="JSON.parse(JSON.stringify(ruleUser.categoryName))"
            >
              <Input
                v-model="item.categoryName"
                :maxlength="30"
                style="width:200px;"
                placeholder="请填写类型"
              />
            </FormItem>
            <Button
              type="primary"
              size="small"
              icon="md-add"
              style="margin-left: 15px;height: 30px;margin-top: 3px"
              v-if="checkAddBtn(index)"
              @click="addTime"
            ></Button>
            <Button
              type="primary"
              size="small"
              icon="md-remove"
              style="margin-left: 15px;height: 30px;margin-top: 3px"
              v-if="dotFilter()"
              @click="handleDelete(index,item)"
            ></Button>
          </div>
          <div style="padding-left:150px;" v-for="(ite, indx) in item.childList" :key="indx">
            <div v-if="!ite.deleteMark">
              <FormItem
                :prop="'typeList.' + index + '.' + 'childList.' + indx + '.categoryName'"
                :rules="JSON.parse(JSON.stringify(ruleUser.subtypes))"
              >
                <Input
                  type="text"
                  style="width:130px;"
                  size="small"
                  :maxlength="30"
                  v-model="ite.categoryName "
                  placeholder="请填写子类型"
                />
                <Button
                  type="primary"
                  size="small"
                  icon="md-remove"
                  style="margin-left: 15px;height: 30px;margin-top: 3px"
                  @click="handleRemove(indx,ite,index)"
                ></Button>
              </FormItem>
            </div>
          </div>
          <div style="padding-left:155px;">
            <Button
              type="primary"
              style="width:135px;margin-bottom:15px"
              long
              v-if="!item.deleteMark"
              @click="handleAdd(index)"
            >添加子分类</Button>
          </div>
        </div>
      </Form>
      <div class="popView-footer-wrap">
        <Button type="primary" @click="handleSubmit">提交</Button>
        <Button @click="cancelData" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { queryConfigType, commitConfigInfo } from "_o/api/compensate.js";
export default {
  props: {
    value: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      showModal: false,
      formData: {
        //表单绑定数据
        typeList: []
      },
      ruleUser: {
        // 表单验证数据
        categoryName: [
          { required: true, message: "请填写类型", trigger: "blur" }
        ],
        subtypes: [
          { required: true, message: "请填写子分类", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    value: {
      handler(value) {
        this.showModal = value;
        if (this.showModal) {
          this.getConfigType();
        }
      },
      immediate: true
    },
    showModal(value) {
      this.$emit("input", value);
    }
  },
  methods: {
    getConfigType() {
      queryConfigType({}).then(res => {
        if (res.data.success) {
          this.formData.typeList = [];
          for (let i = 0; i < res.data.data.length; i++) {
            this.formData.typeList.push({
              categoryName: res.data.data[i].categoryName,
              id: res.data.data[i].id,
              childList: JSON.parse(JSON.stringify(res.data.data[i].childList))
            });
          }
        }
      });
    },
    cancelData() {
      this.$Modal.confirm({
        title: "是否确认取消",
        onOk: () => {
          this.showModal = false;
          this.formData.typeList = [];
        }
      });
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let data = this.formData.typeList.map(it => {
            return {
              ...it
            };
          });
          commitConfigInfo({ parentList: data }).then(res => {
            if (res.data.success) {
              this.$Message.success("配置成功");
              this.showModal = false;
              this.$emit("on-confirm", 1);
            }
          });
        }
      });
    },
    // 类型添加
    addTime() {
      let newDataTime = this.formData.typeList;
      console.log(newDataTime);
      for (let i = 0; i < newDataTime.length; i++) {
        if (newDataTime[i].categoryName) {
        } else {
          this.$Message.warning("请选择类型");
          return false;
        }
      }
      newDataTime.push({
        categoryName: "",
        id: "",
        childList: []
      });
    },
    // 类型删除
    handleDelete(index, item) {
      let M = this.formData.typeList[index].childList.every(
        item => item.deleteMark == 1
      );
      if (item.id) {
        if (!M) {
          this.$Modal.warning({
            title: "提示",
            content: "请先删除子类别"
          });
          return;
        }
        const tmp = this.formData.typeList[index];
        tmp.deleteMark = 1;
        this.formData.typeList.splice(index, 1, tmp);
        // const tmp = this.formData.typeList[index];
        // tmp.deleteMark = 1;
        // if(this.formData.typeList[index].childList.length){
        //     this.$Modal.warning('请先删除子类别')
        // }
        // this.formData.typeList.splice(index, 1, tmp);
        // // let l = this.formData.typeList[index].childList.length
        // this.formData.typeList[index].childList.splice(0);
      } else {
        if (!item.childList.length) {
          this.formData.typeList.splice(index, 1);
        } else {
          this.$Modal.warning({
            title: "提示",
            content: "请先删除子类别"
          });
        }
        // const tmp = this.formData.typeList[index];
        // tmp.deleteMark = 1;
      }
    },
    handleRemove(indx, item, index) {
      if (item.id) {
        const tmp = this.formData.typeList[index].childList[indx];
        tmp.deleteMark = 1;
        this.formData.typeList[index].childList.splice(indx, 1, tmp);
      } else {
        this.formData.typeList[index].childList.splice(indx, 1);
      }
    },
    // 添加子分类列表
    handleAdd(index) {
      const sub = this.formData.typeList[index].childList.length;
      this.$set(this.formData.typeList[index].childList, sub, {
        categoryName: ""
      });
    },
    dotFilter() {
      const l = this.formData.typeList.filter(it => !it.deleteMark);
      return l.length > 1;
    },
    checkAddBtn(index) {
      const M = this.formData.typeList.findIndex(item => !item.deleteMark);
      return M == index;
      // console.log(m);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.popView-footer-wrap {
  margin-top: 50px;
  margin-left: 40%;
}

/deep/.ivu-form-item-content {
  margin-left: 10px !important;
}
// /deep/.ivu-form-item {
//   margin-bottom: 20px !important;
// }
</style>
