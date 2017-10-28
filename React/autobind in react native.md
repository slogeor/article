#### 概要

Using the `@autobind` decorator will do the equivalent of `this.fn = this.fn.bind(this)`; for a function defined on a class. Let’s see how we would go about using @autobind or any other decorator in our React Native application.

#### 配置方法

**1.安装 babel-plugin-transform-decorators-legacy**

```js
npm install --save-dev babel-plugin-transform-decorators-legacy@1.3.4
```

**2.配置 .babelrc**

```js
{
	"presets": [
		"react-native"
	],
    "plugins": ["transform-decorators-legacy"
    ]
}
```

**3. 安装 autobind-decorator**

```js
npm install --save autobind-decorator@1.3.4
```

#### 使用方法

 **1.引入autobind-decorator**
 
 ```js
 import autobind from 'autobind-decorator';
 ```
 
 **2.@autobind 替换 bind**

```js
@autobind
gotoHomeSelect() {
	RNPlus.goto('HomeSelect');
}
```

#### 说明

* babel-plugin-transform-decorators-legacy 和 autobind-decorator 版本均是 `1.3.4`
* 要配置 `.babelrc`

#### 参考链接

* [https://moduscreate.com/using-es2016-decorators-in-react-native/](https://moduscreate.com/using-es2016-decorators-in-react-native/)