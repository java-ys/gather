<!--
 * @description:
 * @author: Tom Dai
 * @date: 2019-12-16 19:27:58
 * @后台人员:
!-->
<template>
    <div style="overflow:hidden" id='outer'>
        <div ref="slider" class="slider" id="slider" @click.self="sliderClick">
            <div class="slider-bar">
                <div
                    :class="{stop:true, hourInt:index % 4 ==0, selectCls:index == currentValue-1 }"
                    v-for="(item,index) in stops"
                    :key="index"
                    :style="{ 'left': item.value + '%' }"
                    @click="handleClickBar(item)"
                ></div>
                <div
                    class="sliderBtn"
                    style="color:#fff  "
                    :style="{ 'left': currentValue + '%' }"
                   
                >
                    <span>{{currentTime}}</span>
                    <img :src="siderImg"   
                    @touchstart="onPointerDown($event, 'min')"
                    @mousedown="onPointerDown($event, 'min')"/>
                </div>
                <div style="top: 14px;position: absolute;color:#fff">
                    <span>00:00</span>
                </div>
                <div style="right:3%;top: 14px;position: absolute;color:#fff">
                    <span>23:59</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { on, off } from '@/libs/util'
import siderImg from '../assets/data-center/icon_slider.png'
export default {
    props: {
        step: {
            type: Number,
            default: 1
        }
    },
  name: '',
  computed: {
       singleStepPer () {
           let per = 100 * Number(this.step / 97).toFixed(2)
           return per
       },
       singleperInPre () {
            let per = (100 * Number(this.step / 97)).toFixed(2)
           return per
       },
       stops () {
                let stopCount = 98 / this.step
                let result = []
                 let time = new Date(new Date(new Date().toLocaleDateString()).getTime())
                //  time = this.$moment(time).format('HH:mm')
                 // 当天0点
                for (let i = 1; i < stopCount; i++) {
                    let mult = (i - 1) * 15
                    let timeStr = this.$moment(time).add(mult, 'm').format('HH:mm')
                    let obj = { value: i * this.singleStepPer, time: timeStr }
                    if (i === 97) {
                        obj = { value: i * this.singleStepPer, time: '23:59' }
                    }
                    result.push(obj)
                }
                return result
            },
        // unitLenth () {
        //     let totolLen = document.getElementById('outer').clientWidth || document.getElementById('outer').offsetWidth
        //     let unitLenth = Number(totolLen / 96).toFixed(0)
        //     return unitLenth
        // },
        // startX () {
        //     let starx = this.$refs.slider.getBoundingClientRect().left + (1 * this.unitLenth)
        //     return starx
        // }

  },
  value (val) {
                val = (this.currentTime + '').replace(':', '')
                if (this.currentTime) {
                    // this.currentTime = val;
                }
            },
    watch:{
        screenWidth:function(val){
            this.initUnit()
        }
    },
  data () {
    return {
       currentValue: 1,
       dragging: true,
       currentX: '',
       siderImg: siderImg,
       currentTime: '00:00',
       unitLenth: null,
       startX: null,
       screenWidth:""
    }
  },
  created(){
    //   this.initUnit()
  },

  mounted () {
      this.initUnit()
      this.getDefaultTime()
      this.emitChange()
      let that = this
      window.addEventListener('resize',function(){
        that.screenWidth = document.body.offsetWidth
        })
  },
  methods: {

    //   设置初始单位
        initUnit(){
            let totolLen = document.getElementById('outer').clientWidth || document.getElementById('outer').offsetWidth
            let unitLenth = Number(totolLen / 96).toFixed(0)
            this.unitLenth = unitLenth
            this.startX = Number(this.$refs.slider.getBoundingClientRect().left + (1 * unitLenth))
        },
      // 获取当前dom位置
        getPointerX (e) {
                return e.type.indexOf('touch') !== -1 ? e.touches[0].clientX : e.clientX
            },
        onPointerDown (event, type) {
            event.preventDefault()
            on(window, 'mousemove', this.onPointerDrag)
            on(window, 'touchmove', this.onPointerDrag)
            on(window, 'mouseup', this.onPointerDragEnd)
            on(window, 'touchend', this.onPointerDragEnd)
        //   let x = this.getPointerX(event)
      },
       onPointerDrag (event) {
                this.dragging = true
                this.currentX = this.getPointerX(event)
                this.currentValue = Math.round(((this.currentX - this.startX) / this.unitLenth)) +1
                if (this.currentValue < 1) {
                    this.currentValue = 1
                } else if (this.currentValue > 97) {
                    this.currentValue = 97
                }
                this.currentTime = this.stops[this.currentValue - 1].time
       },
        onPointerDragEnd () {
                if (this.dragging) {
                    this.dragging = false
                     this.emitChange()
                    }
                this.pointerDown = ''
                off(window, 'mousemove', this.onPointerDrag)
                off(window, 'touchmove', this.onPointerDrag)
                off(window, 'mouseup', this.onPointerDragEnd)
                off(window, 'touchend', this.onPointerDragEnd)
            },
        handleClickBar (i) {
            this.currentValue = i.value
            this.currentTime = i.time
             this.emitChange()
        },
        sliderClick (event) {
             const currentX = this.getPointerX(event)
            this.initUnit()
            let preUnit = Number(this.singleperInPre)
             this.currentValue = Math.round(((currentX - this.startX) / this.unitLenth))+1
                if (this.currentValue < 1) {
                    this.currentValue = 1
                } else if (this.currentValue > 97) {
                    this.currentValue = 97
                }
                this.currentTime = this.stops[this.currentValue - 1].time
                this.emitChange()
        },
        getDefaultTime () {
             let time = Number(new Date(new Date(new Date().toLocaleDateString()).getTime()))
             let nowtime = Number(this.$moment())
             let result = Math.round((nowtime - time) / (60 * 1000 * 15)) + 1
             this.currentValue = result
             this.currentTime = this.stops[this.currentValue - 1].time
        },
        emitChange () {
                let value = this.currentTime + ''
                value = value.replace(':', '')
                this.$emit('on-change', value)
            }

  }
}
</script>
<style scoped lang='less'>
.outer{
    width: 100%;
}
.slider {
    width: 100%;
    height: 44px;
    background: #313354;
    position: relative;
    cursor: pointer;
    .slider-bar {
        width: 100%;
        display: flex;
        justify-content: space-between;
        .stop {
            //  margin-top:80px;
            position: absolute;
            height: 7px;
            bottom: 0px;
            cursor: pointer;
            border: 1px solid #ffffff;
        }
        .hourInt {
            height: 9px;
        }
        .selectCls {
            border: 1px solid #ff8533;
        }
        .sliderBtn {
            position: absolute;
            cursor: move ;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-left: -13px;
                margin-top: -3px;
            img {
                width: 8px;
                height: 20px;
                margin-left: -3px;
                z-index: 10;
                // margin-top: 21px;
            }
            span {
                font-size: 12px;
                color: #ff8533;
            }
        }
    }
}
</style>
