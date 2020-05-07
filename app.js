const express = require('express'), //express 框架 
  wechat = require('./wechat/wechat'),
  config = require('./config');//引入配置文件

var app = express();//实例express框架

var wechatApp = new wechat(config); //实例wechat 模块

// 托管静态文件
app.use(express.static('public'));

//用于处理所有进入 3000 端口 get 的连接请求
app.get('/', function (req, res) {
  wechatApp.auth(req, res);
});

//用于处理所有进入 3000 端口 post 的连接请求
app.post('/', function (req, res) {
  wechatApp.handleMsg(req, res);
});

//用于请求获取 access_token
app.get('/getAccessToken', function (req, res) {
  console.log('getAccessToken');
  wechatApp.getAccessToken().then(function (data) {
    res.send(data);
  });
});

// 用于请求获取userinfo
app.get('/wx_login', function (req, res) {
  console.log('wx_login');
  wechatApp.wxLogin(req, res);
});

app.get('/onLogin', function (req, res) {
  console.log('onLogin');
  wechatApp.wxLogin(req, res);
});

app.post('/send_message', function (req, res) {
  console.log('send_message');
  wechatApp.sendMessage(req, res);
});

app.post('/db_query', function (req, res) {
  console.log('db_query');
  wechatApp.databaseQuery(req, res);
});


app.get('/get_wx_access_token', function (req, res, next) {
  wechatApp.getWxAccessToken(req, res);
});

app.get('/get_wx_jssdk_config', function (req, res, next) {
  wechatApp.getWxJssdkConfig(req, res);
});

app.get('/send_tpl_msg', function (req, res, next) {
  wechatApp.sendTplMsg(req, res);
});


//监听3000端口
app.listen(3300);