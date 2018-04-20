#### call、 apply

在 JavaScript 中，call 和 apply 都是为了改变某个函数运行时的上下文（context）而存在的，换句话说，就是为了改变函数体内部 this 的指向。

```js
function Person() {}

Person.prototype = {
  name: "slogeor",
  say: function() {
    console.log("My name is " + this.name);
  }
}

var p1 = new Person();
p1.say(); //My name is slogeor
```

如果我们有一个对象 `p2 = {name: "Tom"}`，又不想对它重新定义 `say()` 方法，我们可以通过 call、apply 用 p1 的 say() 方法

```js
p1.say.call(p2);  //My name is Tom
p1.say.apply(p2); //My name is Tom
```

call 和apply 是为了动态改变 this 而出现的，当一个 object 没有某个方法，但其他对象有的话，可以借助 call、apply 用其它对象的方法来操作。

call 需要把参数按顺序传递进去，而 apply 则是把参数放在数组里

```js
Array.prototype.slice.call(arguments) 将伪数组转化为标准数组
Object.prototype.toString.call(obj) 判断参数的类型
```

#### bind

`bind()` 方法会创建一个新函数，称为绑定函数。当调用这个绑定函数时，绑定函数会以创建它时传入 `bind()` 方法的第一个参数作为 this，传入 `bind()` 方法的第二个以及以后的参数加上绑定函数运行时本身的参数按照顺序作为原函数的参数来调用原函数。

```js
var foo = {
  num : 1,
  event: function(){
    var _this = this;
    $(".class").on("click",function(event) {
        console.log(_this.num);     //1
    });
  }
}


var foo = {
  num : 1,
  event: function(){
    $(".class").on("click",function(event) {
        console.log(this.num);      //1
    }.bind(this));
  }
}

var bar = function() {
  console.log(this.x);
}

var foo = { x:3 };

bar(); // undefined

var func = bar.bind(foo);
func(); // 3
```

bind 只有第一次才有效，后续的 bind 是无效的。

#### apply、call、bind 区别

- apply、call、bind 都可以改变函数 this 指向
- apply、call、bind 第一个参数都是this要指向的对象，也就是想要指定的上下文
- apply、call、bind 三者都可以利用后续参数传参
- bind 是返回对应函数，便于稍后调用；apply、call 则是立即调用

#### curry

```js
// es5
function currying(fn) {
  const slice = Array.prototype.slice;
  const oldArg = slice.call(arguments, 1);
  return function() {
    const newArg = slice.call(arguments);
    const arg = oldArg.concat(newArg);
    fn.apply(null, arg);
  };
}

// es6
function currying(fn, ...arg1) {
  return function(...arg2) {
    const arg = arg1.concat(arg2);
    fn.apply(null, arg);
  };
}

//调用
currying(add,6)(7); //13
```
