'use strict' //设置为严格模式

const crypto = require('crypto'), //引入加密模块
       https = require('https'), //引入 htts 模块
        util = require('util'), //引入 util 工具包
accessTokenJson = require('./accessToken'); //引入本地存储的 access_token


//构建 WeChat 对象 即 js中 函数就是对象
var WeChat = function(config){
  //设置 WeChat 对象属性 config
  this.config = config;
  //设置 WeChat 对象属性 token
  this.token = config.token;
  //设置 WeChat 对象属性 appID
  this.appID = config.appID;
  //设置 WeChat 对象属性 appScrect
  this.appScrect = config.appScrect;
  //设置 WeChat 对象属性 apiDomain
  this.apiDomain = config.apiDomain;
  //设置 WeChat 对象属性 apiURL
  this.apiDomain = config.apiURL;

  //用于处理 https Get请求方法
  this.requestGet = function(url){
      return new Promise(function(resolve,reject){
          https.get(url,function(res){
              var buffer = [],result = "";
              //监听 data 事件
              res.on('data',function(data){
                  buffer.push(data);
              });
              //监听 数据传输完成事件
              res.on('end',function(){
                  result = Buffer.concat(buffer,buffer.length).toString('utf-8');
                  //将最后结果返回
                  resolve(result);
              });
          }).on('error',function(err){
              reject(err);
          });
      });
  }
}

/**
 * 获取微信 access_token
 */
WeChat.prototype.getAccessToken = function(){
  var that = this;
  return new Promise(function(resolve,reject){
      //获取当前时间 
      var currentTime = new Date().getTime();
      //格式化请求地址
      var url = util.format(that.apiURL.accessTokenApi,that.apiDomain,that.appID,that.appScrect);
      //判断 本地存储的 access_token 是否有效
      if(accessTokenJson.access_token === "" || accessTokenJson.expires_time < currentTime){
          that.requestGet(url).then(function(data){
              var result = JSON.parse(data); 
              if(data.indexOf("errcode") < 0){
                  accessTokenJson.access_token = result.access_token;
                  accessTokenJson.expires_time = new Date().getTime() + (parseInt(result.expires_in) - 200) * 1000;
                  //更新本地存储的
                  fs.writeFile('./wechat/access_token.json',JSON.stringify(accessTokenJson));
                  //将获取后的 access_token 返回
                  resolve(accessTokenJson.access_token);
              }else{
                  //将错误返回
                  resolve(result);
              } 
          });
      }else{
          //将本地存储的 access_token 返回
          resolve(accessTokenJson.access_token);  
      }
  });
}

//暴露可供外部访问的接口
module.exports = WeChat;