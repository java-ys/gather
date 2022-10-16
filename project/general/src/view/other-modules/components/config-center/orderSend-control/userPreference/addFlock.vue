<template>
  <Modal
    v-model="showModal"
    :title="title"
    :mask-closable="false"
    width="800px"
    :z-index="1"
  >
    <Form
      inline="inline"
      :model="formData"
      :label-width="85"
      :rules="formValidate"
      ref="form"
    >
      <Row>
        <FormItem label="用户群:" prop="groupId">
          <Select
            v-model="formData.groupId"
            filterable
            clearable
            label-in-value
            style="width:300px"
            @on-change="changeUser"
            :disabled="isHomeEdit"
          >
            <Option
              :value="item.groupId"
              v-for="(item, index) in groupList"
              :key="index"
              :disabled="isDisabled(item)"
              >{{ item.groupName }}</Option
            >
          </Select>
        </FormItem>
      </Row>
      <!-- <Row>
      <FormItem label="优先级系数:" prop="dispatchWeight">
        <Input
          clearable="clearable"
          style="width:300px"
          v-model="formData.dispatchWeight"
          :maxlength="3"
        />
      </FormItem>
       </Row> -->
      <Row>
        <FormItem label="" prop="absolutelyDispatch">
          <Checkbox v-model="formData.absolutelyDispatch">
            启用绝对优先派单
          </Checkbox>
        </FormItem>
      </Row>
      <Row>
        <FormItem label="" prop="nearbyDispatch">
          <Checkbox v-model="formData.nearbyDispatch">
            启用就近派单策略
          </Checkbox>
        </FormItem>
      </Row>
    </Form>
    <div slot="footer">
      <Button @click="showModal = false">取消</Button>
      <Button type="primary" v-lazy-click="saveData">完成</Button>
    </div>
  </Modal>
</template>

<script>
import { validatorTime } from "./fields";
import { queryGroupLists, userPreferenceList } from "_o/api/configData.js";
export default {
  name: "add",
  data() {
    let self = this;
    return {
      showModal: false,
      title: "添加用户群",
      groupList: [],
      formData: {},
      formValidate: {
        dispatchWeight: [
          {
            required: true,
            message: "必填",
            trigger: "change"
          },
          {
            pattern: /^(\d+|\d+\.\d{1})$/,
            message: "0.1-2.0之间,保留1位小数",
            trigger: "change"
          }
        ],
        groupId: [
          {
            required: true,
            message: "必选",
            trigger: "change"
          }
        ]
      },
      isAdd: false,
      isHomeEdit: false,
      fromTableData: []
    };
  },
  mounted() {
    this.getQueryGroupList();
  },
  methods: {
    init(val) {
      this.showModal = true;
      this.$refs.form.resetFields();
      this.fromTableData = val.tableData;
      // 新增
      if (val.isAdd) {
        this.isAdd = true;
        this.isHomeEdit = false;
        this.formData = {
          dispatchWeight: "",
          groupId: "",
           absolutelyDispatch:false,
          nearbyDispatch:false,

        };
      }
      // 编辑
      else {
        this.isAdd = false;
        this.isHomeEdit = val.isHomeEdit;
        this.formData = {
          groupId: val.groupId,
          groupName: val.groupName,
          // dispatchWeight: String(val.dispatchWeight)
          absolutelyDispatch:val.absolutelyDispatch,
          nearbyDispatch:val.nearbyDispatch,
        };
        this.selectUserGroup = {
          groupId: val.groupId,
          groupName: val.groupName,
          onlineStatus: val.onlineStatus
        };
      }
    },
    getQueryGroupList() {
      queryGroupLists({
        pageSize: 10000,
        currPage: 1
      }).then(res => {
        let data = res.data.data || {};
        this.groupList = data.list;
      });
    },
    saveData() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submit();
        }
      });
    },
    changeUser(val) {
      if (!val) return;
      console.log(val);
      this.selectUserGroup = {
        groupId: val.value,
        groupName: val.label
      };
    },
    isDisabled(val) {
      let flag = false;
      if (val.crowdState === 1) {
        flag = false;
      } else {
        flag = true;
      }
      this.fromTableData.forEach(item => {
        if (item.groupId === val.groupId && item.groupName === val.groupName) {
          flag = true;
        }
      });

      return flag;
    },
    submit() {
      // 0 00 01  000 001
      // if (
      //   this.formData.dispatchWeight > 2 ||
      //   this.formData.dispatchWeight < 0.1 ||
      //   this.formData.dispatchWeight === "0" ||
      //   this.formData.dispatchWeight === "00" ||
      //   this.formData.dispatchWeight === "01" ||
      //   this.formData.dispatchWeight === "000" ||
      //   this.formData.dispatchWeight === "001"
      // ) {
      //   this.$Message.warning("优先级系数范围0.1-2.0,保留1位小数");
      //   return;
      // }
      this.showModal = false;
      // if (this.formData.dispatchWeight === "1") {
      //   this.formData.dispatchWeight = "1.0";
      // }
      // if (this.formData.dispatchWeight === "2") {
      //   this.formData.dispatchWeight = "2.0";
      // }
      let backData = {
        groupId: this.selectUserGroup.groupId,
        groupName: this.selectUserGroup.groupName,
        // dispatchWeight: this.formData.dispatchWeight,
        absolutelyDispatch:this.formData.absolutelyDispatch,
        nearbyDispatch:this.formData.nearbyDispatch,
      };

      this.groupList.forEach(item => {
        if (item.groupId === this.selectUserGroup.groupId) {
          backData.onlineStatus = item.crowdState;
          backData.crowdState = item.crowdState;
        }
      });
      if (this.isAdd) {
        backData.flag = "add";
        this.$emit("backData", backData);
      } else {
        this.$emit("backData", backData);
      }
    }
  }
};
</script>
