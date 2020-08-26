const http = require("http");
const server = http.createServer();
const express = require("express");

const app = express();
app.all('*',(req,res)=>{
  res.header('Access-Control-Allow-Origin','*')
  res.header('Access-Control-Allow-Headers','Content-type')
  res.header('Access-Control-Allow-Methods','POST')
  res.header('Access-Control-Allow-Max-Age','86400')
  next();
})
server.on('request',(req,res)=>{
  console.log('接收到请求');
  console.log(req.id);
  res.write("hello");
})
server.listen(3000,()=>{
  console.log('服务启动成功');
})