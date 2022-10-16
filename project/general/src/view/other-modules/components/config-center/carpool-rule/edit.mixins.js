/*
 * @Author: Evil Cheng
 * @Date: 2021-11-23 16:01:22
 * @LastEditTime: 2022-03-14 15:44:46
 * @Description: 编辑
 */
import { queryRuleDetail } from "_o/api/vehicleRule.js";

export default {
  props: {
    id: {
      type: [String, Number],
      default: ""
    }
  },
  watch: {
    id: {
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
          id: this.id
        }
        const res = await queryRuleDetail(params);
        const { success, data, msg } = res.data;
        if (success) {
          const { title, rule, sort } = data
          this.formData = {
            title,
            rule,
            sort
          }
          this.editorContent = rule
          this.$refs.editor.setHtml(this.editorContent)
        }
      } catch (error) {
        console.error(error);
      }
    }
  },
}