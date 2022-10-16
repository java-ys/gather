# lazyClick

## 介绍

```bush
此组件通过vue自定义指令实现，主要用于点击事件，目的在于让点击事件在一段时间只调用一次，起到防止重复点击的作用。
```

## 安装

```bush
npm install m2-lazy-click
```

### 使用步骤

1.引入 lazyClick

```javascript
import lazyClick from 'lazyClick
```

2.在 main.js 中全局注册自定义指令

```javascript
Vue.directive("lazyClick", lazyClick);
```

3.在 vue 的 template 中绑定自定义指令

```javascript
<div v-lazyClick:3000="refreshView">刷新</div>
```

### 使用指南

1.设置防止重复点击的时间。

在 dom 中的 先绑定 v-lazyClick（使用步骤第二步，全局注册的 lazyClick），在 v-lazyClick 后加 “：” ，冒号后跟所需要设置的时间，单位 ms。再接着绑定点击事件所需要执行的方法，如：

```javascript
<div v-lazyClick:5000="refreshView">刷新</div>
```

上面所达到的效果就是，让此 div 在点击后的 5000ms 内，不能被重复点击。如果设置时间，默认 1000ms。如下：

```javascript
<div v-lazyClick="refreshView">刷新</i-button>
```

2.点击事件传递参数

```javascript
<div v-lazyClick="{fn:refreshView,params:{a:'1'}}">刷新</div>
```

其中 fn 为所需要绑定发的方法，params 为方法所需要传递的参数。

然后再本页面的 refreshView 方法中接收该参数即可。如下：

```javascript
refreshView(params) {
    console.log(params) // {a: "1"}},
}
```

3.阻止事件冒泡

在 v-lazyClick 后加上.stop 的修饰符。如下：

```javascript
<div v-lazyClick.stop="{fn:refreshView,params:{a:'1'}}">刷新</div>
```

4.阻止默认事件

在在 v-lazyClick 后加上.prevent 的修饰符。如下：

```javascript
<div v-lazyClick.prevent="{fn:refreshView,params:{a:'1'}}">刷新</div>
```

5.回调函数

此组件提供了一个事件失效结束后的回调函数 callBackFn（注意名字一定要写对，使用方法同 fn，回调函数接收一个 el 参数），用于用户定制一些按键失效后的过渡过程。一般在 fn 中写点击事件开始的逻辑及样式，callBackFn 中写按键恢复正常的样式。如下：

```javascript
<div type="primary" v-lazyClick="{fn:refreshView,callBackFn:callback}">
  刷新
</div>
```

其中 callback 为恢复正常的回调函数。

### 属性方法

| 修饰符  |                功能说明                 |              事例               |
| :-----: | :-------------------------------------: | :-----------------------------: |
|   ：    | 传递延迟的时间，默认 1000ms。单位：ms。 | v-lazyClick：2000=“refreshView” |
|  stop   |              阻止事件冒泡               |        v-lazyClick.stop         |
| prevent |              阻止默认事件               |       v-lazyClick.prevent       |

|    参数    |                                  功能说明                                  |                                                  事例                                                  |
| :--------: | :------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------: |
|     fn     |                            事件开始时执行的方法                            |                                     v-lazyClick="{fn:refreshView}"                                     |
|   params   |                  事件开始时传递的参数，配合 fn 一起使用。                  | v-lazyClick.prevent="{fn:refreshView,params:{a:'1'}}"（无参数传递采用简写：v-lazyClick="refreshView"） |
| callBackFn | 延迟结束后的回调函数，配合 fn 一起使用。在对应绑定的方法中可接收 el 参数。 |                           v-lazyClick="{fn:refreshView,callBackFn:callback}"                           |
