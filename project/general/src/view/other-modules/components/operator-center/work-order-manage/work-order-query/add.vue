<template>
  <Modal
    v-model="showModal"
    :title="title"
    width="60%"
    :z-index="1"
    :mask-closable="false"
  >
    <Form
      ref="formData"
      :model="formData"
      :label-width="120"
      :rules="formValidate"
      inline
    >
      <FormItem label="一级工单分类" prop="categoryFirst">
        <Select v-model="formData.categoryFirst" clearable style="width:200px" @on-change="changeCategoryFirst">
          <Option
            v-for="(item, index) in categoryFirstList"
            :value="item.value"
            :key="index"
            >{{ item.label }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="二级工单分类" prop="categorySecond" >
        <Select
          v-model="formData.categorySecond"
          clearable
          style="width:200px"
          @on-change="changeSelect"
        >
          <Option
            v-for="(item, index) in categorySecondList"
            :value="item.value"
            :key="index"
            >{{ item.label }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="三级工单分类" prop="categoryThird">
        <Select v-model="formData.categoryThird" clearable style="width:200px"  @on-change="changeCategoryThird">
          <Option
            v-for="(item, index) in categoryThirdList"
            :value="item.value"
            :key="index"
            >{{ item.label }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="四级工单分类" prop="categoryForth">
        <Select v-model="formData.categoryForth" clearable style="width:200px">
          <Option
            v-for="(item, index) in categoryForthList"
            :value="item.value"
            :key="index"
            >{{ item.label }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="车牌号:" prop="carNumber">
        <Input style="width:200px" v-model="formData.carNumber" @on-blur="onInputCarNumberBlur" />
      </FormItem>
      <FormItem label="司机姓名:" prop="driverName">
        <Select
          :value="formData.driverId"
          class="item-style"
          :clearable="true"
          :label-in-value="true"
          filterable
          remote
          :remote-method="driverNameRemote"
          :loading="loading2"
          style="width:200px"
          @on-change="driverNameChange"
        >
          <Option
            v-for="(item, index) in driverList"
            :value="item.uuid"
            :key="index"
            >{{ item.name }}</Option>
        </Select>
      </FormItem>
      <FormItem label="司机UID:" prop="driverId">
        <Input
          style="width:200px"
          v-model="formData.driverId"
          :maxlength="24"
        />
      </FormItem>
      <FormItem label="城市：" prop="cityName">
        <Input style="width:200px" v-model="formData.cityName" />
      </FormItem>
      <FormItem label="运营商：" prop="agentName">
        <Input style="width:200px" v-model="formData.agentName" />
      </FormItem>
      <FormItem label="车辆VIN码:" prop="carVin">
        <Input :readonly="!fromLZ" style="width:200px" v-model="formData.carVin" />
      </FormItem>
      <FormItem label="关联订单编号:" prop="routePlanNo">
        <Input
          clearable="clearable"
          style="width:200px"
          v-model="formData.routePlanNo"
          placeholder="请输入"
          :maxlength="24"
        />
      </FormItem>
      <FormItem label="乘客姓名:" prop="passengerName" v-if="isFk">
        <Input
          clearable="clearable"
          style="width:200px"
          v-model="formData.passengerName"
          placeholder="请输入"
          :maxlength="24"
        />
      </FormItem>
      <FormItem label="报警ID:" prop="alarmId" v-if="isDp">
        <Input
          clearable="clearable"
          style="width:200px"
          v-model="formData.alarmId"
          placeholder="请输入"
          :maxlength="24"
        />
      </FormItem>
      <FormItem label="报警次数:" prop="alarmNumber" v-if="isDp">
        <Input
          clearable="clearable"
          style="width:200px"
          v-model="formData.taskName"
          placeholder="请输入"
          :maxlength="24"
        />
      </FormItem>
      <!-- <FormItem label="创建时间:" prop="createTime">
        <DatePicker
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          style="width: 200px"
          v-model="formData.createTime"
          @on-change="formData.createTime = $event"
        >
        </DatePicker>
      </FormItem> -->
      <FormItem label="违规时间:" prop="illegalTime" v-if="isKs">
        <DatePicker
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          style="width: 200px"
          v-model="formData.illegalTime"
          @on-change="formData.illegalTime = $event"
        >
        </DatePicker>
      </FormItem>
      <Row>
        <FormItem label="问题描述:" prop="illegalMsg" v-if="isFk">
          <Input
            clearable="clearable"
            type="textarea"
            style="width:400px"
            v-model="formData.illegalMsg"
            placeholder="请输入"
            :maxlength="200"
          />
        </FormItem>
      </Row>
      <Row v-if="fromLZ && partList.length">
        <FormItem label="默认处理部门：">
          <Select v-model="formData.partId" :disabled="part.partType!=0" style="width: 100px;">
            <Option v-for="(v,i) of partList" :key="i" :value="v.id">{{v.designation}}</Option>
          </Select>
        </FormItem>
        <span v-if="formData.partId" style="display: inline-block;line-height: 30px;">
          <span>工作时间：{{part.workHour}}-{{part.rushHour}}</span>
          <span style="margin-left: 10px;">处理时长：{{part.handleTime}}</span>
        </span>
      </Row>
      <Row>
        <FormItem label="违规行为描述:" prop="illegalMsg" v-if="isDp">
          <Input
            clearable="clearable"
            type="textarea"
            style="width:400px"
            v-model="formData.illegalMsg"
            placeholder="请输入"
            :maxlength="200"
          />
        </FormItem>
      </Row>
      <Row>
        <FormItem label="投诉内容:" prop="illegalMsg" v-if="isKs">
          <Input
            clearable="clearable"
            type="textarea"
            style="width:400px"
            v-model="formData.illegalMsg"
            placeholder="请输入"
            :maxlength="200"
          />
        </FormItem>
      </Row>
      <br />
      <!-- <FormItem label="相关图片:" prop="picUrl">
            <img-upload
            :defaultImg="formData.picUrl"
            :action="actionUrl"
            :params="{imgType:1}"
            accept="image/png, image/jpeg"
            :maxSize="5120"
            :maxM="9"
            :format="['jpg', 'png']"
            @on-change="getImgUrl"
            ></img-upload>
        </FormItem>
        <div>
            <FormItem label="相关视频:" prop="videoUrl">
              <img-upload
                :defaultFile="formData.videoUrl"
                :defaultFileName="formData.videoName"
                :headerParams="{}"
                :action="videoActionUrl"
                :maxFileSize="600"
                :params="{ videoPayloadType: 'h265' }"
                accept="audio/mp4, video/mp4, audio/3gpp, video/3gpp, audio/mpeg, video/mpeg"
                :format="['mp4']"
                @on-change="getVideoUrl"
                @on-progress="videoOnProgess"
              ></img-upload>
            </FormItem>
            <span v-if="uploadVideoStatus" class="loading"
              >视频上传中</span
            >
        </div> -->
      <FormItem label="相关图片视频:" prop="imageList">
        <!-- <ExportPic
          v-on:up-success="callbackPic1"
          :maxLength="9"
          v-on:deleteItem="deletePic1"
          :imgType="1"
          :showRemove="true"
        ></ExportPic>
        <input type="hidden" v-model="imageList" />
        <br />
        <UploadVideo v-on:up-success="callbackPic2"></UploadVideo> -->
        <mediaUpload
          v-on:upload-success="handleUploadSuccess"
          v-on:delete="handleDelete"
        ></mediaUpload>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button @click="showModal = false">取消</Button>
      <Button type="primary" v-lazy-click="saveData" :loading="loading"
        >提交</Button
      >
    </div>
  </Modal>
</template>

<script>
import {
  getDriverNames,
  getMore,
  fileToken,
  fetchVerifyOrder
} from "_o/api/work-order/common.js";
import uploadfile from "./components/uploadfile.vue";
import { validatorTime } from "./fields";
// import uploadImgVideo from "./components/upload-img-video/index.vue";
import imgUpload from "./components/uploadImage.vue";
import ExportFile from "./components/exportFile.vue";
import ImportFile from "./components/importFile.vue";
import ExportPic from "./components/exportPic.vue";
import UploadVideo from "./components/uploadVideo.vue";
import { orderCreate } from "_o/api/work-order/wo-add";
import mediaUpload from "./components/mediaUpload.vue";
import { getWoTypeList } from "_o/api/work-order/common.js";
import { queryDefaultDepartment, postOrder, queryPlateNumInfo } from "_o/api/work-order/work-order-config";
const levelsMap = {
  0: 'categoryFirstList',
  1: 'categorySecondList',
  2: 'categoryThirdList',
  3: 'categoryForthList',
}
export default {
  components: {
    imgUpload,
    ImportFile,
    uploadfile,
    ExportFile,
    // uploadImgVideo,
    ExportPic,
    UploadVideo,
    mediaUpload
  },
  props: {
    fromLZ: Boolean,
  },
  data() {
    let self = this;
    const myRule = this.fromLZ ? {
      categoryThird: { required: true, message: "必填", trigger: "change" },
      categoryForth: { required: true, message: "必填", trigger: "change" },
      carNumber: { required: true, message: "请填写车牌号", trigger: "blur" },
      illegalMsg: { required: true, message: "请填写问题描述", trigger: "blur" },
    } : undefined;
    return {
      showModal: false,
      title: "新建工单",
      formData: {},
      driverList: [],
      categoryFirstList: [],
      categorySecondList: [],
      categoryThirdList: [],
      categoryForthList: [],
      isFk: true,
      isDp: false,
      isKs: false,
      loading: false,
      loading2: false,
      uploadVideoStatus: false,
      selectName: "",
      formValidate: {
        categoryFirst: [
          {
            required: true,
            message: "必填",
            trigger: "change"
          }
        ],
        categorySecond: [
          {
            required: true,
            message: "必填",
            trigger: "change"
          }
        ],
        driverName: [
          {
            required: true,
            message: "必填",
            trigger: "change"
          }
        ],
        ...myRule
      },
      actionUrl: this._baseUrl4CommonWeb + "/common/uploadImg", // 图片上传地址
      // videoActionUrl: this._uploadUrl + "/file/upload/public", // 视频文件上传服务
      imageList: [],
      videoList: [],
      partList: [],
    };
  },
  computed: {
    part() {
      return this.partList.find(v => v.id === this.formData.partId) || {};
    }
  },
  watch: {
    showModal(val) {
      if (!val) {
        this.busEvents.$emit("clearFiles", true);
      }
    },
    "formData.categoryForth": "updateDefaultPart",
    "formData.agentId": "updateDefaultPart",
  },
  async mounted() {
    // this.getToken();
    await this.queryWotypes(0,null)
  },
  methods: {
    onInputCarNumberBlur() {
      const f = this.formData;
      if (!f.carNumber) return;
      queryPlateNumInfo({plateNum: f.carNumber}).then(res => {
        if (!res || !res[0]) return;
        const item = res[0];
        const f = this.formData;
        ["agentId", "cityCode", "cityName", "agentName"].forEach(k => f[k] = item[k]);
        f.cityUuid = item.cityUuid;
        f.carVin = item.vin;
        if (item.authDriverInfoDtos && item.authDriverInfoDtos[0]) {
          const driver = item.authDriverInfoDtos[0];
          f.driverId = driver.uuid = driver.driverUuid;
          this.selectName = f.driverName = driver.name;
          this.driverList = [driver];
          this.driverNameRemote._lock = true;
          setTimeout(() => this.driverNameRemote._lock = false, 1000)
          // this.driverNameRemote(driver.name);
        }
      })
    },
    updateDefaultPart() {
      this.formData.categoryFourth = this.formData.categoryForth;
      if (this.fromLZ && this.formData.categoryFourth && this.formData.agentId) {
        const data = this.formData;
        queryDefaultDepartment(Object.keys(data).filter(v => v.startsWith("category")).reduce((res,k) => {
          res[k] = data[k];
          return res;
        }, { agentId: this.formData.agentId })).then(res => {
          this.partList = res || [];
          this.formData.partId = this.partList[0]?.id || "";
        })
      }
    },
    getToken() {
      fileToken({ doType: 1 }).then(res => {});
    },
    async queryWotypes(level,id) {
      const res = await getWoTypeList({
        appid: this.fromLZ ? "31f937c72b80474a86c4c5e8c4a9971d" : "520315b4d7524001a27a3bde5d052c51",
        level: level,
        parentUuid: id
      })
      if (!res.data.success) return this.$Message.error(res.data.msg)
      const data = res.data.data.map(it=>{
        return {
          value:it.uuid,
          label:it.name
        }
      })
      this[levelsMap[level]] = data;
      this.formData['category'+['Second','Third', 'Forth'][level-1]] = "";
    },
    saveData() {
      const {
        formData: { pictures, videos }
      } = this;
      const query = {
        ...this.formData,
        driverName: this.selectName || this.formData.driverName,
        picFileId: pictures.map(item => item.fileId).join(","),
        vioFileId: videos.map(item => item.fileId).join(",")
      };
      this.$refs.formData.validate(async valid => {
        if (valid) {
          if(this.fromLZ) {
            query.orderNum = query.routePlanNo;
            postOrder(query).then(() => {
              this.$Message.success("成功！");
              this.showModal = false;
              this.$emit("reload");
            }).catch(err => this.$Message.error(err.msg));
          } else {
            const { routePlanNo } = query;
            if (routePlanNo) {
              const {
                data: { success }
              } = await fetchVerifyOrder({ routePlanNo });
              if (!success) return;
            }
            orderCreate(query).then(res => {
              if (res.data.code == 200) {
                this.$Message.success("成功！");
                this.showModal = false;
                this.$emit("reload");
              }
            });
          }
        }
      });
    },
    init(options) {
      this.fromLZ = options && options.from === "my";
      this.uploadVideoStatus = false;
      this.$refs.formData.resetFields();
      this.showModal = true;
      // "picFileId": "图片文件id列表,英文逗号分隔",
      // "vioFileId": "视频文件id列表,英文逗号分隔",
      this.formData = {
        woType: "",
        categoryFirst: "", // 一级工单分类
        categorySecond: "", // 二级工单分类
        categoryThird: "", // 三级工单分类
        categoryForth: "", // 四级工单分类
        agentId: "", // 运营商ID
        agentName: "", // 运营商Name
        cityName: "", // 城市Name
        cityCode: "", // 城市code
        cityUuid: "", // 城市uuid
        driverName: "", // 司机姓名
        driverId: "", // 司机ID
        driverPhone: "", //司机手机号,
        carVin: "", // 车辆VIN码
        carNumber: "", // 车牌号
        routePlanNo: "", // 关联订单编号
        passengerName: "", // 乘客姓名 --FK
        illegalMsg: "", // 问题描述 --FK
        alarmId: "", // 报警ID --DP
        alarmNumber: "", // 报警次数 --DP
        violationDesc: "", // 违规行为描述--DP
        complaintContent: "", // 投诉内容--KS
        illegalTime: "", // 违规时间--KS
        createTime: "", // 创建时间
        // picUrl: "", // 图片url
        picFileId: "", // 图片id
        // videoUrl: "", // 视频文件url
        vioFileId: "", // 视频id
        // videoName: "", // 视频文件名,
        pictures: [],
        videos: []
      };
    },
    // getImgUrl(res) {
    //   this.formData.picUrl = res.data.picUrl || "";
    //   this.formData.picFileId = res.data.uuid || "";
    // },
    // getVideoUrl(res) {
    //   this.formData.videoUrl = res.data.path;
    //   this.formData.vioFileId = res.data.uuid;
    //   this.formData.videoName = res.data.fileName;
    // },
    videoOnProgess({ event, file, fileList }) {
      this.uploadVideoStatus = event.percent - 100 !== 0;
    },
    driverNameChange(val) {
      console.log('change',val)
      if (val !== undefined) {
        this.selectName = this.formData.driverName = val.label;
        this.formData.driverId = val.value;
        let reqParams = {
          uuid: this.formData.driverId,
          currPage: 1,
          pageSize: 100
        };
        getMore(reqParams)
          .then(res => {
            this.formData.agentId = res.data.data.agentInfo.uuid;
            this.formData.agentName = res.data.data.agentInfo.name;
            this.formData.cityUuid = res.data.data.agentInfo.cityUuid;
            this.formData.cityCode = res.data.data.agentInfo.cityCode;
            this.formData.cityName = res.data.data.agentInfo.cityName;
            this.formData.carVin = res.data.data.carInfo.vin;
            this.formData.carNumber = res.data.data.carInfo.plateNum;
          })
          .catch(err => {});
      } else {
        this.formData.driverId = "";
        this.formData.driverName = "";
        this.formData.agentId = "";
        this.formData.agentName = "";
        this.formData.cityUuid = "";
        this.formData.cityCode = "";
        this.formData.cityName = "";
        this.formData.carVin = "";
        this.formData.carNumber = "";
      }
    },
    changeSelect(type) {
      if (type == "FKGD") {
        this.isFk = true;
        this.isDp = false;
        this.isKs = false;
        this.formData.woType = "FK";
      }
      if (type == "WGGD") {
        this.isDp = true;
        this.isFk = false;
        this.isKs = false;
        this.formData.woType = "DP";
      }
      if (type == "KSGD") {
        this.isKs = true;
        this.isDp = false;
        this.isFk = false;
        this.formData.woType = "KS";
      }
      this.changeCategorySecond(type)
    },
    driverNameRemote(query) {
      if(this.driverNameRemote._lock) return;
      let q = {
        name: query,
        currPage: 1,
        pageSize: 100,
        _silence: 1,
      };
      if (query !== "") {
        this.loading2 = true;
        getDriverNames(q)
          .then(res => {
            this.loading2 = false;
            const { data: { success, data: { list } } } = res
            if (success) {
              this.driverList = list;
            }
          })
      } else {
        this.loading2 = false;
        this.driverList = [];
      }
    },
    //上传图片
    callbackPic1(res) {
      // let pic = res.data.uuid;
      if (this.imageList.length < 8) {
        let picObj = { fileId: res.data.uuid, fileUrl: res.data.picUrl };
        this.imageList.push(picObj);
        this.formData.picFileId = this.imageList.map(i => i.fileId).toString();
        this.$forceUpdate();
        // this.imageList.splice(0, 1);
      } else {
        return;
      }
    },
    //上传视频
    callbackPic2(res) {
      let videoObj = { fileId: res.data.uuid, fileUrl: res.data.publicUrl };
      this.videoList.push(videoObj);
      this.formData.vioFileId = this.videoList.map(i => i.fileId).toString();
      this.$forceUpdate();
    },
    deletePic1(item) {
      const list = this.formData.imageList;
      this.imageList.splice(list.indexOf(item), 1);
      this.formData.picFileId = this.imageList.map(i => i.fileId).toString();
    },

    handleUploadSuccess(file, type) {
      if (type === 1) {
        this.formData.pictures.push(file);
      } else if (type === 2) {
        this.formData.videos.push(file);
      }
    },

    handleDelete(file, type) {
      const { pictures, videos } = this.formData;
      if (type === 1) {
        const index = pictures.findIndex(item => item.fileId === file.fileId);
        pictures.splice(index, 1);
      } else if (type === 2) {
        const index = videos.findIndex(item => item.fileId === file.fileId);
        videos.splice(index, 1);
      }
    },
    changeCategoryFirst(val) {
      this.queryWotypes(1,val)
    },
    changeCategorySecond(val) {
      this.queryWotypes(2,val)
    },
    changeCategoryThird(val) {
      this.queryWotypes(3,val)
    }
  }
};
</script>