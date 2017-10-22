#### Stateless functional components (SFC)

SFC 是 React Component 的一种简写方法：

```js
function HelloMsg(props) {
	return <div> Hello {props.name}</div>;
}
```

*This simpleified component API is intended for components that are pure functions of their props*

这一写法适用于那些本身是 props 的纯函数的 component

- stateless: 没有 state，只有 props
- functional: 以函数的形式实现，接受参数 props，返回结果和普通 Component 的 render 方法相同
- component: 可以像一个普通的 React Component 那么被使用

**注意**

SFC 没有普通 Component 的生命周期方法，不能通过 ref 获取实例，也不是 Component 的实例。

**为何要推荐使用**

* 语法简洁
* 易维护、易测试
* 没有this及其他变量，节省内存空间

#### PureRender

PureRender 即 render 是 pure 的。

pure 是 it renders this same result given this same props and state

props 和 state 不变，则 render 结果就不会变化。

在 props 和 state 不变的情况下，如何保证不重新 render。可以通过重写 shouldComponentUpdate 来避免不必要的 render。

#### 对比

* SFC 的 props 没有变化，函数本身也会重新 render，SFC 没有生命周期方法，不能通过 shouldComponentUpdate 进行优化。

* Pure Render 可以通过重写 shouldComponentUpdate 方法，避免不必要的 render
* SFC 没有生命周期函数，Pure Render 有完整的生命周期函数
* SFC 占用内存空间比 Pure Render 小

#### SFC VS PureRender

* SFC 的性能优化是计划中，只是还没有做
* Pure Render 这样的优化一般对含有 state 的 Componet 作用尤其明显
* 虽然 SFC 不能通过像 ES6 class Component 复写 shouldComponetUpdate 实现性能优化，但可以通过 HOC，来实现

#### 普通的 componet VS PureRender component

**普通的 Component**

* props 没有变化 -> render
* props 变化了 -> render

**PureRender component**

* props 变化了 -> props 遍历及比较 + render
* props 没有变化 -> props 遍历及比较

在 props 变化的情况下，做 PureRender Component 会有额外的开销，其收益来自于 props 不变的情况。