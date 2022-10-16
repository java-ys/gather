<template>
	<div>
		<Modal
			v-model="isShow"
			:width="600"
			title="编辑评价对象"
			:mask-closable="false"
			:footer-hide="true"
			@on-cancel="$emit('close')"
		>
			<div class="line-item">
        <strong class="fontsize15">司机：</strong>
        <span class="fontsize14">开启</span>
      </div>
			<div class="line-item">
        <strong class="fontsize15">平台：</strong>
        <i-switch size="large" v-model="setInfo.platformSwitch" :true-value="1" :false-value="0">
          <span slot="open">开启</span>
          <span slot="close">关闭</span>
        </i-switch>
      </div>
			<div class="line-item">
        <strong class="fontsize15">车辆：</strong>
        <i-switch size="large" v-model="setInfo.carSwitch" :true-value="1" :false-value="0">
          <span slot="open">开启</span>
          <span slot="close">关闭</span>
        </i-switch>
      </div>
      <div class="top15 color90">
        评价对象配置将影响乘客APP端星级评价卡片中的评价对象，提交后立刻生效。
      </div>
      <div class="right-flex top30">
          <Button @click="$emit('close')">取消</Button>
          <Button
            type="primary"
            style="margin-left: 8px"
            @click="submit"
          >确定</Button>
        </div>
		</Modal>
	</div>
</template>
<script>
import {
  axiosEvaluateTargetUpdate
} from "_o/api/operator-carrier";
export default {
  name: "evaluate-set",
  props: {
    show: {
      type: Boolean
    },
    info: {}
  },
  data() {
    return {
      isShow: false,
      setInfo:{
        platformSwitch: false,
        carSwitch: false
      }
    };
  },
  methods: {
		submit(){
      let params = {
        uuid: this.info.uuid,
        ...this.setInfo
      }
      axiosEvaluateTargetUpdate(params).then(res => {
        this.$Message.success("编辑成功")
        this.$emit('close')
        this.$emit('refresh')
      })
    }
	},
  watch: {
    show() {
      this.isShow = this.show;
      if(this.isShow){
        this.setInfo.platformSwitch = this.info.platformSwitch
        this.setInfo.carSwitch = this.info.carSwitch
      }
    }
  }
};
</script>
<style scoped lang="less">
.line-item{
  line-height:45px;
}
</style>