/*
 * @Author: your name
 * @Date: 2020-12-24 14:10:09
 * @LastEditTime: 2020-12-24 17:58:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \register-managef:\project\MYZX_SLD\main.js
 */
var express = require('express');
var fs = require('fs');
var app = express();
var hostName = '127.0.0.1';
var port = 8080;

app.use(function (req, res) {

  const url = req.url;
  console.log('当前请求的url是：', url);

  res.setHeader('Content-Type', 'text/html');

  if (url === '/' || url === '/pc') {

    fs.readFile('./pc/index.html', 'utf-8', function (err, data) {
      if (err) {
        throw err;
      }
      res.send(data);
    });

  } else if (url === '/h5') {

    fs.readFile('./h5/index.html', 'utf-8', function (err, data) {
      if (err) {
        throw err;
      }
      res.send(data);

    })
  } else {

    fs.readFile('./pc/404.html', 'utf-8', function (err, data) {
      if (err) {
        throw err;
      }
      res.send(data);
    });
  }

});

app.listen(port, hostName, function () {

  console.log(`服务器运行在http://${hostName}:${port}`);

});