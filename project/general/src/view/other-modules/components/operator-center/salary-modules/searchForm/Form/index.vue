<template>
    <div class="collapseContainer">
        <div class="contentContainer">
            <slot name= "content"></slot>
            <div v-show="Ismore">
                <slot name= "moreDetail" >
                </slot>
            </div>
            <div class="footer" >
                <div class="footerLeft">
                    <span class="greyColor pointer" v-if="!Ismore && needIsmore" @click="handleIsMore" >
                        <span class="more pd-lf-15">查看更多</span>
                        <i class="el-icon-arrow-down"></i>
                    </span>
					<span class="T3Clolor pointer" v-if="Ismore && needIsmore" @click="handleIsMore">
                        <span class="pd-lf-15">收起</span>
                        <i class="el-icon-arrow-up"></i>
                    </span>
                </div>
                <div class="footerRight" >
                    <slot name="footerRight"></slot>
                </div>
             </div>
        </div>
    </div>
</template>
<script>
export default {
	name: '',
	props:{
		needIsmore:{
			default:false,
			type:Boolean
		}
	},
    data() {
        return {
			IsCollapsed: false,
			Ismore:false,
        }
    },
    methods: {
		handleIsMore(){
			this.Ismore = !this.Ismore
		}
    }
}
</script>
<style scoped lang='scss'>
.collapseContainer {
	 font-size: 14px;
    background: #fff;
    border-radius: 4px;
    padding: 25px;
    .contentContainer {
        display: flex;
        flex-direction: column;
        .footer {
            margin-top: 10px;
            display: flex;
			.footerLeft{
                font-size: 14px;
                width:75%;
                text-align: center;
               
			}
            .footerRight{
                width: 19%;
                text-align: right
            }
        }
    }
}
.more {
    font-size: 14px;
    color: #999999;
}
.greyColor{
color: #999999;
}
.T3Clolor{
	color: #FF8533;
}
.pointer{
	cursor: pointer;
}
.pd-lf-15{
	padding-left: 15px
}
.pd-lf-20{
	padding-left: 20px
}
.ft-16{
    font-size: 16px;
}
</style>