<template>
  <div>
    <pictureUpload
      ref="pictureUpload"
      :source="source"
      :maxLength="9"
      :showRemove="true"
      :defaultList="defaultList.filter(item => item.type === 1)"
      v-on:upload-success="file => $emit('upload-success', file, 1)"
      v-on:delete="file => $emit('delete', file, 1)"
    ></pictureUpload>
    <videoUpload
      v-if="source!='GD'"
      ref="videoUpload"
      :maxLength="9"
      :showRemove="true"
      :defaultList="defaultList.filter(item => item.type === 2)"
      v-on:upload-success="file => $emit('upload-success', file, 2)"
      v-on:delete="file => $emit('delete', file, 2)"
      v-bind="$attrs"
    ></videoUpload>
  </div>
</template>

<script>
import pictureUpload from "./pictureUpload";
import videoUpload from "./videoUpload";
export default {
  components: {
    pictureUpload,
    videoUpload
  },

  props: {
    source: String,
    defaultList: {
      type: Array,
      default: () => []
    }
  },

  created() {
    this.busEvents.$on("clearFiles", val => {
      if (val) {
        this.$refs["pictureUpload"] && this.$refs["pictureUpload"].clearFiles();
        this.$refs["videoUpload"] && this.$refs["videoUpload"].clearFiles();
      }
    });
  }
};
</script>

<style></style>
