<template>
  <Button type="primary" :disabled="isDisabled" @click="downloadFile">
    {{ btnText }}
  </Button>
</template>
<script>
import { downloadZip } from "_g/api/common.js";
export default {
  props: {
    resource: {
      type: Array,
      default: () => {
        return [];
      }
    },
    btnText: {
      type: String,
      default() {
        return "文件下载";
      }
    },
    FileName: {
      type: String,
      default() {
        return "文件下载";
      }
    }
  },
  data() {
    return {
      isDisabled: false
    };
  },
  watch: {
    resource() {
      if (this.resource.length) {
        this.isDisabled = false;
      } else {
        this.isDisabled = true;
      }
    },
    deep: true
  },
  methods: {
    downloadFile() {
      let data = {
        fileName: this.FileName,
        files: this.resource
      };
      downloadZip(data)
        .then(res => {
          this.$emit("download-file", res);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
