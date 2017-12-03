### 基本要点

* 应用中所有的 `state` 都以一个对象树的形式存储在一个单一的 `store` 中
* 唯一改变 `state` 的方法就是触发 `action`，一个描述发生什么的对象
* 为了描述 `action` 如何改变 `state` 树，需要变写 `reducer`

**reducer 的形式**

一个 reducer，形式为 (state, action) => state 的纯函数，描述了 action 如何把 state 转变成下一个 state。

### 三大原则

#### 单一数据源

整个应用的 state 被储存在一棵 object tree 中，并且这个 object tree 只存在于唯一一个 store 中。

#### state 是只读的

唯一改变 state 的方法就是触发 action，action 是一个用于描述已发生事件的普通对象。

#### 使用纯函数来执行修改

为了描述 action 如何改变 state tree ，你需要编写 reducer。reducer 只是一些纯函数，它接收先前的 state 和 action，并返回新的 state。

### action

action 是把数据从应用传到 store 的有效载荷，它是 store 数据的唯一来源，一般会通过 `store.dispatch()` 将 action 传到 store。

添加 todo 任务的 action 是这样的:

```js
const ADD_TODO = 'ADD_TODO';

{
  type: ADD_TODO,
  text: 'build my frist app'
}
```

action 本质上是 JavaScript 普通对象，我们约定 action 内必须使用一个字符串类型的 `type` 字段来表示将要执行的动作。

action 对象的结构完全由自己决定，一般会包含 type、payload、error 等字段。

应该尽量减少在 action 传递数据。

#### action 创建函数

action 创建函数就是生成 action 的方法。`action` 和 `action 创建函数`是两个不同的概念，不要混淆。

在 Redux 中的 `action 创建函数`只是简单的返回一个 action。

```js
function addTodo(text) {
  return {
    type: 'ADD_TODO',
    text,
  }
}
```

Redux 需要把 `action 创建函数`的结果传给 `dispatch()` 方法才可以发起一次 dispatch 过程。

```js
dispatch(addTodo(text))
```

也可以创建一个被绑定的 action 创建函数，自动完成 dispatch。

```js
// 定义
const boundAddTodo = (text) => dispatch(addTodo(text))
// 调用
boundAddTodo(text);
```

store 里能直接通过 `store.dispatch()` 调用 `dispatch()` 方法。但大多数情况我们会使用 react-redux 提供的 `connect()` 帮助器调用。`bindActionCreators()`可以自动把多个 action 创建函数绑定到 `dispatch()` 方法上。

### reducer

action 只是描述了有事情发生这一事实，并没有指明应用如何更新 state。而这正是 reducer 要做的事情。

#### 设计 state 结构

开发复杂应用时，不可避免会有一些数据相互引用，建议尽可能把 state 范式化，不存在嵌套。

#### action 处理

reducer 是一个纯函数，接受旧的 state 和 action，返回新的 state

```js
(previousState, action) => newState
```

现在可以编写 reducer 来处理 action

```js
function todoApp(state = initialState, action) {
  // 这里暂不处理任何 action，
  // 仅返回传入的 state。
  return state
}
```

#### 拆分 reducer

可以开发一个函数来做为主 reducer，它调用多个子 reducer 分别处理 state 中的一部分数据。然后再将这些数据合成一个大的单一对象。

```js
function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ]
    case TOGGLE_TODO:
      return state.map((todo, index) => {
        if (index === action.index) {
          return Object.assign({}, todo, {
            completed: !todo.completed
          })
        }
        return todo
      })
    default:
      return state
  }
}

function visibilityFilter(state = SHOW_ALL, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.filter
    default:
      return state
  }
}

function todoApp(state = {}, action) {
  return {
    visibilityFilter: visibilityFilter(state.visibilityFilter, action),
    todos: todos(state.todos, action)
  }
}
```

每个 reducer 只负责管理全局 state 中它负责的一部分。每个 reducer 的 state 参数都不同，分别对应它管理的那部分 state 数据。

Redux 提供了 `combineReducers()` 工具类来做上面 todoApp 做的事情。

利用  `combineReducers()` 可以重构 `todoApp `

```js
import { combineReducers } from 'redux';

const todoApp = combineReducers({
  visibilityFilter,
  todos
})

export default todoApp;
```

`combineReducers()` 所做的只是生成一个函数，这个函数来调用你的一系列 reducer，每个 reducer 根据它们的 key 来筛选出 state 中的一部分数据并处理，然后这个生成的函数再将所有 reducer 的结果合并成一个大的对象。没有任何魔法。

### store

* 维持应用的 state
* 提供 `getState()` 方法获取 state
* 提供 `dispatch(action)` 方法更新 state
* 通过 `subscribe(listener)` 注册监听器
* 通过 `subscribe(listener)` 返回的函数注销监听器

Redux 应用只有一个单一的 store，当需要拆分数据时，应该使用 reducer 组合，而不是创建多个 store。

```js
import { createStore } from 'redux'
import todoApp from './reducers'
let store = createStore(todoApp)
```

`createStore()` 的第二个参数是可选的，用于设置 state 的初始状态。

#### 发起 action

```js
store.dispatch(addTodo('Learn about actions'))
```
