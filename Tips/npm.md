### npm ERR Darwing 14.5.0

#### 错误重现

* npm 模块配置和正确
* npm publish <foldname>
* 报 npm ERR！Darwing 14.5.0
* 错误截图

![img](https://github.com/slogeor/images/blob/master/question/2016/node.package.jpg?raw=true)

#### 错误分析

* package.json 没有配置 repository 信息
* 需要提供github地址即可

#### 解决方案

* 需要提供一个唯一的package name
* 配置正确的[package.json](https://github.com/slogeor/node-package-slogeor/blob/master/package.json)
