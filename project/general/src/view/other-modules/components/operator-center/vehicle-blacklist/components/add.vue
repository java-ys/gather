<!--
 * @Author: NapierPLUS
 * @Date: 2021-07-20 21:11:43
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2021-08-19 16:29:44
 * @Description: 新建、编辑
-->
<template>
  <div>
    <Modal
      ref="addmodal"
      v-model="showModal"
      :title="type === 0 ? '新建' : '编辑'"
      :width="1200"
      :mask-closable="false"
      :closable="false"
    >
      <Form ref="form" :model="form" :rules="formRule" :label-width="120">
        <FormItem label="城市:" prop="cityUuid">
          <Select
            v-model="form.cityUuid"
            style="width: 300px"
            filterable
            clearable
            @on-change="handleSelectCity"
          >
            <Option
              v-for="key in cityList"
              :key="key.cityUuid"
              :value="key.cityUuid"
            >
              {{key.cityName}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="车牌：" prop="plateNum">
          <Input v-model="form.plateNum" style="width:300px;" placeholder="请输入" :maxlength="50" />
        </FormItem>
        <FormItem label="备注：" prop="remark">
          <Input v-model="form.remark" type="textarea" style="width:300px;min-height:200px" placeholder="请输入" :maxlength="50" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="onCancel">取消</Button>
        <Button type="primary" @click="onOk">
          <span>确定</span>
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { formRule } from "./fields"
import { addBlacklist } from "_o/api/lease"
export default {
  components: {

  },
  props: {
    type: {
      type: Number,
      default: 0
    },
    detailData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    cityList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      form: {

      },
      formRule: formRule(this),
      showModal: false,
    };
  },
  watch: {
    showModal(val) {
      if (!val) {
        this.resetFields()
      } else {
        this.init()
      }
    }
  },
  mounted() {
  },
  methods: {
    init() {
    },
    resetFields() {
      this.$refs["form"].resetFields()
      this.form = {}
    },
    async onOk() {
      this.showModal = true;
      this.$refs.addmodal.visible = true;
      try {
        const res = await this.$refs["form"].validate();
        if (res) {
          let formParams = {
            ...this.form
          }
          const requestApi = addBlacklist
          this.$Modal.confirm({
            title: "确定提交吗",
            onOk: async () => {
              const {
                data: {
                  success
                }
              } = await requestApi(formParams)
              if (success) {
                this.changeShowModal()
                this.resetFields()
                this.$emit("on-add-success")
              }
            }
          });
        } else {
          this.$Message.error("请检查输入项");
        }
      } catch (error) {
        console.log(error);
      }
    },
    onCancel() {
      this.$Modal.confirm({
        title: "确定取消操作吗？",
        onOk: async () => {
          this.showModal = false;
          this.resetFields()
        }
      });
    },
    changeShowModal() {
      this.showModal = !this.showModal;
    },
    handleSelectCity(val) {
      if (val) {
        this.form.cityName = this.cityList.find(it => it.cityUuid === val).cityName || ""
      }
    }
  }
};
</script>

<style lang="less" scoped>
.action {
  margin: 0 0 15px;
}
.filename{
    color:#3399dd;
    padding:10px;
}
</style>
