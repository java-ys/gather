<!-- 
 * @description: 
 * @author: Tom Dai 
 * @date: 2020-06-04 16:41:16
 * @后台人员:  
!-->
<template>
    <div>
        <SearchList
            :inputList="inputList"
            @on-search='handleSearch'
            @on-reset="reset"
        ></SearchList>
    </div>
</template>
<script>
import {pushInputList} from './statisticFields'
export default {
    name: '',
    mounted(){
        console.log(JSON.parse(localStorage.getItem('pcOperatorList')))
        // this.inputList[2].cascaderList = JSON.parse(localStorage.getItem('pcOperatorList'))
    },
    data() {
        return {

        }
    },
    computed:{
        inputList (){
            let list = []
            if(this.$route.query.type == 1){
                list = pushInputList
                list[2].cascaderList= JSON.parse(localStorage.getItem('pcOperatorList'))
                return list
            }
        }
    },
    methods:{
        handleSearch(){},
        reset(){}
    }
}
</script>
<style scoped lang='less'>
</style>