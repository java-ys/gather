<template>
  <div class="broadcast_wrap">
    <div class="header">语音播报配置：</div>
    <div class="content">
      <div class="line">
        <div class="left">
          <FormItem
            label="任务启用播报内容："
            class="ivu-form-item-required"
          >
            <RadioGroup
              v-model="addData.broadcast.enableType"
              class="right15"
              @on-change="broadcastTypeChange"
              :disabled="isDetail"
            >
              <Radio
                v-for="item in broadcastTypeOptions"
                :key="item.value"
                :value="item.value"
                :label="item.value"
                :disabled="isDetail"
              >{{ item.label }}
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem
            label=""
            class="broadcastContent_wrap"
            v-if="addData.broadcast.enableType === 1"
          >
            <Input
              v-model="addData.broadcast.enableContent"
              placeholder="请输入播报内容"
              type="textarea"
              class="content_input"
              :maxlength="100"
              @on-change="contentChange"
              :disabled="isDetail"
            />
            <div
              v-if="addData.broadcast.enableType === 1"
              class="c_len"
            >
              ({{
              addData.broadcast.enableContent ? addData.broadcast.enableContent.length: 0
              }}/ 100)
            </div>
          </FormItem>
          <FormItem
            label=""
            v-if="addData.broadcast.enableType === 2"
            class="upload_wrap"
          >
            <div class="file_list_wrap">
              {{ addData.broadcast.enabledBroadcastUrlName }}
            </div>
            <Upload
              v-if="addData.broadcast.enableType === 2"
              style="margin-left: 10px"
              ref="UploadFile"
              :headers="header"
              :format="format"
              :on-format-error="formatError"
              :action="actionUrl"
              :data="enable.uploadFiles"
              :show-upload-list="false"
              :before-upload="(res) => beforeEnableUpload(res)"
              :on-success="(res) => uploadEnableSuccess(res)"
              :on-error="(err) => uploadError(err)"
              :disabled="isDetail"
            >
              <Button
                v-if="addData.broadcast.enableType === 2"
                :loading="uploadLoading"
                type="primary"
                :disabled="isDetail"
              >
                <span v-if="!uploadLoading">{{ addData.broadcast.enabledBroadcastUrlName ? '重新上传': '上传音频' }}</span>
                <span v-else>上传中...</span></Button>
            </Upload>
          </FormItem>
        </div>
        <div class="right">
          <FormItem
            label="任务启用提前通知时间："
            :label-width="200"
            prop="enableHour"
          >
            <InputNumber
              v-model="addData.broadcast.enableHour"
              placeholder=""
              type="number"
              :min="0"
              :max="12"
              class="hour_input"
              :disabled="isDetail || addData.isRealtime === 0"
              @on-change="hourChange"
            />
            <div class="unit">小时</div>
            <InputNumber
              v-model="addData.broadcast.enableMin"
              placeholder=""
              type="number"
              :min="0"
              :max="59"
              class="nin_input"
              :disabled="isDetail || addData.isRealtime === 0"
              @on-change="minChange"
            />
            <div class="unit">分钟</div>
          </FormItem>
        </div>
      </div>
      <div class="line">
        <div class="left">
          <FormItem label="任务停用播报内容：">
            <RadioGroup
              v-model="addData.broadcast.disableType"
              class="right15"
              @on-change="broadcastTypeChange"
              :disabled="isDetail"
            >
              <Radio
                v-for="item in broadcastTypeOptions"
                :key="item.value"
                :value="item.value"
                :label="item.value"
                :disabled="isDetail"
              >{{ item.label }}
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem
            label=""
            class="broadcastContent_wrap"
            v-if="addData.broadcast.disableType === 1"
            prop="disableContent"
          >
            <Input
              v-model="addData.broadcast.disableContent"
              placeholder="请输入播报内容"
              type="textarea"
              class="content_input"
              :maxlength="100"
              @on-change="contentChange"
              :disabled="isDetail"
            />
            <div
              v-if="addData.broadcast.disableType === 1"
              class="c_len"
            >
              ({{
              addData.broadcast.disableContent ? addData.broadcast.disableContent.length:0
              }}/ 100)
            </div>
          </FormItem>
          <FormItem
            label=""
            v-if="addData.broadcast.disableType === 2"
            class="upload_wrap"
          >
            <div class="file_list_wrap">
              {{ addData.broadcast.disableBroadcastUrlName }}
            </div>
            <Upload
              style="margin-left: 10px"
              ref="UploadFile"
              :headers="header"
              :format="format"
              :on-format-error="formatError"
              :action="actionUrl"
              :data="disable.uploadFiles"
              :show-upload-list="false"
              :before-upload="(res) => beforeDisableUpload(res)"
              :on-success="(res) => uploadDisableSuccess(res)"
              :on-error="(err) => uploadError(err)"
              :disabled="isDetail"
            >
              <Button
                :loading="uploadLoading"
                type="primary"
                :disabled="isDetail"
              >
                <span v-if="!uploadLoading">{{ addData.broadcast.disableBroadcastUrlName ? '重新上传': '上传音频' }}</span>
                <span v-else>上传中...</span></Button>
            </Upload>
          </FormItem>
        </div>
        <div class="right">
          <FormItem
            label="任务停用提前通知时间："
            :label-width="200"
          >
            <InputNumber
              v-model="addData.broadcast.disableHour"
              placeholder=""
              type="number"
              :min="0"
              :max="2"
              class="hour_input"
              @on-change="hourChange"
              :disabled="isDetail || addData.isRealtime === 0"
            />
            <div class="unit">小时</div>
            <InputNumber
              v-model="addData.broadcast.disableMin"
              placeholder=""
              type="number"
              :min="0"
              :max="59"
              class="nin_input"
              @on-change="minChange"
              :disabled="isDetail || addData.isRealtime === 0"
            />
            <div class="unit">分钟</div>
          </FormItem>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getToken } from "@/libs/util.js";
import {
  broadcastTypeOptions
} from "../../../../config/fields"

export default {
  name: 'broadcast',
  props: {
    addData: {
      type: Object,
      default () {
        return {}
      }
    },
    isDetail: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      broadcastTypeOptions,
      uploadLoading: false,
      actionUrl: this._baseUrl + "/common/uploadFile",
      header: { Authorization: getToken() },
      maxSize: 51200,
      format: ["mp3"],
      enable: {
        file: {},
        uploadFiles: {},
      },
      disable: {
        file: {},
        uploadFiles: {},
      }
    }
  },
  created () {
    console.log('this.addData', this.addData)
  },
  watch: {
    addData: {
      immediate: true,
      handler (newValue) {
        console.log('broadcast -------------', newValue)
      }
    }
  },
  methods: {
    broadcastTypeChange (value) {
      this.$emit('broadcastTypeChange', value)
    },
    contentChange () {

    },
    hourChange () {

    },
    minChange () {

    },
    // 处理上传格式
    getFileType (url) {
      let fileObj = { fileType: 1 };
      if (
        url.indexOf(".jpg") != -1 ||
        url.indexOf(".png") != -1 ||
        url.indexOf(".gif") != -1
      ) {
        fileObj = {
          fileType: 1
        };
      }
      if (
        url.indexOf(".mp4") != -1 ||
        url.indexOf(".avi") != -1 ||
        url.indexOf(".rmvb") != -1 ||
        url.indexOf(".mpeg") != -1
      ) {
        fileObj = {
          fileType: 2
        };
      }
      if (
        url.indexOf(".mp3") != -1
      ) {
        fileObj = {
          fileType: 3
        };
      }
      return fileObj;
    },
    async beforeEnableUpload (file) {
      let isAllow = true;
      let msg = "";
      let that = this;
      let flagPV = "";
      let maxSize = 0;
      let fileType = this.getFileType(file.name).fileType;
      if (fileType === 3) {
        maxSize = this.maxAudioSize;
        flagPV = "音频";
      }
      // 文件的大小
      if (maxSize) {
        isAllow = file.size / 1024 > maxSize ? false : true;
        if (maxSize < 1024) {
          msg = `请上传大小在 ${maxSize}KB 以内${flagPV}`;
        } else {
          msg = `请上传大小在 ${maxSize / 1024}M 以内${flagPV}`;
        }

        if (!isAllow) {
          that.$Message.error(msg);
          return false;
        } else {
          this.uploadLoading = true;
        }
      }
      return true;
    },
    // TODO /common/uploadFile改造 未使用
    uploadEnableSuccess (res) {
      console.log("res", res);
      this.uploadLoading = false;
      if (res.data) {
        let newData = res.data || {};
        this.fileType = this.getFileType(newData.fileName).fileType;
        newData.fileType = this.fileType;
        this.addData.broadcast.enabledBroadcastUrl = newData.fileUrl
        this.addData.broadcast.enabledBroadcastUrlName = newData.fileName
        this.$forceUpdate()
        this.$emit("uploadSuccess", newData);
      }
    },
    async beforeDisableUpload (file) {
      let isAllow = true;
      let msg = "";
      let that = this;
      let flagPV = "";
      let maxSize = 0;
      let fileType = this.getFileType(file.name).fileType;
      if (fileType === 3) {
        maxSize = this.maxAudioSize;
        flagPV = "音频";
      }
      // 文件的大小
      if (maxSize) {
        isAllow = file.size / 1024 > maxSize ? false : true;
        if (maxSize < 1024) {
          msg = `请上传大小在 ${maxSize}KB 以内${flagPV}`;
        } else {
          msg = `请上传大小在 ${maxSize / 1024}M 以内${flagPV}`;
        }

        if (!isAllow) {
          that.$Message.error(msg);
          return false;
        } else {
          this.uploadLoading = true;
        }
      }
      return true;
    },
    uploadDisableSuccess (res) {
      console.log("res", res);
      this.uploadLoading = false;
      if (res.data) {
        let newData = res.data || {};
        this.fileType = this.getFileType(newData.fileName).fileType;
        newData.fileType = this.fileType;
        this.addData.broadcast.disableBroadcastUrl = newData.fileUrl
        this.addData.broadcast.disableBroadcastUrlName = newData.fileName
        this.$forceUpdate()
        this.$emit("uploadSuccess", newData);
      }
    },
    formatError () {
      this.uploadLoading = false;
      this.$Message.error(`请上传 ${this.format.join(", ")} 格式`);
    },
    uploadError (res) {
      this.uploadLoading = false;
      this.$Message.error(res.msg);
    },
  },
}
</script>

<style lang="less" scoped>
.broadcast_wrap {
  border: 1px solid #ddd;
  padding: 12px;
  width: 1200px;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-left: 120px;
  /deep/ .ivu-form-item-label {
    white-space: nowrap;
  }
  &.dayWidth {
    width: 500px;
  }
  &.weekWidth {
    width: 500px;
  }
  .header {
    font-size: 15px;
  }
  .upload_wrap {
    .file_list_wrap {
      margin-left: 8px;
    }
  }
  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    .left {
      flex: 0.5;
      display: flex;
      width: 50%;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      .broadcastContent_wrap {
        /deep/ .ivu-form-item-content {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: flex-end;
        }
        .c_len {
          margin-left: 4px;
          white-space: nowrap;
        }
      }
    }
    .right {
      flex: 0.5;
      width: 50%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-start;
      flex-wrap: no-wrap;
      white-space: nowrap;
      .week_wrap {
        width: 80%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: flex-start;
        flex-wrap: wrap;
        .ivu-checkbox-group-item {
          padding-right: 10px;
        }
      }
      .week_period_wrap {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: flex-start;
        flex-wrap: nowrap;
        white-space: nowrap;
      }
      .unit {
        margin-left: 4px;
        margin-right: 4px;
      }
    }
  }
  .line {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
  }
  /deep/ .ivu-form-item-content {
    // margin-left: 100px !important;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
  }
  /deep/ .ivu-input-wrapper {
    input {
      width: 80px !important;
    }
    textarea {
      width: 400px !important;
      height: 100px;
    }
  }
  /deep/ .ivu-select {
    width: 150px;
  }
}
</style>
