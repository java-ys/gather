
## Vue

```
v-model 使用技巧
https://segmentfault.com/a/1190000040863402
图形验证码
	https://juejin.cn/post/6919710203520745486?utm_source=gold_browser_extension
nexttick
	https://juejin.cn/post/6844903914068787213
面试题
https://juejin.cn/post/6850037277675454478
面试
https://juejin.cn/post/6844903928442667015
源码解析
https://juejin.cn/column/6969563635194527758
```

## js 获取css变量

```

js 获取 css 变量

	// 获取一个 Dom 节点上的 CSS 变量
	element.style.getPropertyValue("--my-var");

	// 获取任意 Dom 节点上的 CSS 变量
	getComputedStyle(element).getPropertyValue("--my-var");

	// 修改一个 Dom 节点上的 CSS 变量
	element.style.setProperty("--my-var", jsVar + 4);

```

## Async defer

```
如果 script 无 src 属性，则 defer, async 会被忽略
	动态添加的 script 标签隐含 async 属性。
	结论:
	两者都不会阻止 document 的解析
	defer 会在 DOMContentLoaded 前依次执行 （可以利用这两点哦！）
	async 则是下载完立即执行，不一定是在 DOMContentLoaded 前
	async 因为顺序无关，所以很适合像 Google Analytics 这样的无依赖脚本
```

## Git

```
git message 前缀
	build：表示构建，发布版本可用这个
	ci：更新 CI/CD 等自动化配置
	chore：杂项，其他更改
	docs：更新文档
	feat：常用，表示新增功能
	fix：常用：表示修复 bug
	perf：性能优化
	refactor：重构
	revert：代码回滚
	style：样式更改
	test：单元测试更改
```

## Npm 发包

```

npm 发包
	mkdir [name]
	cd [name]
	npm init -y
	npm version [patch/minor/major]
	npm login
	npm publish
	npm unpublish npm-component@1.0.1   72小时之内可以删除
```

## 跨域

```

https://juejin.cn/post/6844903767226351623
当协议、子域名、主域名、端口号中任意一个不相同时，都算作不同域
协议和端口造成的跨域问题“前台”是无能为力的
在跨域问题上，仅仅是通过“URL的首部”来识别而不会根据域名对应的IP地址是否相同来判断。
“URL的首部”可以理解为“协议, 域名和端口必须匹配

http:// www . abc.com : 8080 / scripts/jquery.js
协议    子域名   主域名    端口号   请求资源地址

同源策略限制内容有：
Cookie、LocalStorage、IndexedDB 等存储性内容
DOM 节点
AJAX 请求发送后，结果被浏览器拦截了

有三个标签是允许跨域加载资源：
<img src=XXX>
<link href=XXX>
<script src=XXX>

总结:
CORS支持所有类型的HTTP请求，是跨域HTTP请求的根本解决方案
JSONP只支持GET请求，JSONP的优势在于支持老式浏览器，以及可以向不支持CORS的网站请求数据。
不管是Node中间件代理还是nginx反向代理，主要是通过同源策略对服务器不加限制。
日常工作中，用得比较多的跨域方案是cors和nginx反向代理

 
```

#### jsonp
```

需要对方服务器做支持
// index.html
function jsonp({ url, params, callback }) {
  return new Promise((resolve, reject) => {
    let script = document.createElement('script')
    window[callback] = function(data) {
      resolve(data)
      document.body.removeChild(script)
    }
    params = { ...params, callback } // wd=b&callback=show
    let arrs = []
    for (let key in params) {
      arrs.push(`${key}=${params[key]}`)
    }
    script.src = `${url}?${arrs.join('&')}`
    document.body.appendChild(script)
  })
}
jsonp({
  url: 'http://localhost:3000/say',
  params: { wd: 'Iloveyou' },
  callback: 'show'
}).then(data => {
  console.log(data)
})
上面这段代码相当于向http://localhost:3000/say?wd=Iloveyou&callback=show这个地址请求数据，然后后台返回show('我不爱你')，最后会运行show()这个函数，打印出'我不爱你'
// server.js
let express = require('express')
let app = express()
app.get('/say', function(req, res) {
  let { wd, callback } = req.query
  console.log(wd) // Iloveyou
  console.log(callback) // show
  res.end(`${callback}('我不爱你')`)
})
app.listen(3000)

  1) JSONP和AJAX对比
  JSONP和AJAX相同，都是客户端向服务器端发送请求，从服务器端获取数据的方式。
  但AJAX属于同源策略，JSONP属于非同源策略（跨域请求）

  2) JSONP优缺点
  JSONP优点是简单兼容性好，可用于解决主流浏览器的跨域数据访问的问题。缺点是仅支持get方法具有局限性,不安全可能会遭受XSS攻击。


```

#### cors
```

CORS 需要浏览器和后端同时支持。IE 8 和 9 需要通过 XDomainRequest 来实现。
服务端设置 Access-Control-Allow-Origin 就可以开启 CORS。 
该属性表示哪些域名可以访问资源，如果设置通配符则表示所有网站都可以访问资源。

分别为简单请求和复杂请求
1) 简单请求
  只要同时满足以下两大条件，就属于简单请求
  条件1：使用下列方法之一：

  GET
  HEAD
  POST

  条件2：Content-Type 的值仅限于下列三者之一：

  text/plain
  multipart/form-data
  application/x-www-form-urlencoded

2) 复杂请求

不符合以上条件的请求就肯定是复杂请求了。 复杂请求的CORS请求，会在正式通信之前，
增加一次HTTP查询请求，称为"预检"请求,该请求是 option 方法的，
通过该请求来知道服务端是否允许跨域请求。
后台配置
// 允许哪个方法访问我
res.setHeader('Access-Control-Allow-Methods', 'PUT')
// 预检的存活时间
res.setHeader('Access-Control-Max-Age', 6)
// OPTIONS请求不做任何处理
if (req.method === 'OPTIONS') {
  res.end() 
}
// 定义后台返回的内容
app.put('/getData', function(req, res) {
  console.log(req.headers)
  res.end('我不爱你')
})

```

#### postMessage()
```
otherWindow.postMessage(message, targetOrigin, [transfer]);
message: 将要发送到其他 window的数据。
targetOrigin:通过窗口的origin属性来指定哪些窗口能接收到消息事件，
其值可以是字符串"*"（表示无限制）或者一个URI。在发送消息的时候，如果目标窗口的协议、
主机地址或端口这三者的任意一项不匹配targetOrigin提供的值，那么消息就不会被发送；
只有三者完全匹配，消息才会被发送。
transfer(可选)：是一串和message 同时传递的 Transferable 对象. 
这些对象的所有权将被转移给消息的接收方，而发送一方将不再保有所有权。


http://localhost:3000/a.html页面向http://localhost:4000/b.html传递“我爱你”,然后后者传回"我不爱你"


// a.html
  <iframe src="http://localhost:4000/b.html" frameborder="0" 
  id="frame" onload="load()"></iframe> //等它加载完触发一个事件
  
  //内嵌在http://localhost:3000/a.html
  
    <script>
      function load() {
        let frame = document.getElementById('frame')
        frame.contentWindow.postMessage('我爱你', 'http://localhost:4000') //发送数据
        window.onmessage = function(e) { //接受返回数据
          console.log(e.data) //我不爱你
        }
      }
    </script>


// b.html
  window.onmessage = function(e) {
    console.log(e.data) //我爱你
    e.source.postMessage('我不爱你', e.origin)
 }


```

#### websocket
```
本地文件socket.html向localhost:3000发生数据和接受数据

// socket.html
<script>
    let socket = new WebSocket('ws://localhost:3000');
    socket.onopen = function () {
      socket.send('我爱你');//向服务器发送数据
    }
    socket.onmessage = function (e) {
      console.log(e.data);//接收服务器返回的数据
    }
</script>


// server.js
let express = require('express');
let app = express();
let WebSocket = require('ws');//记得安装ws
let wss = new WebSocket.Server({port:3000});
wss.on('connection',function(ws) {
  ws.on('message', function (data) {
    console.log(data);
    ws.send('我不爱你')
  });
})


```

#### node中间件代理
```
同源策略是浏览器需要遵循的标准，而如果是服务器向服务器请求就无需遵循同源策略。 
代理服务器，需要做以下几个步骤：

接受客户端请求 。
将请求 转发给服务器。
拿到服务器 响应 数据。
将 响应 转发给客户端。
```

#### nginx 反向代理
```
实现原理类似于Node中间件代理，需要你搭建一个中转nginx服务器，用于转发请求。
使用nginx反向代理实现跨域，是最简单的跨域方式。只需要修改nginx的配置即可解决跨域问题，支持所有浏览器，支持session，不需要修改任何代码，并且不会影响服务器性能。
实现思路：通过nginx配置一个代理服务器（域名与domain1相同，端口不同）做跳板机，反向代理访问domain2接口，并且可以顺便修改cookie中domain信息，方便当前域cookie写入，实现跨域登录。

// proxy服务器
server {
    listen       81;
    server_name  www.domain1.com;
    location / {
        proxy_pass   http://www.domain2.com:8080;  #反向代理
        proxy_cookie_domain www.domain2.com www.domain1.com; #修改cookie里域名
        index  index.html index.htm;

        # 当用webpack-dev-server等中间件代理接口访问nignx时，此时无浏览器参与，故没有同源限制，下面的跨域配置可不启用
        add_header Access-Control-Allow-Origin http://www.domain1.com;  #当前端只跨域不带cookie时，可为*
        add_header Access-Control-Allow-Credentials true;
    }
}


// index.html
var xhr = new XMLHttpRequest();
// 前端开关：浏览器是否读写cookie
xhr.withCredentials = true;
// 访问nginx中的代理服务器
xhr.open('get', 'http://www.domain1.com:81/?user=admin', true);
xhr.send();

// server.js
var http = require('http');
var server = http.createServer();
var qs = require('querystring');
server.on('request', function(req, res) {
    var params = qs.parse(req.url.substring(2));
    // 向前台写cookie
    res.writeHead(200, {
        'Set-Cookie': 'l=a123456;Path=/;Domain=www.domain2.com;HttpOnly'   // HttpOnly:脚本无法读取
    });
    res.write(JSON.stringify(params));
    res.end();
});
server.listen('8080');
console.log('Server is running at port 8080...');



```
#### window.name + iframe
```
window.name属性的独特之处：name值在不同的页面（甚至不同域名）加载后依旧存在，
并且可以支持非常长的 name 值（2MB）
 // a.html(http://localhost:3000/b.html)
  <iframe src="http://localhost:4000/c.html" frameborder="0" onload="load()" id="iframe"></iframe>
  <script>
    let first = true
    // onload事件会触发2次，第1次加载跨域页，并留存数据于window.name
    function load() {
      if(first){
      // 第1次onload(跨域页)成功后，切换到同域代理页面
        let iframe = document.getElementById('iframe');
        iframe.src = 'http://localhost:3000/b.html';
        first = false;
      }else{
      // 第2次onload(同域b.html页)成功后，读取同域window.name中数据
        console.log(iframe.contentWindow.name);
      }
    }
  </script>

 // c.html(http://localhost:4000/c.html)
  <script>
    window.name = '我不爱你'  
  </script>


```
#### location.hash + iframe
```
实现原理： a.html欲与c.html跨域相互通信，通过中间页b.html来实现。 
三个页面，不同域之间利用iframe的location.hash传值，相同域之间直接js访问来通信。


一开始a.html给c.html传一个hash值，然后c.html收到hash值后，再把hash值传递给b.html，最后b.html将结果放到a.html的hash值中。
同样的，a.html和b.html是同域的，都是http://localhost:3000;而c.html是http://localhost:4000

 // a.html
  <iframe src="http://localhost:4000/c.html#iloveyou"></iframe>
  <script>
    window.onhashchange = function () { //检测hash的变化
      console.log(location.hash);
    }
  </script>

 // b.html
  <script>
    window.parent.parent.location.hash = location.hash 
    //b.html将结果放到a.html的hash值中，b.html可通过parent.parent访问a.html页面
  </script>

 // c.html
 console.log(location.hash);
  let iframe = document.createElement('iframe');
  iframe.src = 'http://localhost:3000/b.html#idontloveyou';
  document.body.appendChild(iframe);


```

#### document.domain + iframe
```
该方式只能用于二级域名相同的情况下，比如 a.test.com 和 b.test.com 适用于该方式。 只需要给页面添加 document.domain ='test.com' 表示二级域名都相同就可以实现跨域

// a.html
<body>
 helloa
  <iframe src="http://b.zf1.cn:3000/b.html" frameborder="0" onload="load()" id="frame"></iframe>
  <script>
    document.domain = 'zf1.cn'
    function load() {
      console.log(frame.contentWindow.a);
    }
  </script>
</body>

// b.html
<body>
   hellob
   <script>
     document.domain = 'zf1.cn'
     var a = 100;
   </script>
</body>


```


## 微信小程序

```

	https://juejin.cn/post/7034435052817776676?utm_source=gold_browser_extension
	https://juejin.cn/post/6961317489225498631
```

## 权限系统设计

```
	https://juejin.cn/post/7019651859560267807?utm_source=gold_browser_extension

```



## http

```
 	https://juejin.cn/post/7052224696867094536?utm_source=gold_browser_extension

```

## Css 开发总结

```
https://juejin.cn/post/6844904066301050893
https://juejin.cn/post/7045872960166428685?utm_source=gold_browser_extension

```

## 浏览器输入url

```
	https://juejin.cn/post/6986416221323264030?utm_source=gold_browser_extension

```

## h5性能优化

```
	https://juejin.cn/post/6994383328182796295?utm_source=gold_browser_extension

```

#### promise

```
https://juejin.cn/post/6844903607968481287
```

## 手写代码

```
https://juejin.cn/post/6844903809206976520
https://juejin.cn/post/6844903856489365518#heading-23
mvvm
https://juejin.cn/post/6844903605414133773

数组对象去重
递归实现
双层循环 冒泡排序
	- 如何跳出  return  break name
```

## 基础知识

```
https://juejin.cn/post/7022795467821940773
```

## 导出excel

````

	https://github.com/zhaoyunchong/jsonToExcel
	https://www.cnblogs.com/mooncher/p/13265438.html
````

## css 回流重绘
```
GPU 加速的本质其实是减少浏览器渲染页面每一帧过程中的 reflow 和 repaint，
其根本，就是让需要进行动画的元素，生成自己的 GraphicsLayer。
在 Chrome 中，存在有不同类型的层：RenderLayer(负责 DOM 子树)，GraphicsLayer(负责 RenderLayer 的子树)


CSS 动画（Web 动画同理）优化的第一条准则就是让需要动画的元素生成了自己独立的 GraphicsLayer，
强制开始 GPU 加速，而我们需要知道是，GPU 加速的本质是利用让元素生成了自己独立的 GraphicsLayer，
降低了页面在渲染过程中重绘重排的开销


生成自己的独立的 GraphicsLayer，不仅仅只有 transform3d api，还有非常多的方式。在 CSS 中，
包括但不限于（找了很多文档，没有很全面的，需要一个一个去尝试，通过开启 Chrome 的 Layer border 选项）：
	3D 或透视变换(perspective、transform) CSS 属性
	使用加速视频解码的
	拥有 3D (WebGL) 上下文或加速的 2D 上下文的 元素
	混合插件(如 Flash)
	对自己的 opacity 做 CSS 动画或使用一个动画变换的元素
	拥有加速 CSS 过滤器的元素
	元素有一个包含复合层的后代节点(换句话说，就是一个元素拥有一个子元素，该子元素在自己的层里)
	元素有一个 z-index 较低且包含一个复合层的兄弟元素(换句话说就是该元素在复合层上面渲染)
	
	
减少使用耗性能样式
	box-shadow
	CSS 3D 变换、mix-blend-mode、filter
	
使用 will-change 提高页面滚动、动画等渲染性能


```

```
全局路由钩子函数有：beforeEach、beforeResolve、afterEach（参数中没有next）
组件内路由的钩子函数有：beforeRouterEnter、beforeRouteUpdate、beforeRouteLeave
路由独享的钩子函数有：beforeEnter

```


```
OSI分层：应用层、表示层、会话层、传输层、网络层、数据链路层、物理层

TCP/IP模型：应用层、传输层、网络层、网络接口层

应用层协议(常用)：HTTP、RTSP、FTP

传输层协议：TCP、UDP



2、tcp/udp属于哪一层？
传输层
3、tcp/udp有哪些优缺点？
(1)tcp是面向连接的，udp是面向无连接的
tcp在通信之前必须通过三次握手机制与对方建立连接，而udp通信不必与对方建立连接，不管对方的状态就直接把数据发送给对方
(2)tcp连接过程耗时，udp不耗时
(3)tcp连接过程中出现的延时增加了被攻击的可能，安全性不高，而udp不需要连接，安全性较高
(4)tcp是可靠的，保证数据传输的正确性，不易丢包，udp是不可靠的，易丢包
tcp可靠的四大手段：
顺序编号：tcp在传输文件的时候，会将文件拆分为多个tcp数据包，每个装满的数据包大小大约在1k左右，tcp协议为保证可靠传输，会将这些数据包顺序编号
确认机制：当数据包成功的被发送方发送给接收方，接收方会根据tcp协议反馈给发送方一个成功接收的ACK信号，信号中包含了当前包的序号
超时重传：当发送方发送数据包给接收方时，会为每一个数据包设置一个定时器，当在设定的时间内，发送方仍没有收到接收方的ACK信号，会再次发送该数据包，直到收到接收方的ACK信号或者连接已断开
校验信息：tcp首部校验信息较多，udp首部校验信息较少
(5)tcp传输速率较慢，实时性差，udp传输速率较快
tcp建立连接需要耗时，并且tcp首部信息太多，每次传输的有用信息较少，实时性差
(6)tcp是流模式，udp是数据包模式
tcp只要不超过缓冲区的大小就可以连续发送数据到缓冲区上，接收端只要缓冲区上有数据就可以读取，可以一次读取多个数据包，而udp一次只能读取一个数据包，数据包之间独立
4、tcp/udp的使用场合？
(1)对数据可靠性的要求。tcp适用于可靠性高的场合，udp适用于可靠性低的场合
(2)应用的实时性。tcp有延时较大，udp延时较小
(3)网络的可靠性。网络不好的情况下使用tcp，网络条件好的情况下，使用udp
5、PPP协议属于哪一层协议？
数据链路层

```


```
从浏览器地址栏输入url到显示页面的步骤
详细版本


在浏览器地址栏输入URL


浏览器查看缓存，如果请求资源在缓存中并且新鲜，跳转到转码步骤


如果资源未缓存，发起新请求


如果已缓存，检验是否足够新鲜，足够新鲜直接提供给客户端，否则与服务器进行验证。


检验新鲜通常有两个HTTP头进行控制Expires和Cache-Control：

HTTP1.0提供Expires，值为一个绝对时间表示缓存新鲜日期
HTTP1.1增加了Cache-Control: max-age=,值为以秒为单位的最大新鲜时间





浏览器解析URL获取协议，主机，端口，path


浏览器组装一个HTTP（GET）请求报文


浏览器获取主机ip地址，过程如下：

浏览器缓存
本机缓存
hosts文件
路由器缓存
ISP DNS缓存
DNS递归查询（可能存在负载均衡导致每次IP不一样）



打开一个socket与目标IP地址，端口建立TCP链接，三次握手如下：

客户端发送一个TCP的SYN=1，Seq=X的包到服务器端口
服务器发回SYN=1， ACK=X+1， Seq=Y的响应包
客户端发送ACK=Y+1， Seq=Z



TCP链接建立后发送HTTP请求


服务器接受请求并解析，将请求转发到服务程序，如虚拟主机使用HTTP Host头部判断请求的服务程序


服务器检查HTTP请求头是否包含缓存验证信息如果验证缓存新鲜，返回304等对应状态码


处理程序读取完整请求并准备HTTP响应，可能需要查询数据库等操作


服务器将响应报文通过TCP连接发送回浏览器


浏览器接收HTTP响应，然后根据情况选择关闭TCP连接或者保留重用，关闭TCP连接的四次握手如下：


1.  主动方发送Fin=1， Ack=Z， Seq= X报文
1.  被动方发送ACK=X+1， Seq=Z报文
1.  被动方发送Fin=1， ACK=X， Seq=Y报文
1.  主动方发送ACK=Y， Seq=X报文
复制代码


浏览器检查响应状态吗：是否为1XX，3XX， 4XX， 5XX，这些情况处理与2XX不同


如果资源可缓存，进行缓存


对响应进行解码（例如gzip压缩）


根据资源类型决定如何处理（假设资源为HTML文档）


解析HTML文档，构件DOM树，下载资源，构造CSSOM树，执行js脚本，这些操作没有严格的先后顺序，以下分别解释


构建DOM树：


1.  Tokenizing：根据HTML规范将字符流解析为标记
1.  Lexing：词法分析将标记转换为对象并定义属性和规则
1.  DOM construction：根据HTML标记关系将对象组成DOM树
复制代码


解析过程中遇到图片、样式表、js文件，启动下载


构建CSSOM树：


1.  Tokenizing：字符流转换为标记流
1.  Node：根据标记创建节点
1.  CSSOM：节点创建CSSOM树
复制代码

根据DOM树和CSSOM树构建渲染树:

1.  从DOM树的根节点遍历所有可见节点，不可见节点包括：1）`script`,`meta`这样本身不可见的标签。2)被css隐藏的节点，如`display: none`
1.  对每一个可见节点，找到恰当的CSSOM规则并应用
1.  发布可视节点的内容和计算样式
复制代码

js解析如下：

1.  浏览器创建`Document`对象并解析HTML，将解析到的元素和文本节点添加到文档中，此时`document.readystate`为`loading`
1.  HTML解析器遇到没有`async`和`defer`的`script`时，将他们添加到文档中，然后执行行内或外部脚本。这些脚本会同步执行，并且在脚本下载和执行时解析器会暂停。这样就可以用`document.write()`把文本插入到输入流中。同步脚本经常简单定义函数和注册事件处理程序，他们可以遍历和操作`script`和他们之前的文档内容
1.  当解析器遇到设置了`async`属性的`script`时，开始下载脚本并继续解析文档。脚本会在它下载完成后尽快执行，但是解析器不会停下来等它下载。异步脚本禁止使用`document.write()`，它们可以访问自己`script`和之前的文档元素
1.  当文档完成解析，`document.readState`变成`interactive`
1.  所有`defer`脚本会按照在文档出现的顺序执行，延迟脚本能访问完整文档树，禁止使用`document.write()`
1.  浏览器在`Document`对象上触发`DOMContentLoaded`事件
1.  此时文档完全解析完成，浏览器可能还在等待如图片等内容加载，等这些内容完成载入并且所有异步脚本完成载入和执行，`document.readState`变为`complete`,`window`触发`load`事件
复制代码

显示页面（HTML解析过程中会逐步显示页面）

```


#### 切换主题

1. 自定义样式适配

```
<!-- html 节点添加主题自定义属性 -->
<html data-theme="light">
  <!-- 使用CSS变量控制样式 -->
	<body style="background: var(--body-background)"></body>
</html>


// 跟主题无关的变量放到root里
:root {
    --border-radius-base: 6px;
}

// 跟主题相关变量，通过属性选择器提升优先级
html[data-theme='default']:root {
    --body-background: #efefef;
}

html[data-theme='dark']:root {
    --body-background: #000;
}


```

2. ui库适配

   ```
   <html data-theme="light"></html>
   
   html[data-theme='light'] .ant-button {color: #fff}
   html[data-theme='dark'] .ant-button {color: #000}
   
   
   ```

3. 动态切换

   ```
   页面切换主题具体需要从下面三个维度来考虑：
   
   系统主题更换
   页面提供主题切换按钮，用户主动切换
   通过URL控制当前主题
   
   body {
     background: var(--body-background);
     transition: background 0.3s;
   }
   
   @media (prefers-color-scheme: light) {
     :root {
       --body-background: #efefef;
       --text-color: #333;
     }
   }
   
   @media (prefers-color-scheme: dark) {
     :root {
       --body-background: #000;
       --text-color: #ededed;
     }
   }
   
   
   # 跟随主题
   // 给HTML DOM节点添加自定义主题，标识当前主题
   const toggleTheme = (isDarkMode) => {
   	const htmlEl = document.documentElement;
     htmlEl.setAttribute("data-theme", isDarkMode ? "dark" : "light");
   };
   
   const themeMedia = window.matchMedia("(prefers-color-scheme: dark)");
   
   // 页面初始化切换
   toggleTheme(themeMedia.matches);
   
   // 监听系统切换
   themeMedia.addListener((e) => {
     toggleTheme(e.matches);
   });
   
   
   # 按钮切换
   const buttonEl = document.getElementById("btn");
   
   buttonEl.addEventListener("click", () => {
     const currentTheme = htmlEl.getAttribute("data-theme");
     const nextTheme = currentTheme === "dark" ? "light" : "dark";
   
     htmlEl.setAttribute("data-theme", nextTheme);
   });
   
   # url 切换
   
   const search = new URLSearchParams(location.search);
   const theme = search.get("theme") || "light";
   
   document.documentElement.setAttribute("data-theme", theme);
   
   
   
   ```



#### Vue

```
v-model 使用技巧
https://segmentfault.com/a/1190000040863402
图形验证码
	https://juejin.cn/post/6919710203520745486?utm_source=gold_browser_extension
nexttick
	https://juejin.cn/post/6844903914068787213
面试题
https://juejin.cn/post/6850037277675454478
面试
https://juejin.cn/post/6844903928442667015
源码解析
https://juejin.cn/column/6969563635194527758
```

#### js 获取css变量

```

js 获取 css 变量

	// 获取一个 Dom 节点上的 CSS 变量
	element.style.getPropertyValue("--my-var");

	// 获取任意 Dom 节点上的 CSS 变量
	getComputedStyle(element).getPropertyValue("--my-var");

	// 修改一个 Dom 节点上的 CSS 变量
	element.style.setProperty("--my-var", jsVar + 4);

```

#### Async defer

```
如果 script 无 src 属性，则 defer, async 会被忽略
	动态添加的 script 标签隐含 async 属性。
	结论:
	两者都不会阻止 document 的解析
	defer 会在 DOMContentLoaded 前依次执行 （可以利用这两点哦！）
	async 则是下载完立即执行，不一定是在 DOMContentLoaded 前
	async 因为顺序无关，所以很适合像 Google Analytics 这样的无依赖脚本
```

#### Git

```
git message 前缀
	build：表示构建，发布版本可用这个
	ci：更新 CI/CD 等自动化配置
	chore：杂项，其他更改
	docs：更新文档
	feat：常用，表示新增功能
	fix：常用：表示修复 bug
	perf：性能优化
	refactor：重构
	revert：代码回滚
	style：样式更改
	test：单元测试更改
```

#### Npm 发包

```

npm 发包
	mkdir [name]
	cd [name]
	npm init -y
	npm version [patch/minor/major]
	npm login
	npm publish
	npm unpublish npm-component@1.0.1   72小时之内可以删除
```

#### 跨域

```

https://juejin.cn/post/6844903767226351623
当协议、子域名、主域名、端口号中任意一个不相同时，都算作不同域

协议和端口造成的跨域问题“前台”是无能为力的

在跨域问题上，仅仅是通过“URL的首部”来识别而不会根据域名对应的IP地址是否相同来判断。
“URL的首部”可以理解为“协议, 域名和端口必须匹配

http:// www . abc.com : 8080 / scripts/jquery.js
协议    子域名   主域名    端口号   请求资源地址

同源策略限制内容有：
Cookie、LocalStorage、IndexedDB 等存储性内容
DOM 节点
AJAX 请求发送后，结果被浏览器拦截了

有三个标签是允许跨域加载资源：
<img src=XXX>
<link href=XXX>
<script src=XXX>

1. jsonp
需要对方服务器做支持
// index.html
function jsonp({ url, params, callback }) {
  return new Promise((resolve, reject) => {
    let script = document.createElement('script')
    window[callback] = function(data) {
      resolve(data)
      document.body.removeChild(script)
    }
    params = { ...params, callback } // wd=b&callback=show
    let arrs = []
    for (let key in params) {
      arrs.push(`${key}=${params[key]}`)
    }
    script.src = `${url}?${arrs.join('&')}`
    document.body.appendChild(script)
  })
}
jsonp({
  url: 'http://localhost:3000/say',
  params: { wd: 'Iloveyou' },
  callback: 'show'
}).then(data => {
  console.log(data)
})
上面这段代码相当于向http://localhost:3000/say?wd=Iloveyou&callback=show这个地址请求数据，然后后台返回show('我不爱你')，最后会运行show()这个函数，打印出'我不爱你'
// server.js
let express = require('express')
let app = express()
app.get('/say', function(req, res) {
  let { wd, callback } = req.query
  console.log(wd) // Iloveyou
  console.log(callback) // show
  res.end(`${callback}('我不爱你')`)
})
app.listen(3000)

  1) JSONP和AJAX对比
  JSONP和AJAX相同，都是客户端向服务器端发送请求，从服务器端获取数据的方式。
  但AJAX属于同源策略，JSONP属于非同源策略（跨域请求）

  2) JSONP优缺点
  JSONP优点是简单兼容性好，可用于解决主流浏览器的跨域数据访问的问题。缺点是仅支持get方法具有局限性,不安全可能会遭受XSS攻击。

2.cors

CORS 需要浏览器和后端同时支持。IE 8 和 9 需要通过 XDomainRequest 来实现。
服务端设置 Access-Control-Allow-Origin 就可以开启 CORS。 
该属性表示哪些域名可以访问资源，如果设置通配符则表示所有网站都可以访问资源。

分别为简单请求和复杂请求
1) 简单请求
  只要同时满足以下两大条件，就属于简单请求
  条件1：使用下列方法之一：

  GET
  HEAD
  POST

  条件2：Content-Type 的值仅限于下列三者之一：

  text/plain
  multipart/form-data
  application/x-www-form-urlencoded

2) 复杂请求

不符合以上条件的请求就肯定是复杂请求了。 复杂请求的CORS请求，会在正式通信之前，
增加一次HTTP查询请求，称为"预检"请求,该请求是 options 方法的，
通过该请求来知道服务端是否允许跨域请求。
后台配置
// 允许哪个方法访问我
res.setHeader('Access-Control-Allow-Methods', 'PUT')
// 预检的存活时间
res.setHeader('Access-Control-Max-Age', 6)
// OPTIONS请求不做任何处理
if (req.method === 'OPTIONS') {
  res.end() 
}
// 定义后台返回的内容
app.put('/getData', function(req, res) {
  console.log(req.headers)
  res.end('我不爱你')
})



```

#### 微信小程序

```

	https://juejin.cn/post/7034435052817776676?utm_source=gold_browser_extension
	https://juejin.cn/post/6961317489225498631
```

#### 权限系统设计

```
	https://juejin.cn/post/7019651859560267807?utm_source=gold_browser_extension

```



#### http

```
 	https://juejin.cn/post/7052224696867094536?utm_source=gold_browser_extension

```

#### Css 开发总结

```
https://juejin.cn/post/6844904066301050893
https://juejin.cn/post/7045872960166428685?utm_source=gold_browser_extension

```

#### 浏览器输入url

```
	https://juejin.cn/post/6986416221323264030?utm_source=gold_browser_extension

```

#### h5性能优化

```
	https://juejin.cn/post/6994383328182796295?utm_source=gold_browser_extension

```

#### promise

```
https://juejin.cn/post/6844903607968481287
```

#### 手写代码

```
https://juejin.cn/post/6844903809206976520
https://juejin.cn/post/6844903856489365518#heading-23
mvvm
https://juejin.cn/post/6844903605414133773

数组对象去重
递归实现
双层循环 冒泡排序
	- 如何跳出  return  break name
```

#### 基础知识

```
https://juejin.cn/post/7022795467821940773
```

#### 导出excel

````

	https://github.com/zhaoyunchong/jsonToExcel
	https://www.cnblogs.com/mooncher/p/13265438.html
````


## git rebase
```
// https://blog.csdn.net/weixin_42310154/article/details/119004977
!!不要通过rebase对任何已经提交到公共仓库中的commit进行修改（你自己一个人玩的分支除外）

基于develop分支执行: git rebase master
develop: 待变基分支 当前分支
master: 基分支 目标分支

当执行rebase操作时，git会从两个分支的共同祖先开始提取待变基分支上的修改，
然后将待变基分支指向基分支的最新提交，最后将刚才提取的修改应用到基分支的最新提交的后面。

合并当前分支的多个提交记录:
git rebase -i [startPonit] [endPoint]
              HEAD~N   N为我们需要合并的 commit 记录的数量

  前开后闭 区间 这里的 [startPonit] 是指需要合并的commit的前一个commit (即当前示例中的 “4cb600e: feat: modify a”)。 
  因为, 三个commit肯定要基于上一个commit合并成了新的commit。
  谨慎使用[endPoint] 省略, 即默认表示从起始commit一直到最后一个，但是一旦你填写了, 
  则表示 [endPoint]后面的commit全部不要了!

  pick 改成 s
  注释不必要的提交信息

  pick：保留该commit（缩写:p）
  reword：保留该commit，但我需要修改该commit的注释（缩写:r）
  edit：保留该commit, 但我要停下来修改该提交(不仅仅修改注释)（缩写:e）
  squash：将该commit和前一个commit合并（缩写:s）
  fixup：将该commit和前一个commit合并，但我不要保留该提交的注释信息（缩写:f）
  exec：执行shell命令（缩写:x）
  drop：我要丢弃该commit（缩写:d）


分支合并 
git rebase [分支名]


  总的原则是，只对尚未推送或未分享给别人的本地修改执行变基操作清理历史， 从不对已推送至别处的提交执行变基操作，这样，你才能享受到两种方式（rebase 和merge）带来的便利。


(将一段commit粘贴到另一个分支上) (如果只是复制某一两个提交到其他分支，建议使用更简单的命令:git cherry-pick)
    git rebase   [startpoint]   [endpoint]  --onto  [branchName]
ex: 
    git  rebase   90bc0045b^   5de0da9f2   --onto master
    这时候 master 没有任何变化
    git checkout master
    git reset --hard  0c72e64
    将master指向所提交的id
```

## 屏幕宽高获取
```

this.$el.offsetWidth
window.pageYOffset
window.pageXOffset
this.$el.getBoundingClientRect()



窗口相对于屏幕顶部距离 window.screenTop
窗口相对于屏幕左边距离 window.screenLeft,
屏幕分辨率的高 window.screen.height,
屏幕分辨率的宽 window.screen.width,
屏幕可用工作区高度 window.screen.availHeight,
屏幕可用工作区宽度 window.screen.availWidth
网页滚动距离顶部距离 document.body.scrollTop
网页滚动距离左边距离 document.body.scrollLeft
 
网页可见区域宽： document.body.clientWidth
网页可见区域高： document.body.clientHeight
网页可见区域宽： document.body.offsetWidth (包括边线的宽)
网页可见区域高： document.body.offsetHeight (包括边线的高)
网页正文全文宽： document.body.scrollWidth
网页正文全文高： document.body.scrollHeight
网页被卷去的高： document.body.scrollTop
网页被卷去的左： document.body.scrollLeft

对应的dom元素的宽高有以下几个常用的：
元素的实际高度：document.getElementById("div").offsetHeight
元素的实际宽度：document.getElementById("div").offsetWidth
元素的实际距离左边界的距离：document.getElementById("div").offsetLeft
元素的实际距离上边界的距离：document.getElementById("div").offsetTop


window.getComputedStyle(dom元素,'伪类').属性名
dom元素.clientHeight/clientWidth
dom元素.offsetHeight/offsetWidth
dom元素.scrollHeight/scrollWidth
dom元素.style.height/width


```

## DOM

```
-nodeType


 Node.ELEMENT_NODE(1);
 Node.ATTRIBUTE_NODE(2);
 Node.TEXT_NODE(3);
 Node.CDATA_SECTION_NODE(4);
 Node.ENTITY_REFERENCE_NODE(5);
 Node.ENTITY_NODE(6);
 Node.PROCESSING_INSTRUCTION_NODE(7); 
 Node.COMMENT_NODE(8);
 Node.DOCUMENT_NODE(9);
 Node.DOCUMENT_TYPE_NODE(10);
 Node.DOCUMENT_FRAGMENT_NODE(11); 
 Node.NOTATION_NODE(12)。



-nodeName nodeValue  tagName

对于元素节点，nodeName 中保存的始终都是元素的标签名，而 nodeValue 的值则始终为 null

-childNodes

nodeList[0] 等同于 nodeList.items(0)

parentNode

nextSibling previousSibling

firstChild lastChild

所有节点都有的最后一个属性是 ownerDocument，该属性指向表示整个文档的文档节点


下面四个方法操作的都是某个节点的子节点

appendChild()  
返回新增的节点

insertBefore()方法。接受两个参数:要插入的节点和作为参照的节点,
插入节点后，被插入的节点会变成参照节点的前一个同胞节点(previousSibling)，同时被方法返回。
如果参照节点是 null，则 insertBefore()与 appendChild()执行相同的操作

replaceChild()方法接受的两个参数是: 要插入的节点和要替换的节点。
要替换的节点将由这个方法返回并从文档树中被移除，同时由要插入的节点占据其位置
在使用 replaceChild()插入一个节点时，该节点的所有关系指针都会从被它替换的节点复制过来。
尽管从技术上讲，被替换的节点仍然还在文档中，但它在文档中已经没有了自己的位置。

removeChild()方法。这个方法接受一个参数，即要移除 的节点。被移除的节点将成为方法的返回值
与使用 replaceChild()方法一样，通过 removeChild()移除的节点仍然为文档所有，
只不过在文档中已经没有了自己的位置




document.documentElement; //取得对<html>的引用
document.body // 取得对body的引用
document.doctype // 取得对<!DOCTYPE>引用
document.title // 标题
//取得完整的 URL
var url = document.URL;
var domain = document.domain;   // 可以设置, 但只能设置为主域
//取得来源页面的 URL
var referrer = document.referrer;


⭐️
当页面中包含来自其他子域的框架或内嵌框架时，能够设置document.domain就非常方便了。
由于跨域安全限制，来自不同子域的页面无法通过 JavaScript 通信。
而通过将每个页面的 document.domain 设置为相同的值，这些页面就可以互相访问对方包含的 JavaScript 对象了。
例如，假设有一个页面加载自 www.wrox.com，其中包含一个内嵌框架，框架内的页面加载自 p2p.wrox.com。 
由于 document.domain 字符串不一样，内外两个页面之间无法相互访问对方的 JavaScript 对象。
但如果将这两个页面的 document.domain 值都设置为"wrox.com"，它们之间就可以通信了
浏览器对 domain 属性还有一个限制，即如果域名一开始是“松散的”(loose)，那么不能将它再设置为“紧绷的”(tight)。
换句话说，在将 document.domain 设置为"wrox.com"之后，就不能再将其 设置回"p2p.wrox.com"，否则将会导致错误


除了属性和方法，document 对象还有一些特殊的集合。这些集合都是 HTMLCollection 对象， 
为访问文档常用的部分提供了快捷方式，包括:
 document.anchors，包含文档中所有带 name 特性的<a>元素;
 document.applets，包含文档中所有的<applet>元素，因为不再推荐使用<applet>元素，
所以这个集合已经不建议使用了;
 document.forms，包含文档中所有的<form>元素，与 document.getElementsByTagName("form")
得到的结果相同;
document.images，包含文档中所有的<img>元素，与 document.getElementsByTagName
("img")得到的结果相同;
 document.links，包含文档中所有带 href 特性的<a>元素。


dom 一致性检测
document.implementation.hasFeature("XML", "1.0")

文档写入
体现在下列 4 个方法中:write()、writeln()、open()和 close()


HTML

每个 HTML 元素中都存在的下列标准特性。
 id，元素在文档中的唯一标识符。
 title，有关元素的附加说明信息，一般通过工具提示条显示出来。
 lang，元素内容的语言代码，很少使用。
 dir，语言的方向，值为"ltr"(left-to-right，从左至右)或"rtl"(right-to-left，从右至左)，
也很少使用。
 className，与元素的 class 特性对应，即为元素指定的 CSS 类。没有将这个属性命名为 class，
是因为 class 是 ECMAScript 的保留字

操作特性的 DOM 方法主要有三个，分别是 getAttribute()、setAttribute()和 removeAttribute()。
这三 个方法可以针对任何特性使用，包括那些以 HTMLElement 类型属性的形式定义的特性

attributes 属性

要取得元素的 id 特性，可以使用以下代码。
    var id = element.attributes.getNamedItem("id").nodeValue;
  以下是使用方括号语法通过特性名称访问节点的简写方式。
    var id = element.attributes["id"].nodeValue;

调用 removeNamedItem()方法与在元素上调用 removeAttribute()方法的效果相同——直接删 除具有给定名称的特性。
下面的例子展示了两个方法间唯一的区别，即 removeNamedItem()返回表示 被删除特性的 Attr 节点。
var oldAttr = element.attributes.removeNamedItem("id");

document.createElement()方法可以创建新元素
document.createTextNode()创建新文本节点

Text类型提供了一个作用与normalize()相反的方法:splitText(num)

Comment 类型与 Text 类型继承自相同的基类，因此它拥有除 splitText()之外的所有字符串操
 作方法
 
 document.createComment()并为其传递注释文本也可以创建注释节点

CDATASection 类型继承自 Text 类型，因此拥有除 splitText()之外的所有字符串操作方法
CDATA 区域只会出现在 XML 文档中



轻量级文档
document.createDocumentFragment()
⭐️⭐️⭐️⭐️⭐️
如果将文档中的节 点添加到文档片段中，就会从文档树中移除该节点，也不会从浏览器中再看到该节点。
添加到文档片段 中的新节点同样也不属于文档树。
可以通过 appendChild()或 insertBefore()将文档片段中内容添 加到文档中。
在将文档片段作为参数传递给这两个方法时，实际上只会将文档片段的所有子节点添加到 相应位置上;
文档片段本身永远不会成为文档树的一部分


Attr 类型
var attr = document.createAttribute("align");
attr.value = "left";
element.setAttributeNode(attr);
alert(element.attributes["align"].value);       //"left"
alert(element.getAttributeNode("align").value); //"left"
alert(element.getAttribute("align"));        //"left"



为<table>元素添加的属性和方法如下。
 caption:保存着对<caption>元素(如果有)的指针。
 tBodies:是一个<tbody>元素的 HTMLCollection。
 tFoot:保存着对<tfoot>元素(如果有)的指针。
 tHead:保存着对<thead>元素(如果有)的指针。
 rows:是一个表格中所有行的 HTMLCollection。
 createTHead():创建<thead>元素，将其放到表格中，返回引用。
 createTFoot():创建<tfoot>元素，将其放到表格中，返回引用。
 createCaption():创建<caption>元素，将其放到表格中，返回引用。  deleteTHead():删除<thead>元素。
 deleteTFoot():删除<tfoot>元素。
 deleteCaption():删除<caption>元素。
 deleteRow(pos):删除指定位置的行。
 insertRow(pos):向 rows 集合中的指定位置插入一行。
为<tbody>元素添加的属性和方法如下。
 rows:保存着<tbody>元素中行的 HTMLCollection。
 deleteRow(pos):删除指定位置的行。
 insertRow(pos):向 rows 集合中的指定位置插入一行，返回对新插入行的引用


为<tr>元素添加的属性和方法如下。
 cells:保存着<tr>元素中单元格的 HTMLCollection。
 deleteCell(pos):删除指定位置的单元格。
 insertCell(pos):向 cells 集合中的指定位置插入一个单元格，返回对新插入单元格的引用。
 
```


## Bom

```
窗口位置
window.screenLeft window.screenTop

窗口大小
innerWidth、innerHeight、outerWidth 和 outerHeight

通过dom提供页面可见区域相关信息
document.documentElement.clientWidth 和 
document.documentElement.clientHeight 中保存了页面视口的信息

document.body.clientWidth 和 document.body. clientHeight

```

## form

```
HTMLFormElement 也有它自己下列独有的属性和方法。
 acceptCharset:服务器能够处理的字符集;等价于 HTML 中的 accept-charset 特性。  action:接受请求的 URL;等价于 HTML 中的 action 特性。
 elements:表单中所有控件的集合(HTMLCollection)。
 enctype:请求的编码类型;等价于 HTML 中的 enctype 特性。
 length:表单中控件的数量。
 method:要发送的 HTTP 请求类型，通常是"get"或"post";等价于 HTML 的 method 特性。  name:表单的名称;等价于 HTML 的 name 特性。
 reset():将所有表单域重置为默认值。
 submit():提交表单。
 target:用于发送请求和接收响应的窗口名称;等价于 HTML 的 target 特性。

var firstForm = document.forms[0]; //取得页面中的第一个表单
var myForm = document.forms["form2"]; //取得页面中名称为"form2"的表单

调用 submit()方法的形式提交表单时，不会触发 submit 事件，因此要记得在调用此方法之 前先验证表单数据
与调用 submit()方法不同，调用 reset()方法会像单击重置按钮一样触发 reset 事件。

共有的表单字段属性

除了<fieldset>元素之外，所有表单字段都拥有相同的一组属性。由于<input>类型可以表示多 种表单字段，因此有些属性只适用于某些字段，但还有一些属性是所有字段所共有的。表单字段共有的 属性如下。
 disabled:布尔值，表示当前字段是否被禁用。
 form:指向当前字段所属表单的指针;只读。
 name:当前字段的名称。
 readOnly:布尔值，表示当前字段是否只读。
 tabIndex:表示当前字段的切换(tab)序号。
 type:当前字段的类型，如"checkbox"、"radio"，等等。
 value:当前字段将被提交给服务器的值。对文件字段来说，这个属性是只读的，包含着文件
在计算机中的路径。

每个表单字段都有两个方法:focus()和 blur()

共有的表单字段事件
除了支持鼠标、键盘、更改和 HTML 事件之外，所有表单字段都支持下列 3 个事件。
 blur:当前字段失去焦点时触发。 change:对于<input>和<textarea>元素，在它们失去焦点且 value 值改变时触发;对于
<select>元素，在其选项改变时触发。  focus:当前字段获得焦点时触发。



input type="text" 和 textarea 区别

必须将<input>元素的 type 特性设置为"text"。而通过设置 size 特性，可以指 定文本框中能够显示的字符数。
通过 value 特性，可以设置文本框的初始值，而 maxlength 特性则用 于指定文本框可以接受的最大字符数。
如果要创建一个文本框，让它能够显示 25 个字符，但输入不能 超过 50 个字符，可以使用以下代码:
 图灵社区会员 StinkBC(StinkBC@gmail.com) 专享 尊重版权

<input type="text" size="25" maxlength="50" value="initial value">


<textarea>元素则始终会呈现为一个多行文本框。要指定文本框的大小，可以使用 rows 和 cols 特性。其中，rows 特性指定的是文本框的字符行数，而 cols 特性指定的是文本框的字符列数 (类似于<inpu>元素的 size 特性)。与<input>元素不同，<textarea>的初始值必须要放在
<textarea>和</textarea>之间，如下面的例子所示。 <textarea rows="25" cols="5">initial value</textarea>
另一个与<input>的区别在于，不能在 HTML 中给<textarea>指定最大字符数。
无论这两种文本框在标记中有什么区别，但它们都会将用户输入的内容保存在 value 属性中。可 以通过这个属性读取和设置文本框的值，如下面的例子所示:
     var textbox = document.forms[0].elements["textbox1"];
     alert(textbox.value);
     textbox.value = "Some new value";
我们建议读者像上面这样使用 value 属性读取或设置文本框的值，不建议使用标准的 DOM 方法。 换句话说，不要使用 setAttribute()设置<input>元素的 value 特性，也不要去修改<textarea> 元素的第一个子节点。原因很简单:对 value 属性所作的修改，不一定会反映在 DOM 中。因此，在处 理文本框的值时，最好不要使用 DOM 方法。


上述两种文本框都支持 select()方法，这个方法用于选择文本框中的所有文本。在调用 select() 方法时，大多数浏览器(Opera 除外)都会将焦点设置到文本框中。

selectionStart 和 selectionEnd

现在除 select()方法之外，所有文本框都有一个 setSelectionRange() 方法。
这个方法接收两个参数:要选择的第一个字符的索引和要选择的最后一个字符之后的字符的索引

textbox.value = "Hello world!"
//选择所有文本
textbox.setSelectionRange(0, textbox.value.length); //"Hello world!"
//选择前 3 个字符 textbox.setSelectionRange(0, 3); //"Hel"
//选择第4到第6个字符 textbox.setSelectionRange(4, 7); //"o w"



可以通过下列代码屏蔽所有按键操作。
 EventUtil.addHandler(textbox, "keypress", function(event){
    event = EventUtil.getEvent(event);
    EventUtil.preventDefault(event);
});

例如，下列代码只允许 用户输入数值。
EventUtil.addHandler(textbox, "keypress", function(event){ 
event = EventUtil.getEvent(event);
var target = EventUtil.getTarget(event);
var charCode = EventUtil.getCharCode(event);
     
        if (!/\d/.test(String.fromCharCode(charCode)) && charCode > 9 &&
                 !event.ctrlKey){
  			EventUtil.preventDefault(event);
	}
});


下列就是 6 个剪贴板事件。 
 beforecopy:在发生复制操作前触发。
 copy:在发生复制操作时触发。
 beforecut:在发生剪切操作前触发。
 cut:在发生剪切操作时触发。
 beforepaste:在发生粘贴操作前触发。 
 paste:在发生粘贴操作时触发



选择框的 change 事件与其他表单字段的 change 事件触发的 条件不一样。
其他表单字段的 change 事件是在值被修改且焦点离开当前字段时触发，
而选择框的 change 事件只要选中了选项就会触发


移除 option
selectbox.removeChild(selectbox.options[0]); //移除第一个选项 
其次，可以使用选择框的 remove()方法。
这个方法接受一个参数，即要移除选项的索引，如下面的例子所示:
selectbox.remove(0); //移除第一个选项
最后一种方式，就是将相应选项设置为 null。这种方式也是 DOM 出现之前浏览器的遗留机制。
 例如:
selectbox.options[0] = null; //移除第一个选项
  要清除选择框中所有的项，需要迭代所有选项并逐个移除它们，如下面的例子所示:
    function clearSelectbox(selectbox){
        for(var i=0, len=selectbox.options.length; i < len; i++){
            selectbox.remove(i);
        }
}

富文本编辑

1
<iframe name="richedit" style="height:100px;width:100px;" src="blank.htm"></iframe>
    <script type="text/javascript">
    EventUtil.addHandler(window, "load", function(){
        frames["richedit"].document.designMode = "on";
    });
</script>

2.
<div class="editable" id="richedit" contenteditable></div>
与富文本编辑器交互的主要方式，就是使用 document.execCommand()。
这个方法可以对文档执 行预定义的命令，而且可以应用大多数格式。
可以为 document.execCommand()方法
传递 3 个参数: 要执行的命令名称、表示浏览器是否应该为当前命令提供用户界面的一个布尔值
和执行命令必须的一个 值(如果不需要值，则传递 null)。



```



## JavaScript笔试部分:

```

https://juejin.im/post/5d51e16d6fb9a06ae17d6bbc
https://juejin.im/post/5cef46226fb9a07eaf2b7516
https://juejin.im/post/5d469e0851882544b85c32ef
https://juejin.im/post/5d46a94e6fb9a06b24430027


Mithril、Inferno、Angular、React、Aurelia、Vue 和 Polymer
我发现最简单的方法是从你选择的库中选择一个方法，并记录当你调用它时会发生什么。不要每一个步骤都记录，而是尝试理解它的整体流程和结构。


```

## 文章收集


[前端开发规范](https://yq.aliyun.com/articles/51488)

[推荐的vue ui库](https://segmentfault.com/a/1190000015423178?utm_source=tag-newest)

[css总结](https://juejin.im/post/5d3eca78e51d4561cb5dde12)

[Js总结](https://juejin.im/post/5d54e78be51d4561b072dce6)

[Js原生api实现](https://juejin.im/post/5d635566e51d4561e224a360)

[前端推荐文章](https://juejin.im/post/5d387f696fb9a07eeb13ea60)

[一个框架](https://yoxjs.github.io/yox/#/)

[前端100题](https://juejin.im/post/5d23e750f265da1b855c7bbe)

[Vue 面试题](https://juejin.im/post/5d59f2a451882549be53b170)

[HTML/CSS/JS编码规范](https://juejin.im/post/599ececb5188252423583c27#heading-55)

[Less 常用语法](https://www.jianshu.com/p/d81496ed0e29)

[简易mvvm](https://www.cnblogs.com/canfoo/p/6891868.html)

[Js设计模式](https://juejin.im/post/5d58ca046fb9a06ad0056cc7)

[vue目录解构](https://juejin.im/post/5d5a44f0e51d456201486e41)

[腾讯code guider](http://alloyteam.github.io/CodeGuide/#js-miscellaneous)

[虚拟dom](https://juejin.im/post/5d3f3bf36fb9a06af824b3e2)

[前端协作规范](https://juejin.im/post/5d3a7134f265da1b5d57f1ed#heading-27)

[干货](https://juejin.im/post/5d3edad9f265da03a652f133)








