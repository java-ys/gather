<template>
    <div class="container_box">
        <div class="detail">
             <div class="detail_item">
                <span>Push标题：</span>
                <span class="item_content">{{theInfo.title}}</span>
             </div>
             <div class="detail_item">
                <span>Push副标题：</span>
                <span class="item_content"> {{theInfo.subTitle}}</span>
             </div>
             <div class="detail_item">
                <span>发送对象：</span>
                <span class="item_content" v-if="theInfo.pushRole==1"> 司机</span>
                <span class="item_content" v-if="theInfo.pushRole==2"> 乘客</span>
             </div>
             <div class="detail_item flex-box">
                <span style="min-width:72px;">发送城市：</span>
                <span style="max-width:380px;" class="city-box"> {{theInfo.cityNames}}</span>
             </div>
             <div class="detail_item">
                <span>用户选择方式：</span>
                <span class="item_content" v-if="theInfo.target==1 && theInfo.pushRole==1">  指定司机</span>
                <span class="item_content" v-if="theInfo.target==1 && theInfo.pushRole==2">  指定乘客</span>
                <span class="item_content" v-if="theInfo.target==2"> 指定条件</span>
                <span class="item_content" v-if="theInfo.target==3"> 批量</span>
                <span class="item_content" v-if="theInfo.target==4"> 用户分群</span>
             </div>
             <div class="detail_item" v-if="theInfo.pushRole===2 && theInfo.target==4">
                <span>乘客分组类别：</span>
                <span v-if="theInfo.userGroupType=='1'" class="item_content"> 注册城市 </span>
                <span v-if="theInfo.userGroupType=='2'" class="item_content"> 冒泡城市 </span>
                <span v-if="theInfo.userGroupType=='3'" class="item_content"> 完单城市 </span>
             </div>
             <div class="detail_item">
                <span style="padding-left: 73px;"></span>
                <span v-if="theInfo.target==1">手机号
                    <span v-for="(item, index) in theInfo.mobile" :key="index"> {{item}}</span>
                </span>
                <span v-if="theInfo.target==2">
                    <span v-for="(item, index) in theInfo.operatorName" :key="index"> {{item}}</span>
                </span>
                <span v-if="theInfo.cityName">
                    <span v-for="(item, index) in theInfo.cityName" :key="index"> {{item}}</span>
                </span>
                <span v-if="theInfo.target==3"><a @click="exportList">导出批量列表</a></span>
                <span v-if="theInfo.target==4">{{theInfo.userGroupName}}</span>
                <span class="item_content">{{theInfo.pushRangeDetail}}</span>
            </div>

        <div class="detail_item">
                <span>跳转链接：</span>
                <span class="item_content">{{theInfo.pushLink}}</span>
            </div>
            <div class="detail_item">
                <span>发送时间：</span>
                <span class="item_content">{{theInfo.pushTime}}</span>
            </div>
            <div class="detail_item" v-if="theInfo.giveUpOn">
                <span>放弃时间：</span>
                <span class="item_content">{{theInfo.giveUpOn}}</span>
            </div>
            <div class="detail_item">
                <span>状态：</span>
                <span class="item_content">{{statusValue}}</span>
            </div>
            <div class="import_info">
                <span v-if="importResult">{{importResult}}</span>
                <span v-if="isUploadFail" class="text-btn" @click="exportFile(theInfo.failUrl)">下载导入失败清单</span>
            </div>
            <div class="detail_item"  >
                    <span>发送人数：</span>
                    <span class="item_content">{{theInfo.sendQuantity}}</span>
            </div>
            <div class="flex-box flex-item">
                <div class="half_box">
                    <span>已送达人数：</span>
                    <span class="item_content">{{theInfo.pushStatus===1?theInfo.reachQuantity:'-'}}</span>
                </div>
                <div class="half_box">
                    <span>未送达人数：</span>
                    <span class="item_content">{{theInfo.pushStatus===1?theInfo.notReachQuantity:'-'}}</span>
                </div>
                <div class="half_box">
                    <span>送达率：</span>
                    <span class="item_content">{{theInfo.pushStatus===1?`${theInfo.reachQuantityRatio}%`:'-'}}</span>
                </div>
            </div>
            <div class="flex-box flex-item"  >
                <div class="half_box">
                    <span>已读人数：</span>
                    <span class="item_content">{{theInfo.pushStatus===1?theInfo.haveRead:'-'}}</span>
                </div>
                <div class="half_box">
                    <span>未读人数：</span>
                    <span class="item_content">{{theInfo.pushStatus===1?theInfo.notRead:'-'}}</span>
                </div>
                <div class="half_box">
                    <span>阅读率：</span>
                    <span class="item_content">{{theInfo.pushStatus===1?`${theInfo.haveReadRatio}%`:'-'}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { pushStatusMap,batchStatusMap } from '../fields.js'
export default {
    props: {
        theInfo: {
            type: Object,
            default:() =>{
                return {}
            }
        },
        show:{}
    },
    data(){
        return {
        }
    },
    computed:{
        statusValue(){
            let data = this.theInfo
            let res = ''
            if(data.target===3){
                res = batchStatusMap[data.pushStatus]
            }else{
                res = pushStatusMap[data.pushStatus]
            }
            return res
        },
        importResult(){
            let data = this.theInfo
            let res = ''
            // 批量
            if(data.target===3 && data.pushStatus!==4){
                res = `导入成功${data.importTotalCount-data.importFailCount||0}条，导入失败${data.importFailCount||0}条`
            }
            return res
        },
        isUploadFail(){
            let data = this.theInfo
            let res = false
            // 批量
            if(data.target===3 && data.pushStatus!==4 && data.importFailCount>0){
                res = true
            }
            return res
        }
    },
    methods:{
        exportList(){
            let url = this.theInfo.uploadFileUrl
            window.location.href = url
        },
        exportFile(url) {
            window.open(url);
        },
    }
}
</script>

<style lang="less" scoped>
.container_box{
    // width: 520px;
    .detail{
        padding: 0 20px;
        width:100%;
        box-sizing: border-box;
        .detail_item{
            padding-top: 15px;
            display: flex;
        }
    }
}
.half_box{
    min-width: 200px;
}
.flex-item{
    margin-top: 15px;
}
.text-btn{
    color:#57a3f3;
    cursor: pointer;
    display: inline-block;
    margin-left: 30px;
}
// .city-box{
//     max-height:200px;
//     overflow: auto;
// }
.import_info{
    margin: 10px 0 0 35px;
}
</style>

