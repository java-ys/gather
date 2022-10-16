<template>
  <Modal
    v-model="show"
    width="46%"
    title="新增公告"
    :mask-closable="false"
    @on-cancel="e => cancel()"
  >
    <div>
      <Form ref="_form" :label-width="110" :model="formData" :rules="formRules">
        <FormItem label="公告状态：">
          <span>待审批</span>
        </FormItem>
        <FormItem label="公告位置：">
          <span>乘客消息中心</span>
        </FormItem>
        <FormItem label="公告类型：" prop="noticeType">
          <RadioGroup v-model="formData.noticeType">
            <Radio :label="11" :value="11">订阅消息</Radio>
            <Radio :label="12" :value="12">新闻动态</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="发送范围：" class="special-form-line" prop="target">
          <TreeInputs
            v-model="formData.target"
            :data="cityList"
            @on-change="treeChange"
          >
          </TreeInputs>
        </FormItem>
        <FormItem label="公告标题：" prop="noticeTitle">
          <Input
            v-model="formData.noticeTitle"
            :maxlength="17"
            placeholder="请填写公告标题"
            style="width: 300px"
          />
        </FormItem>
        <div>
          <FormItem label="公告副标题：">
            <Input
              v-model="formData.noticeSubTitle"
              placeholder="请填写公告副标题"
              :maxlength="50"
              style="width: 300px"
            />
          </FormItem>
          <FormItem label="公告banner图：">
            <Alert style="width: 300px">建议图片尺寸1400x656</Alert>
            <UploadImg
              ref="_uploadImg"
              :action="_baseUrl + '/common/uploadPics'"
              @on-uperror="onUperror"
              @before-upload="beforeUpload"
              @on-upsuccess="getPicUrl"
            >
            </UploadImg>
          </FormItem>
        </div>
        <FormItem label="跳转链接：">
          <Input
            v-model="formData.noticeLink"
            placeholder="请填写跳转链接"
            :maxlength="200"
            style="width: 300px"
          />
        </FormItem>
        <FormItem label="时间段：" prop="time">
          <DatePicker
            v-model="formData.time"
            :options="dayOptions"
            type="datetimerange"
            placeholder="请选择上下线日期"
            style="width: 300px"
          >
          </DatePicker>
        </FormItem>
        <FormItem
          v-if="formData.noticeType - 11 === 0"
          label="发布类目："
          prop="publishMenuCode"
        >
          <Select
            v-model="formData.publishMenuCode"
            style="width: 300px"
            placeholder="请选择发布类目"
          >
            <Option
              :value="item.value"
              :key="index"
              v-for="(item, index) in catList"
              >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
      </Form>
    </div>
    <div slot="footer">
      <Button type="primary" ghost @click="e => cancel()">取消</Button>
      <Button type="primary" :loading="loading" @click="submit">
        <span>提交</span>
      </Button>
    </div>
  </Modal>
</template>

<script>
import UploadImg from "_a/v-upload/v-upload.vue";
import TreeInputs from "_a/tree-input/tree-input.vue";
import { getAppointedCityInAuth, axiosAccessCityAgent } from "_g/api/common.js";
import { announceSubmit } from "_o/components/short-message-center/passenger-info/service";
import { freeze } from "@/mixins/base";
import { arrValidator } from "../fields";
export default {
  components: {
    UploadImg,
    TreeInputs
  },
  inject: ['getCatList'],
  computed: {
    catList() {
      return this.getCatList() || []
    }
  },
  data() {
    return {
      show: false,
      formData: {
        noticeType: "",
        noticeSubTitle: "",
        noticeLink: "",
        target: [],
        time: [],
        publishMenuCode: ""
      },
      loading: false,
      opGroup: [],
      cityList: [],
      dayOptions: freeze({
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      }),
      formRules: freeze({
        noticeType: [{ required: true, message: "请选择公告类型" }],
        noticeTitle: [{ required: true, message: "请输入公告标题" }],
        target: [
          { required: true, validator: arrValidator("发送范围不得为空") }
        ],
        time: [
          {
            required: true,
            type: "array",
            validator: arrValidator("时间段不得为空")
          }
        ],
        publishMenuCode: [{ required: true, message: "请选择发布类目" }]
      })
    };
  },
  mounted() {
    this.getCitys();
  },
  methods: {
    async submit() {
      let valid = await this.$refs._form.validate();
      if (!valid) return;
      const { success } = await announceSubmit(this.getSubmitParams());
      if (!success) {
        this.$Message.error("添加失败");
        return;
      }
      this.$Message.success("添加成功");
      this.cancel(true);
    },
    getSubmitParams() {
      let {
        noticeType,
        publishMenuCode,
        noticeBanner,
        target,
        noticeTitle,
        noticeSubTitle,
        noticeLink,
        time
      } = this.formData;
      return {
        localtion: 2,
        noticeType,
        noticeBanner,
        target,
        noticeTitle,
        noticeSubTitle,
        noticeLink,
        time,
        status: 1,
        upTime: Date.parse(time[0]),
        downTime: Date.parse(time[1]),
        ...(noticeType - 11 === 0 ? { publishMenuCode } : {})
      };
    },
    treeChange() {
      this.$refs._form.validateField("target");
    },
    init(p) {
      this.show = true;
    },
    getPicUrl(res) {
      this.loading = false;
      this.formData.noticeBanner = res.data.picUrl;
    },
    beforeUpload(file) {
      this.loading = true;
    },
    onUperror() {
      this.loading = false;
    },
    cancel(p) {
      this.show = false;
      this.$refs._form.resetFields();
      this.$refs._uploadImg?.clear();
      this.formData.noticeLink = ""
      this.formData.noticeSubTitle = ""
      p && this.$emit("refresh");
    },
    getCitys() {
      let params = {
        areaType: 2,
        businessLineList: [1, 2, 4, 6, 7]
      };
      getAppointedCityInAuth(params).then(res => {
        let resData = res.data.data || {};
        let list = resData.openAreaConfigDtoList || [];
        if (list.length > 0) {
          list.forEach(item => {
            item.value = item.cityId;
            item.title = item.city;
          });
          this.cityList = [
            {
              children: list,
              title: "全部城市",
              value: "000000",
              expand: true
            }
          ];
        }
      });
    }
  }
};
</script>
