# t3-web-general

运营后台（通用模块）

## Run and build

### Install

```bush
npm install
```

### Run

#### Development

```bush
npm run dev
```

#### Production(Build)

```bush
npm run build
```

## 工程说明

- other-modules                         通用业务模块

## 项目结构及说明

```bash
├── public           入口html
├── src              源码入口
	├──config             开发相关配置
	├──components	        通用组件以及公用组件
	├──view               页面源码
		├──xxx-module													xxx业务模块
		├──general-module												综合模块(包括store/directive等)
			├──api       	                              请求接口配置模块
			├── src              												源码入口
				├──assets    	            静态资源
				├──components    	        综合组件
					├──components	  							业务组件
						├──main                 			  嵌套路由父路由component
						├──login        							  登陆页面
						├──search-list                	输入框组件
						├──v-table                    	table组件
						├──error-page   							  报错之后跳转页面
				├──directive    	        综合指令
				├──store    	        		综合存储
				├──styles    	        		综合样式
	├──APP.vue           vue挂载主页面
	├──index.less        通用css
	├──main.js           主JS
├── vue.config.js   主配置文件
```

## git message 格式规范

每次提交，Commit message 都包括三个部分：Header，Body 和 Footer。

```
<type>(<scope>): <subject>
// 空一行
<body>
// 空一行
<footer>
```

其中，Header 是必需的，Body 和 Footer 可以省略。

不管是哪一个部分，任何一行都不得超过72个字符（或100个字符）。这是为了避免自动换行影响美观。

### Header （eg: other_feat: 企业用车发票管理新需求）

Header部分只有一行，包括三个字段：module(所属模块)+_+type（必需）、scope（可选）和subject（必需）。

（1）type

type用于说明 commit 的类别，只允许使用下面7个标识。

```
feat：新功能（feature）
fix：修补bug
docs：文档（documentation）
style： 格式（不影响代码运行的变动）
refactor：重构（即不是新增功能，也不是修改bug的代码变动）
test：增加测试
chore：构建过程或辅助工具的变动
```

如果type为feat和fix，则该 commit 将肯定出现在 Change log 之中。其他情况（docs、chore、style、refactor、test）由你决定，要不要放入 Change log，建议是不要。

（2）scope

scope用于说明 commit 影响的范围，比如数据层、控制层、视图层等等，视项目不同而不同。

（3）subject

subject是 commit 目的的简短描述，不超过50个字符。

以动词开头，使用第一人称现在时，比如change，而不是changed或changes
第一个字母小写
结尾不加句号（.）

### Body

Body 部分是对本次 commit 的详细描述，可以分成多行。下面是一个范例。

```
More detailed explanatory text, if necessary.  Wrap it to
about 72 characters or so.

Further paragraphs come after blank lines.

- Bullet points are okay, too
- Use a hanging indent
```

有两个注意点。

（1）使用第一人称现在时，比如使用change而不是changed或changes。

（2）应该说明代码变动的动机，以及与以前行为的对比。

### Footer

Footer 不做要求
# t3-web-general

```js
        {
            "bussinessId": 4,
            "carNo": "闽DDB5390",
            "chargingStatus": "0",
            "cityID": "350200",
            "currentLat": "24.55138412607718",
            "currentLng": "118.1085683579677",
            "deviceTime": 1642004367000,
            "direction": "314.58",
            "driverStatus": 0,
            "driverUuid": "799ada53457147ef9e60b487372ff582",
            "marked": false,
            "mobile": "18805068535",
            "onlineStatus": 0,
            "operationStatus": "2",
            "receiveTime": 1642004369021,
            "routeStatus": "0",
            "updateTime": 1642004369021,
            "vin": "LS6A2E0F5MA002660"
        },
        
                {
                    "bussinessId": 4,
                    "carNo": "闽DDB5390",
                    "chargingStatus": "0",
                    "cityID": "350200",
                    "currentLat": "24.570485050179546",
                    "currentLng": "118.03991258942972",
                    "deviceTime": 1642004367000,
                    "direction": "314.58",
                    "driverStatus": 0,
                    "driverUuid": "799ada53457147ef9e60b487372ff582",
                    "marked": false,
                    "mobile": "18805068535",
                    "onlineStatus": 0,
                    "operationStatus": "2",
                    "receiveTime": 1642004369021,
                    "routeStatus": "0",
                    "updateTime": 1642004369021,
                    "vin": "LS6A2E0F5MA002660"
                }
```

```js
        {
            "bussinessId": 6,
            "carNo": "苏A77LN1",
            "chargingStatus": "0",
            "cityID": "320100",
            "currentLat": "31.749219292534722",
            "currentLng": "117.20972981770834",
            "deviceTime": 1641625204000,
            "direction": "50.00",
            "driverStatus": 0,
            "driverUuid": "9471742f13b44ac890210d192a1dc7b9",
            "marked": false,
            "mobile": "15209829160",
            "onlineStatus": 0,
            "operationStatus": "2",
            "receiveTime": 1641625207261,
            "routeStatus": "0",
            "updateTime": 1641625207261,
            "vin": "LSJW56U62HG184744"
        }
        
                {
                    "bussinessId": 6,
                    "carNo": "苏A77LN1",
                    "chargingStatus": "0",
                    "cityID": "320100",
                    "currentLat": "31.749219292534722",
                    "currentLng": "117.20972981770834",
                    "deviceTime": 1641625204000,
                    "direction": "50.00",
                    "driverStatus": 0,
                    "driverUuid": "9471742f13b44ac890210d192a1dc7b9",
                    "marked": false,
                    "mobile": "15209829160",
                    "onlineStatus": 0,
                    "operationStatus": "2",
                    "receiveTime": 1641625207261,
                    "routeStatus": "0",
                    "updateTime": 1641625207261,
                    "vin": "LSJW56U62HG184744"
                },
        

```
