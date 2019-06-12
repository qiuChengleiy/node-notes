## NodeJs 进阶学习

---

### Node特性(解决web服务器高性能瓶颈问题)

* 1.单线程

相对其他服务器开发语言来说，像java、php，用户每一次请求都会为用户创建单独的线程，会增大服务器的开销，可能会造成内存严重不足，需要使用多台
服务器。 而node则是单线程，不会独立创建单独的线程，从而减少服务器硬件上的开销。node通过内部事件，当用户连接时就会触发，通过非阻塞I/O、事件驱动机制，让node宏观上来看也是"并发执行"的,一个8G的内存服务器可处理同时4万的连接，同时它也能解决服务器线程开销的时间。

缺点： 因为是单线程，当某个用户线程崩溃，那么导致了其他用户也会崩溃

* 解决: pm2(出现崩溃服务会照常运行不会造成整个服务停止)   pm2 start app.js  pm2 list  pm2 log app 

* 2.非阻塞I/O

传统服务器开发，进行I/O操作，比如数据库读写，往往会等到查询的结果，代码才会继续往下执行，这就造成了堵塞，而node则是放到回调函数中，等待返回结果
在执行回调函数，不会造成堵塞，它会对CPU的利用率更高。--------有了非阻塞并不能解决问题，还需借助事件循环机制

* 3. 事件驱动

在比如客户端建立连接、发送请求、提交数据时，都会触发相对应的事件，而在某一个时刻，只能处理一个事件的回调函数，而在处理某一个事件的回调函数时，又可以转化为其他事件，然后返回执行原有事件的回调函数，从而产生了事件循环。Node底层是用c++写的，V8也是基于c++,c++,在底层代码中，多数都是用事件队列、回调函数队列的构建。用事件队列来完成服务器的任务调度。队列也有优先级。


### Node适合干什么

因为基于node的特性，善于I/O，不善于计算，如果业务中有大批量的计算服务，实际上也相当于阻塞了这个线程，node不适合做这样的开发。
当应用程序处理大批量并发的I/O时，而在响应之前不需要大批量的计算，内部处理时，nodejs非常适合。nodejs也非常适合长连接的项目开发，非常适合
与websocket结合，开发实时交互的应用程序。比如：用户表单收集、考试系统、聊天室、图文直播、提供JSON API服务

* Node 可以挑战PHP、Java、?等传统服务器开发语言吗

答案是无法比拟的，因为很多企业追求的是可靠的服务，node是一种工具，它在处理某一块时是非常有用的。然而很多企业也都在用node处理某一块业务功能


### Node安装

推荐使用nvm（包括线上的生产环境搭建）

```sh

nvm install v8.10.0 安装 node
nvm use v8.10.0 nvm 指定使用的 node 的版本
nvm alias default v8.10.0 设置 node 默认使用版本
npm config set registry https://registry.npm.taobao.org 设置淘宝镜像
增加系统文件监控数目 echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p

```

---

* [之前写的笔记---参考](./base/README.md)

### Node模块进阶API学习

* [hello world-编写一定Node web服务](./moduleDemo/day1/hello.js)
---
* [http](./moduleDemo/day1/http.js)

* [fs](./moduleDemo/day1/fs.js)

* [module -- npm -- package](http://node.org)

* get相对来说简单些，通过url来获取

* [post](./moduleDemo/day2/post.js)

* [form 中间件- 表单域-文件上传改名](./moduleDemo/day2/form.js)

* [重拾fs](./core/fs.js)

* [buffer](./core/buffer.js)

* [stream](./core/stream.js)

* [path](./core/path.js)

* [重拾http](./core/http.js)

---
//未完待续  ^

### 框架进阶学习


























