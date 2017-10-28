### 基于类的组件

基于类的组件是有状态的，或许还包含方法。应该尽量少地使用它们。

#### 1. 导入 CSS

```
import React, {Component} from 'react'

import './styles/main.css'
```

#### 2. 初始化状态

```
import React, {Component} from 'react'

import './styles/main.css'

class Banner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }
}
```

#### 3.propTypes 和 defaultProps

propTypes 和 defaultProps 是静态属性，在组件代码中声明的优先级尽可能高。由于它们作为文档，因此它们应该对其他读取文件的开发者可见。建议，所有组件都应该有 propTypes。

```
import React, {Component} from 'react'

import './styles/main.css'

class Banner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }
}
Banner.propTypes = {
  onPress: PropTypes.func,
}

Banner.defaultProps = {
  onPress: () => {},
}
```

#### 4.方法

使用类组件，当将方法传递给子组件时，必须确保它们在调用时具有正确的 `_this_`。通常需要在 constructor 里进行绑定。还可以使用 ES6 的箭头函数自动保持正确的上下文。

```
import React, {Component} from 'react'

import './styles/main.css'

class Banner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange() {
    console.log('onChange');
  }
}
Banner.propTypes = {
  onPress: PropTypes.func,
}

Banner.defaultProps = {
  onPress: () => {},
}
```

#### 5.解构 props

具有多个 props 组件，每个 props 应该占据单独一行。

```
import React, {Component} from 'react'

import './styles/main.css'

class Banner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange() {
    console.log('onChange');
  }

  render() {
    const {
      title,
      name,
      msg,
    } = this.props;

    return (
      <div>This is a component</div>
    );
  }
}
Banner.propTypes = {
  onPress: PropTypes.func,
}

Banner.defaultProps = {
  onPress: () => {},
}
```

#### 6. 闭包

避免传递新的闭包到子组件里。

```
<input
  type="text"
  value={model.name}
  // onChange={(e) => { model.name = e.target.value }}
  // ^ Not this. Use the below:
  onChange={this.handleChange}
  placeholder="Your Name"
/>
```

如果传递闭包，每次父组件渲染时，都会创建一个新的函数并传递给 input。

### 函数组件

这些组件没有状态、方法，应该尽量多的使用它们。

* 1. propTypes
* 2. 解构 Props 和 defaultProps

### JSX 条件

JSX 里可能有许多条件渲染，建议使用 IIFE，尽量减少在 JSX 里出现各种判断。

当你只想渲染一个条件的元素，可以使用 `short-circuit` 赋值。

```
{
  isTrue &&
  <p>true!</p>
}
```
