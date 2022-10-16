<template>
  <section id="main-section" class="app-main">
    <transition id="main-transition" name="fade-transform" mode="out-in">
      <keep-alive :exclude="exclude">
        <router-view/>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
import Router from '@/router/index'
  export default {
    name: 'Main',
    data(){
      return {
        router: {...Router},
        exclude: ''
      }      
    },
    created(){
      this.router.options.routes.forEach(element => {
        if(element.children){
          element.children.forEach((item, index)=>{
            this.exclude += element.children.length === index ? item.name : item.name + ','
          })
        }
      })
    }
  }
</script>
