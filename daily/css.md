## vertical-align
```
属性值：

	线类：baseline、top、middle、bottom
	文本类：text-top、text-bottom
	上标下标类：sub、super
	数值百分比类：20px、2em、20%等（对于基线往上或往下偏移）


温馨提示：负值相对于基线往下偏移，正值往上偏移，事实上vertical-align:base-line等同于vertical-align:0。这个负值真的是 CSS 神器！

vertical-align生效前提：

什么情况生效
内联元素span、strong、em、img、button、input等
display值为inline、inline-block、inline-table或table-cell的元素
需要注意浮动和绝对定位会让元素块状化，因此此元素绝对不会生效

```
## 伪类和伪元素的区别

```


伪类和伪元素是用来修饰不在文档树中的部分，比如，一句话中的第一个字母，或者是列表中的第一个元素。
下面分别对伪类和伪元素进行解释：
伪类用于当已有元素处于的某个状态时，为其添加对应的样式，这个状态是根据用户行为而动态变化的。
比如说，当用户悬停在指定的元素时，我们可以通过:hover来描述这个元素的状态。虽然它和普通的css类相似，
可以为已有的元素添加样式，但是它只有处于dom树无法描述的状态下才能为元素添加样式，所以将其称为伪类。
伪元素用于创建一些不在文档树中的元素，并为其添加样式。
比如说，我们可以通过:before来在一个元素前增加一些文本，并为这些文本添加样式。虽然用户可以看到这些文本，但是这些文本实际上不在文档树中。
区别
伪类的操作对象是文档树中已有的元素，而伪元素则创建了一个文档树外的元素。因此，伪类与伪元素的区别在于：有没有创建一个文档树之外的元素。
CSS3规范中的要求使用双冒号(::)表示伪元素，以此来区分伪元素和伪类，比如::before和::after等伪元素使用双冒号(::)，
:hover和:active等伪类使用单冒号(:)。除了一些低于IE8版本的浏览器外，大部分浏览器都支持伪元素的双冒号(::)表示方法。

```

## BFC

```

BFC 全称为块级格式化上下文 (Block Formatting Context) 。
BFC是 W3C CSS 2.1 规范中的一个概念，它决定了元素如何对其内容进行定位以及与其他元素的关系和相互作用，
当涉及到可视化布局的时候，Block Formatting Context提供了一个环境，HTML元素在这个环境中按照一定规则进行布局。
一个环境中的元素不会影响到其它环境中的布局。比如浮动元素会形成BFC，浮动元素内部子元素的主要受该浮动元素影响，两个浮动元素之间是互不影响的。
这里有点类似一个BFC就是一个独立的行政单位的意思。可以说BFC就是一个作用范围，把它理解成是一个独立的容器，并且这个容器里box的布局与这个容器外的box毫不相干。

触发BFC的条件

	根元素或其它包含它的元素
	浮动元素 (元素的 float 不是 none)
	绝对定位元素 (元素具有 position 为 absolute 或 fixed)
	内联块 (元素具有 display: inline-block)
	表格单元格 (元素具有 display: table-cell，HTML表格单元格默认属性)
	表格标题 (元素具有 display: table-caption, HTML表格标题默认属性)
	具有overflow 且值不是 visible 的块元素
	弹性盒（flex或inline-flex）
	display: flow-root
	column-span: all

BFC的约束规则

	内部的盒会在垂直方向一个接一个排列（可以看作BFC中有一个的常规流）
	处于同一个BFC中的元素相互影响，可能会发生外边距重叠
	每个元素的margin box的左边，与容器块border box的左边相接触(对于从左往右的格式化，否则相反)，即使存在浮动也是如此
	BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素，反之亦然
	计算BFC的高度时，考虑BFC所包含的所有元素，连浮动元素也参与计算
	浮动盒区域不叠加到BFC上

BFC可以解决的问题

	垂直外边距重叠问题
	去除浮动
	自适用两列布局（float + overflow）


BFC的概念
BFC 是 Block Formatting Context 的缩写，即块级格式化上下文。BFC是CSS布局的一个概念，是一个独立的渲染区域，规定了内部box如何布局，
并且这个区域的子元素不会影响到外面的元素，其中比较重要的布局规则有内部 box 垂直放置，计算 BFC 的高度的时候，浮动元素也参与计算。

BFC的原理布局规则

	内部的Box会在垂直方向，一个接一个地放置
	Box垂直方向的距离由margin决定。属于同一个BFC的两个相邻Box的margin会发生重叠
	每个元素的margin box的左边， 与包含块border box的左边相接触(对于从左往右的格式化，否则相反
	BFC的区域不会与float box重叠
	BFC是一个独立容器，容器里面的子元素不会影响到外面的元素
	计算BFC的高度时，浮动元素也参与计算高度
	元素的类型和display属性，决定了这个Box的类型。不同类型的Box会参与不同的Formatting Context。

如何创建BFC？

	根元素，即HTML元素
	float的值不为none
	position为absolute或fixed
	display的值为inline-block、table-cell、table-caption
	overflow的值不为visible

BFC的使用场景

	去除边距重叠现象
	清除浮动（让父元素的高度包含子浮动元素）
	避免某元素被浮动元素覆盖
	避免多列布局由于宽度计算四舍五入而自动换行


```

## 层级

```
background/border    
z-index < 0
block块级水平盒子
float浮动盒子
inline/inline-block水平盒子
z-index:  auto 或者0;
z-index > 0
```



## 语义化标签
```
header nav main article section aside footer


语义化的优点:

	在没CSS样式的情况下，页面整体也会呈现很好的结构效果
	代码结构清晰，易于阅读，
	利于开发和维护 方便其他设备解析（如屏幕阅读器）根据语义渲染网页。
	有利于搜索引擎优化（SEO），搜索引擎爬虫会根据不同的标签来赋予不同的权重


```





## 水平居中
```
https://juejin.cn/post/7008348524530106381

对于 行内元素 : text-align: center;

对于确定宽度的块级元素：
（1）width和margin实现。margin: 0 auto;
（2）绝对定位和margin-left: (父width - 子width）/2, 前提是父元素position: relative


对于宽度未知的块级元素
（1）table标签配合margin左右auto实现水平居中。使用table标签（或直接将块级元素设值为 display:table），再通过给该标签添加左右margin为auto。
（2）inline-block实现水平居中方法。display：inline-block和text-align:center实现水平居中。
（3）绝对定位+transform，translateX可以移动本身元素的50%。
（4）flex布局使用justify-content:center




垂直居中

	利用 line-height 实现居中，这种方法适合纯文字类
	通过设置父容器 相对定位 ，子级设置 绝对定位，标签通过margin实现自适应居中
	弹性布局 flex :父级设置display: flex; 子级设置margin为auto实现自适应居中
	父级设置相对定位，子级设置绝对定位，并且通过位移 transform 实现
	table 布局，父级通过转换成表格形式，然后子级设置 vertical-align 实现。（需要注意的是：vertical-align: middle使用的前提条件是内联元素以及display值为table-cell的元素）。

```
## Flex
```

Flex 是 Flexible Box 的缩写，意为"弹性布局",用来为盒状模型提供最大的灵活性。指定容器 display: flex 即可。 简单的分为容器属性和元素属性。
容器的属性：

	flex-direction：决定主轴的方向（即子 item 的排列方法）flex-direction: row | row-reverse | column | column-reverse;
	flex-wrap：决定换行规则 flex-wrap: nowrap | wrap | wrap-reverse;
	flex-flow： .box { flex-flow: || ; }
	justify-content：对其方式，水平主轴对齐方式
	align-items：对齐方式，竖直轴线方向
	align-content

项目的属性（元素的属性）：

	order 属性：定义项目的排列顺序，顺序越小，排列越靠前，默认为 0
	flex-grow 属性：定义项目的放大比例，即使存在空间，也不会放大
	flex-shrink 属性：定义了项目的缩小比例，当空间不足的情况下会等比例的缩小，如果 定义个 item 的 flow-shrink 为 0，则为不缩小
	flex-basis 属性：定义了在分配多余的空间，项目占据的空间。
	flex：是 flex-grow 和 flex-shrink、flex-basis 的简写，默认值为 0 1 auto。
	align-self：允许单个项目与其他项目不一样的对齐方式，可以覆盖
	align-items，默认属 性为 auto，表示继承父元素的 align-items 比如说，用 flex 实现圣杯布局


```


```

## 清除浮动

1. <div class="parent">
    //添加额外标签并且添加clear属性
    <div style="clear:both"></div>
    //也可以加一个br标签
</div>

2. 父级添加overflow属性，或者设置高度

3. //在css中添加:after伪元素
   .parent:after{
   /* 设置添加子元素的内容是空 */
   content: '';
   /* 设置添加子元素为块级元素 */
   display: block;
   /* 设置添加的子元素的高度0 */
   height: 0;
   /* 设置添加子元素看不见 */
   visibility: hidden;
   /* 设置clear：both */
   clear: both;
   }

```


## 切换主题(换肤)
```
多套样式

vuex 切换  
缺点: 代码量大  样式不易管理 开发效率低 拓展性差

link 动态加载css文件
缺点: 重复cv多套文件 没有提取公共样式 需提前知道打包后路径,易引入错误

css变量  兼容性
body.style.setProperty(key, value)
css-vars-ponyfill

1. 自定义样式适配

```

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


```
2. ui库适配
   
   <html data-theme="light"></html>
   
   html[data-theme='light'] .ant-button {color: #fff}
   html[data-theme='dark'] .ant-button {color: #000}
   
   
```

```

```javscript
    //3. 动态切换

   // 页面切换主题具体需要从下面三个维度来考虑：
   
   // 系统主题更换
   // 页面提供主题切换按钮，用户主动切换
   // 通过URL控制当前主题
   
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
   
   
    跟随主题
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
   
   
   webpack 打包  自定义插件
   
   // vue.config.js
		const fs = require("fs");
		const webpack = require("webpack");
		
		// 获取主题文件名
		const themeFiles = fs.readdirSync("./src/style/theme");
		let ThemesArr = [];
		themeFiles.forEach(function (item, index) {
		  let stat = fs.lstatSync("./src/style/theme/" + item);
		  if (stat.isDirectory() === true) {
		    ThemesArr.push(item);
		  }
		});
		
		module.exports = {
		  css: {...},
		  configureWebpack: (config) => {
		    return {
		      plugins: [
		        // 自定义webpack插件
		        new webpack.DefinePlugin({
		          THEMEARR: JSON.stringify(ThemesArr),
		        }),
		      ],
		    };
		  },
		};

    使用

    // App.vue
    mounted() {
    document.getElementsByTagName("body")[0].setAttribute("data-theme", "default");
    },

	// Home.vue
		mounted() {
		  this.themeValue = THEMEARR;
		  this.currentThemeIndex = this.themeValue.findIndex(
		    (theme) => theme === "default"
		  );
		  this.currentTheme = this.themeValue[this.currentThemeIndex];
		},
		methods: {
		  onConfirm(currentTheme) {
		    this.currentTheme = currentTheme;
		    this.showPicker = false;
		    this.currentThemeIndex = this.themeValue.findIndex(
		      (theme) => theme === currentTheme
		    );
		    document
		      .getElementsByTagName("body")[0]
		      .setAttribute("data-theme", THEMEARR[this.currentThemeIndex]);
		  },
		}

```





# css



####  visibility : collapse

它的表现跟visibility：hidden;是一样的。元素是不可见的，但此时仍占用页面空间

但例外的是，如果这个元素是table相关的元素，例如table行，table group，table列，table column group，它的
表现却跟display:none一样，也就是说，它们占用的空间也会释放。

在不同浏览器下的区别：

在谷歌浏览器里，使用collapse值和使用hidden值没有什么区别。

在火狐浏览器、Opera和IE11里，使用collapse值的效果就如它的字面意思：table的行会消失，它的下面一行会补充它的位
置。



#### width:auto 和 width:100%的区别

width:100%会使元素box的宽度等于父元素的content box的宽度。

width:auto会使元素撑满整个父元素，margin、border、padding、content区域会自动分配水平空间。



#### 绝对定位元素与非绝对定位元素的百分比计算的区别

绝对定位元素的宽高百分比是相对于临近的position不为static的祖先元素的padding box来计算的。

非绝对定位元素的宽高百分比则是相对于父元素的content box来计算的。





#### base64 编码的优点和缺点

优点是：

（1）减少一个图片的HTTP请求

缺点是：

（1）根据base64的编码原理，编码后的大小会比原文件大小大1/3，如果把大图片编码到html/css中，不仅会造成文件体
积的增加，影响文件的加载速度，还会增加浏览器对html或css文件解析渲染的时间。

（2）使用base64无法直接缓存，要缓存只能缓存包含base64的文件，比如HTML或者CSS，这相比域直接缓存图片的效果要
差很多。

（3）兼容性的问题，ie8以前的浏览器不支持。



#### margin重叠

1. 外层元素padding代替
2. 外层元素透明边框 border:1px solid transparent;
3. 内层元素绝对定位 postion:absolute:
4. 外层元素 overflow:hidden;display: flex|inline-flex
5. 内层元素 加float:left;或display:inline-block|table-cell或table-caption
6. 外层元素padding:1px;

BFC指的是块级格式化上下文，一个元素形成了BFC之后，那么它内部元素产生的布局不会影响到外部元素，外部元素的布局也
不会影响到BFC中的内部元素。一个BFC就像是一个隔离区域，和其他区域互不影响。

一般来说根元素是一个BFC区域，浮动和绝对定位的元素也会形成BFC，display属性的值为inline-block、flex这些
属性时也会创建BFC。还有就是元素的overflow的值不为visible时都会创建BFC。



####  clear 属性清除浮动的原理

clear:none|left|right|both

如果单看字面意思，clear:left应该是“清除左浮动”，clear:right应该是“清除右浮动”的意思，实际上，这种解释是有问
题的，因为浮动一直还在，并没有清除。

官方对clear属性的解释是：“元素盒子的边不能和前面的浮动元素相邻。”，我们对元素设置clear属性是为了避免浮动元素
对该元素的影响，而不是清除掉浮动。

还需要注意的一点是clear属性指的是元素盒子的边不能和前面的浮动元素相邻，注意这里“前面的”3个字，也就是clear属
性对“后面的”浮动元素是不闻不问的。考虑到float属性要么是left，要么是right，不可能同时存在，同时由于clear
属性对“后面的”浮动元素不闻不问，因此，当clear:left有效的时候，clear:right必定无效，也就是此时clear:left
等同于设置clear:both；同样地，clear:right如果有效也是等同于设置clear:both。由此可见，clear:left和cle
ar:right这两个声明就没有任何使用的价值，至少在CSS世界中是如此，直接使用clear:both吧。

一般使用伪元素的方式清除浮动

```css
.clear::after{
  content:'';
  display:table; //也可以是'block'，或者是'list-item'
  clear:both;
}
```

clear属性只有块级元素才有效的，而::after等伪元素默认都是内联水平，这就是借助伪元素清除浮动影响时需要设置disp
lay属性值的原因。



#### zoom:1 的清除浮动原理

清除浮动，触发hasLayout；
zoom属性是IE浏览器的专有属性，它可以设置或检索对象的缩放比例。解决ie下比较奇葩的bug。譬如外边距（margin）
的重叠，浮动清除，触发ie的haslayout属性等。

来龙去脉大概如下：
当设置了zoom的值之后，所设置的元素就会就会扩大或者缩小，高度宽度就会重新计算了，这里一旦改变zoom值时其实也会发
生重新渲染，运用这个原理，也就解决了ie下子元素浮动时候父元素不随着自动扩大的问题。

zoom属性是IE浏览器的专有属性，火狐和老版本的webkit核心的浏览器都不支持这个属性。然而，zoom现在已经被逐步标
准化，出现在CSS3.0规范草案中。

目前非ie由于不支持这个属性，它们又是通过什么属性来实现元素的缩放呢？可以通过css3里面的动画属性scale进行缩放。



#### CSS 优化、提高性能的方法

##### 加载性能：

（1）css压缩：将写好的css进行打包压缩，可以减少很多的体积。
（2）css单一样式：当需要下边距和左边距的时候，很多时候选择:margin:top 0 bottom 0;但margin-bottom:bot
tom;margin-left:left;执行的效率更高。
（3）减少使用@import,而建议使用link，因为后者在页面加载时一起加载，前者是等待页面加载完成之后再进行加载。

##### 选择器性能：

（1）关键选择器（key selector）。选择器的最后面的部分为关键选择器（即用来匹配目标元素的部分）。CSS选择符是从右到
左进行匹配的。当使用后代选择器的时候，浏览器会遍历所有子元素来确定是否是指定的元素等等；

（2）如果规则拥有ID选择器作为其关键选择器，则不要为规则增加标签。过滤掉无关的规则（这样样式系统就不会浪费时间去匹
配它们了）。

（3）避免使用通配规则，如*{}计算次数惊人！只对需要用到的元素进行选择。

（4）尽量少的去对标签进行选择，而是用class。

（5）尽量少的去使用后代选择器，降低选择器的权重值。后代选择器的开销是最高的，尽量将选择器的深度降到最低，最高不要超过
三层，更多的使用类来关联每一个标签元素。

（6）了解哪些属性是可以通过继承而来的，然后避免对这些属性重复指定规则。

##### 渲染性能：

（1）慎重使用高性能属性：浮动、定位。

（2）尽量减少页面重排、重绘。

（3）去除空规则：｛｝。空规则的产生原因一般来说是为了预留样式。去除这些空规则无疑能减少css文档体积。

（4）属性值为0时，不加单位。

（5）属性值为浮动小数0.**，可以省略小数点之前的0。

（6）标准化各种浏览器前缀：带浏览器前缀的在前。标准属性在后。

（7）不使用@import前缀，它会影响css的加载速度。

（8）选择器优化嵌套，尽量避免层级过深。

（9）css雪碧图，同一页面相近部分的小图标，方便使用，减少页面的请求次数，但是同时图片本身会变大，使用时，优劣考虑清
楚，再使用。

（10）正确使用display的属性，由于display的作用，某些样式组合会无效，徒增样式体积的同时也影响解析性能。

（11）不滥用web字体。对于中文网站来说WebFonts可能很陌生，国外却很流行。web fonts通常体积庞大，而且一些浏
览器在下载web fonts时会阻塞页面渲染损伤性能。

##### 可维护性、健壮性：

（1）将具有相同属性的样式抽离出来，整合并通过class在页面中进行使用，提高css的可维护性。
（2）样式与内容分离：将css代码定义到外部css中。



#### flex

##### 父项常用属性

- flex-direction：设置主轴的方向
- justify-content：设置主轴上的子元素排列方式 flex-start flex-end center space-around space-between
- flex-wrap：设置子元素是否换行
- align-content：设置侧轴上的子元素的排列方式（多行）
- align-items：设置侧轴上的子元素排列方式（单行）
- flex-flow：复合属性，相当于同时设置了 flex-direction 和 flex-wrap

space-around：项目之间的间距为左右两侧项目到容器间距的2倍

space-evenly：项目两侧之间的间距与项目与容器两侧的间距相等，相当于除去项目宽度和容器和项目的两侧间距，剩下的平均分配了剩余宽度作为项目左右margin



##### 子项常见属性

- flex(复合属性): 默认: flex: 0 1 auto;
    - flex-grow
    - flex-shrink
    - flex-basis
- align-self：控制子项自己在侧轴的排列方式
- order：定义子项的排列顺序(前后顺序), 0是第一个

**flex-grow**

> 默认0，用于决定项目在有剩余空间的情况下是否放大，默认不放大；注意，即便设置了固定宽度，也会放大。

**flex-shrink**

> 默认1，用于决定项目在空间不足时是否缩小，默认项目都是1，即空间不足时大家一起等比缩小；注意，即便设置了固定宽度，也会缩小。但如果某个项目flex-shrink设置为0，则即便空间不够，自身也不缩小。

**flex-basis**

> 默认auto，用于设置项目宽度，默认auto时，项目会保持默认宽度，或者以width为自身的宽度，但如果设置了flex-basis，权重会width属性高，因此会覆盖widtn属性。



#### Transform

- 透视：`perspctive`
- 3D呈现：`transfrom-style`
- 3D 位移：`translate3d(x, y, z)`
- 3D旋转：`rotate3d(x, y, z)`

https://juejin.im/post/6888102016007176200?utm_source=gold_browser_extension#heading-8



#### animation

/* animation: 动画名称 持续时间 运动曲线 何时开始 播放次数 是否反方向 起始与结束状态 */
animation: name duration timing-function delay iteration-count direction fill-mode





#### 哪些些属性值会具有BFC的条件

> 不是所有的元素模式都能产生BFC，w3c 规范： display 属性为 block, list-item, table 的元素，会产生BFC.

要给这些元素添加如下属性就可以触发BFC。

- float属性不为none
- position为absolute或fixed
- display为inline-block, table-cell, table-caption, flex, inline-flex
- overflow不为visible。

BFC布局规则特性：

- 在BFC中，盒子从顶端开始垂直地一个接一个地排列
- 盒子垂直方向的距离由margin决定。**属于同一个BFC的两个相邻盒子的margin会发生重叠**
- 在BFC中，每一个盒子的左外边缘（margin-left）会触碰到容器的左边缘(border-left)（对于从右到左的格式来说，则触碰到右边缘）。
    - BFC的区域不会与浮动盒子产生交集，而是紧贴浮动边缘。
    - 计算BFC的高度时，自然也会检测浮动或者定位的盒子高度

它是一个独立的渲染区域，只有Block-level box参与， 它规定了内部的Block-level Box如何布局，并且与这个区域外部毫不相干。



#### 硬件加速的原理

> 浏览器接收到页面文档后，会将文档中的标记语言解析为DOM树。DOM树和CSS结合后形成浏览器构建页面的渲染树。渲染树中包含大量的渲染元素，每个渲染元素会被分到一个图层中，每个图层又会被加载到GPU形成渲染纹理，而图层在GPU中transform是不会触发repaint的，最终这些使用transform的图层都会由独立的合成器进程进行处理, CSS transform会**创建了一个新的复合图层，可以被GPU直接用来执行transform操作**。

**浏览器什么时候会创建一个独立的复合图层呢？事实上一般是在以下几种情况下：**

- 3D或者CSS transform
- `<video>`和`<canvas>`标签
- `css filters(滤镜效果)`
- 元素覆盖时，比如使用了z-index属性

##### 为什么硬件加速会使页面流畅

> 因为transform属性不会触发浏览器的repaint（重绘），而绝对定位absolute中的left和top则会一直触发repaint（重绘）。

##### 为什么transform没有触发repaint呢？

> 简而言之，transform动画由GPU控制，支持硬件加载，并不需要软件方面的渲染。**并不是所有的CSS属性都能触发GPU的硬件加载，事实上只有少数的属性可以，比如transform、opacity、filter**

##### 如何用CSS开启硬件加速

> CSS animation、transform以及transition不会自动开启GPU加速，而是由浏览器的缓慢的软件渲染引擎来执行，那我们怎样才可以切换到GPU模式呢，很多浏览器提供了某些触发的CSS规则。

当浏览器检测到页面中某个DOM元素应用了某些CSS规则时就会开启，最显著的特征的元素是3D变化。

```css
.cube{
    translate3d(250px,250px,250px);
    rotate3d(250px,250px,250px,-120deg)
    scale3d(0.5,0.5,0.5);
}
复制代码
```

> 可能在一些情况下，我们并不需要对元素应用3D变幻的效果，那怎么办呢?这时候我们可以使用“欺骗”浏览器来开启硬件加速。虽然我们可能不想对元素应用3D变幻，可我们一样可以开启3D引擎。例如我们可以用`transform:translateZ(0)`;来开启硬件加速







































































































































































































































































































































































































































































































































































































































































































































































































































































































































