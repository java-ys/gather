<!-- 
 * @description: 
 * @author: Tom Dai 
 * @date: 2019-11-13 11:09:09
 * @后台人员:  
!-->
<template>
    <div class="searchItem">
        <div class="label_title">{{label}}</div>
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: '',
    props: {
        label: {
            type: String,
            default: ''
        }
    },
    data() {
        return {}
    }
}
</script>
<style scoped lang='less'>
.searchItem {
    width: 100%;
    .label_title {
        font-size: 14px;
        color: #666666;
        padding-bottom: 5px;
    }
}
</style>