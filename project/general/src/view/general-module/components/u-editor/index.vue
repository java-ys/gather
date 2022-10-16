<template>
  <div>
    <VueUeditorWrap
      v-model="editorMsg"
      :config="editorConfig"
      :destroy="true"
      @ready="editorReady"
    ></VueUeditorWrap>
  </div>
</template>
<script>
// 已迁移
import { getToken } from "@/libs/util";
import config from "@/config/config";
import VueUeditorWrap from "vue-ueditor-wrap";

export default {
  name: 'ueditor',
  components: {
    VueUeditorWrap
  },
  props: {
    /*编辑器的内容*/
    value: {
      // type: Object,
      // default(){
      //   return {}
      // }
    },
    /*图片大小*/
    maxSize: {
      type: Number,
      default: 4000 //kb
    },
    inputMax: {
      default: 0
    },
    maximumWords: {
      default: 0
    }
  },
  data () {
    return {
      backgroundColor: '#fff',
      editorInstance: null,
      defaultClassName: "rich-text-box",
      editorConfig: {
        // 初始容器高度
        initialFrameHeight: 300,
        // 上传文件接口
        serverUrl: this._baseUrl + "/common/uploadFile",
        // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
        UEDITOR_HOME_URL: process.env.NODE_ENV === 'development' ? "/editor/" : '/m2-web-general/editor/',
        serverConfig: {
          serverUrl: this._baseUrl + "/common/uploadFile",
          imageActionName: "image",
          imageFieldName: "file",
          videoActionName: "video",
          videoFieldName: "file",
          imageAllowFiles: [".png", ".gif", ".jpg", ".jpeg", ".svg"],
          videoAllowFiles: [".mp4", ".mpeg", ".mpg", ".3gpp"],
          imageUrlPrefix: "",
          videoUrlPrefix: "",
          imageMaxSize: this.maxSize * 1204,
          // 回调的callback
          responseCb (res) {
            if (res.success && res.data && res.data.fileUrl) {
              res.url = res.data.fileUrl;
              res.state = "SUCCESS";
            } else {
              res.state = "FAIL";
            }
            return res;
          }
        },
        headers: {
          Authorization: getToken(),
          ...config.headers
        },
        toolbars: [[
          // 去掉：
          // 锚点，涂鸦，音乐，附件，地图，谷歌地图，代码语言，百度应用，模板，分页，背景色，截图，图片转存，图表，打印，预览，从草稿箱，
          "fullscreen", "source", "|", "undo", "redo", "|",
          "bold", "italic", "underline", "fontborder", "strikethrough", "superscript", "subscript", "removeformat", "formatmatch", "autotypeset", "blockquote", "pasteplain", "|", "forecolor", "backcolor", "insertorderedlist", "insertunorderedlist", "selectall", "cleardoc", "|",
          "rowspacingtop", "rowspacingbottom", "lineheight", "|",
          "customstyle", "paragraph", "fontfamily", "fontsize", "|",
          "directionalityltr", "directionalityrtl", "indent", "|",
          "justifyleft", "justifycenter", "justifyright", "justifyjustify", "|", "touppercase", "tolowercase", "|",
          "link", "unlink", "|", "imagenone", "imageleft", "imageright", "imagecenter", "|",
          "simpleupload", "insertimage", "emotion", "insertvideo", "insertframe", "|",
          "horizontal", "date", "time", "spechars", "|",
          "inserttable", "deletetable", "insertparagraphbeforetable", "insertrow", "deleterow", "insertcol", "deletecol", "mergecells", "mergeright", "mergedown", "splittocells", "splittorows", "splittocols", "|",
          "searchreplace", "help"
        ]],
        wordCount: true, //字数统计
        autoFloatEnabled: false,
        maximumWords: this.maximumWords
      },
      // actionUrl: this._baseUrl + "/common/uploadFile",
      editorMsg: this.value || '',
    }
  },
  methods: {
    editorReady (editor) {
      this.editorInstance = editor;
      // 图片和商品会撑开编辑器，设置一下最大宽度
      let style = document.createElement("style");
      style.innerHTML = ".view video,img{max-width:100%}";
      editor.body.parentElement.querySelector("head").appendChild(style)
    }
  },
  watch: {
    value: {
      handler (value) {
        this.$emit("input", value);
      },
      deep: true
    },
    editorMsg (value) {
      let contentText = value;
      // 先去掉之前有的style样式标签
      if (value.match(/\<style(([\s\S])*?)\<\/style\>/)) {
        contentText = value.replace(/\<style(([\s\S])*?)\<\/style\>/g, "");
      }
      // 组装一个父节点，然后将style的样式约束到父节点上面
      let str = "<style scoped>"
      if (this.editorInstance && this.editorInstance.body) {
        // eslint-disable-next-line no-return-assign
        this.editorInstance.body.parentElement.querySelectorAll("head>style").forEach(item => {
          let text = item.innerText;
          // 用大括号分隔，单数下标全部是类选择器，双数下标全部是样式内容
          let textArr = text.split(/\{|\}/);
          str += textArr.reduce((str, item, index) => {
            if (!item) {
              return str;
            }
            // 单数下标的选择前面加入约束的classname。
            if (index % 2 === 0) {
              // 逗号分隔的选择器，需要给每个“,”里的选择器都加一个className
              return str + item.split(",").map(selector => ("." + this.defaultClassName + " " + selector)).join(",") + "{";
            }
            return str + item + "}";
          }, "");
        })
      }
      str += "</style>";
      // 加一个父级div，并添加class
      let res = `<div class="${this.defaultClassName}">${contentText}${str}</div>`;
      this.$emit("input", res);
    }
  }
}
</script>

<style>
</style>
