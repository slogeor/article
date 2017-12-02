### 执行 webpack-dev-server，报 Error: listen EADDRNOTAVAIL 172.18.225.82:3010

#### 问题重现

```
Error: listen EADDRNOTAVAIL 172.18.225.82:3010
    at Object.exports._errnoException (util.js:870:11)
    at exports._exceptionWithHostPort (util.js:893:20)
    at Server._listen2 (net.js:1221:19)
    at listen (net.js:1270:10)
    at net.js:1379:9
    at GetAddrInfoReqWrap.asyncCallback [as callback] (dns.js:64:16)
    at GetAddrInfoReqWrap.onlookup [as oncomplete] (dns.js:83:10)
```
不仅仅局限于执行 webpack-dev-server，其它本地服务也有可能

#### 分析原因

- 端口被占用
- 本地 hosts 没有配置 127.0.0.1 localhost

#### 解决方法

- webpack-dev-server –port 9090 –inline –hot
- 在 /etc/hosts 添加 127.0.0.1 localhost
