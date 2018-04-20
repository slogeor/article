### Redux






Redux 工作原理

![img](http://upload-images.jianshu.io/upload_images/1234637-4c60ce39ecad2a42.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/700)

redux 流程的逻辑非常清晰，数据流是单向循环的，就像一个生产的流水线： store（存放状态） -> container（显示状态） -> reducer （处理动作）-> store

三个基本概念

* store 是应用的状态管理中心，保存着是应用的状态（state），当收到状态的更新时，会触发视觉组件进行更新。
* container 是视觉组件的容器，负责把传入的状态变量渲染成视觉组件，在浏览器显示出来。
* reducer 是动作(action)的处理中心， 负责处理各种动作并产生新的状态（state），返回给store。

一个形象的比喻：把 js 比喻成巴士，把 store, container, reducer 比喻为三个车站，再把 state 和 action 比喻成两种乘客。这是一趟环路巴士：js巴士 从 store车站 出发，载上 state乘客 ， state乘客 到达某个 container车站 下车并把自己展示出来，过了一会，有一个 action乘客 上车了，js巴士 把action乘客 送到 reducer车站，在这里 action乘客 和 state乘客 生了一个孩子 new state, js巴士把 new state 送回了 store车站。（好像是人生轮回→_→）