import { getUploadToken } from "_o/api/operator-carrier"

export const uploadMixin = {
  data() {
    return {
      publicFileUploadHeader: { token: '' },
      loading: false,
      actionUrl: this._uploadUrl + "/file/upload/public",
    }
  },
  methods: {
    async beforeUpload(file) {
      const { data } = await getUploadToken()
      if (!data.success) {
        this.$Message.error('文件服务出错');
        return false
      }
      this.publicFileUploadHeader.token = data.data
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/bmp' || file.type === 'image/gif';
      if (!isJpgOrPng) {
        this.$Message.error('只支持上传以jpg、png、bmp、gif后缀的图片格式');
      }
      const isLt30M = file.size / 1024 / 1024 < 30;
      if (!isLt30M) {
        this.$Message.error('图片文件大小必须小于30M');
      }
      return new Promise((resolve, reject) => {
        if (isJpgOrPng && isLt30M)
          resolve(file)
        else
          reject(file)
      })
      
    },
    handleChange(info, key) {
      if (info.file.status === 'uploading') {
        if (this.hide) return
        this.loading = true;
        this.hide = this.$Message.loading('文件上传中', 0)
        return;
      }
      if (info.file.status === 'done') {
        const imageUrlKey = key + 'Url'
        const { publicUrl, uuid } = info.file.response.data
        this.imageUrlMap[imageUrlKey] = publicUrl
        this.imageUuidMap[key] = uuid
        this.loading = false;
        this.hide()
        this.hide = null
        this.$Message.success(`${info.file.name} 上传成功`);
      } else if (info.file.status === 'error') {
        this.hide()
        this.hide = null
        this.$Message.error(`${info.file.name} 上传失败`);
      }
    },
  }
}
