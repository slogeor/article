### HTML 存储

#### cookie

优点

* 方便使用: 客户端和服务器端都可以设置 cookie
* 兼容性相对比较好

缺点

* 数据量有限: 大小限制在 4k 左右，不适合存储业务数据
* 增加网络流量: cookie 会跟随 HTTP 请求一起发送
* 不安全

cookie 的扩展

cookie 是存储在客户端，每个 cookie 都以名/值对的形式，即 name=value，可以通过 `document.cookie` 获取，可以给 `document.cookie` 赋值，写入 cookie。

cookie 是不能跨域的，domain 和 path  决定 cookie 可以被哪些页面共享。

expries 和 max-age 是用来决定cookie的生命周期的

#### localstorage

localstorage 可以说是对 cookie 的优化，可以方便在客户端存储数据，并不会随着 HTTP 传输

* localstorage 大小限制在 500 万字符左右，各个浏览器不一致
* localstorage 在隐私模式下不可读取
* localstorage 本质是在读写文件（字符串形式），数据多的话会比较卡
* localstorage 不能被爬虫爬取，不要用它完全取代 URL 传参

##### 1. sessionStorage

session是即会话，在这里的 session 是指用户浏览某个网站时，从进入网站到关闭网站这个时间段，session 对象的有效期就这么长。

##### 2. localStorage

将数据保存在客户端硬件设备上，下次打开计算机时候数据还在

两者区别就是一个作为临时保存，一个长期保存

主要方法

- getItem:  获取数据
- setItem:  设置数据
- removeItem: 删除某一项
- clear:  清空

### HTML5 的文档类型
