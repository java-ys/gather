<template>
  <div>
    <Modal
      v-model="show"
      width="1000"
      :title="title"
      :mask-closable="false"
      class="modal-s"
      @on-cancel="cancel"
    >
      <div class="pr">
        <Form
          ref="_form"
          :model="addForm"
          :label-width="150"
          :rules="validateRules"
        >
          <Row>
            <Col span="12">
              <FormItem label="策略名称：" prop="strategyName">
                <Input
                  v-model="addForm.strategyName"
                  class="item-width"
                  :maxlength="20"
                  placeholder="请输入任务名称"
                ></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="选择终端：" prop="terminal">
                <Select
                  v-model="addForm.terminal"
                  class="input-width item-width"
                  multiple
                  @on-change="terminalChange"
                >
                  <Option
                    v-for="(item, index) in terminalList"
                    :value="item.value"
                    :key="index"
                  >{{ item.label }}</Option
                  >
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="选择首页：" prop="menu">
                <Select
                  v-model="addForm.menu"
                  class="input-width item-width"
                >
<!--                  <Option :key="-1" value="-1">全部</Option>-->
                  <Option
                    v-for="(item, index) in menuList"
                    :value="item.value"
                    :key="index"
                  >{{ item.label }}</Option
                  >
                </Select>
              </FormItem>
            </Col>
          </Row>

          <Row type="flex" justify="start">
            <Col span="24">
              <FormItem label="选择首页风格：" prop="style">
                <RadioGroup v-model="addForm.style">
                  <Row>
                    <Col span="8">
                  <Radio label="0">
                    <span>默认风格</span>
                    <div><img :src="img1" class="img-t" alt=""></div>
                  </Radio>
                    </Col>
                    <Col span="8">

                    <Radio label="1">
                      <span>自定义风格1</span>
                    <div>
                      <img :src="img2" class="img-t" alt="">
                    </div>
                  </Radio>
                    </Col>
                    <Col span="8">

                    <Radio label="2">
                      <span>自定义风格2</span>
                    <div>
                      <img :src="img3" class="img-t" alt="">
                    </div>
                  </Radio>
                    </Col>
                  </Row>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col span="12">
              <FormItem label="大头针颜色：" prop="">
<!--                <ColorPicker v-model="addForm.pinColor" />-->
                <Input
                  v-model="addForm.pinColor"
                  class="item-width"
                  :maxlength="20"
                  placeholder="#333333"
                ></Input>
              </FormItem>
            </Col>
          </Row>
<!--

                  :width="110"
                  :height="120"
-->
          <Row>
            <Col span="12">
              <FormItem label="通知条背景：">
                <img-upload
                  :defaultImg="addForm.noticeBg"
                  :headerParams="{}"
                  :action="actionUrl"
                  :params="{}"
                  :format="['jpg', 'png', 'gif']"
                  @on-change="getImgUrl"
                ></img-upload>
              </FormItem>
            </Col>
          </Row>

<!--          <Row>-->
<!--            <FormItem label="有效期：" prop="dateRange">-->
<!--              <DatePicker-->
<!--                v-model="addForm.dateRange"-->
<!--                type="datetimerange"-->
<!--                class="item-width"-->
<!--                placeholder="请选择日期"-->
<!--                :editable="false"-->
<!--                :options="DatePickerOption"-->
<!--                style="width: 310px;"-->
<!--                @on-change="dateChange"-->
<!--              >-->
<!--              </DatePicker>-->
<!--            </FormItem>-->
<!--          </Row>-->
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" ghost @click="(e) => cancel()"
          >取消</Button
        >
        <Button
          type="primary"
          :loading="submitLoading"
          @click="save"
        >
          <span>确定</span>
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { tool, freeze } from "@/mixins/base";
import { addHomePage } from "_o/api/homePage"
import imgUpload from "_a/img-upload/index.vue";
import {pageConfig} from "../fields"
import img1 from "@/view/other-modules/assets/page/type1.jpg"
import img2 from "@/view/other-modules/assets/page/type2.jpg"
import img3 from "@/view/other-modules/assets/page/type3.jpg"
import {
  terminalList,
} from "../fields";
import {fetchMenuList} from "../service";


const rules = {
  strategyName: [
    {
      required: true,
      message: "请输入策略名称",
      trigger: "change",
    },
  ],
  terminal: [{ required: true, message: "请选择终端" }],
  menu: [{ required: true, message: "请选择首页" }],
  style: [{ required: true, message: "请选择首页风格" }],
  dateRange: [{ required: true, type: 'array', message: "请选择有效期", trigger: 'change', fields: {
      0: {type: 'date', required: true, message: '请选择日期'},
      1: {type: 'date', required: true, message: '请选择日期'}
    } }]
};
const _addForm = {
  strategyName: "", // 策略名称
  terminal: "", // 终端
  menu: "", // 首页
  style: "",
  pinColor: "", // 大头针颜色
  noticeBg: "", // 通知条背景
  // start_date: "", // 开始时段 Date
  // end_date: "", // 结束时段 Date
  // dateRange: "", // 多次的起止日期
};
export default {
  name: "home-page-edit",
  mixins: [tool],
  components: {
    imgUpload
  },
  // inject: ["getMenuList"],
  data() {
    return {
      actionUrl: this._baseUrl + "/common/uploadFile",
      terminalList: freeze(terminalList),
      validateRules: freeze(rules),
      DatePickerOption: freeze({
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      }),

      submitLoading: false,
      show: false,

      addForm: JSON.parse(JSON.stringify(_addForm)),
      pageData: {},
      title: "",
      menuList: []
    };
  },
  created() {
    this.img1 = img1
    this.img2 = img2
    this.img3 = img3
  },
  // computed: {
  //   menuList() {
  //     return this.getMenuList()
  //   }
  // },
  methods: {
    init(p = {}) {
      this.pageData = p;
      this.initData().showModal();
    },
    initData() {
      if (!Object.keys(this.pageData).length) {
        this.title = "新增策略";
        return this;
      }

      return this;
    },
    save() {
      this.$refs._form.validate((valid) => {
        if (!valid) return;
        let p = this.getSaveParams();

        if (!this.checkParams(p)) return;

        this.$Modal.confirm({
          title: "提示",
          content: `确定提交吗?`,
          onOk: async () => {
            const [err, data] = await this.toResult(addHomePage(p));
            if (err) {
              return;
            }
            this.$Message.success(`${this.title}成功`);
            this.$emit("refresh");
            this.cancel();
          }
        })
      });
    },
    getSaveParams() {
      let p = {...this.addForm}
      // delete p.dateRange
      p.style= pageConfig[p.style];
      p.terminal = p.terminal.join(",")
      return p;
    },
    checkParams(p) {
      return true;
    },
    clear() {
      this.addForm = JSON.parse(JSON.stringify(_addForm));
      this.$refs._form.resetFields();
      return this;
    },
    cancel() {
      this.clear().hideModal();
      return this;
    },
    showModal() {
      this.show = true;
      return this;
    },
    hideModal() {
      this.show = false;
    },
    // dateChange(v) {
    //   const [start, end] = v || [];
    //   this.dateRange = v;
    //   this.addForm.start_date = start;
    //   this.addForm.end_date = end;
    // },
    getImgUrl(url, { fileUrl, fileName, fileUuid }) {
      this.addForm.noticeBg = fileUrl;
    },
    async terminalChange(v) {
      if(v.length) {
        const {originList} = await fetchMenuList(v);
        this.menuList = originList.filter(it => it.menuPage - 1 === 0).map(it => {
          //  0 无媒介通用  1 APP 2 微信小程序 3支付宝小程序 '
          let msgArr = ["通用", "APP", "微信小程序"]
          let typeMsg = msgArr[it.mediumType] ? msgArr[it.mediumType] + "-" : ""
          return {
            label: `${typeMsg}${it.menuName}`,
            value: it.menuCode,
          }
        })
      } else {
        this.menuList = []
      }
      this.addForm.menu = ""
    }
  },
};
</script>

<style scoped lang="less">
.modal-s {
  background-color: #f2f2f2;
}
.mb-40 {
  margin-bottom: 40px;
}
.t {
  font-size: 16px;
  margin-bottom: 10px !important;
}
.item-width {
  width: 240px;
}
.flex-c {
  display: flex;
  flex-direction: row;
}
.ml-20 {
  margin-left: 20px;
}
.it-width {
  width: 140px;
}
.flex-r {
  display: flex;
  flex-direction: row;
}
.mb-10 {
  margin-bottom: 10px;
}
.b-time {
  color: #ed4014;
}
.img-t {
  width: 60%;
}
</style>
