<template>
  <div class="rich-text-container">
    <quill-editor
      ref="editor"
      :options="editorOptions"
      @change="onEditorChange"
    />
    <ImageModal
      :show="show"
      title="插入背景图片"
      @cancel="show = false"
      @confirm="onImageConfirm"
    />
  </div>
</template>

<script>
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import ImageModal from "./ImageModal"

export default {
  name: "RichText",
  components: { ImageModal, quillEditor },
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    placeholder: String,
    maxlength: {
      type: [String, Number],
      default: 1000,
    },
    value: String,
  },
  data() {
    return {
      show: false,
      editorOptions: {
        placeholder: this.placeholder,
        modules: {
          toolbar: [["bold"], [{ color: [] }], ["image"]]
        }
      },
      textLength: 0,
    }
  },
  mounted() {
    const { quill } = this.$refs.editor;
    quill.getModule("toolbar").addHandler("image", () => {
      this._offset = quill.getSelection().index;
      this.show = true;
    });
    quill.on("text-change", () => {
      quill.deleteText(this.maxlength, 1);
      this.textLength = quill.getLength() - 1;
    })
    const unwatch = this.$watch("value", str => {
      if (str) {
        if (quill.hasFocus()) return unwatch && unwatch();
        const html = /^<p>/.test(str) ? str : `<p>${str}</p>`;
        quill.pasteHTML(html);
        unwatch && unwatch();
      }
    }, { immediate: true })
  },
  methods: {
    onImageConfirm(img) {
      this.$refs.editor.quill.updateContents((this._offset ? [{ retain: this._offset }] : []).concat({
        insert: { image: img.url }, attributes: { width: img.width + "%" }
      }))
    },
    onEditorChange(res) {
      const html = res.html;
      this.$emit("change", html);
      this.$emit("on-change", html)
    }
  }
};
</script>

<style lang="less" scoped>
</style>