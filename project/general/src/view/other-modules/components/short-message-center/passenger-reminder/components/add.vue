<template>
  <div class="reminder-add">
      <Form :label-width="120" :model="reminderForm" :rules="reminderValidate" ref="reminderForm">
        <Row>
          <Col span="12">
            <FormItem label="策略名称：" prop="strategyName">
              <Input class="itemWidth" v-model="reminderForm.strategyName" placeholder="请输入" :maxlength="20" />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="产品线：" prop="businessLines">
                <Select
                    multiple
                    class="itemWidth"
                    v-model="reminderForm.businessLines"
                >
                    <Option
                    v-for="(item,index) in products"
                    :value="item.value"
                    :key="index"
                    >{{ item.label }}</Option>
                </Select>
            </FormItem>
          </Col>
        </Row>
         <Row>
          <Col span="24">
            <FormItem
                label="城市：" prop="cityCodes"
            >
             <Select
                multiple
                collapse-tags
                class="itemWidth"
                v-model="reminderForm.cityCodes"
             >
               <Option
                     v-for="(item) in cityList"
                    :value="item.cityId"
                    :key="item.cityId"
               >{{item.city}}</Option>
             </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem
                label="生效时段：" prop="effectedTime"
            >
            <DatePicker
              v-model="reminderForm.effectedTime"
              :clearable="false"
              placeholder="请输入"
              type="datetimerange"
              style="width:250px"
              :options="dateOptions"
              @on-change="createdTime"
            >
            </DatePicker>
            </FormItem>
          </Col>
        </Row>
        </Form>

        <!-- *提醒节点Block -->
        <div class="reminderBlock">
          <Form :label-width="120" :model="reminderNodeForm" :rules="reminderNodeValidate" ref="reminderNodeForm">
            <Row>
              <Col span="14" :offset="2">
                <div class="remindB-strategyName"> <span>*</span> 提醒节点：</div>
              </Col>
            </Row>
            <Row type="flex" justify="space-between">
              <Col span="24">
                <FormItem label="" prop="remindNodeList" class="reminderNode">
                  <Checkbox-group v-model="reminderNodeForm.remindNodeList" @on-change="handleReNodeClick">
                    <Checkbox label="1">司机接单</Checkbox>
                    <Checkbox label="2">司机即将到达起点</Checkbox>
                    <Checkbox label="3">乘客上车后</Checkbox>
                    <Checkbox label="4">即将到达目的地</Checkbox>
                    <Checkbox label="5">乘客支付费用后</Checkbox>
                  </Checkbox-group>
                  <span v-if="reminderNodeForm.remindNodeListNone" class="redColr">至少选一个</span>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col span="20">
                  <div class="solidBorder"></div>
              </Col>
            </Row>
          </Form>

          <!-- 具体节点 司机接单 order   -->
            <Form :label-width="120" :model="orderNodeForm" :rules="orderNodeValidate" :hidden="!orderNodeToggle" ref="orderNodeForm">
              <Row>
                <Col span="14" :offset="2">
                  <div class="remindB-substrategyName"> <span>*</span> 司机接单：</div>
                </Col>
              </Row>
              <Row type="flex" justify="center">
                <Col span="22">
                  <FormItem label="弹窗图片" prop="popupImgUrl">
                    <div class="uploadBlock">
                      <img-upload
                        :defaultImg="orderNodeForm.popupImgUrl"
                        :headerParams="qrcodeHeaderParams"
                        :action="actionUrl"
                        :params="{  }"
                        :maxSize="2048"
                        :format="['jpg', 'png']"
                        @on-change="getImgUrlFir"
                      ></img-upload>
<span>尺寸: 840x1120</span>
                    </div>
                  </FormItem>
                </Col>
              </Row>
              <Row type="flex" justify="center">
              <Col span="22">
                <FormItem label="按钮文案" prop="buttonText">
                  <Input class="itemWidth" v-model="orderNodeForm.buttonText" placeholder="请输入" :maxlength="12" show-word-limit />
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col span="22">
                <FormItem label="跳转链接" prop="linkUrl">
                  <Input class="itemWidth" v-model="orderNodeForm.linkUrl" placeholder="请输入" />
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col span="22">
                <FormItem label="链接页标题" prop="linkTitle">
                  <Input class="itemWidth" v-model="orderNodeForm.linkTitle" placeholder="请输入" :maxlength="12" show-word-limit />
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col span="20">
                  <div class="solidBorder"></div>
              </Col>
            </Row>
          </Form>

          <!-- 具体节点 司机即将到达起点 coming -->
            <Form :label-width="120" :model="comingNodeForm" :rules="comingNodeValidate" :hidden="!comingNodeToggle"  ref="comingNodeForm">
              <Row>
                <Col span="14" :offset="2">
                  <div class="remindB-substrategyName"> <span>*</span> 司机即将到达起点：</div>
                </Col>
              </Row>
              <Row type="flex" justify="center">
                <Col span="22">
                  <FormItem label="弹窗图片" prop="popupImgUrl">
                    <img-upload
                      :defaultImg="comingNodeForm.popupImgUrl"
                      :headerParams="qrcodeHeaderParams"
                      :action="actionUrl"
                      :params="{  }"
                      :maxSize="2048"
                      :format="['jpg', 'png']"
                      @on-change="getImgUrlSec"
                    ></img-upload>
<span>尺寸: 840x1120</span>
                  </FormItem>
                </Col>
              </Row>
              <Row type="flex" justify="center">
              <Col span="22">
                <FormItem label="按钮文案" prop="buttonText">
                  <Input class="itemWidth" v-model="comingNodeForm.buttonText" placeholder="请输入" :maxlength="12" show-word-limit />
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col span="22">
                <FormItem label="跳转链接" prop="linkUrl">
                  <Input class="itemWidth" v-model="comingNodeForm.linkUrl" placeholder="请输入" />
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col span="22">
                <FormItem label="链接页标题" prop="linkTitle">
                  <Input class="itemWidth" v-model="comingNodeForm.linkTitle" placeholder="请输入" :maxlength="12" show-word-limit />
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col span="22">
                <FormItem label="距离目的地" prop="distance">
                  <Input class="itemWidth80" v-model="comingNodeForm.distance" placeholder="请输入" width="80" />
                  <span>米提醒</span>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col span="20">
                  <div class="solidBorder"></div>
              </Col>
            </Row>
          </Form>

         <!-- 具体节点 乘客上车后 -->
            <Form :label-width="120" :model="goOnNodeForm" :rules="goOnNodeValidate" :hidden="!goOnNodeToggle" ref="goOnNodeForm">
              <Row>
                <Col span="14" :offset="2">
                  <div class="remindB-substrategyName"> <span>*</span> 乘客上车后：</div>
                </Col>
              </Row>
              <Row type="flex" justify="center">
                <Col span="22">
                  <FormItem label="弹窗图片" prop="popupImgUrl">
                    <img-upload
                      :defaultImg="goOnNodeForm.popupImgUrl"
                      :headerParams="qrcodeHeaderParams"
                      :action="actionUrl"
                      :params="{  }"
                      :maxSize="2048"
                      :format="['jpg', 'png']"
                      @on-change="getImgUrlThr"
                    ></img-upload>
<span>尺寸: 840x1120</span>
                  </FormItem>
                </Col>
              </Row>
              <Row type="flex" justify="center">
              <Col span="22">
                <FormItem label="按钮文案" prop="buttonText">
                  <Input class="itemWidth" v-model="goOnNodeForm.buttonText" placeholder="请输入" :maxlength="12" show-word-limit />
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col span="22">
                <FormItem label="跳转链接" prop="linkUrl">
                  <Input class="itemWidth" v-model="goOnNodeForm.linkUrl" placeholder="请输入" />
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col span="22">
                <FormItem label="链接页标题" prop="linkTitle">
                  <Input class="itemWidth" v-model="goOnNodeForm.linkTitle" placeholder="请输入" :maxlength="12" show-word-limit />
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col span="20">
                  <div class="solidBorder"></div>
              </Col>
            </Row>
          </Form>

         <!-- 具体节点 即将到达目的地 -->
            <Form :label-width="120" :model="destinationNodeForm" :rules="destinationNodeValidate" :hidden="!destinationNodeToggle" ref="destinationNodeForm">
              <Row>
                <Col span="14" :offset="2">
                  <div class="remindB-substrategyName"> <span>*</span> 即将到达目的地：</div>
                </Col>
              </Row>
              <Row type="flex" justify="center">
                <Col span="22">
                  <FormItem label="弹窗图片" prop="popupImgUrl">
                    <img-upload
                      :defaultImg="destinationNodeForm.popupImgUrl"
                      :headerParams="qrcodeHeaderParams"
                      :action="actionUrl"
                      :params="{  }"
                      :maxSize="2048"
                      :format="['jpg', 'png']"
                      @on-change="getImgUrlThi"
                    ></img-upload>
<span>尺寸: 840x1120</span>
                  </FormItem>
                </Col>
              </Row>
              <Row type="flex" justify="center">
              <Col span="22">
                <FormItem label="按钮文案" prop="buttonText">
                  <Input class="itemWidth" v-model="destinationNodeForm.buttonText" placeholder="请输入" :maxlength="12" show-word-limit />
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col span="22">
                <FormItem label="跳转链接" prop="linkUrl">
                  <Input class="itemWidth" v-model="destinationNodeForm.linkUrl" placeholder="请输入" />
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col span="22">
                <FormItem label="链接页标题" prop="linkTitle">
                  <Input class="itemWidth" v-model="destinationNodeForm.linkTitle" placeholder="请输入" :maxlength="12" show-word-limit />
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col span="22">
                <FormItem label="距离目的地" prop="distance">
                  <Input class="itemWidth80" v-model="destinationNodeForm.distance" placeholder="请输入" width="80" />
                  <span>米提醒</span>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col span="20">
                  <div class="solidBorder"></div>
              </Col>
            </Row>
          </Form>


         <!-- 具体节点 乘客支付费用后 -->
            <Form :label-width="120" :model="payNodeForm" :rules="payNodeValidate" :hidden="!payNodeToggle" ref="payNodeForm">
              <Row>
                <Col span="14" :offset="2">
                  <div class="remindB-substrategyName"> <span>*</span> 乘客支付费用后：</div>
                </Col>
              </Row>
              <Row type="flex" justify="center">
                <Col span="22">
                  <FormItem label="弹窗图片" prop="popupImgUrl">
                    <img-upload
                      :defaultImg="payNodeForm.popupImgUrl"
                      :headerParams="qrcodeHeaderParams"
                      :action="actionUrl"
                      :params="{  }"
                      :maxSize="2048"
                      :format="['jpg', 'png']"
                      @on-change="getImgUrlFif"
                    ></img-upload>
<span>尺寸: 840x1120</span>
                  </FormItem>
                </Col>
              </Row>
              <Row type="flex" justify="center">
              <Col span="22">
                <FormItem label="按钮文案" prop="buttonText">
                  <Input class="itemWidth" v-model="payNodeForm.buttonText" placeholder="请输入" :maxlength="12" show-word-limit />
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col span="22">
                <FormItem label="跳转链接" prop="linkUrl">
                  <Input class="itemWidth" v-model="payNodeForm.linkUrl" placeholder="请输入" />
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col span="22">
                <FormItem label="链接页标题" prop="linkTitle">
                  <Input class="itemWidth" v-model="payNodeForm.linkTitle" placeholder="请输入" :maxlength="12" show-word-limit />
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col span="20">
                  <div class="solidBorder"></div>
              </Col>
            </Row>
          </Form>
        </div>
    <import-fail-modal
      :show="isImportFail"
      :info="importFailInfo"
      @close="isImportFail=false">
    </import-fail-modal>
  </div>
</template>

<script>
import imgUpload from "_a/img-upload/index.vue";
import importFailModal from "../../components/import-fail-modal";
import { getOnLineCity } from "_g/api/common.js";
import { cpLabelValue } from "@/libs/tools";
import floatVue from '../../../config-center/elecfence-control/float.vue';

export default {
  name: "add",
  props:{
    theInfo: Object,
    tag: Number
  },
  components: {
    importFailModal,
    imgUpload
  },
  data() {
    const validateMultiple = (rule, value, callback) => {
      if (value.length<1) {
          callback(new Error('不少于1项'));
      }else {
          callback();
      }
    };
    const validateNumber = (rule, value, callback) => {
        if(isNaN(value)){
          callback(new Error("请输入数字"));
          return false
        }else if(!isNaN(value) && (value< 0)){
          callback(new Error("请输入大于等于0的正数"));
        }else if(!isNaN(value) && typeof value === 'string'){
          if(value === '-0'){
            callback(new Error("请输入正数"));
          }
          value = Number(value)
          callback();
          return value
        }else if(!value){
          callback(new Error("请输入"));
          return
        }
    };
    const effectiveTime = (rule, value, callback) => {
        let date = this.reminderForm.effectedTime || null
        if (!date || !date[0]) {
          return callback(new Error('请选择生效时间'))
        }else {
          callback()
        //     let timestamp = new Date(date).getTime()
        //     if (timestamp < Date.now()) {
        //         callback(new Error('生效时间不得小于当前时间'))
        //     } else callback()
        }
    }
    return {
      loading: false,
      importFailInfo: {},
      isImportFail: false,
      orderNodeToggle: true,
      comingNodeToggle: false,
      goOnNodeToggle: false,
      destinationNodeToggle: false,
      payNodeToggle: false,
      uploadNoneError: true, //上传超过2Mb的标识
      dateOptions:{
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      reminderForm: { // 表格检索条件
        strategyName:'',
        businessLines:[],
        cityCodes:[],
        effectedTime:[]
      },
      checkboxList:[
        {
          label: '司机接单',
          key:1
        },
        {
          label: '司机即将到达起点',
          key:2
        },
        {
          label: '乘客上车后',
          key:3
        },
        {
          label: '即将到达目的地',
          key:4
        },
        {
          label: '乘客支付费用后',
          key:5
        },
      ], // 复选框 初始值
      reminderNodeForm: { //复选框
        remindNodeList: [], //默认选中项
        remindNodeListNone: false, //自定义-校验使用
      },
      orderNodeForm: { //提醒节点 form 司机接单
        linkUrl:'',
        linkTitle:'',
        buttonText :'',
        popupImgUrl: '',
      },
      comingNodeForm: { //提醒节点 form 司机即将到达
        linkUrl:'',
        linkTitle:'',
        buttonText :'',
        popupImgUrl: '',
        distance: null
      },
      goOnNodeForm: { //
        linkUrl:'',
        linkTitle:'',
        buttonText :'',
        popupImgUrl: '',
        distance: null
      },
      destinationNodeForm: { //
        linkUrl:'',
        linkTitle:'',
        buttonText :'',
        popupImgUrl: '',
        distance: null
      },
      payNodeForm: { //
        linkUrl:'',
        linkTitle:'',
        buttonText :'',
        popupImgUrl: '',
        distance: null
      },
      products: [
        {
            value: '2',
            label: '专享'
          },
          {
            value: '4',
            label: '快享'
          },
      ],
      options: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      },
      cityList: [], //城市列表
      reminderValidate: { // 表头 form
        strategyName: [{ required: true, message: "请输入", trigger: "blur" }],
        businessLines: [
          { required: true,  trigger: "change", validator: validateMultiple }
        ],
        cityCodes: [
          { required: true,  trigger: "change", validator: validateMultiple }
        ],
        effectedTime: [
          { required: true,  trigger: 'change',message:"请选择生效时间", validator: effectiveTime }
        ],
      },
      reminderNodeValidate: { //提醒节点 form 复选框 ---------------------------------
        // remindNodeList: [
        //   {required: true, trigger: 'change', validator: validateCheckbox}
        // ]
      },

      orderNodeValidate: { //提醒节点 form 接单
        buttonText: [
          { required: true,  trigger: "blur", message:"请输入" }
        ],
        popupImgUrl: [
          {
            required: true,
            message: "请上传图片",
            trigger: "change",
          },
        ],
      },
      imageUrl: '', //ceshi upload
      comingNodeValidate: {
        buttonText: [
          { required: true,  trigger: "blur", message:"请输入" }
        ],
        distance: [
          { type: 'number',required: true,  trigger: "blur", validator: validateNumber }
        ],
        popupImgUrl: [
          {
            required: true,
            message: "请上传图片",
            trigger: "change",
          },
        ],
      },
      goOnNodeValidate: {
        buttonText: [
          { required: true,  trigger: "blur", message:"请输入" }
        ],
        popupImgUrl: [
          {
            required: true,
            message: "请上传图片",
            trigger: "change",
          },
        ],
      },
      destinationNodeValidate: {
        buttonText: [
          { required: true,  trigger: "blur", message:"请输入" }
        ],
        distance: [
          { type: 'number',required: true,  trigger: "blur", validator: validateNumber }
        ],
        popupImgUrl: [
          {
            required: true,
            message: "请上传图片",
            trigger: "change",
          },
        ],
      },
      payNodeValidate: {
        buttonText: [
          { required: true,  trigger: "blur", message:"请输入" }
        ],
        popupImgUrl: [
          {
            required: true,
            message: "请上传图片",
            trigger: "change",
          },
        ],
      },
      qrcodeHeaderParams: {}, //order 上传图片
      actionUrl: this._baseUrl + "/common/uploadFile", // 公共文件上传服务
    };
  },
  watch: {
    theInfo(){
        if(JSON.stringify(this.theInfo) === '{}') return;
        if(!this.tag){
          return
        }
        this.showData_reminderForm() //表头数据回填
        this.showData_reminderNodeForm() // 提醒节点watch
    },
  },
  methods: {
    createdTime(value) {
        if (value && value[0]) {
          this.reminderForm.startTime = value[0]
          this.reminderForm.endTime = value[1]
        } else {
          this.reminderForm.startTime = null
          this.reminderForm.endTime = null
          // this.reminderForm.effectiveTime()
          // this.effectiveTimeFn()
        }
    },
    setTimeClear(){
          this.reminderForm.startTime = null
          this.reminderForm.endTime = null
    },
    getCitiyList(){
        getOnLineCity({}).then(res => { //
            let list = res.data.data||[]
            let params = {
            list: list,
            labelKey: 'city',
            valueKey: 'cityId',
            isDeep: true,
            data: {
                loading: false,
                type:1 //级联位置
            }
            }
            list = cpLabelValue(params)
            this.cityList = list
        });
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
    chooseTime() {
      if (this.reminderForm.rangeTime && this.reminderForm.rangeTime.length) {
        const [startTime = "", endTime = ""] = this.reminderForm.rangeTime;
      } else {
      }
    },
    // TODO /common/uploadFile 改造 未使用
    getImgUrlFir(index,{ fileUrl, fileName }) {
      this.orderNodeForm.popupImgUrl = this.uploadNoneError ? fileUrl : '';
    },
    getImgUrlSec(index,{ fileUrl, fileName }) {
      this.comingNodeForm.popupImgUrl = fileUrl;
    },
    getImgUrlThr(index,{ fileUrl, fileName }) {
      this.goOnNodeForm.popupImgUrl = fileUrl;
    },
    getImgUrlThi(index,{ fileUrl, fileName }) {
      this.destinationNodeForm.popupImgUrl = fileUrl;
    },
    getImgUrlFif(index,{ fileUrl, fileName }) {
      this.payNodeForm.popupImgUrl = fileUrl;
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    handleReNodeClick(list){
      if(list.length === 0){
        this.clearForm()
        this.hideAllForm()
        this.reminderNodeForm.remindNodeListNone = true //提示
        return
      }

      list.map(()=>{
         this.reminderNodeForm.remindNodeListNone = false
        if(list.includes("1")){
          this.orderNodeToggle = true
          this.orderNodeForm["routeNode"] = 1
        }else{
          this.orderNodeToggle = false
        }
        if(list.includes("2")){
          this.comingNodeToggle = true
          this.comingNodeForm["routeNode"] = 2
        }else{
          this.comingNodeToggle = false
        }
        if(list.includes("3")){
          this.goOnNodeToggle = true
          this.goOnNodeForm["routeNode"] = 3
        }else{
           this.goOnNodeToggle = false
        }

        if(list.includes("4")){
          this.destinationNodeToggle = true
          this.destinationNodeForm["routeNode"] = 4
        }else{
           this.destinationNodeToggle = false
        }

        if(list.includes("5")){
          this.payNodeToggle = true
          this.payNodeForm["routeNode"] = 5
        }else{
           this.payNodeToggle = false
        }
      })
    },
    clearForm(){
      this.reminderForm.model = {}
      this.orderNodeForm.model = {}
      this.comingNodeForm.model = {}
      this.goOnNodeForm.model = {}
      this.destinationNodeForm.model = {}
      this.payNodeForm.model = {}
    },
    showData_reminderForm(){
      this.reminderForm = this.theInfo
      this.reminderForm.cityCodes = this.theInfo.cityCodes
      this.reminderForm.effectedTime = [this.theInfo.startTime, this.theInfo.endTime]
    },
    togglerTxt(param){
      let bLines, newLines = [];
      this.theInfo[param].map((item, idx) => {
          if(param === 'businessLines'){  //
            newLines.push( item === "4" ? "快享" : "专享" )
          }else if(param === 'cityNames'){
            newLines.push(item)
          }
          bLines = newLines.join("、")
          this.reminderForm[param] = bLines
      });
    },
    showData_reminderNodeForm(){
      let form1 = this.theInfo.strategyNodes
      this.reminderNodeForm.remindNodeList = []
      if(form1.length === 0) return;
      form1.map((item, idx) => {
        this.splitData(item);
      })
    },
    splitData(item){
      if(item.routeNode === 1){  //
          this.reminderNodeForm.remindNodeList.push('1')
          this.orderNodeForm = {...item}
          this.orderNodeForm["uuid"] = item.uuid  //uuid 只有编辑有,新增无uuid
          this.orderNodeToggle = true
      }else if(item.routeNode === 2){  //
          this.reminderNodeForm.remindNodeList.push('2')
          this.comingNodeForm = {...item}
          this.comingNodeForm.distance = item.distance+''
          this.comingNodeForm["uuid"] = item.uuid
          this.comingNodeToggle = true
      }else if(item.routeNode === 3){  //
          this.reminderNodeForm.remindNodeList.push('3')
          this.goOnNodeForm = {...item}
          this.goOnNodeForm.distance = item.distance+''
          this.goOnNodeForm["uuid"] = item.uuid
          this.goOnNodeToggle = true
      }else if(item.routeNode === 4){  //
          this.reminderNodeForm.remindNodeList.push('4')
          this.destinationNodeForm = {...item}
          this.destinationNodeForm.distance = item.distance+''
          this.destinationNodeForm["uuid"] = item.uuid
          this.destinationNodeToggle = true
      }else if(item.routeNode === 5){  //
          this.reminderNodeForm.remindNodeList.push('5')
          this.payNodeForm = {...item}
          this.payNodeForm.distance = item.distance+''
          this.payNodeForm["uuid"] = item.uuid
          this.payNodeToggle = true
      }
    },
    hideAllForm(){
      this.orderNodeToggle = false
      this.comingNodeToggle = false
      this.goOnNodeToggle = false
      this.destinationNodeToggle = false
      this.payNodeToggle = false
    },
    clear(){
      if(JSON.stringify(this.reminderForm) !== '{}'){
        this.reminderForm= { // 表格检索条件
          strategyName:'',
          businessLines:[],
          cityCodes:[],
          effectedTime:[]
        }
      }

      if(JSON.stringify(this.reminderNodeForm) !== '{}'){
        this.reminderNodeForm.remindNodeList = ['1'] //routeNode 点取消弹框,默认数据恢复到新增
        this.reminderNodeForm.remindNodeListNone = false
      }
      if(JSON.stringify(this.orderNodeForm) !== '{}'){
      this.orderNodeForm = { //提醒节点 form 司机接单
        linkUrl:'',
        linkTitle:'',
        buttonText :'',
        popupImgUrl: '',
      }
      }

      if(JSON.stringify(this.comingNodeForm) !== '{}'){
              this.comingNodeForm= {
        linkUrl:'',
        linkTitle:'',
        buttonText :'',
        popupImgUrl: '',
        distance: null
      }
      }
      if(JSON.stringify(this.goOnNodeForm) !== '{}'){
             this.goOnNodeForm= {
        linkUrl:'',
        linkTitle:'',
        buttonText :'',
        popupImgUrl: '',
        distance: null
      }
      }
      if(JSON.stringify(this.destinationNodeForm) !== '{}'){
              this.destinationNodeForm= {
        linkUrl:'',
        linkTitle:'',
        buttonText :'',
        popupImgUrl: '',
        distance: null
      }
      }
      if(JSON.stringify(this.payNodeForm) !== '{}'){
              this.payNodeForm= {
        linkUrl:'',
        linkTitle:'',
        buttonText :'',
        popupImgUrl: '',
        distance: null
      }
      }
    }
  },
  mounted(){
    this.getCitiyList()

  }
};
</script>

<style lang="less" scoped>
.reminder-add {
    width: 100%;
    margin: 0 auto;
    padding: 10px;
    .itemWidth {
        width:200px;
    }
    .itemWidth80 {
      width: 80px;
    }
    .reminderBlock {
      padding: 30px 0;
      border: 1px solid #ededed;
    }
    .remindB-strategyName {
      font-size: 15px;
      font-weight: bold;
      span {
        color: red;
      }
    }
    .remindB-substrategyName {
      font-size: 14px;
      margin-bottom: 15px;
      color: #333;
      span {
        color: red;
      }
    }
    .reminderNode {
      margin-bottom: 10px;
    }
    .solidBorder {
      border-bottom: 1px solid #ededed;
      margin-bottom: 20px;
    }
    .popHigh {
      height: 80px;
    }
}
</style>