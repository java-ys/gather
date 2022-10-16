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
        >
          <Row>
            <Col span="12">
              <FormItem label="策略名称：">
                <span>{{addForm.strategyName}}</span>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="选择终端：">
               <span>{{addForm.terminal | terminalF}}</span>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="选择首页：" prop="menu">
                <span>{{addForm.menuName}}</span>
              </FormItem>
            </Col>
          </Row>

          <Row type="flex" justify="start">
            <Col span="24">
              <FormItem label="选择首页风格：" prop="style">
                <RadioGroup v-model="addForm.style" >
                  <Row>
                    <Col span="8">
                      <Radio label="0" disabled>
                        <span>默认风格</span>
                        <div><img :src="img1" class="img-t" alt=""></div>
                      </Radio>
                    </Col>
                    <Col span="8">

                      <Radio label="1" disabled>
                        <span>自定义风格1</span>
                        <div>
                          <img :src="img2" class="img-t" alt="">
                        </div>
                      </Radio>
                    </Col>
                    <Col span="8">

                      <Radio label="2" disabled>
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
              <FormItem label="大头针颜色：">
<!--                <ColorPicker v-model="addForm.pinColor" disabled />-->
                <span>{{addForm.pinColor}}</span>
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
                <img v-if="addForm.noticeBg" :src="addForm.noticeBg" class="bg-img" alt="">
              </FormItem>
            </Col>
          </Row>

<!--          <Row>-->
<!--            <FormItem label="有效期：" prop="dateRange">-->
<!--              <span>{{addForm.startDate}}-{{addForm.endDate}}</span>-->
<!--            </FormItem>-->
<!--          </Row>-->
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" ghost @click="(e) => cancel()"
        >取消</Button
        >
      </div>
    </Modal>
  </div>
</template>

<script>
import imgUpload from "_a/img-upload/index.vue";
import img1 from "@/view/other-modules/assets/page/type1.jpg"
import img2 from "@/view/other-modules/assets/page/type2.jpg"
import img3 from "@/view/other-modules/assets/page/type3.jpg"
import {
  terminalDesc,
  themeId_to_index
} from "../fields";

const _addForm = {
  strategyName: "", //
  terminal: "", //
  menu: "", //
  style: "",
  pinColor: "", // 大头针颜色
  noticeBg: "", // 通知条背景
  start_date: "", // 开始时段 Date
  end_date: "", // 结束时段 Date
  dateRange: "", // 多次的起止日期
};
export default {
  name: "home-page-detail",
  components: {
    imgUpload
  },
  inject: ["allMenu"],
  filters: {
    terminalF(v) {
      let ll = v.split(",")
      return ll.map(k => (terminalDesc[k])).join(", ");
    }
  },
  computed: {
    allMenuList() {
      return this.allMenu()
    }
  },
  data() {
    return {
      show: false,
      addForm: JSON.parse(JSON.stringify(_addForm)),
      pageData: {},
      title: "",
    };
  },
  created() {
    this.img1 = img1
    this.img2 = img2
    this.img3 = img3
  },
  methods: {
    async init(p = {}) {
      this.pageData = p;
      this.initData()
      this.showModal();
    },
    initData() {
      this.title = "查看策略";
      this.addForm = {...this.addForm, ...this.pageData};
      let style = {}
      try {
        style = JSON.parse(this.pageData.style)
      } catch {
        style = {}
      }
      this.addForm.style = themeId_to_index[style.themeId]

      let list = this.allMenuList;
      let f = list.find(it => `${it.value}` === `${this.addForm.menu}`)
      if(f) {
        this.addForm.menuName = f.label
      }
    },
    clear() {
      this.addForm = JSON.parse(JSON.stringify(_addForm));
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
  },
};
</script>

<style scoped lang="less">
.modal-s {
  background-color: #f2f2f2;
}

.t {
  font-size: 16px;
  margin-bottom: 10px !important;
}

.img-t {
  width: 60%;
}
.bg-img {
  width: 100px;
  display: inline-block;
}
</style>
