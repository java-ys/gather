<template>
  <div class="img-upload-container">
    <div
      v-for="(item, index) in uploadList"
      :key="index"
      :class="{
        'demo-upload-list': showType === 'img',
        'text-type': showType === 'text'
      }"
    >
      <template v-if="item.status === 'finished'">
        <template
          v-if="showType === 'img'"
        >
          <img
            :src="item.url"
            alt=""
          >
          <div class="demo-upload-list-cover">
            <Icon
              type="ios-eye-outline"
              @click.native="handleView(item)"
            />
            <Icon
              type="ios-trash-outline"
              @click.native="handleRemove(item)"
            />
          </div>
        </template>
        <template
          v-else
        >
          <div class="text-flex">
            <div class="text-flex-item">
              {{ item.url }}
            </div>
            <div class="text-flex-icon">
              <Icon
                :size="20"
                type="ios-trash-outline"
                @click.native="handleRemove(item)"
              />
            </div>
          </div>
        </template>
      </template>
      <template v-else>
        <Progress
          v-if="item.showProgress"
          :percent="item.percentage"
          :stroke-width="10"
          hide-info
        />
      </template>
    </div>
    <Upload
      v-show="uploadList.length < maxlength"
      ref="upload"
      :show-upload-list="false"
      :default-file-list="defaultFileList"
      :on-success="handleSuccess"
      :format="format"
      :max-size="maxSize"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      multiple
      type="drag"
      :action="baseUrl + action"
      :headers="header"
      :data="data"
      style="display: inline-block;width:58px;"
    >
      <div style="width: 58px;height:58px;line-height: 58px;">
        <Icon
          type="ios-camera"
          size="20"
        ></Icon>
      </div>
    </Upload>
    <Modal
      v-model="visible"
      title="查看图片"
    >
      <img
        v-if="visible"
        :src="imgUrl"
        style="width: 100%"
        alt=""
      >
    </Modal>
  </div>
</template>
<script>
import { getToken } from '@/libs/util'

export default {
  props: {
    action: {
      type: String,
      default: '/common/uploadPics'
    },
    maxSize: {
      type: Number,
      default: 2048
    },
    format: {
      type: Array,
      default: () => ['jpg', 'jpeg', 'png']
    },
    value: {
      type: Array,
      default: () => []
    },
    maxlength: {
      type: Number,
      default: 1
    },
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    },
    baseURL: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
      default: () => ({})
    },
    showType: {
      type: String,
      // img , text
      default: 'img'
    }
  },
  data() {
    return {
      imgUrl: '',
      visible: false,
      header: {
        Authorization: getToken()
      },
    }
  },
  computed: {
    defaultFileList() {
      return this.value.map(item => ({
        url: item
      }))
    },
    uploadList() {
      if (this.value && this.$refs?.upload?.fileList) {
        return this.$refs.upload.fileList
      }
      return []
    },
    baseUrl() {
      return this.baseURL || this._baseUrl
    }
  },
  methods: {
    handleView(item) {
      this.imgUrl = item.url
      this.visible = true
    },
    handleRemove(file) {
      const fileList = this.$refs.upload.fileList
      console.log('remove', file, fileList.indexOf(file))
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
      this.emitInput()
    },
    handleSuccess(res, file) {
      const fileList = this.$refs.upload.fileList
      if (res.success) {
        this.$Message.success('上传成功!')
        file.url = res.data.picUrl
        this.emitInput()
      } else {
        this.$Message.error(res.msg)
        this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
      }
    },
    handleFormatError() {
      this.$Notice.warning({
        title: '图片格式不正确',
        desc: `只支持${this.format.join(',')}`
      })
    },
    handleMaxSize() {
      this.$Notice.warning({
        title: '图片尺寸不正确',
        desc: `最大支持${this.maxSize}KB`
      })
    },
    async handleBeforeUpload(file) {
      let check = this.value.length < this.maxlength
      console.log('file', file)
      if (!check) {
        this.$Notice.warning({
          title: `最多支持上传${this.maxlength}张`
        })
        return check
      }
      if (this.width > 0 || this.height > 0) {
        return this.checkImageWH(file, this.width, this.height)
      }
      return check
    },
    checkImageWH(file, width, height) {
      let self = this
      return new Promise(function (resolve, reject) {
        let filereader = new FileReader()
        filereader.onload = e => {
          let src = e.target.result
          const image = new Image()
          image.onload = function () {
            if (this.width === width && this.height === height) {
              resolve()
            } else if (width === 0 && this.height === height) {
              resolve()
            } else if (this.width === width && height === 0) {
              resolve()
            } else {
              let reason = `请上传尺寸为${width}*${height}的图片`
              if (height === 0) {
                reason = `请上传宽度为${width}的图片`
              }
              if (width === 0) {
                reason = `请上传高度为${height}的图片`
              }
              self.$Message.warning(reason)
              reject(reason)
            }
          }
          image.onerror = reject
          image.src = src
        }
        filereader.readAsDataURL(file)
      })
    },
    emitInput() {
      this.$emit('input', this.$refs.upload.fileList.map(item => item.url))
    }
  }
}
</script>
<style>
.img-upload-container {
  display: inline-block;
  width: 100%;
  position: relative;
  vertical-align: middle;
  line-height: normal;
}

.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
  margin-right: 4px;
}

.demo-upload-list img {
  width: 100%;
  height: 100%;
}

.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, .6);
}

.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}

.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}

.text-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .text-flex-icon {
    cursor: pointer;
  }
}
</style>
