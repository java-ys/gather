<!-- 
 * @description: 
 * @author: Tom Dai 
 * @date: 2020-03-24 17:28:45
 * @后台人员:  
!-->
<template>
  <div>
        <video width="100%" height="100%" controls>
            <source :src="videoUrl"  type="video/mp4">
            您的浏览器不支持 HTML5 video 标签。
        </video>
  </div>
</template>
<script>
export default {
  name:'',
  props:{
      videoUrl:{
            type: String,
			default: ()=>{
                return ''
            }
        },
  },
  data(){
    return {
       
    }
  }
}
</script>
<style scoped lang='less'>
</style>