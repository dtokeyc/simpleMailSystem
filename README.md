# 邮件系统信息17-1

#### 996邮箱系统介绍
参照https://wenku.baidu.com/view/92dcd8dfce2f0066f53322e3.html，完成一个邮件系统开发



#### 软件架构

本邮件收发管理系统采用 NodeJS 作为服务器，使用了 Express 作为Web应用框架，搭载了 Ejs 模板引擎，前端使用了 LayUI 框架，并引入了 JQuery 框架辅助使用。
核心的发送邮件功能采用了 nodemailer 开源模块，收邮件功能采用了 IMAP 协议和 mailparser 进行邮件解析。




#### 快速使用

**注意，使用前请先安装 NodeJS 环境**

在项目根目录下打开终端，输入以下命令启动服务

```
node server.js 
```

之后浏览器打开本地 1234 端口进入登录页面，登录账户为 admin ，密码 123

![login_demo](\public\img\login_demo.png)



#### 使用说明

1. 默认端口为 1234，如有冲突请修改 server.js 文件最后一行。

2. 实现了登录验证的部分数据库连接代码，可在 server.js 的注释中找到。

3. 本应用采用了 Session 进行登录验证，cookies 过期时间默认为 10 分钟，在登录期间可以直接访问 index 页面，非登录状态下则会进入登录页面先进行登录，index 页面右上角可手动退出登录。

4. 邮件的发送和接收使用了本人注册的测试邮箱，可在 sendMail.js 和 receiveMail.js 中进行修改，修改时只需要修改用户名和授权码即可。

5. 发送邮箱可能提示“发送成功！”但后台出现超时错误（Greeting never received with email ） 的情况，这是由于发送邮件的开源模块本身连接的问题，遇到此问题时请重新启动 server.js。

6. 接收邮件刷新操作为点击收件箱，由于 NodeJS 异步操作的原因，有时需要再点击一次才能正确刷新，同时不建议连续快速多次点击收件箱，否则异步的写文件请求可能导致缓存的 mails.json 出错导致应用崩溃。

7. 当出现 json 文件异常时，可尝试进行还原，请用以下内容覆盖源文件。

   ```json
   {
       "data": [
   
       ],
       "context": [
   
       ],
       "total": 0,
       "total2": 0
   }
   ```

   

#### 参考资料

1.  [Node.js使用Nodemailer发送邮件](https://segmentfault.com/a/1190000012251328)
2.  https://www.layui.com/doc/
3.  [nodejs框架express准备登录](https://www.cnblogs.com/jasonnode/p/4487510.html)
4.  [Express + Session 实现登录验证](https://www.cnblogs.com/mingjiatang/p/7495321.html)
5.  http://expressjs.com/en/api.html#app.settings.table
6.  [ejs模板的书写](https://www.jianshu.com/p/67dda091fc68)
7.  [利用nodejs对本地json文件进行增删改查](https://blog.csdn.net/zhaoxiang66/article/details/79894209)
8.  [收邮件NO Select Unsafe Login. Please contact kefu解决办法](https://blog.csdn.net/shanghaojiabohetang/article/details/74486196)
9.  [Node.js接收电子邮件](https://www.jianshu.com/p/6163113fae4f)
10.  [nodeJs之express框架学习笔记](https://www.jianshu.com/p/94360745c4ae)
11.  [MAILPARSER参数配置](https://nodemailer.com/extras/mailparser/)
