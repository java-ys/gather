<template>
  <div class="msg-add">
    <Form :model="addParams" ref="formInline" :label-width="110" :rules="rules">
      <FormItem label="任务名称 :" prop="taskName">
        <Input
          :maxlength="20"
          v-model="addParams.taskName"
          placeholder="请输入名称"
          style="width: 200px"
        />
      </FormItem>
      <FormItem label="发送对象 :" prop="sendName">
        <Select
          v-model="addParams.sendName"
          style="width: 200px"
          @on-change="changeSendName"
        >
          <Option value="0">乘客</Option>
          <Option value="1">司机</Option>
          <Option value="3">运营商</Option>
        </Select>
      </FormItem>
      <FormItem label="发送城市 :" prop="cityCodeList">
        <TreeInput
          :data="cityList"
          placeholder="请选择城市"
          v-model="addParams.cityCodeList"
          inputWidth="400px"
          @on-change="selectCity"
        ></TreeInput>
      </FormItem>
      <FormItem label="用户选择方式 :" prop="driver">
        <Select
          v-model="addParams.driver"
          style="width: 200px"
          ref="resetSelect"
          @on-change="loadListInfo"
        >
          <Option
            v-for="(item, index) in chooseWayList"
            :value="item.value"
            :key="index"
          >{{item.label}}</Option>
        </Select>
      </FormItem>
      <FormItem
        label="乘客分组类别 :"
        prop="userGroupType"
        v-if="isPassenger && addParams.driver==='1'"
      >
        <Select
          v-model="addParams.userGroupType"
          style="width: 200px"
          @on-change="clearUserGroup()"
        >
          <Option value="1">注册城市</Option>
          <Option value="2">冒泡城市</Option>
          <Option value="3">完单城市</Option>
        </Select>
      </FormItem>
      <FormItem
        :label="addParams.driver === '1' && isPassenger ? '用户分群' : '司机分群'"
        prop="userGroupUuid"
        v-if="isPassenger && addParams.driver === '1' || isDriver && addParams.driver === '3'"
      >
          <Select
            @input="limitcount"
            multiple
            @on-change="selectGroup()"
              v-model="addParams.userGroupUuid"
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
            v-for="(option, index) in userGroupList"
            :value="option.crowdCode"
            :key="option.crowdCode"
          >{{option.crowdName}}</Option>
        </Select>
        <span ref="choose_diss" class="choose_diss">
          <Icon type="md-close-circle" @click="clearData" />
        </span>
      </FormItem>
      <FormItem prop="mobiles" v-if="addParams.driver === '0'">
        <Input v-model="addParams.mobiles" type="textarea" :rows="4" placeholder="请输入手机号，以英文逗号隔开" />
      </FormItem>
      <FormItem
        label="业务类型 :"
        prop="businessType"
        v-if="isDriver && addParams.driver === '1'"
      >
        <Select v-model="addParams.businessType" placeholder="请选择业务类型" style="width: 200px">
          <Option v-for="item in bizTypeList" :value="item.value" :key="item.value">{{item.label}}</Option>
        </Select>
      </FormItem>
      <FormItem
        label="运营商 :"
        prop="agentUuid"
        v-if="(isDriver && addParams.driver === '1') || isLeague"
      >
        <TreeInput
          :data="operatorGroup"
          placeholder="请选择运营商"
          @on-change="selectTree"
          v-model="addParams.agentUuid"
          :handleKeys="true"
        ></TreeInput>
      </FormItem>
      <FormItem v-if="addParams.driver === '2'">
        <ImportFile
          @on-success="importSuccess"
          @on-error="uploadFail"
          :disabled="!addParams.cityCodeList||addParams.cityCodeList.length===0"
          importFileUrl="/admin/sms/importBatchExcel"
          :toDownTemplateUrl="downloadUrl"
          :data="{roleType: addParams.sendName,cityCodes: addParams.cityCodeList?addParams.cityCodeList.join(','):''}"
        ></ImportFile>
        <p style="color:#ed4014" v-if="!addParams.cityCodeList||addParams.cityCodeList.length===0">请先选择城市</p>
        <span v-if="this.addParams.ossFileUrl">已上传</span>
      </FormItem>
      <FormItem label="工资类别 :" prop="salaryTypeList" v-if="isDriver && addParams.driver - 21 === 0">
        <Select v-model="addParams.salaryTypeList" multiple filterable clearable style="width: 200px">
          <Option
            v-for="(item, index) in wagesTypeList"
            :value="item.itemcode"
            :key="index"
          >{{item.itemvalue}}</Option>
        </Select>
      </FormItem>
      <FormItem v-if="isLeague && addParams.driver - 22 === 0" label="角色类型 :" prop="">
        <Checkbox-group v-model="addParams.agentRoles" @on-change="roleChange">
          <Checkbox label="allRoles" >全部</Checkbox>
          <Checkbox label="agentMgr" >运营商管理员</Checkbox>
          <Checkbox label="driverMgr">司管</Checkbox>
          <Checkbox label="carMgr">车管</Checkbox>
          <Checkbox label="secMgr">安全员</Checkbox>
        </Checkbox-group>
      </FormItem>
      <FormItem v-if="isLeague && addParams.driver - 23 === 0" label="" prop="">
        <Input
          v-model="addParams.mobiles"
          type="textarea"
          :rows="4"
          :maxlength="9999"
          placeholder="请输入手机号,以英文逗号分割"
          style="width:400px"
        />
      </FormItem>
      <FormItem v-if="isLeague && addParams.driver - 24 === 0">
        <ImportFile
          importFileUrl="/admin/sms/importBatchExcel"
          toDownTemplateUrl="/download/AgentSmsTemplate.xlsx"
          :data="{roleType: addParams.sendName, cityCodes: addParams.cityCodeList?addParams.cityCodeList.join(','):''}"
          @on-success="importSuccess"
          @on-error="uploadFail"
        ></ImportFile>
        <span v-if="this.addParams.ossFileUrl">已上传</span>
      </FormItem>
      <FormItem label="消息内容 :" prop="sendContent">
        <!-- <Input
          v-model="addParams.sendContent"
          type="textarea"
          :rows="4"
          :maxlength="200"
          @keyup.native="getCount"
          placeholder="请输入短信内容"
          style="width:400px"
        /> -->
        <Button @click="$emit('select')">选择模板</Button>
        <p v-if="template">{{template.content}}</p>
      </FormItem>
      <Row>
        <FormItem label="测试手机号 :" >
          <Input v-model="addParams.testMobile" placeholder="请输入手机号" :maxlength="11" style="width: 200px"></Input>
          <Button type="primary" @click="sendTestMsg" style="margin-left: 12px;" :loading="isSendingMsg">发送到测试手机号</Button>
        </FormItem>
      </Row>
      <FormItem label="发送时间模式 :" prop="sendType">
        <RadioGroup v-model="addParams.sendType" >
          <Radio :label="1">
            定时发送
          </Radio>
          <Radio :label="2">
            周期发送
          </Radio>
        </RadioGroup>
      </FormItem>
      <div v-if="addParams.sendType===1">
        <Form
          v-for="(item,index) in timeDataList"
          :ref="'timeForm'+index"
          :model="item"
          :rules="rules"
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
      <div v-if="addParams.sendType===2">
        <FormItem label="首次发送时间 :" prop="firstSendTime">
          <DatePicker
            v-model="addParams.firstSendTime"
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
            v-model="addParams.betweenDays"
            :precision="0"
            :min="1"
            placeholder="请输入时长"
            style="width:150px;"
          ></InputNumber> 天
        </FormItem>
        <FormItem label="发送次数 :" prop="sendTimes">
          <InputNumber
            v-model="addParams.sendTimes"
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
    </Form>
    <div class="popView-footer-wrap">
      <Button size="large" type="text" @click="commit(0)" style="margin-right: 8px;">取消</Button>
      <Button type="primary" :loading="submitLoading" :disabled="submitLoading" @click="commit(1)">
        <span v-if="!submitLoading">保存</span>
        <span v-else>保存...</span>
      </Button>
      <!-- <Button size="large" type="primary" v-lazy-click="{fn:commit,params:{params:1}}">确定</Button> -->
    </div>
    <import-fail-modal
      :show="isImportFail"
      :info="importFailInfo"
      @close="isImportFail=false">
    </import-fail-modal>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ImportFile from "_a/import-file/index.vue";
import TreeInput from "_a/tree-input/tree-input.vue";
import importFailModal from "../../components/import-fail-modal";
import { sendMessage, getGroupList, sendTestSms } from "_o/api/announcement";
import TableRedio from "../components/tableRadio"
import { getAgentListInAuth,getNationalAreaInAuth } from "_g/api/common";
import oss from "@/mixins/oss";
import { freeze } from "@/mixins/base"
import { salaryTypeList } from "_o/api/announcement.js";
import { passengerBoundary, driverBoundary, leagueBoundary } from "../fields"
import {regTest} from "@/libs/tools";

const defaultAddParams = {
  userGroupUuid: [],
  betweenDays: null,
  sendTimes: null,
  fileUuid: "",
  salaryTypeList: []
}
const mobile = (rule, value, callback) => {
    if(regTest(value, 'mobile')) callback()
    else callback(new Error('请输入正确的手机号'))
}
export default {
  components: {
    ImportFile,
    TreeInput,
    TableRedio,
    importFailModal
  },
  props: {
    value: {
      type: Boolean
    },
    template: Object,
  },
  mixins: [oss],
  data() {
    const sendTime = (rule, value, callback) => {
      if (value === "") callback(new Error("请选择发送时间"));
      let now = new Date();
      let dataTime = new Date(value);
      if (dataTime <= now) {
        callback(new Error("选择时间应大于当前时间"));
      } else {
        callback();
      }
    };
    const agentUuid = (rule, value, callback) => {
      let arr = value || [];
      if (arr.length) callback();
      else callback(new Error("请选择运营商"));
    };
    const validateUpload = (rule, value, callback) => {
      if (value == 2 && !this.addParams.ossFileUrl) {
        callback(new Error("请上传文件"));
      }
      callback();
    };
    const minValid = (rule, value, callback) => {
      if(Number(value)<2) callback(new Error("限输入大于等于2的整数"));
      else callback();
    };
    return {
      loading: false,
      timeDataList: [
        { sendTime:'' }
      ],
      addParams: {
        ...defaultAddParams,
        testMobile:''
      },
      letter:0,
			letterCount:0,
      searchQuery:'',
      userGroupList: [],
      rules: {
        taskName: [
          { required: true, message: "请填写任务名称", trigger: "change" }
        ],
        sendName: [
          { required: true, message: "请选择发送对象", trigger: "change" }
        ],
        driver: [
          { required: true, message: "请选择用户选择方式"},
          { validator: validateUpload, trigger: "click" }
        ],
        userGroupUuid: [
          { required: true, message: "至少选择一个", trigger: "change", type: "array"}
        ],
        salaryTypeList: [
          { required: true, type: "array", message: "请选择工资类别", trigger: "change" }
        ],
        sendContent: [
          { required: true, message: "请填写发送内容", trigger: "change" }
        ],
        sendTime: [
          { required: true, validator: sendTime, trigger: "blur" }
        ],
        firstSendTime: [
          { required: true, validator: sendTime, trigger: "blur" }
        ],
        businessType: [
          { required: true, message: "请选择业务类型" }
        ],
        agentUuid: [
          { required: true, validator: agentUuid, trigger: "change" }
        ],
        mobiles: [
          { required: true, message: "请填写手机号", trigger: "change" }
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
        cityCodeList: [
          { required: true, message: "请选择城市", trigger: "change", type: "array"}
        ],
        userGroupType:  [
          { required: true, message: "请选择发送对象", trigger: "change" }
        ],
      },
      downloadUrl: "",
      operatorGroup: [],
      passengerBoundary: freeze(passengerBoundary),
      driverBoundary: freeze(driverBoundary),
      leagueBoundary: freeze(leagueBoundary),
      optionsTime: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      submitLoading: false,
      cityList: [],
      importFailInfo: {},
      isImportFail: false,
      wagesTypeList: [],
      isSendingMsg:false
    };
  },
  watch: {
    value() {
      if (this.value) {
        this.$refs.formInline && this.$refs.formInline.resetFields();
        this.addParams = {...defaultAddParams}
        this.timeDataList = [{}]
        this.agentList = []
        this.cityList = []
        this.letter = 0
        this.letterCount = 0
        this.submitLoading = false
      }
    },
    template: {
      handler(value) {
        if(value) {
          this.addParams.sendContent = this.addParams.content = value.content;
          this.addParams.templateCode = value.templateCode;
        }
      },
      immediate: true
    }
  },
  computed: {
    ...mapState({
      bizTypeList: state => state.common.bizTypeList,
    }),
    // 用户选择方式列表
    chooseWayList({isLeague, isPassenger, isDriver, passengerBoundary, driverBoundary, leagueBoundary}) {
      if(isLeague) return leagueBoundary
      if(isPassenger) return passengerBoundary
      if(isDriver) return driverBoundary
      return []
    },
    // 发送对象是运营商
    isLeague({addParams}) {
      return addParams.sendName - 3 === 0
    },
    // 发送对象是乘客
    isPassenger({addParams}) {
      return `${addParams.sendName}` === '0'
    },
    // 发送对象是司机
    isDriver({addParams}) {
      return addParams.sendName - 1 === 0
    },
    sendTimeList(){
      let result = []
      // 发送时间判断
      if(this.addParams.sendType===1){
        // 定时发送
        result = this.timeDataList.map(item=>item.sendTime)
      }else{
        // 周期发送
        let start = this.addParams.firstSendTime
        let between = this.addParams.betweenDays
        let times = this.addParams.sendTimes
        if(start && between && times){
          for(let key=0;key<times;key++){
            let time = new Date(start).getTime()+key*between*24*60*60*1000
            result.push(this.$moment(time).format('YYYY-MM-DD HH:mm:ss'))
          }
        }
      }
      return result
    },
    templateCount() {
      const tmp = this.template;
      if(!tmp) return 0;
      const len = tmp.length;
      return len < 65 ? 1 : len < 129 ? 2 : len < 196 ? 3 : 4;
    }
  },
  methods: {
    // 切换方式，清空用户分群
    clearUserGroup(){
      this.addParams.userGroupUuid = []
      this.userGroupList = []
    },
    remoteMethod() {
      if(!this.addParams.cityCodeList?.length){
        this.$Message.warning('请先选择城市！')
        this.userGroupList = []
        return false
      }
      // 乘客-用户分群-必须先选乘客分组类别
      if(this.addParams.sendName==='0' && this.addParams.driver==='1' && !this.addParams.userGroupType){
        this.$Message.warning('请先选择乘客分组类别！')
        this.userGroupList = []
        return false
      }
      if (this.searchQuery != "") {
        let params = {
          crowdType: this.addParams.sendName, // 区分司机乘客
          crowdName: this.searchQuery, //搜索内容
          type: 1, // 区分 push/短信
          cityCodes: this.addParams.cityCodeList, //数据权限控制，分群只是城市内的
          behavior: this.addParams.sendName==='0'?this.addParams.userGroupType:1, //乘客分组类别
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
    // 选中数据之后清空搜索输入框内容
    selectGroup() {
      this.$refs.choose_diss.style.display = "inline"
      this.searchQuery = ''
       this.$forceUpdate()
    },
    // 最大选择数量
    limitcount(e) {
      if (e.length > 10) {
        this.$Message.warning("最多选择十条");
        e.pop();
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
    clearData() {
      this.addParams.userGroupUuid = [];
      this.searchQuery = ''
      setTimeout(() => {
        this.$refs.choose_diss.style.display = "none"
      }, 0.1);
      this.$forceUpdate()
    },
    getCount(){
            //是否多个url ??  todo
            // let regTest = /(HTTPS|https):\/\/([\w.]+\/?)\w*/g
            // 匹配输入的所有网址
            let regTest = /(https?):\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]+[-A-Za-z0-9+&@#\/%=~_|]/g
            if(regTest.test(this.addParams.sendContent)){
                let urlStr = this.addParams.sendContent.match(regTest)
                // copyStr--仅用于统计字数的模板
                let copyStr = this.addParams.sendContent;
                // 计数模板--19个字符
                let countStr = 's.m2cn.cn/2ehFg7f0R'
                for(let item of urlStr){
                    // 判断是否短链接
                    // https://s.m2cn.cn/2ehFg7f0R  格式:https://---域名---/一层路径
                    let valiContent = item.replace(/^(HTTPS|https):\/\/[^/]+/, "");
                    switch(valiContent.split('/').length){
                        case 2: //短链接
                        //若输入的https链接为short短链，则按照实际长度计算字符数，但去除https://进行计算；
                        //若输入的https链接为s短链，则按照实际长度计算字符数，但去除https://进行计算；
                        let delStr = item.replace(/https:\/\//,'')
                        copyStr = copyStr.replace(item,delStr)
                        break
                        case 0:
                        case 1:  // 小于2-----域名还没输完或url不合法 --- 正常计数--pass
                        // this.letter = this.addParams.sendContent?.length
                        break;
                        default: //长链接
                        // 若输入的https链接但为长链，则按照固定19个字符进行计算字符数；
                        copyStr = copyStr.replace(item,countStr)
                        break
                    }
                }
                // console.log(copyStr)
                this.letter = copyStr.length
            }else{ // 其他情况正常计算
                this.letter = this.addParams.sendContent?.length
            }
			if(this.letter == 0){
				this.letterCount = 0
			}else{
				if(this.letter<65 ){
				this.letterCount = 1
				}else{
					if(this.letter<129){
						this.letterCount = 2
					}else{
					if(this.letter<196){
						this.letterCount = 3
					}else{
						this.letterCount = 4
					}
					}
				}

			}
    },
    // 按照填写城市和发送乘客，用户选择方式，查询不同数据
    loadListInfo(isChangeCity){
      if(this.addParams.cityCodeList?.length>0){
        // 司机-指定运营商
        if(isChangeCity) this.cityEmptyChange()
        if((this.addParams.sendName==='1' && this.addParams.driver==='1')||this.addParams.sendName==='3')
          this.getOperatorGroup()
        else
          this.operatorGroup = []
      }else{
        this.cityEmptyChange()
      }
    },
    cityEmptyChange(){
      this.operatorGroup = []
      this.userGroupList = []
      this.addParams.agentUuid?.splice(0,this.addParams.agentUuid.length)
      this.addParams.userGroupUuid?.splice(0,this.addParams.userGroupUuid.length)
    },
    // 切换城市，按需加载
    selectCity() {
      // 选择城市
      this.$refs.formInline.validateField("cityCodeList");
      this.loadListInfo(true)
    },
    // 根据城市获取运营商
    getOperatorGroup(){
      let params = {
        cityCodes: this.addParams.cityCodeList.join(',')
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
        this.operatorGroup = agentList
      })
    },
    selectTree(val) {
      // 选择运营商
      this.$refs.formInline.validateField("agentUuid");
    },
    // 附件上传成功
    async importSuccess(res) {
      let fileUuid = res?.data?.fileUuid
      this.addParams.fileUuid = fileUuid
      const [, v] = await this.getOssFile({uuid: fileUuid})
      this.addParams.ossFileUrl = v || "";
      this.$forceUpdate();
    },
    uploadFail(res) {
      if(res.errCode === 33001){
        this.openAuthDownLoad(res)
      }
      this.addParams.ossFileUrl = "";
      this.$forceUpdate();
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
    commit(temp) {
      if (typeof temp === "object" && temp.params) {
        temp = temp.params;
      }
      if (!temp) {
        this.$emit("input", false);
        return
      }
      let formValidResult = false
      let TimeValidResult = true
      // 新建form校验
      this.$refs.formInline.validate(res => {formValidResult = res});
      // 如果定时发送，发送时间校验
      if(this.addParams.sendType===1){
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

      if (!(formValidResult && TimeValidResult)) return

      let params = JSON.parse(JSON.stringify(this.addParams))

      params.sendTimeList = this.sendTimeList.map(item=>this.$moment(item).format('YYYY-MM-DD HH:mm:ss'))
      delete params.sendTimes
      delete params.betweenDays
      delete params.firstSendTime
      delete params.sendTime
      delete params.sendType

      const { sendName, driver } = this.addParams

      if (this.isPassenger) {
        if (driver === "0") params.driver = 2; // 指定乘客
        if (driver === "1") params.driver = 10; // 用户群组
        if (driver === "2") params.driver = 5; // 乘客批量
      } else if(this.isDriver) {
        if (driver === "0") params.driver = 3; // 指定司机
        if (driver === "1") params.driver = 4; // 指定运营商
        if (driver === "2") params.driver = 7; // 司机批量
        if (driver === "3") params.driver = 10; // 司机分群
      }
      if (this.addParams.driver === "0" || this.addParams.driver === 23) {
        // 指定乘客/指定司机
        params.mobiles = params.mobiles.split(",");
      }
      if (driver - 2 === 0) {
        // 批量导入
        let ossFileUrl = params.ossFileUrl || null;
        if (!ossFileUrl) this.$Message.warning("请先导入数据");
      }
      params.sendName = Number(params.sendName);
      params.userGroupUuid = params.userGroupUuid.join(",");
      params.cityCodes = params.cityCodeList.join(',')
      // this.submitLoading = true
      params.ossFileUrl = params.fileUuid
      delete params.fileUuid

      // 处理运营商
      if(params.agentUuid && params.agentUuid.length){
          params.agentInfos = params.agentUuid.map(it =>{
            return {
            uuid:it.value,
            name:it.label
            }
        })
        let agentUuid = []
        for(let item of params.agentInfos){
            agentUuid.push(item.uuid)
        }
        params.agentUuid = agentUuid
      }

      if(this.isLeague) {
        let r = this.handleLeagueParams(params);
        params = {...params, ...r}
      }
      this.submitLoading = true
      console.log('save', params)
      sendMessage(params).then(res => {
        // 在此处关闭loading会有漏网之鱼，放在打开modal中放开
        this.$emit("input", false);
        this.$emit("on-confirm");
        this.$Message.success("创建成功");
      }).catch(err=>{
        this.submitLoading = false
        let resInfo = err.data
        if(resInfo.errCode === 33001){
          this.openAuthDownLoad(resInfo)
        }
      })
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
    changeSendName(value) {
      this.$refs.resetSelect.clearSingleSelect();
      this.userGroupList = [];// 清空可选择数组
      this.addParams.userGroupUuid = [];// 清空选中数据
      this.searchQuery = ''  // 清空搜索内容
      this.$set(this.addParams,'driver','')
      this.cityList = []
      value && this.getCityList(value)
      // 乘客
      if (value === "0") {
        this.downloadUrl = "/download/PassengerPushTemplate.xlsx";
      } else if (value === "1") {
        // 司机
        this.downloadUrl = "/download/DriverMessageTemplate.xlsx";
        this.getsalaryTypeList()
      } else if (value - 3 === 0) { // 运营商
        // this.downloadUrl = "/download/AgentSmsTemplate.xlsx";
      }
    },
    getCityList(value){
      this.addParams.cityCodeList?.splice(0,this.addParams.cityCodeList.length)
      let params = {}
      if(value==='0'){
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
    sendTestMsg() {
      if(regTest(this.addParams.testMobile, 'mobile')) {
          this.isSendingMsg = true
          sendTestSms({phoneNumber:this.addParams.testMobile,sendContent:this.addParams.sendContent}).then(res=>{
              if(res.data.success){
                  this.$Message.success('发送成功')
              } else{
                  this.$Message.error(res.data.msg)
              }
              setTimeout(()=>{
                  this.isSendingMsg = false
              },300)
          })
      } else {
          this.$Message.error('请输入正确的手机号')
          this.isSendingMsg = false
      }

    },
    // 全部选项和其他选项互斥
    roleChange(v) {
      let alIndex = v.findIndex(it => it === 'allRoles')
      let len = v.length
      if(len > 1) {
        if(alIndex > 0) {
          v.splice(0, len, "allRoles")
        } else if (alIndex === 0) {
          v.splice(0, 1)
        }
      }
    },
    // 获取工资类别
    getsalaryTypeList() {
      salaryTypeList({}).then(res => {
        let resData = res.data.data || {};
        this.wagesTypeList = resData
      })
    },
    handleLeagueParams(p) {
      let { driver } = p
      let r = {}
      delete p.mobiles
      delete p.agentRoles
      if(driver - 23 === 0) {
        let mobileList = this.addParams.mobiles.replace(/,|，/ig, ",").split(",").filter(Boolean)
        r.mobiles = mobileList.filter(it => regTest(it, 'relexMobile') || regTest(it, 'phone')); // 宽松校验手机号
      } else if(driver - 24 === 0) {
        r.ossFileUrl = this.addParams.fileUuid
      } else if (driver - 22 === 0) {
        r.agentRoles = this.addParams.agentRoles
      }
      return r
    }
  },
};
</script>
<style lang="less">
.msg-add{
  .message_letter{
    color:#57a3f3;
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
  .ivu-select-dropdown{
    max-height: 400px;
    overflow: auto;
  }
}
</style>
