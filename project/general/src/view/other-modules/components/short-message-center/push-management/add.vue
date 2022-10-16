<template>
  <div class="push-add">
    <Card :bordered="false">
      <p slot="title">新增push</p>
      <Form :label-width="140" :model="pushForm" :rules="ruleValidate" ref="pushForm">
        <Row>
          <Col span="8">
            <FormItem label="push状态 : ">
              <span>未推送</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="push标题 : " prop="title">
              <Input v-model="pushForm.title" placeholder="请输入" :maxlength="16"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="push副标题 : ">
              <Input v-model="pushForm.subTitle" placeholder="请输入" :maxlength="64"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="发送对象 : " prop="pushRole">
              <Select
                v-model="pushForm.pushRole"
                style="width:240px"
                @on-change="handelChangeItem(true)"
              >
                <Option
                  v-for="(item,index) in roleTypes"
                  :value="item.value"
                  :key="index"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="发送城市 : " prop="cityCodeList">
              <t-tree-input
                key="cityTree"
                :data="cityList"
                placeholder="请选择城市"
                @on-change="selectCity"
                v-model="pushForm.cityCodeList"
                inputWidth="400px"
              ></t-tree-input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="15">
            <FormItem label="用户选择方式 : " v-if="pushForm.pushRole==2" prop="target">
              <RadioGroup v-model="pushForm.target" @on-change="handelChangeItem">
                <Radio label="1">指定乘客</Radio>
                <Radio label="4">用户分群</Radio>
                <Radio label="3">批量</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="用户选择方式 : " v-if="pushForm.pushRole==1" prop="target">
              <RadioGroup v-model="pushForm.target" @on-change="handelChangeItem">
                <Radio label="1">指定司机</Radio>
                <Radio label="2">指定条件</Radio>
                <Radio label="3">批量</Radio>
                <Radio label="4">司机分群</Radio>
                <Radio label="21">工资类别</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <!-- 指定乘客/司机 -->
        <Row>
          <Col span="12">
            <FormItem v-if="pushForm.pushRole== 1 && pushForm.target == 1" prop="pushRangeDetail">
              <Input
                v-model="mobileStr"
                type="textarea"
                style="width:400px;"
                placeholder="请输入司机手机号，以英文逗号隔开"
                @change.native="changeCommaToArr()"
              />
            </FormItem>
            <FormItem v-if="pushForm.pushRole== 2 && pushForm.target == 1" prop="pushRangeDetail">
              <Input
                v-model="mobileStr"
                type="textarea"
                style="width:400px;"
                placeholder="请输入乘客手机号，以英文逗号隔开"
                @change.native="changeCommaToArr()"
              />
            </FormItem>
            <FormItem v-if="pushForm.pushRole == 1 && pushForm.target == 2" prop="operatorUuid">
              <input type="hidden" v-model="pushForm.operatorName" />
              <!-- <tree-input
                key="opTree"
                position="right-start"
                :TreeData="opGroup"
                IndexId="value"
                :parentData.sync="targetGroup"
                :parentKeyData.sync="targetGroup2"
                :selectAll="false"
              ></tree-input> -->
              <t-tree-input
                key="cityTree"
                :data="opGroup"
                placeholder="请选择运营商"
                @on-change="selectTree"
                v-model="pushForm.operatorUuid"
                inputWidth="400px"
              ></t-tree-input>
            </FormItem>
            <FormItem v-if=" pushForm.target == 3 ">
              <ImportFile
                :toDownTemplateUrl="downloadUrl"
                :importFileUrl="importUrl"
                :disabled="!pushForm.cityCodeList||pushForm.cityCodeList.length===0"
                :data="{roleType:pushForm.pushRole,cityCodes: pushForm.cityCodeList?pushForm.cityCodeList.join(','):''}"
                @on-success="uploadSuc"
                @on-error="uploadFail"
              ></ImportFile>
              <p style="color:#ed4014" v-if="!pushForm.cityCodeList||pushForm.cityCodeList.length===0">请先选择城市</p>
              <span v-show="pushForm.uploadFileUrl">已上传</span>
            </FormItem>
          </Col>
        </Row>
        <!-- 乘客/司机分组 -->
        <Row>
          <Col span="8">
            <FormItem label="乘客分组类别 :" prop="userGroupType" v-if="pushForm.pushRole===2 && pushForm.target === '4'">
              <Select v-model="pushForm.userGroupType" style="width: 200px" @on-change="clearUserGroup()">
                <Option value="1">注册城市</Option>
                <Option value="2">冒泡城市</Option>
                <Option value="3">完单城市</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row
          v-show="pushForm.pushRole == 2 && pushForm.target == 4 || pushForm.pushRole == 1 && pushForm.target == 4"
        >
          <Col span="10">
            <FormItem
              :label="pushForm.pushRole == 2 && pushForm.target == 4?'用户分群':'司机分群' "
              prop="userGroupUuid"
            >
              <Select
                @input="limitcount"
                multiple
                @on-change="selectGroup()"
                v-model="pushForm.userGroupUuid"
                style="width: 240px"
                @on-open-change="clearQuery"
              >

              <Input
                v-model="searchQuery"
                type="text"
                placeholder="请输入搜索内容"
                @input="remoteMethod()"
                style="width: 240px"
                class="search_input"
              />
                <Option
                  id="madeStyle"
                  v-for="(option, index) in userGroupList"
                  :value="option.crowdCode"
                  :key="option.crowdCode"
                >{{option.crowdName}}</Option>
              </Select>
              <span ref="choose_diss" class="choose_diss">
                <Icon type="md-close-circle" @click="clearData" />
              </span>

            </FormItem>

          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem
              label="业务类型"
              style="display:inline-block;"
              v-if="pushForm.pushRole==1 && pushForm.target ==2 "
              prop="businessType"
            >
              <Select
                v-model="pushForm.businessType"
                multiple
                clearable
                filterable
                style="width:200px"
              >
                <Option
                  v-for="(item, index) in bizTypeList"
                  :value="item.value"
                  :key="index"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row
          v-if="pushForm.pushRole === 2"
        >
          <Col span="12">
            <FormItem label="push大图">
              <img-upload
                :defaultImg="pushForm.bigImg"
                :action="actionUrl"
                :maxSize="500"
                :width="876"
                :height="324"
                @on-change="getImgUrlBig"
              ></img-upload>
            </FormItem>
          </Col>
        </Row>
        <Row
          v-if="pushForm.pushRole === 2"
        >
          <Col span="12">
            <FormItem label="push小图">
              <img-upload
                :defaultImg="pushForm.iconImg"
                :action="actionUrl"
                :maxSize="200"
                :width="120"
                :height="120"
                @on-change="getImgUrlIcon"
              ></img-upload>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <FormItem
            label="工资类别 :"
            style="display:inline-block;"
            v-if="pushForm.pushRole==1 && pushForm.target - 21 === 0 "
            prop="salaryTypeList"
          >
            <Select
              v-model="pushForm.salaryTypeList"
              clearable
              filterable
              multiple
              style="width:270px"
            >
              <Option
                v-for="(item, index) in wagesTypeList"
                :value="item.itemcode"
                :key="index"
              >{{item.itemvalue}}</Option>
            </Select>
          </FormItem>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="跳转链接（非必填）">
              <Input v-model="pushForm.pushLink" placeholder="请输入" :maxlength="255"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="15">
            <FormItem label="发送时间模式 :" prop="sendType">
              <RadioGroup v-model="pushForm.sendType" >
                <Radio :label="1">
                  定时发送
                </Radio>
                <Radio :label="2">
                  周期发送
                </Radio>
              </RadioGroup>
            </FormItem>
            <div v-if="pushForm.sendType===1">
              <Form
                v-for="(item,index) in timeDataList"
                :ref="'timeForm'+index"
                :model="item"
                :rules="ruleValidate"
                :label-width="110"
                :key="index-100"
                style="position:relative">
                <FormItem :label="timeDataList.length>1?`发送时间${index+1} :`:'发送时间 :'" prop="sendTime">
                  <DatePicker
                    v-model="item.sendTime"
                    type="datetime"
                    placeholder="请选择发送时间"
                    format="yyyy-MM-dd HH:mm:ss"
                    :editable="false"
                    :options="optionsTime"
                    style="width: 200px"
                  ></DatePicker>
                </FormItem>
                <Icon v-if="index>0" @click="removeTime(index)" class="remove-icon" type="ios-remove-circle-outline" />
              </Form>
              <Button type="primary" size="small" @click="addTimeItem" style="margin-left:110px;">增加发送时间</Button>
            </div>
            <div v-if="pushForm.sendType===2">
              <FormItem label="首次发送时间 :" prop="firstSendTime">
                <DatePicker
                  v-model="pushForm.firstSendTime"
                  type="datetime"
                  placeholder="请选择首次发送时间"
                  format="yyyy-MM-dd HH:mm:ss"
                  :editable="false"
                  :options="optionsTime"
                  style="width: 200px"
                ></DatePicker>
              </FormItem>
              <FormItem label="发送间隔时长 :" prop="betweenDays">
                <InputNumber
                  v-model="pushForm.betweenDays"
                  :precision="0"
                  :min="1"
                  placeholder="请输入时长"
                  style="width:150px;"
                ></InputNumber> 天
              </FormItem>
              <FormItem label="发送次数 :" prop="sendTimes">
                <InputNumber
                  v-model="pushForm.sendTimes"
                  :precision="0"
                  :min="0"
                  placeholder="请输入次数"
                  style="width:150px;"
                ></InputNumber>
              </FormItem>
              <FormItem label="发送时间 :">
                <span v-for="t in sendTimeList" :key="t" class="time_show">{{t}}</span>
              </FormItem>
            </div>
          </Col>
        </Row>
        <Row class="top30">
          <Col span="8" offset="4">
            <Button type="primary" :loading="submitLoading" :disabled="submitLoading" @click="handleSave('pushForm')">
              <span v-if="!submitLoading">保存</span>
              <span v-else>保存...</span>
            </Button>
            <!-- <Button type="primary" v-lazy-click="{fn:handleSave,params:{params:'pushForm'}}">保存</Button> -->
            <Button :style="{'marginLeft': '10px'}" @click="backOneStep">返回</Button>
          </Col>
        </Row>
      </Form>
    </Card>
    <import-fail-modal
      :show="isImportFail"
      :info="importFailInfo"
      @close="isImportFail=false">
    </import-fail-modal>
  </div>
</template>

<script>
// import {treeDataTranslate} from '@/libs/tools.js'
import TreeInput from "_a/treeInput/treeInput.vue";
import tTreeInput from "_a/tree-input/tree-input.vue";
import ImportFile from "_a/import-file/index.vue";
import { addPush, getGroupList } from "_o/api/announcement.js";
import {  } from "_g/api/common.js";
import { changeKeyMethod } from "@/libs/tools.js";
import importFailModal from "../components/import-fail-modal";
import { getAgentListInAuth,getNationalAreaInAuth } from "_g/api/common";
import { getToken } from "@/libs/util";
import imgUpload from "_a/img-upload/index.vue";
import oss from "@/mixins/oss";
import { salaryTypeList } from "_o/api/announcement.js"
import { mapState } from "vuex";
export default {
  name: "add-push",
  components: {
    TreeInput,
    tTreeInput,
    ImportFile,
    importFailModal,
    imgUpload
  },
  data() {
    const validateNN = (rule, value, callback) => {
      if (value !== "") callback();
      else callback(new Error("不得为空"));
    };
    const validateNExist = (rule, value, callback) => {
      if (!value) {
        callback(new Error("不得为空"));
      } else callback();
    };
    const validateUpload = (rule, value, callback) => {
      if (value == 3 && !this.pushForm.uploadFileUrl) {
        callback(new Error("请上传文件"));
      }
      callback();
    };
    const sendTime = (rule, value, callback) => {
      if (value === "") callback(new Error("请选择发送时间"));
      let now = new Date();
      let dataTime = new Date(value);
      if (dataTime < now) {
        callback(new Error("选择时间不能小于当前时间"));
      } else {
        callback();
      }
    };
    const minValid = (rule, value, callback) => {
      if(Number(value)<2) callback(new Error("限输入大于等于2的整数"));
      else callback();
    };
    return {
      loading: false,
      userGroupList: [],
      targetGroup: [],
      targetGroup2: [],
      searchQuery:'',
      mobileStr: "",
      downloadUrl: "/download/pushTemplate.xlsx",
      importUrl: "/admin/system/push/importExcel",
      actionUrl: this._baseUrl + "/common/uploadFile",
      timeDataList: [
        { sendTime:'' }
      ],
      defaultPushForm: {
        title:'',
        subTitle:'',
        userGroupUuid: [],
        sendType: null,
        betweenDays: null,
        sendTimes: null,
        iconImg: '',
        bigImg: '',
        fileUuid: "",
        salaryTypeList: ""
      },
      pushForm: {
        ...this.defaultPushForm
      },
      roleTypes: [
        {
          label: "司机",
          value: 1
        },
        {
          label: "乘客",
          value: 2
        }
      ],
    //   businessTypes: [
    //     {
    //       text: "出租车",
    //       value: 1
    //     },
    //     {
    //       text: "专享",
    //       value: 2
    //     },
    //     {
    //       text: "跨域",
    //       value: 3
    //     },
    //     {
    //       text: "快享",
    //       value: 4
    //     }
    //   ],
      ruleValidate: {
        title: [{ required: true, message: "请填写", trigger: "blur" }],
        pushRole: [
          { required: true, trigger: "change",message:"请填写",type: 'number'  }
        ],
        target: [
          { required: true, validator: validateNExist, trigger: "blur" },
          { validator: validateUpload, trigger: "click" }
        ],
        operatorName: [{ required: true, message: "请填写", trigger: "blur" }],
        userGroupUuid: [{ required: false }],
        cityName: [
          { required: true, validator: validateNN, trigger: "change" }
        ],
        businessType: [
          { type: 'array', required: true, message: '不得为空'}
        ],
        userGroups: [
          { required: true, validator: validateNExist, trigger: "blur" }
        ],
        betweenDays: [
          { required: true,type:'number', message: "请填写发送间隔时长", trigger: "change" }
        ],
        sendTimes: [
          { required: true,type:'number', message: "请填写发送次数", trigger: "change" },
          { validator: minValid, trigger: "blur" }
        ],
        sendType: [
          { required: true, type:'number', message: "请选择发送模式", trigger: "change" }
        ],
        salaryTypeList: [
          { required: true, type: "array", message: "请选择工资类别", trigger: "change" }
        ],
        sendTime: [
          { required: true, validator: sendTime, trigger: "change" }
        ],
        firstSendTime: [
          { required: true, validator: sendTime, trigger: "change" }
        ],
        operatorUuid: [
          { required: true, message: "请选择指定条件", trigger: "change", type: "array"}
        ],
        cityCodeList: [
          { required: true, message: "请选择城市", trigger: "change", type: "array"}
        ],
        userGroupType:  [
          { required: true, message: "请选择发送对象", trigger: "change" }
        ]
      },
      timeOptions: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400001;
        }
      },
      opGroup: [],
      optionsTime: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      submitLoading: false,
      cityList: [],
      importFailInfo: {},
      isImportFail: false,
      // 上传图片
      formatData: [],
      qrcodeHeaderParams: {},
      header: { Authorization: getToken() },
      wagesTypeList: []
    };
  },
  mixins: [oss],
  computed: {
    ...mapState({
      bizTypeList: state => state.common.bizTypeList,
    }),
    // 转换id
    rangeIds: function() {
      let str = "";
      let station = [];
      station = this.targetGroup;
      if (this.targetGroup.indexOf("_000") != -1) {
        station = ["_000"];
      }
      return station;
    },
    // 转换key
    rangeKeys: function() {
      let str = "";
      let station = [];
      station = this.targetGroup2;
      if (station.indexOf("全部") != -1) {
        station = ["全部"];
      }
      return station;
    },
    sendTimeList(){
      let result = []
      // 发送时间判断
      if(this.pushForm.sendType===1){
        // 定时发送
        result = this.timeDataList.map(item=>item.sendTime)
      }else{
        // 周期发送
        let start = this.pushForm.firstSendTime
        let between = this.pushForm.betweenDays
        let times = this.pushForm.sendTimes
        if(start && between && times){
          for(let key=0;key<times;key++){
            let time = new Date(start).getTime()+key*between*24*60*60*1000
            result.push(this.$moment(time).format('YYYY-MM-DD HH:mm:ss'))
          }
        }
      }
      return result
    }
  },
  mounted() {

  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.pushForm = {...vm.defaultPushForm};
      vm.timeDataList = [ { sendTime:'' } ];
      vm.pushForm.userGroupUuid = []
      vm.$refs.pushForm.resetFields();
      vm.mobileStr = "";
      vm.$forceUpdate();
    });
  },
  methods: {
    // 切换方式，清空用户分群
    clearUserGroup(){
      this.pushForm.userGroupUuid = []
      this.userGroupList = []
    },
    remoteMethod() {
      if(!this.pushForm.cityCodeList?.length){
        this.$Message.warning('请先选择城市！')
        this.userGroupList = []
        return false
      }
      // 乘客-用户分群-必须先选乘客分组类别
      if(this.pushForm.pushRole===2 && this.pushForm.target==='4' && !this.pushForm.userGroupType){
        this.$Message.warning('请先选择乘客分组类别！')
        this.userGroupList = []
        return false
      }
      if (this.searchQuery !== "") {
        let params = {
          crowdType: this.pushForm.pushRole, //区分乘客司机
          crowdName: this.searchQuery, //搜索内容
          type: 2, // 区分 push/短信
          cityCodes: this.pushForm.cityCodeList, //数据权限控制，分群只是城市内的
          behavior: this.pushForm.pushRole===2?this.pushForm.userGroupType:1, //乘客分组类别
          newInterface: 1
        };
        this.loading = true;
        getGroupList(params).then(res => {
          let data = res.data.data;
          this.userGroupList = data;
          this.loading = false;
        });
      }
    },
    // 按照填写城市和发送乘客，用户选择方式，查询不同数据
    loadListInfo(isChangeCity){
      if(this.pushForm.cityCodeList?.length>0){
        if(isChangeCity) this.cityEmptyChange()
        // 司机-指定运营商
        if(this.pushForm.pushRole===1 && this.pushForm.target==='2')
          this.getOperatorGroup()
        else
          this.opGroup = []
      }else{
        this.cityEmptyChange()
      }
    },
    cityEmptyChange(){
      this.opGroup = []
      this.userGroupList = []
      this.pushForm.operatorUuid?.splice(0,this.pushForm.operatorUuid.length)
      this.clearData()
    },
    // 切换城市，按需加载
    selectCity() {
      // 选择城市
      this.$refs.pushForm.validateField("cityCodeList");
      this.loadListInfo(true)
    },
    selectTree() {
      // 选择运营商
      this.$refs.pushForm.validateField("operatorUuid");
    },
    // 根据城市获取运营商
    getOperatorGroup(){
      let params = {
        cityCodes: this.pushForm.cityCodeList.join(',')
      }
      getAgentListInAuth(params).then(res => {
        let agentList = res.data.data?.agentList||[];
        agentList.forEach(item=>{
          item.title = item.label
          item.children?.forEach(city=>{
            city.title = city.label
            city.children?.forEach(op=>{
              op.title = op.label
            })
          })
        })
        this.opGroup = agentList
      })
    },
    // 最大选择数量
    limitcount(e) {
      if (e.length > 10) {
        this.$Message.warning("最多选择十条");
        e.pop();
         this.$forceUpdate()
      }else{
        if(e.length == 0){
        this.$refs.choose_diss.style.display = "none"
         this.$forceUpdate()
      }
      }
    },
    // 下拉框展开始的时候清除搜索的参数
    clearQuery(val) {
      if(val == true){
         this.searchQuery = ''
        //  this.$forceUpdate()
      }
    },
     // 清空已选中内容
    clearData(){
      this.pushForm.userGroupUuid = [];
      this.searchQuery = ''
      setTimeout(() => {
        this.$refs.choose_diss.style.display = "none"
      }, 0.1);
      this.$forceUpdate()
    },
    // 选中数据之后清空搜索输入框内容
    selectGroup() {
       this.$refs.choose_diss.style.display = "inline"
      this.searchQuery = ''
       this.$forceUpdate()
    },
    handleBulk(val) {
      this.pushForm.pushRangeDetail = "";
      this.pushForm.pushRangeIds = "";
    },
    handelChangeItem(isClear) {
      this.targetGroup = [];
      this.targetGroup2 = [];
      if(true === isClear){
        this.$set(this.pushForm, "target", "");
        this.mobileStr = "";
        this.pushForm.uploadFileUrl = "";
        this.cityList = []
        this.getCityList(this.pushForm.pushRole)
      }
      this.loadListInfo()
      // 司机
      if (this.pushForm.pushRole === 1) {
        this.downloadUrl = "/download/DriverPushTemplate.xlsx";
        this.userGroupList = []; // 清空可选择数组
        this.searchQuery = ''  // 清空搜索内容
        this.pushForm.userGroupUuid = []; // 清空选中数据
        this.getsalaryTypeList();
      }
      // 乘客
      if (this.pushForm.pushRole === 2) {
        this.downloadUrl = "/download/PassengerPushTemplate.xlsx";
        this.searchQuery = ''  // 清空搜索内容
        this.userGroupList = []; // 清空可选择数组
        this.pushForm.userGroupUuid = []; // 清空选中数据
      }
    },
    getCityList(value){
      this.pushForm.cityCodeList?.splice(0,this.pushForm.cityCodeList.length)
      let params = {}
      if(value===2){
        // 获取乘客城市
        params.authDimension = 1
      }else{
        // 获取司机城市
        params.authDimension = 2
      }

      getNationalAreaInAuth(params).then(res => {
        let list = res.data.data||[]
        if(list.length>0){
          list.forEach(function (item, index) {
            item.title = item.province
            item.value = item.provinceID
            item.children = item.citys
            item.children.forEach(function (_item, _index) {
              _item.title = _item.city
              _item.value = _item.cityID
            })
          })
          this.cityList = [
            {
              value: '1',
              title: '全选',
              expand: true,
              children: list
            }
          ]
        }

      });
    },
    backOneStep() {
      this.$router.go(-1);
    },
    async uploadSuc(res) {
      const [err, v] = await this.getOssFile({uuid: res.data})
      this.pushForm.uploadFileUrl = v || "";
      this.pushForm.fileUuid = res.data
      this.$forceUpdate();
    },
    uploadFail(res) {
      this.pushForm.uploadFileUrl = "";
      if(res.errCode === 33001){
        this.openAuthDownLoad(res)
      }
      this.$forceUpdate();
    },
    //新增push
    changeCommaToArr() {
      let str = this.mobileStr;
      let arr = str.split(",");
      this.pushForm.mobile = arr;
    },
    handleSave(name) {
      let that = this
      if (typeof name === "object" && name.params) {
        name = name.params;
      }

      //tree-input指定条件时赋值
      // if (this.pushForm.target == 2 && this.pushForm.pushRole == 1) {
      //   this.pushForm.operatorUuid = this.rangeIds;
      //   this.pushForm.operatorName = this.rangeKeys;
      // }
      // t-tree-input
      if (this.pushForm.target == 2 && this.pushForm.pushRole == 1) {
        let list = []
        recursion(this.opGroup);
        function recursion(arr) {
          for (let i = 0; i < arr.length; i++) {
            if (typeof arr[i].children !== "undefined" && arr[i].children?.length!==0) {
              recursion(arr[i].children);
            } else {
              if(that.pushForm.operatorUuid.indexOf(arr[i].value)>-1){
                list.push(arr[i].title)
              }
            }
          }
        }
        this.pushForm.operatorName = list
      }

      let formValidResult = false
      let TimeValidResult = true
      // 2 指定条件  4 分群
      this.$refs[name].validate(valid => { formValidResult = valid })
      // 判断push图片上传
      const { bigImg, iconImg } = this.pushForm
      if (!((bigImg && iconImg) || (!bigImg && !iconImg))) {
        this.$Message.error("请同时上传push大图和push小图");
        return
      }

      // 如果定时发送，发送时间校验
      if(this.pushForm.sendType===1){
        this.timeDataList.forEach((item,index)=>{
          let key='timeForm'+index
          this.$refs[key][0].validate().then(status => {
            if(!status){
              TimeValidResult = false
            }
          })
        })
      }
      // 短信周期不超过30天校验
      let sendTimeListCopy = JSON.parse(JSON.stringify(this.sendTimeList))
      sendTimeListCopy = sendTimeListCopy.sort((a,b)=>{return new Date(a).getTime()-new Date(b).getTime()})
      let start = sendTimeListCopy[0]
      let end = sendTimeListCopy[sendTimeListCopy.length-1]
      let diff = (new Date(end).getTime()-new Date(start).getTime())/1000/60/60/24
      if(diff>30){
        this.$Message.error('整体发送周期不得超过30天')
        return false
      }

      if (!(formValidResult && TimeValidResult)) {
        this.$Message.error("请完成表单!");
        return
      }

      let data = JSON.parse(JSON.stringify(this.pushForm));

      data.target = Number(data.target);
      // 发送时间赋值
      data.sendTimeList = this.sendTimeList.map(item=>this.$moment(item).format('YYYY-MM-DD HH:mm:ss'))
      delete data.sendTimes
      delete data.betweenDays
      delete data.firstSendTime
      delete data.sendTime
      delete data.sendType
      data.cityCodes = data.cityCodeList.join(',')
      data.uploadFileUrl = data.fileUuid; // 提交的保存 文件uuid
      if ( data.target == 3 || data.target == 1 || data.target == 2 || data.target - 21 === 0) {
        this.getData(data);
      } else {
        if (data.userGroupUuid.length != 0 && data.target == 4) {
          data.userGroupUuid = this.pushForm.userGroupUuid.join(",");
          this.getData(data);
        } else {
          this.$Message.error("请至少选择一个分群!");
        }
      }

    },
    openAuthDownLoad(resObj){
      this.importFailInfo = {
        isLink: false,
        params: resObj.data||{},
        msg: resObj.msg,
        url: '/common/v1/downLoadFile',
        baseUrl: '/m2-admin'
      }
      this.isImportFail = true
    },
    getData(data) {
      this.submitLoading = true
      addPush(data).then(res => {
        this.$Message.success("保存成功!");
        this.$router.push({ name: "push-center" });
        setTimeout(()=>{
          this.submitLoading = false
        },1000)
      }).catch(err=>{
        this.submitLoading = false
        let resInfo = err.data
        if(resInfo.errCode === 33001){
          this.openAuthDownLoad(resInfo)
        }
      })
    },
    // 删除定时时间
    removeTime(index){
      this.timeDataList.splice(index,1)
    },
    // 添加定时时间
    addTimeItem(){
      this.timeDataList.push({
        sendTime:''
      })
    },
    // TODO /common/uploadFile改造 未使用
    // 图片上传成功毁掉
    getImgUrlBig(index, { fileUrl }) {
      this.pushForm.bigImg = fileUrl;
    },
    getImgUrlIcon(index, { fileUrl }) {
      this.pushForm.iconImg = fileUrl;
      console.log(fileUrl)
    },
    // 图片上传失败毁掉
    uploadError(res) {},
    formatError() {
      this.$Message.error("请上传正确格式");
    },
    getsalaryTypeList() {
      salaryTypeList({}).then(res => {
        let resData = res.data.data || {};
        this.wagesTypeList = resData
      })
    },
  }
};
</script>

<style lang="less" scoped>
.dropShower {
  display: inline-block;
  width: 300px;
  min-height: 36px;
  line-height: 1.5;
  padding: 4px 7px;
  font-size: 12px;
  border: 1px solid #dcdee2;
  border-radius: 4px;
  color: #515a6e;
  background-color: #fff;
  background-image: none;
  position: relative;
  cursor: text;
  transition: border 0.2s ease-in-out, background 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;

  ul li {
    height: 24px;
    line-height: 22px;
    margin: 3px 4px 3px 0;
    display: inline-block;
    line-height: 22px;
    padding: 0 8px;
    border: 1px solid #e8eaec;
    border-radius: 3px;
    background: #f7f7f7;
    font-size: 12px;
    vertical-align: middle;
    opacity: 1;
    overflow: hidden;
    cursor: pointer;

    span {
      color: #515a6e;
    }

    i {
      font-size: 16px;
    }
  }
}
div{
  .choose_diss{
    display: none;
  }
}
.time_show{
  white-space: nowrap;
  margin-right: 20px;
  display: inline-block;
}
.remove-icon{
  position: absolute;
  left:330px;
  top:7px;
  font-size: 20px;
  color:#e61f10;
  font-weight: bold;
  cursor: pointer;
}
</style>
<style lang="less">
  .push-add .ivu-select-dropdown{
    max-height: 400px;
    overflow: auto;
  }
</style>
