/*
 * @Author: Evil Cheng
 * @Date: 2021-11-23 16:01:22
 * @LastEditTime: 2021-11-24 10:37:03
 * @Description: 编辑
 */
import { queryEquityTextDetail } from "_o/api/airportConfig.js";

export default {
  props: {
    uuid: {
      type: String,
      default: ""
    }
  },
  watch: {
    uuid: {
      handler: function(val) {
        // 赋值
        if (val) {
          this.getDetail()
        }
      },
      immediate: true,
    }
  },
  methods: {
    async getDetail() {
      try {
        const params = {
          uuid: this.uuid
        }
        const res = await queryEquityTextDetail(params);
        const { success, data, msg } = res.data;
        if (success) {
          const { title, description } = data
          this.formData = {
            title,
            description
          }
          this.editorContent = description
          this.$refs.editor.setHtml(this.editorContent)
        }
      } catch (error) {
        console.error(error);
      }
    }
  },
}