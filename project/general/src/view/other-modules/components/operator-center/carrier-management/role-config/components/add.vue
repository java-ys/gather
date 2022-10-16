<template>
  <Modal
    v-model="showModal"
    title="新建"
    width="700"
    :mask-closable="false"
    @on-cancel="e=>cancel()"
  >
    <Form
      ref="_applyForm"
      :model="formData"
      :rules="rules"
      class="leaveInfo-form"
      :label-width="135"
    >
      <FormItem label="所属角色组" prop="groupCode">
        <Select v-model="formData.groupCode" class="input-width" label-in-value>
          <Option key="1" :value="0">合作伙伴组</Option>
          <Option key="2" :value="1">城市组</Option>
<!--          <Option key="3" :value="2">用户增长组</Option>-->
          <Option key="4" :value="3">财务组</Option>
        </Select>
      </FormItem>
      <!-- 只有城市组 需要选城市 -->
      <FormItem label="城市" v-if="`${formData.groupCode}` === '1'" prop="city">
        <!-- <Cascader
          v-model="formData.city"
          :data="cascaderList"
          placeholder="请选择"
          style="width: 240px"
        ></Cascader> -->
        <Select
          v-model="formData.city"
          class="input-width"
          filterable
          multiple
          label-in-value
          @on-change="cityChange"
        >
          <OptionGroup
            :key="index"
            :label="it.label"
            v-for="(it, index) in cascaderList"
          >
            <Option
              v-for="item in it.children"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </OptionGroup>
        </Select>
      </FormItem>
      <FormItem label="手机号" prop="userPhone">
        <Input
          v-model="formData.userPhone"
          placeholder="请输入"
          :maxlength="11"
          class="input-width"
          @on-change="telChange"
        ></Input>
      </FormItem>
      <FormItem label="姓名">
        <span>{{ formData.userName }}</span>
      </FormItem>
      <FormItem label="工号">
        <span>{{ formData.empNo }}</span>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="primary" @click="save">确定</Button>
      <Button @click="e=>cancel()">取消</Button>
    </div>
  </Modal>
</template>

<script>
import { cpTranslate } from "@/libs/tools";
import { getProvinceCityList } from "_g/api/common.js";
import { tool } from "_o/api/baseMixin.js";
import {
  roleGroupPageService,
  roleGroupGetService,
  roleGroupSaveService,
  roleGroupUpdateService,
  roleGroupDeleteService,
  roleGroupQueryUserlistService,
  queryStaffByPhoneService,
} from "_o/api/roleConfig";
import { regTest } from "@/libs/tools";

const groupCodeList = ["HT_HZHB", "HT_CITY", "HT_YHZZ", "HT_CWSH"];
const groupNameList = ["合作伙伴组", "城市组", "用户增长组", "财务组"];
const _formData = {
  city: [],
  id: "",
  groupCode: "",
  groupName: "",
  userId: "",
  userPhone: "",
  userName: "",
  empNo: "",
  cityNames: "",
};
export default {
  name: "set-add",
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    detail: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  mixins: [tool],
  watch: {
    visible: {
      handler(v) {
        this.showModal = v;
        if (v) {
          this.getCityList();
          this.initData();
        } else {
          Object.keys(_formData).forEach((it) => {
            this.formData[it] = _formData[it];
          });
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      showModal: false,
      cascaderList: [],
      selectCity: [],
      formData: {
        city: [],
        id: "",
        groupCode: "",
        groupName: "",
        userId: "",
        userPhone: "",
        userName: "",
        empNo: "",
        cityNames: "",
      },
      rules: {
        groupCode: [{ required: true, message: "请选择所属角色组" }],
        userPhone: [{ required: true, message: "请输入手机号" }],
        city: [{ required: true, message: "请选择城市" }],
      },
    };
  },
  methods: {
    initData() {
      let formData = {
        city: [],
        id: "",
        groupCode: "",
        groupName: "",
        userId: "",
        userPhone: "",
        userName: "",
        empNo: "",
        cityNames: "",
      };
      if (this.detail.id) {
        formData.empNo = this.detail.empNo;
        formData.id = this.detail.id;
        formData.groupCode = groupCodeList.findIndex(
          (it) => it === this.detail.groupCode
        );
        formData.groupName = this.detail.groupName;
        formData.userName = this.detail.userName;
        formData.userPhone = this.detail.userPhone;
        formData.cityNames = this.detail.cityNames;
        formData.userId = this.detail.userId;
        formData.city = this.detail.cityCodes.split(",");
      }
      Object.keys(this.formData).forEach((it) => {
        this.formData[it] = formData[it];
      });
    },
    cancel(r) {
      this.$refs._applyForm.resetFields()
      this.$emit("close", r);
    },
    cityChange(l) {
      this.selectCity = l;
    },
    async queryStaff() {
      let p = {
        systemId: "4",
        telephone: this.formData.userPhone,
      };
      const [err, data] = await this.toResult(queryStaffByPhoneService(p));
      if (err || !data) {
        return;
      }
      this.formData.empNo = data.empNo;
      this.formData.userName = data.name;
      this.formData.userId = data.id;
    },
    telChange(event) {
      let n = event.target.value;
      if (n.length === 11 && regTest(n, "mobile")) {
        this.queryStaff();
      }
    },
    save() {
      this.$refs._applyForm.validate(async (valid) => {
        if (!valid) return;

        if (!this.formData.userName || !this.formData.userId) {
          this.$Message.error("用户名不能为空");
          return;
        }
        let p = {
          groupCode: groupCodeList[+this.formData.groupCode],
          groupName: groupNameList[+this.formData.groupCode],
          userId: this.formData.userId,
          userPhone: this.formData.userPhone,
          userName: this.formData.userName,
          empNo: this.formData.empNo,
          cityNames: this.selectCity
            .map((it) => {
              return `${it.value}_${it.label}`;
            })
            .join(","), // 320100_南京
        };
        let func = roleGroupSaveService;
        let msg = "新增成功";
        if (this.detail.id) {
          func = roleGroupUpdateService;
          p.id = this.detail.id;
          msg = "更新成功";
        }
        const [err, data] = await this.toResult(func(p));
        if (err) {
          this.$Message.error(err.message);
          return;
        }
        this.$Message.success(msg);
        this.cancel(true);
      });
    },
    // 获取省市
    async getCityList() {
      const [err, data] = await this.toResult(getProvinceCityList({}));
      if (err) {
        this.$Message.error(err.message);
        return;
      }
      this.cascaderList = cpTranslate(data);
    },
  },
};
</script>

<style scoped lang="less">
.t-but {
  text-align: right;
}
.b-1 {
  margin-right: 20px;
}
.input-width {
  width: 240px;
}
</style>
