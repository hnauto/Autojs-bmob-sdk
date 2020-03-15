# autojs-bmob-sdk

### SDK介绍

本SDK通过bmob restful API支持autojs数据库读写操作。



## 安装使用

### **在Autojs中使用
复制代码到main.js或下载autojs-bmob-sdk.js

然后在项目中引入
```
var Bmob = require('../autojs-bmob-sdk.js');
```
### Demo 示例代码
```javascript
log(bmob.timestamp()); //时间戳
log(bmob.userCreate("test1","123456")); //添加用户
log(bmob.userLogin("test1","123456")); //用户登录
log(bmob.requestSmsCode("13939999999")); //获取手机验证码
log(bmob.userMobileCreate("13939999999","000000")); //注册手机用户
log(bmob.userMobileLogin("13939999999","000000")); //手机用户登录
log(bmob.userQuery("test1")); //查询用户
log(bmob.userCurrent('c470e3740d')); //当前用户 objectId
log(bmob.userUpdate("c470e3740d",'43c59ec540879cee8051110483f9dfb8',{"mobilePhoneNumber":"13939999999"}));
log(bmob.userSession("c470e3740d")); //用户seesion token
log(bmob.userDelete("c470e3740d",'43c59ec540879cee8051110483f9dfb8'));//删除用户
log(bmob.userList()); //用户列表
log(bmob.userPasswordReset("email",{"email":"test@autojs.xyz"})); //密码重置邮箱方式
log(bmob.userPasswordReset("sms",{"password":"123456"},smsCode)); //密码重置短信方式
log(bmob.userPasswordReset("oldNew",{"oldPassword": "654321","newPassword": "123456"},'f8b98e11ac','132efc77400780b380f33e94651652d7')); //更改密码
log(bmob.userEmailVerify("test@autojs.xyz"));

log(bmob.createObject("ClassName",{"category":"category","value":"value"})); //添加数据
log(bmob.createObjects("ClassName", [{"category": "category","value": "value1"},{"category": "category","value": "value2"}])); //批量添加数据
log(bmob.getObjects("ClassName")); //查询表数据
log(bmob.getObject("ClassName",'cd7bc2eefa')); //查询指定objectId数据
log(bmob.queryObject("ClassName",{"category": "category","value": "value1"})); 条件查询数据
log(bmob.updateObject("ClassName",'cd7bc2eefa',{"category": 'category2',"value": 'value11'})) 更新数据
log(bmob.deleteObject("ClassName",'cd7bc2eefa')); //删除指定objectId数据
log(bmob.BQL("select * from ClassName limit 0,100 order by category")) //BQL查询

```
### 相关知识点
1. autojs https://github.com/hyb1996/Auto.js
2. Bmob http://doc.bmob.cn/data/restful/index.html



### 感谢

---

1. autojs作者 大屌萌妹
2. 家 QQ:203118908

> 在此欢迎大家贡献代码