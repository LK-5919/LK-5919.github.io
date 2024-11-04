# AJAX学习

首先明确，ajax（Asynchronous Javascript And XML）是一种提供页面无刷新获取数据的方法，是一种思想，但也存在以下几个缺点：

- 请求没有历史记录，不可回退；
- 存在跨域问题；
- 不利于SEO；

在这里，先使用JS原生的内置对象`XMLHttpRequest`来实现发送一个ajax请求；

## XMLHttpRequest

### 发送简单GET请求

首先新建一个html页面，在页面中使用JS脚本进行ajax请求的发送；

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8" />
		<title>1_ajax小试牛刀</title>
		<style>
			#content{
				width: 300px;
				height: 100px;
				border: 1px solid black;
				margin-top: 10px;
			}
		</style>
	</head>
	<body>
		<h3>该页面是测试：ajax小试牛刀</h3>
		<button id="btn">点我发送请求(原生js-ajax-get)</button>
		<div id="content"></div>
		<script type="text/javascript" >
			//获取按钮
			const btn = document.getElementById('btn')
			const content = document.getElementById('content')
			//给按钮绑定监听
			btn.onclick = ()=>{
				//1.创建xhr实例对象
				const xhr = new XMLHttpRequest()
				//xhr内部有5种状态，值分别为：0、1、2、3、4
				xhr.onreadystatechange = ()=>{
					if(xhr.readyState === 4){
						console.log(xhr.response);
						content.innerHTML = `<h3>${xhr.response}</h3>`
					}
				}
				//2.指定发送请求的：method、url
				xhr.open('GET','http://127.0.0.1:8080/test_get')
				//3.发送请求
				xhr.send()
			}
		</script>
	</body>
</html>
```

之后使用nodejs编写一个简单的响应服务器

```js
//引入express
const express = require('express')

//暴露静态资源
app.use(express.static(__dirname+'/src'))

//响应GET请求--可以接收query参数
app.get('/test_get',(request,response)=>{
	console.log('有人请求test_get了');
	response.send('hello_test_get')
})

//监听端口
app.listen(8080,(err)=>{
	if(!err) {
		console.log('测试ajax请求的服务器开启成功了！测试地址如下');
	}
})
```

在以上代码中，若是直接使用vscode的live插件启动页面。页面默认会在5500端口运行，此时，向服务器请求（8080端口），将会产生跨域，在这里使用`express`暴露静态资源（暴露的路径按项目目录结构决定）；

![image-20220815235558359](https://lk-blog-1304200811.cos.ap-guangzhou.myqcloud.com/img/image-20220815235558359.png)

在本案例中，serve.js即为服务端，src中存放网页；

启动本地服务端，并通过8080端口访问网页，点击页面按钮发送请求

![image-20220816000011877](https://lk-blog-1304200811.cos.ap-guangzhou.myqcloud.com/img/image-20220816000011877.png)

即实现了通过XMLHttpRequest发送一个简单的GET请求，在这里简要说明一下XMLHttpRequest对象的使用；

1. 首先创建XHR对象实例`const xhr = new XMLHttpRequest()`；
2. 设置XHR实例对象的发送方法`method`和请求地址`url`，`xhr.open('GET','localhost:8080/test_get')`；
3. 监听XHR实例对象的`readyState`，其中`readyState`共有四种状态，当XHR实例对象被创建成功时，其值为0，当成功结束到服务端响应的数据时，其值为4；监听方法`xhr.onreadystatechange = () => {}`,此方法每当XHR实例对象的`readyState`值发送变化时就会被调用一次；
4. 发送请求，`xhr.send()`;

### XMLHttpRequest的五种状态说明

首先明确XMLHttpRequest'的实例对象`xhr`有5种`readyState`状态，为0，1，2，3，4，各种状态说明如下：

* 0 ：当xhr实例对象被创建成功时就处于此状态；
* 1：当xhr实例对象调用了open方法，但还没调用send方法时，此时为1状态，可以在此设置请求头；
* 2：当xhr实例对象已经调用了send方法后，此时处于2状态，此时不能再修改请求头；
* 3：当接受到响应头和一部分小数据时，大数据有待进一步接受时处于3状态；
* 4：当数据全部结束完毕的时候，处于4状态；

可以通过设置xhr的状态监听函数来对各个状态发送改变时进行业务处理：

```js
xhr.onreadystatechange = () => {
    if(xhr.readyState === 1){
						xhr.setRequestHeader('demo',123) //配置请求头
					} 
	if(xhr.readyState === 2){
						//xhr.setRequestHeader('demo',123) //配置请求头--报错
					} 
	if(xhr.readyState === 3){
						console.log('3时接收到的数据',xhr.response);
						console.log('3时接收到的响应头',xhr.getAllResponseHeaders());
					}
	if(xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)){
						console.log(xhr.response);
					}
}
```

### GET请求携带参数

首先明确get请求可以携带Query参数和Params参数，形式说明如下：

* Query参数：形如`key1=value1&key2=value2`，为urlencoded编码形式；
* Params参数：形如`/value1/value2`，直接拼接在请求的url路径后面；

下面通过代码演示get请求携带这两种参数：

```js
xhr.open('GET','http://127.0.0.1:8080/test_get?name=老刘&age=18'); //携带query参数
xhr.open('GET','http://127.0.0.1:8080/test_get2/老刘/18');  //携带params参数

//在使用nodejs编写的服务端中，通过以下的方法获取get请求携带的两个参数

//响应GET请求--可以接收query参数
app.get('/test_get',(request,response)=>{
	console.log('有人请求test_get了--携带的query参数是：',request.query);
	response.send('hello_test_get')
})

//响应GET请求--可以接收params参数
app.get('/test_get2/:name/:age',(request,response)=>{
	console.log('有人请求test_get2了--携带的params参数是：',request.params);
	response.send('hello_test_get2')
})
```

需要注意的时，后端接受params参数时需要使用占位符`:key`;

### 发送POST请求

首先明确get请求和post请求主要区别：

* xhr调用open方法时，method值为`POST`；
* POST请求除了可以携带query参数和params参数外，还可以携带请求体参数body；

post请求携带query，params参数与get请求一致，在此只演示POST请求携带请求体参数，需要注意的是，请求体参数有两种编码方式，需要在发送前通过设置请求头来告知服务端参数的编码类型，分别为：

* urlencoded形式；

```js
//指定发送请求的：method、url、参数
xhr.open('POST','http://127.0.0.1:8080/test_post');
//指定发送的请求体编码格式为urlencoded格式
xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
//发送请求，并携带请求体参数
xhr.send('name=老刘&age=18'); //携带urlencoded编码形式的请求体参数

//后端在使用nodejs编写的服务端中，需要使用中间件来解析post请求体参数
//使用中间件解析urlencoded编码形式的请求体参数
app.use(express.urlencoded({extended:true}))
//响应POST请求--可以接收请求体参数
app.post('/test_post',(request,response)=>{
	console.log('有人请求test_post了--携带的请求体参数是',request.body);
	response.send('hello_test_post')
})
```

* json格式；

```js
//指定发送请求的：method、url、参数
xhr.open('POST','http://127.0.0.1:8080/test_post');
//指定发送的请求体编码格式为urlencoded格式
xhr.setRequestHeader('Content-type','application/json');
//发送请求，并携带请求体参数
const person = { name: '老刘', age: 18}
xhr.send(JSON.stringify(person)); //携带json编码形式的请求体参数

//后端在使用nodejs编写的服务端中，需要使用中间件来解析post请求体参数
//使用中间件解析json编码形式的请求体参数
app.use(express.json())
//响应POST请求--可以接收请求体参数
app.post('/test_post',(request,response)=>{
	console.log('有人请求test_post了--携带的请求体参数是',request.body);
	response.send('hello_test_post')
})
```

### XHR指定数据返回类型

在接受服务端返回的数据是，可以通过调用xhr实例对象身上的`responseType`指定数据返回的数据类型，以常用的JSON数据格式为例，在调用send()方法之前，如下指定：

```js
xhr.responseType = 'json';
```

这样，当服务端返回json格式的数据时，将会被自动解析；

### XHR指定请求超时和处理请求异常

当请求发出去后，若服务端长时间未响应数据时，我们可以对超时进行业务处理，代码如下：

```js
//超时时间
xhr.timeout = 2000;
//超时的回调
xhr.ontimeout = ()=>{
		alert('网速不给力，请切换网络重试');
		}
```

当请求出现问题是，xhr实例对象也可以设置相应的回调进行处理

``` js
xhr.onError = () => {
    console.log("请求配置出错！");
}
```

### XHR取消请求

当发送了请求但是服务端又长时间未进行响应，且此时没有达到响应超时时间时，我们可以调用xhr身上的回调取消本次请求；

```js
//取消请求
xhr.abort();
```

值得注意的是，当发送完请求后立即调用取消请求的操作时，服务端时收不到请求的，但是频繁的请求取消会造成有漏网之鱼，此时将会有请求到达服务器，但是因为客户端取消了请求，所以即使服务端做出响应，客户端也不会接受数据；

### 简单封装一个可避免重复请求的Ajax

代码如下：

```js
//声明xhr实例对象
let xhr;
//声明一个状态用于表示当前是否有xhr实例对象存在
let isLoding;

//给按钮绑定点击事件
btn.onclick = () => {
    //如果当前有xhr实例对象存在，取消上此的请求
    if(isLoading){
        xhr.abort();
    }
    xhr = new XMLHttpRequest();
    xhr.open('GET','http:127.0.0.1:8080/test');
    xhr.onreadystatechange = () => {
        if(xhr.readyState === 1){
           //追加响应头用于标识携带请求体参数的编码形式--urlencoded
		  xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
        }
        if(xhr.readyState === 4 ){
            if(xhr.status >= 200 && xhr.status < 300){
                console.log(xhr.response);
            }
		}
    }
    xhr.responseType = 'json';
    xhr.send();
    //发送完请求后
    isLoading = true;
}
```

## 使用jQuery发现Ajax请求

jQuery对JS的原生对象XHRHttpRequest进行了封装，使发送ajax请求变得简单，在此对使用jQuery发送GET请求和POST请求做出说明和简单使用；

### 发送GET请求

完整版代码

```js
//使用jQuery发送ajax-get（完整版）
				$.ajax({
					url:'http://127.0.0.1:8080/test_jquery_get', //请求地址
					method:'GET',//请求方式（默认值是GET）
					data:{school:'atguigu'},//携带的数据
					dataType:'json',//配置响应数据格式
					timeout:2000,//指定超时的时间
					success:(result,reponseText,xhr)=>{
						console.log(result,reponseText,xhr);
					},//成功的回调
					error:(xhr)=>{console.log('请求出错了',xhr);} //失败的回调
				})
```

从上面的代码可以知道，请求成功的回调中会传入3个参数：

* result：后端响应的数据；
* reponseText：响应的提示文字，成功时为"success"；
* xhr：完整的xhr对象，可用于获取响应头之类的数据；

值得注意的时，jQuery封装的ajax方法中，当发生请求超时时也会走失败的回调，这点与原生的XHR对象需要单独配置超时回调不同；

精简版代码

```js
//使用jQuery发送ajax-get（精简版）
 $.get('http://127.0.0.1:8080/test_jquery_get',{school:'atguigu'},(data)=>{
		console.log(data);
		content.append(`<div>汽车名：${data.name}，价格：${data.price}</div>`)
	},'json')   //json为指定数据响应的格式
```

### 发送POST请求

完整版代码

```js
//使用jQuery发送ajax-post（完整版）
				$.ajax({
					url:'http://127.0.0.1:8080/test_jquery_post', //请求地址
					method:'POST',//请求方式（默认值是GET）
					data:{school:'atguigu'},//携带的数据
					dataType:'json',//配置响应数据格式
					timeout:2000,//指定超时的时间
					success:(result,reponseText,xhr)=>{
						console.log(result,reponseText,xhr);
					},//成功的回调
					error:(xhr)=>{console.log('请求出错了',xhr);} //失败的回调
				})
```

精简版代码

```js
	//使用jQuery发送ajax-post（精简版）
	$.post('http://127.0.0.1:8080/test_jquery_post',{school:'atguigu'},(data)=>{
		console.log(data);
	},'json')
```

## JSONP解决跨域

其实jsonp方法只是避开了跨域问题，并没有从根本解决跨域问题，且jsonp方法只能发送get请求，并需要后端与前端密切配合，故在真实开发环境中基本不使用；

### 原生JSONP方法

jsonp方法其实是利用script脚本的src中的get请求，因为浏览器因为script脚本中的src指向的资源是可运行的js代码，所以并不会产生跨域问题，故可以利用在script的src中向后端发送get请求，这需要前端先声明请求返回来需要执行的函数，后端返回函数执行语句和执行函数需要的参数，从而达到页面无刷新获取数据，并绕开跨域问题；

```js
//前端代码
	<body>
		<h3>当前页面一定不要用服务器去打开，因为要制造跨域问题，用jsonp去解决</h3>
		<button id="btn">点我获取数据</button>
		<script type="text/javascript" >
			const btn = document.getElementById('btn')
			btn.onclick = ()=>{
				//1.创建script节点
				const scriptNode = document.createElement('script')
				//2.给节点指定src属性(请求地址)
				scriptNode.src = 'http://localhost:8080/test_jsonp?callback=peiqi'
				//3.将节点放入页面
				document.body.appendChild(scriptNode)
				//4.准备好一个函数
			 	window.peiqi = (a)=>{
					console.log(a);
				}
				//5.移除已经使用过的script节点
				document.body.removeChild(scriptNode)
			}
		</script>

//后台服务
app.get('/test_jsonp',(request,response)=>{
	const person = [{name:'tom',age:18},{name:'老刘',age:5}]
	response.send(`${callback}(${JSON.stringify(person)})`)
})
```

因为服务端返回的需要将数据转换成json格式传输，所以此种方法称为JSONP（json with padding，每次执行都会在html中填充插入一段可执行脚本）；

值得注意的是，jsonp方法的get请求并不是通过xhr实现的；

### jQuery使用jsonp

相比于使用原生JSONP的繁琐，jQuery对其进行了封装，使用如下：

```js
	<body>
		<h3>当前页面一定不要用服务器去打开，因为要制造跨域问题，jquery封装的jsonp</h3>
		<button id="btn">点我获取数据</button>
		<script type="text/javascript" >
			const btn = $('#btn')
			btn.click(()=>{
				$.getJSON('http://localhost:8080/test_jsonp?callback=?',{},(data)=>{
					console.log(data);
				})
			})
		</script>
	</body>
```

## 后端使用CORS解决跨域

jsonp只是绕开了跨域，要想真正解决跨域，可通过后端配置cors来解决，此方法不需要前端作任何处理，只需要后端在数据响应时加上对应的响应头即可；

### 简单请求配置跨域

```js
//响应GET请求--可以接收query参数
app.get('/test_get',(request,response)=>{
	console.log('有人请求test_get了--携带的query参数是：',request.query);
    //配置允许跨域的请求源地址，一般为前端IP地址，* 通配符为允许所以网站
	response.setHeader('Access-Control-Allow-Origin','*')
    //配置请求体暴露，不配置此请求头，xhr.getAllResponseHeaders() 拿到的请求头不完整
	response.setHeader('Access-Control-Expose-Headers','*') 
	response.send('hello_test_get')
})
```

配置了以上两个响应头后，对于简单请求get和post来说是没有问题了，但是一旦发送PUT请求时，仍然会发送请求失败，这里就涉及到简单请求和复杂请求的区别了；

请求满足以下条件为简单请求，否则为复杂请求
1.请求方式是 get/post/head；
2.请求头包含字段可以有：Accept，Accept-Language，content-Language，Last-Event-ID，Content-Type，其中Content-Type的值只能是 application/x-www-form-urlencoded，text/plain，multipart/form-data。

复杂请求会多发一次请求，例：我们向 3000 服务器发送 "/getdata"的get 请求，浏览器会额外发送一个"/getdata"的options请求，这个请求我们称为预请求，服务器也会做出“预响应”，预请求实际上是一种权限请求，只有预请求成功后，实际的请求才会执行，预请求也存在跨域问题。

### 复杂请求配置跨域

复杂请求会多发送一个OPTIONS的预请求，故后端需要对预请求也做跨域配置和响应；

```js
app.options('/test_put',(request,response)=>{
	response.setHeader('Access-Control-Allow-Origin','*')
	response.setHeader('Access-Control-Expose-Headers','*')
	response.setHeader('Access-Control-Allow-Methods','*')
	response.send()
}) 

app.put('/test_put',(request,response)=>{
	response.setHeader('Access-Control-Allow-Origin','*')
	response.setHeader('Access-Control-Expose-Headers','*') 
	response.send('hello_test_put')
})
```

至此，前端发送put复杂请求时，就可正确拿到数据；

### nodejs使用cors中间件

在使用nodejs编写的后端时，使用常规的cors配置跨域时，需要对每一个请求路由的响应头都进行配置，复杂请求还需要单独多配置一个OPTIONS预请求，十分繁琐，故可以使用cors中间件来进行统一配置；

```js
//引入express
const express = require('express')
const cors = require('cors')
//创建app实例对象
const app = express()
app.use(cors())

//复杂请求不需要再单独配置跨域响应头
app.put('/test_put',(request,response)=>{
	response.send('hello_test_put')
})
```
