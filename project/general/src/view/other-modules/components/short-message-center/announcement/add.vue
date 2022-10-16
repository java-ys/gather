<template>
  <Card class="announce-add">
    <p slot="title">新增公告</p>
    <Form :label-width="110">
      <FormItem label="公告状态：">
        <span>待发布</span>
      </FormItem>
      <FormItem label="公告位置：">
        <RadioGroup v-model="announceForm.localtion" @on-change="changeRadio">
          <Radio :label="1" :value="1">首页轮播</Radio>
<!--          <Radio :label="2" :value="2">乘客公告</Radio>-->
          <Radio :label="3" :value="3">司机公告</Radio>
          <Radio :label="4" :value="4">发票中心</Radio>
          <Radio :label="5" :value="5">运营商公告</Radio>
        </RadioGroup>
      </FormItem>
    </Form>

    <Form ref="treeValidate" :model="announceForm" :label-width="110" :rules="treeRule">
      <div v-if="announceForm.localtion === 3" key="driver-box">
        <FormItem label="发送范围：" prop="targetType">
          <RadioGroup v-model="announceForm.targetType" @on-change="changeTarget">
            <Radio :label="1" :value="1">运营商</Radio>
            <Radio :label="2" :value="2">工资类别</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem v-if="announceForm.targetType === 2" label="发送城市：" class="special-form-line" prop="cityCodeList">
          <TreeInputs
            v-model="announceForm.cityCodeList"
            :data="cityList"
          >
          </TreeInputs>
        </FormItem>
        <FormItem v-if="announceForm.targetType === 1" key="tree-agent" class="special-form-line" prop="target">
          <TreeInputs
            v-model="announceForm.target"
            :data="opGroup"
          >
          </TreeInputs>
        </FormItem>
        <FormItem v-if="announceForm.targetType === 2" key="wages-box" label="工资类别：" prop="salaryTypeList">
          <Select v-model="announceForm.salaryTypeList" style="width: 200px" placeholder="请选择" multiple filterable clearable>
            <Option v-for="item in wagesTypeList" :key="item.itemcode" :value="item.itemcode">{{item.itemvalue}}</Option>
          </Select>
        </FormItem>
      </div>
      <div v-else-if="isLeagueAnounce">
        <FormItem key="tree-agent" label="发送范围：" class="special-form-line" prop="agentUuidList">
          <TreeInputs
            v-model="announceForm.agentUuidList"
            :data="opGroup"
          >
          </TreeInputs>
        </FormItem>
      </div>
      <div v-else key="else-box">
        <FormItem label="发送范围：" class="special-form-line" prop="target">
          <TreeInputs
            v-model="announceForm.target"
            :data="cityList"
          >
          </TreeInputs>
        </FormItem>
      </div>
      <FormItem v-if="announceForm.localtion === 3 && announceForm.targetType === 1" label="司机类型：" prop="driverTypeList">
        <CheckboxGroup v-model="announceForm.driverTypeList">
          <Checkbox v-for="item in driverTypeList" :key="item.value" :label="item.value">{{item.label}}</Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem v-if="isLeagueAnounce" label="角色类型：" prop="agentRoleList">
        <!-- 全部与其他角色互斥其他可多选 -->
        <Select
          v-model="announceForm.agentRoleList"
          style="width: 300px"
          placeholder="请选择角色类型"
          multiple
          filterable
          @on-change="agentRoleChange"
        >
          <Option value="allRoles">全部角色</Option>
          <Option value="agentMgr">运营商管理员</Option>
          <Option value="driverMgr">司管</Option>
          <Option value="carMgr">车管</Option>
          <Option value="secMgr">安全员</Option>
        </Select>
      </FormItem>
    </Form>
    <Form ref="formValidate" :model="announceForm" :label-width="110" :rules="dataRule">
      <FormItem v-if="announceForm.localtion === 3" label="公告类型：" prop="noticeType">
        <Select v-model="announceForm.noticeType" style="width: 300px" placeholder="请选择公告类型">
          <Option :value="1">政策通知</Option>
          <Option :value="2">培训通知</Option>
          <Option :value="3">其他通知</Option>
        </Select>
      </FormItem>
      <FormItem v-if="isLeagueAnounce" label="公告类型：" prop="noticeType">
        <Select v-model="announceForm.noticeType" style="width: 300px" placeholder="请选择公告类型">
          <Option :value="1">政策通知</Option>
          <Option :value="3">其他通知</Option>
        </Select>
      </FormItem>
      <FormItem label="公告标题：" prop="noticeTitle">
        <Input v-model="announceForm.noticeTitle" :maxlength="maxlengthTitle" :placeholder="placeHolder" style="width: 300px" />
      </FormItem>
      <div v-if="announceForm.localtion !== 1">
        <FormItem label="公告副标题：">
          <Input v-model="announceForm.noticeSubTitle" placeholder="请填写公告副标题" style="width: 300px" />
        </FormItem>
        <FormItem v-if="announceForm.localtion !== 4" label="公告banner图：">
          <Alert style="width: 300px">建议图片尺寸1400x656</Alert>
          <UploadImg
            :action="_baseUrl + '/common/uploadPics'"
            @on-uperror="onUperror"
            @before-upload="beforeUpload"
            @on-upsuccess="getPicUrl"
          >
          </UploadImg>
        </FormItem>
      </div>
      <FormItem v-if="announceForm.localtion !== 4" label="跳转链接：">
        <Input v-model="announceForm.noticeLink" placeholder="请填写跳转链接" style="width: 300px" />
      </FormItem>
      <FormItem label="时间段：" prop="time">
        <DatePicker
          v-model="announceForm.time"
          :clearable="false"
          :options="dayOptions"
          type="datetimerange"
          placeholder="请选择上下线日期"
          style="width: 300px"
        >
        </DatePicker>
      </FormItem>
      <div style="margin-left: 110px;">
        <Button style="margin-right: 10px;" @click="back">返回</Button>
        <Button v-lazy-click="submit" type="primary" :loading="loading">提交</Button>
      </div>
    </Form>
  </Card>
</template>

<script>
import UploadImg from "_a/v-upload/v-upload.vue"
import TreeInputs from "_a/tree-input/tree-input.vue"
import { addAnnounce, salaryTypeList } from "_o/api/announcement.js"
import { getAppointedCityInAuth, axiosAccessCityAgent } from "_g/api/common.js"
import { driverTypeList } from "_g/config/status-map";
export default {
  components: {
    UploadImg,
    TreeInputs
  },
  data() {
    const targetPass = (rule, value, callback) => {
      if (value.length) callback()
      else callback(new Error("发送范围不得为空"))
    }
    const timePass = (rule, value, callback) => {
      if (value !== "") callback()
      else callback(new Error("时间段不得为空"))
    }
    const noticeType = (rule, value, callback) => {
      if (this.announceForm.localtion === 3) {
        if (value !== "" && typeof (value) !== "undefined") {
          callback()
        } else {
          callback(new Error("公告类型不得为空"))
        }
      }
      else { callback() }
    }
    const valNoticeTitle = (rule, value, callback) => {
      if (this.announceForm.localtion === 3) {
        if (value.length <= 18) {
          callback()
        } else {
          callback(new Error("建议15个字以内"))
        }
      }
      else { callback() }
    }
    return {
      driverTypeList,
      arr: [],
      maxlengthTitle: 99999,
      placeHolder: "请填写公告标题",
      treeRule: {
        target: [{
          required: true, trigger: "change", validator: targetPass
        }],
        cityCodeList: [{
          required: true, validator: targetPass
        }],
        targetType: [{
          required: true, type: "number", message: "发送范围不得为空", trigger: "change"
        }],
        agentUuidList: [{
          required: true, message: "发送范围不得为空"
        }],
        salaryTypeList: [{
          required: true, message: "请选择工资类别", type: "array", trigger: "change"
        }],
        driverTypeList: [{
          required: true, type: "array", message: "司机类型不得为空", trigger: "change"
        }],
        agentRoleList: [{
          required: true, type: "array", message: "请选择角色类型", trigger: "change"
        }]
      },
      dataRule: {
        noticeTitle: [{
          required: true, trigger: "change", message: "公告标题不得为空",
        }, {
          validator: valNoticeTitle, trigger: "change",
        }],
        time: [{
          required: true, validator: timePass, trigger: "change"
        }],
        noticeType: [{
          required: true, validator: noticeType, trigger: "change"
        }]
      },
      initAnno: {
        localtion: 1,
        noticeBanner: "",
        upTime: "",
        downTime: "",
        time: "",
        target: [],
        salaryTypeList: null,
        targetType: 1,
        driverTypeList: [],
        cityCodeList: []
      },
      dayOptions: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      },
      loading: false,
      announceForm: {
        target: [],
        agentUuidList: [], // 运营商
        agentRoleList: [] // 运营商角色
      },
      cityList: [],
      provinceCityList: [],
      opGroup: [],
      wagesTypeList: [],
    }
  },
  computed: {
    // 运营商公告
    isLeagueAnounce({ announceForm }) {
      return announceForm.localtion - 5 === 0
    }
  },
  mounted() {
    this.getCitys()
    this.getOpList()
    this.getsalaryTypeList();
    this.announceForm = JSON.parse(JSON.stringify(this.initAnno))
  },
  methods: {
    changeTarget(value) {
      if (value === 1) {
        this.announceForm.salaryTypeList = null
      } else {
        this.announceForm.target.splice(0, this.announceForm.target.length)
      }
      this.announceForm.driverTypeList = []
    },
    beforeUpload(file) {
      this.loading = true
    },
    onUperror() {
      this.loading = false
    },
    back() {
      this.$router.push({
        name: "announcement-center"
      })
    },
    getsalaryTypeList() {
      salaryTypeList({}).then(res => {
        let resData = res.data.data || {};
        this.wagesTypeList = resData
      })
    },
    getCitys() {
      let params = {
        areaType: 2,
        businessLineList: [1, 2, 4, 6, 7]
      }
      getAppointedCityInAuth(params).then(res => {
        let resData = res.data.data || {};
        let list = resData.openAreaConfigDtoList || []
        if (list.length > 0) {
          list.forEach(item => {
            item.value = item.cityId
            item.title = item.city
          })
          this.cityList = [{
            children: list,
            title: "全部城市",
            value: "000000",
            expand: true
          }]
        }

      })
    },
    getOpList() {
      axiosAccessCityAgent({}).then(res => {
        let agentList = res.data.data?.agentList || [];
        if (agentList.length > 0) {
          agentList.forEach(item => {
            item.title = item.label
            // eslint-disable-next-line no-unused-expressions
            item.children?.forEach(city => {
              city.title = city.label
                // eslint-disable-next-line no-unused-expressions
                city.children?.forEach(op => {
                  op.title = op.label
                })
            })
          })
          this.opGroup = [{
            children: agentList,
            title: "全部运营商",
            value: "000000",
            expand: true
          }]
        }
      })

    },
    changeRadio() { // 改变radio
      this.announceForm.target = []
      this.announceForm.driverTypeList = []
      this.announceForm.cityCodeList = []
      if (this.announceForm.localtion === 3) {
        this.placeHolder = "建议15个字以内"
        this.maxlengthTitle = 18
      } else {
        this.placeHolder = "请填写公告标题"
        this.maxlengthTitle = 99999
      }
      this.$nextTick(() => {
        if (this.announceForm.noticeTitle && this.announceForm.noticeTitle !== "") {
          this.$refs.formValidate.validateField("noticeTitle")
        }
      })

    },
    // TODO /common/uploadPics改造
    getPicUrl(res) {
      this.loading = false
      this.announceForm.noticeBanner = res.data.picUrl
    },
    submit() {
      this.$refs.treeValidate.validate().then(res1 => {
        this.$refs.formValidate.validate().then(res2 => {
          if (!(res1 && res2)) return

          this.announceForm.status = 1
          this.announceForm.upTime = Date.parse(this.announceForm.time[0])
          this.announceForm.downTime = Date.parse(this.announceForm.time[1])

          if (this.announceForm.localtion === 3) { // 司机公告
            if (this.announceForm.targetType === 1) { // 1 运营商
              delete this.announceForm.salaryTypeList
            } else { // 2 工资类别
              delete this.announceForm.target
            }
            delete this.announceForm.targetType
          }
          // 处理线上问题 targetType 0代表全体(或者不传) 1代表个体
          if (this.announceForm.targetType) {
            delete this.announceForm.targetType
          }
          if (!this.announceForm.salaryTypeList) {
            delete this.announceForm.salaryTypeList
          }
          addAnnounce(this.announceForm).then(res => {
            if (!res.data.success) {
              this.$Message.error("添加失败")
              return
            }
            this.$Message.success("添加成功")
            this.back()
          })
        })
      })
    },
    agentRoleChange(v) {
      if (v.find((it) => it === "allRoles")) {
        v.splice(0, v.length, "allRoles");
      }
    },
  }
}
</script>
<style lang="less">
  .announce-add .ivu-select-dropdown{
    max-height: 400px;
    overflow: auto;
  }
</style>
