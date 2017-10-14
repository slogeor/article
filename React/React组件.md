React 组件按功能划分，可分为容器组件和展示组件。容器组件是页面容器，用来放置当前页面的所有展示型组件，容器组件更多的关注是业务；展示组件是具体到某一个小的组件模块，比如一个按钮、一个卡片等，更多的关注是层面展示。

#### 容器组件 Container Component

* 只关心它们的运作方式
* 可能同时包含子级容器型组件和展示型组件，但大都不含 DOM 标签
* 为展示型组件或其他组件提供数据和方法
* 调用 action，并且将其作为展示组件的回调函数
* 维持许多变量状态，充当一个数据源
* 通常由高阶组件生成

#### 展示组件 Presentational Component

* 只关心它们的样子
* 可能同时包含子级容器型组件和展示型组件，一般含 DOM 标签和自定义的样式
* 通常用 this.props.children 来包含其他组件
* 不依赖 app 其它组件
* 不会定义数据如何读取、如何改变
* 只通过 this.props 接受数据和回调函数
* 很少有自己的状态变量，即使有，也是 UI 的状态变量
* 一般是函数级组件，除非它们需要状态，lifecycle hooks，优化处理

#### 这样划分的好处

* 分离关注，可以更好的理解 app 和 UI
* 更易复用，同样的展示型组件可以在不同的状态、数据源中使用
* 展示组件是 app 的调色板
* 这样划分会强迫你去解析布局相关的组件，强迫使用 this.props.children，而不是在不同容器中复制 jsx

#### 小结

* 展示和容器更好的分离，更好的理解应用程序和UI
* 重用性高，展示组件可以用于多个不同的 state 数据
* 展示组件就是你的调色板，可以把他们放到单独的页面
* 迫使你分离标签，达到更高的可复用性


组件按状态划分，又可以分成无状态组件、有状态组件。有状态组件就是组件的 ES6 写法，有自己的生命周期和 this 作用域。无状态组件就是组件的 function 写法，只有 props 和 content。

#### 有状态组件

```js
import React from 'react';
import { render } from 'react-dom';

class SimpleComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: this.props.open,
        };
        this.hanleClick = this.handleClick.bind(this);
    }

    handleClick() {
        // ...
    }

    render() {
        let open = this.state.open;
        return (
            <div onClick={this.handleClick}>
                hello world
            </div>
        );
    }
}

SimpleComponent.defaultProps = {
    open: false,
}

render(
    <SimpleComponent />,
    document.getElementById('app')
)
```

* 有生命周期函数，可以在不同的生命周期处理不同的逻辑
* 有this 和自身的属性
* 支持 ref，可以很方便获取组件的引用
* 可以通过 shoulComponentUpdate 来控制是否需要 render

#### 无状态组件

一个组件没有状态，那么组件的输出方法，将完全取决于 props 和 content，只要有相同的 props 和 content，那么组件的输出绝对相同。

```js
function HelloComponent(props, /* context */) {
  return <div>Hello {props.name}</div>
}
ReactDOM.render(<HelloComponent name="Sebastian" />, mountNode)
```

* 没有 this 关键字、语法更简洁
* 占内存更小(class 有 props、content 等诸多属性)，首次 render 性能更好
* 可以写成无副作用的函数
* 可扩展性更强(函数的 component、currying 等组合方式，比 class 的 extend 更灵活)

#### 如何划分

* 一个组件只接受父组件的 props，这个组件应该设计成无状态组件；
* 一个组件的内部状态变化会触发页面 render，这个组件应该设计为有状态组件

#### 小结

* 无状态组件更简洁，只接受 props 和 content，没有生命周期函数
* 有状态组件功能更强大，可以在不同的生命周期阶段处理业务
* 建议多使用无状态组件，因为没有额外的开销


#### 总结

组件不管如何划分，都是为了复用代码，减少冗余代码，使我们的代码更简洁，维护更简单。