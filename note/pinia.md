## 核心特性

```
Pinia 没有 Mutations
Actions 支持同步和异步
没有模块的嵌套结构

Pinia 通过设计提供扁平结构，就是说每个 store 都是互相独立的，谁也不属于谁，也就是扁平化了，更好的代码分割且没有命名空间。当然你也可以通过在一个模块中导入另一个模块来隐式嵌套 store，甚至可以拥有 store 的循环依赖关系


更好的 TypeScript 支持

不需要再创建自定义的复杂包装器来支持 TypeScript 所有内容都类型化，并且 API 的设计方式也尽可能的使用 TS 类型推断


不需要注入、导入函数、调用它们，享受自动补全，让我们开发更加方便
无需手动添加 store，它的模块默认情况下创建就自动注册的
Vue2 和 Vue3 都支持

除了初始化安装和SSR配置之外，两者使用上的API都是相同的


支持 Vue DevTools

跟踪 actions, mutations 的时间线
在使用了模块的组件中就可以观察到模块本身
支持 time-travel 更容易调试
在 Vue2 中 Pinia 会使用 Vuex 的所有接口，所以它俩不能一起使用
但是针对 Vue3 的调试工具支持还不够完美，比如还没有 time-travel 功能


模块热更新

无需重新加载页面就可以修改模块
热更新的时候会保持任何现有状态


支持使用插件扩展 Pinia 功能
支持服务端渲染

```

## 初始化

```javascript
import { createPinia } from 'pinia'
createApp(App).use(createPinia()).mount('#app')
```

## 定义

```javascript
// 定义一个user
import { defineStore } from 'pinia'
export const userStore = defineStore('user',/* 名称唯一 */ {
    state: () => {
        return { 
            count: 1,
            arr: []
        }
    },
    getters: {  },
    actions: {  }
})

/*
第二个参数是一个对象，里面的选项和 Vuex 差不多

其中 state 用来存储全局状态，它必须是箭头函数，为了在服务端渲染的时候避免交叉请求导致的数据状态污染所以只能是函数，
而必须用箭头函数则为了更好的 TS 类型推导
getters 就是用来封装计算属性，它有缓存的功能
actions 就是用来封装业务逻辑，修改 state

**/
```

## 访问state

```javascript
<template>
    <div>{{ user_store.count }}</div>
</template>
<script lang="ts" setup>
import { userStore } from '../store'
const user_store = userStore()
// 解构完 数据不是响应式的
// const { count } = userStore()
</script>

// 使用 storeToRefs
<script lang="ts" setup>
    import { storeToRefs } from 'pinia'
    import { userStore } from '../store'
    const { count } = storeToRefs(userStore())
</script>


```
