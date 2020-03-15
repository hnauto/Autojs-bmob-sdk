/*
 * @Author: autojs.xyz
 * @version 2.2.2
 * @blog: blog.csdn.net/vip
 * @github: github.com/hnauto/autojs-bmob-sdk
 * @Last Modified time: 2020-03-15 18:09:00
 * @Description: Bmob数据库autojs SDK 
 * @Memo: 部分代码参考原作者 家 QQ:203118908
 */

//参见http://doc.bmob.cn/data/restful/
const APPID = 'df18b9ddc4bcc1017db9fcd026de4c64';// APPID
const REST_ID = '04d01a1ee2112155e6a5e2072e2e301d'; //REST ID

/*------------bmob数据库的增删改查*------------*/ 
const Bmob = (function () {
    function Bmob(url, appId, restKey) {
        this.baseUrl = url;
        this.appId = appId;
        this.restKey = restKey;
    }
    Bmob.prototype.makeRequest = function (method, url, json, sessionToken, callback) {
        url = this.baseUrl + url;
        var options = {};
        options.contentType = "application/json";
        options.method = method;
        if (json) {
            options.body = JSON.stringify(json);
        }
        sessionToken = sessionToken || "";
        options.headers = {
            "X-Bmob-Application-Id": this.appId,
            "X-Bmob-REST-API-Key": this.restKey,
            "Content-Type": "application/json",
            // 加入X-Bmob-Session-Token
            "X-Bmob-Session-Token": sessionToken
        }
        return http.request(url, options, callback);
    }
    //获取服务器时间
    Bmob.prototype.timestamp = function () {
        return this.makeRequest("GET", "/timestamp", null).body.json();
    }
    /*------------------------用户表------------------------------*/
    //添加用户
    Bmob.prototype.userCreate = function (username,password,email,phone,info) {
        let user = {"username": username,"password": password,
            // "email": email, 
            // "mobilePhoneNumber": phone,
            // "info": info
        }
        return this.makeRequest("POST", "/users/", user).body.json();
    }
    //添加手机用户
    Bmob.prototype.userMobileCreate = function (phoneNum,smsCode) {
        let user = {"mobilePhoneNumber":phoneNum,"smsCode":smsCode}
        return this.makeRequest("POST", "/users/", user).body.json();
    }
    //用户登录
    Bmob.prototype.userLogin = function (username,password) {
        let url = encodeURI(util.format('/login?username=%s&password=%s', username, password));
        return this.makeRequest("GET", url, null).body.json();
    }
    //手机用户登录
    Bmob.prototype.userMobileLogin = function (phoneNum,smsCode) {
        let url = encodeURI(util.format('/login?username=%s&password=%s', phoneNum,smsCode));
        return this.makeRequest("GET", url, null).body.json();
    }
    //用户查询
    Bmob.prototype.userQuery = function (username) {
        let url = encodeURI(util.format('/users?where={"username":"%s"}', username));
        return this.makeRequest("GET", url, null).body.json();
    }
    //当前用户
    Bmob.prototype.userCurrent = function (objectId) {
        return this.makeRequest("GET", "/users/"+objectId, null).body.json();
    }
    //检查session token是否过期 ?在哪些情况下{ msg: 'ok' }现验证为{ msg: 'fail' }
    Bmob.prototype.userSession = function (objectId) {
        return this.makeRequest("GET", "/checkSession/"+objectId, null).body.json();
    }   
    //更新用户
    Bmob.prototype.userUpdate= function (objectId, sessionToken, data) {
        return this.makeRequest("PUT", "/users/"+objectId, data, sessionToken).body.json();
    }
    //删除用户
    Bmob.prototype.userDelete = function (objectId, sessionToken) {
        return this.makeRequest("DELETE", "/users/"+objectId, null, sessionToken).body.json();
    }
    //用户列表
    Bmob.prototype.userList = function () {
        return this.makeRequest("GET", "/users/", null).body.json();
    }
    //密码重置
    Bmob.prototype.userPasswordReset = function (type, data ,data2 ,sessionToken) {
        /*data格式*email {"email":emailAdress} sms {"password": "new password"} oldNew {"oldPassword": "用户的老密码","newPassword": "用户的新密码"} */
        var  url = ""; var data = data || ""; var data2 = data2 || ""; var method = "PUT"; var sessionToken = sessionToken|| "";
        switch (type) {
            case "email":
                method = "POST";
                url = "/requestPasswordReset";  
                break;
            case "sms":               
                url = "/resetPasswordBySmsCode/"+data2; //smsCode
                break;
            case "oldNew":
                url = "/updateUserPassword/"+data2; //objectId
                break;
            default:
                break;
        }
        return this.makeRequest(method, url, data, sessionToken).body.json();
    }
    //Email验证
    Bmob.prototype.userEmailVerify = function (email) {
        let data = {"email":email};
        return this.makeRequest("POST", "/requestEmailVerify/", data, null).body.json();
    }   
    //获取手机验证码
    Bmob.prototype.requestSmsCode = function (phoneNum,template) {
        let data = {"mobilePhoneNumber": phoneNum,"template": templateName||""}
        /*data = {"mobilePhoneNumber": phoneNum,"template": templateName} */

        return this.makeRequest("POST", "/requestSmsCode/", data).body.json();
    }
    /*------------------------第三方帐号用户账户连接----------------*/
    //后续增加

    /*------------------------数据表------------------------------*/
    // 添加数据
    Bmob.prototype.createObject = function (className, data) {
        return this.makeRequest("POST", "/classes/" + className, data).body.json();
    }
    //批量增加数据
    // https://api2.bmob.cn/1/batch/1/classes/TableName
    Bmob.prototype.createObjects = function (className, items) {
        //数据样例 className 为表名 items = [{"category": "类别","word": "value1"},{"category": "类别","word": "value2"}]
        let data = {"requests": []};
        items.forEach(item=> {
            let tmp = {
                "method": "POST",
                "path": "/1/classes/" + className,
                "body": item,
            };
            data.requests.push(tmp);           
        });
        return this.makeRequest("POST", "/batch/", data).body.json();
    }
    // 查询表数据
    Bmob.prototype.getObjects = function (className) {
        return this.makeRequest("GET", "/classes/" + className).body.json();
    }
    // 查询ID数据
    Bmob.prototype.getObject = function (className, id) {
        return this.makeRequest("GET", "/classes/" + className + "/" + id).body.json();
    }
    //条件查询
    Bmob.prototype.queryObject = function (className, data) {
        let url = encodeURI(util.format('/classes/%s/?where=%j', className, data));
        return this.makeRequest("GET", url, null).body.json();
    }
    // 更新数据
    Bmob.prototype.updateObject = function (className, objectId, data) {
        return this.makeRequest("PUT", "/classes/" + className + "/" + objectId, data).body.json();
    }
    // 删除数据
    Bmob.prototype.deleteObject = function (className, data) {
        var id = typeof (data) == "string" ? data : data.objectId;
        return this.makeRequest("DELETE", "/classes/" + className + "/" + id).body.json();
    }
    //BQL查询
    Bmob.prototype.BQL = function (bql) {
        let url = encodeURI(util.format('/cloudQuery?bql=%s', bql));
        return this.makeRequest("GET", url).body.json();
    }

    return Bmob;
})();

if (!APPID || !REST_ID) {
    alert("需要注册Bmob并填入app id和rest id");
    app.openUrl("http://doc.bmob.cn/data/restful/");
    exit();
}

var bmob = new Bmob("https://api2.bmob.cn/1", APPID, REST_ID);

// log(bmob.timestamp()); //时间戳
// log(bmob.userCreate("test1","123456")); //添加用户
// log(bmob.userLogin("test1","123456")); //用户登录
// log(bmob.requestSmsCode("13939999999")); //获取手机验证码
// log(bmob.userMobileCreate("13939999999","000000")); //注册手机用户
// log(bmob.userMobileLogin("13939999999","000000")); //手机用户登录
// log(bmob.userQuery("test1")); //查询用户
// log(bmob.userCurrent('c470e3740d')); //当前用户 objectId
// log(bmob.userUpdate("c470e3740d",'43c59ec540879cee8051110483f9dfb8',{"mobilePhoneNumber":"13939999999"}));
// log(bmob.userSession("c470e3740d")); //用户seesion token
// log(bmob.userDelete("c470e3740d",'43c59ec540879cee8051110483f9dfb8'));//删除用户
// log(bmob.userList()); //用户列表
// log(bmob.userPasswordReset("email",{"email":"test@autojs.xyz"})); //密码重置邮箱方式
// log(bmob.userPasswordReset("sms",{"password":"123456"},smsCode)); //密码重置短信方式
// log(bmob.userPasswordReset("oldNew",{"oldPassword": "654321","newPassword": "123456"},'f8b98e11ac','132efc77400780b380f33e94651652d7')); //更改密码
// log(bmob.userEmailVerify("test@autojs.xyz"));

// log(bmob.createObject("ClassName",{"category":"category","value":"value"})); //添加数据
// log(bmob.createObjects("ClassName", [{"category": "category","value": "value1"},{"category": "category","value": "value2"}])); //批量添加数据
// log(bmob.getObjects("ClassName")); //查询表数据
// log(bmob.getObject("ClassName",'cd7bc2eefa')); //查询指定objectId数据
// log(bmob.queryObject("ClassName",{"category": "category","value": "value1"})); 条件查询数据
// log(bmob.updateObject("ClassName",'cd7bc2eefa',{"category": 'category2',"value": 'value11'})) 更新数据
// log(bmob.deleteObject("ClassName",'cd7bc2eefa')); //删除指定objectId数据
// log(bmob.BQL("select * from ClassName limit 0,100 order by category")) //BQL查询
