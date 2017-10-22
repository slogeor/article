#### 问题1 Print: Entry, ":CFBundleIdentifier", Does Not Exist

具体描述

```js
** BUILD FAILED **


The following build commands failed:

	CompileC /Users/xiao.geng/job/github/person/rnlearn/ios/build/Build/Intermediates/React.build/Debug-iphonesimulator/third-party.build/Objects-normal/x86_64/StringBase.o /Users/xiao.geng/job/github/person/rnlearn/node_modules/react-native/third-party/folly-2016.09.26.00/folly/StringBase.cpp normal x86_64 c++ com.apple.compilers.llvm.clang.1_0.compiler
(1 failure)

Installing build/Build/Products/Debug-iphonesimulator/rnlearn.app
No devices are booted.
Print: Entry, ":CFBundleIdentifier", Does Not Exist

Command failed: /usr/libexec/PlistBuddy -c Print:CFBundleIdentifier build/Build/Products/Debug-iphonesimulator/rnlearn.app/Info.plist
Print: Entry, ":CFBundleIdentifier", Does Not Exist
```
因为 react 与 react-native 版本不匹配，需要修改 package.json 文件，具体如下。

```js
"react": "16.0.0-alpha.6",
"react-native": "0.44.3"
```

执行 `rm -rf node-modules` 删除node-modules文件夹

执行`npm install` 重新安装依赖
