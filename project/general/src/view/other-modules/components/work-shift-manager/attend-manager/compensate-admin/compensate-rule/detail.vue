<!--
 * @description: 营运管理-考勤管理-停运补偿规则-编辑&新增
 * @author: huanglin
 * @date: 2020-03-27
!-->
<template>
  <div>
    <Modal
      v-model="showModal"
      title="停运补偿规则"
      width="50%"
      :mask-closable="false"
      @on-cancel="cancelData"
    >
      <Form ref="formValidate" :label-width="100">
        <FormItem label="适用城市" prop="applyCity">{{formData.cityName}}</FormItem>
        <FormItem>
          <div v-for="(item, index) in formData._list" :key="index">
            <p class="lli">
              <span>{{item.outageSubCategoryName}}</span>
              <span>{{item.outageCategoryName}}</span>
              <span>{{item.recoupDuration}}</span>
            </p>
            <!-- <div style="display: flex;">
              <FormItem
                label=""
                style="margin-rigth:10px;"
              >{{formData.subCategoryNames}}</FormItem>
              <FormItem :prop="'faultList.' + index + '.responsibility'"></FormItem>
              <FormItem label="最大可补偿时长"></FormItem>
            </div> -->
          </div>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="cancelData">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  addCompensateRule, //新增补偿列表
  editCompensateRule, //编辑补偿列表
  deleteCompensateRule, //删除补偿列表
  getRuleDetail, //补偿列表详情
  getpageList, //查询列表
  queryConfigType
} from "_o/api/compensate.js";
export default {
  props: {
    value: {
      type: Boolean,
      required: true
    },
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      showModal: false,
      formData: {}
    };
  },
  watch: {
    value: {
      handler(value) {
        this.showModal = value;
        this.formData = this.data
        if(this.showModal) this.getDetail(this.formData.cityCode)
      },
      immediate: true
    },
    showModal(value) {
      this.$emit("input", value);
    }
  },
  methods: {
    getDetail(cityCode) {
      getRuleDetail({cityCode}).then(res => {
        console.log(res)
        if(res.data.success) {
          // this.formData._list = res.data.data
          this.$set(this.formData, '_list', res.data.data)
        }
      })
    },
    cancelData() {
      this.showModal = false;
    }
  }
};
</script>

<style lang="less" scoped>
.lli {
  & > span {
    margin-right: 20px;
  }
}
</style>
