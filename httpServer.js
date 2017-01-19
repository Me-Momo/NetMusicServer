  var http = require('http')
  var libUrl = require('url'); //URL解析模块
  var libFs = require("fs"); //文件系统模块
  var libPath = require("path"); //路径解析模块
  var query = require("querystring"); //解析POST请求
  var api = require('./api')


  var server = http.createServer(function (req, res) {
    var reqUrl = req.url;
    //使用url解析模块获取url中的路径名
    var pathName = libUrl.parse(reqUrl)
      .pathname;
    res.writeHead(200, {
      'Content-Type': 'text/json;charset=utf-8',
      'Cache-Control': 'no-cache, must-revalidate',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });

    switch (pathName) {
      case "/radio":
        {
          api.radio(function (err, data) {
            if (err) {
              console.log(JSON.stringify(err));
              res.writeHead(err.code)
              res.end(null);
            } else {
              res.write(JSON.stringify(data) ||
                "nothing")
              res.end();
            }
          });
          break;
        }
      case "/songLyric":
        {
          var songId = libUrl.parse(reqUrl, true)
            .query.id || '26034822';
          api.songLyric(songId, function (err, data) {
            if (err) {
              console.log(JSON.stringify(err));
              res.writeHead(err.code)
              res.end(null);
            } else {
              res.write(JSON.stringify(data) || null)
              res.end();
            }
          });
          break;
        }
      case "/song":
        {
          var songId = libUrl.parse(reqUrl, true)
            .query.id || 427595456;
          api.songDetail(songId, function (err, data) {
            if (err) {
              console.log(JSON.stringify(err));
              res.writeHead(err.code)
              res.end(null);
            } else {
              res.write(JSON.stringify(data))
              res.end();
            }
          })
        }
        break;
      case "/playlist":
        {
          var songId = libUrl.parse(reqUrl, true)
            .query.id || '422995334';
          api.playlistDetail(songId, function (err, data) {
            if (err) {
              console.log(JSON.stringify(err));
              res.writeHead(err.code)
              res.end(null);
            } else {
              // console.log("测试歌曲" + JSON.stringify(data))
              res.write(JSON.stringify(data) || null)
              res.end();
            }
          })
        }
        break;
      case "/search":
        {
          var searchparam = libUrl.parse(reqUrl, true)
            .query.q;
          var stype = libUrl.parse(reqUrl, true)
            .query.stype;
          var offset = libUrl.parse(reqUrl, true)
            .query.offset;
          var limit = libUrl.parse(reqUrl, true)
            .query.limit;
          api.search(searchparam, stype, offset, limit, function (err, data) {
            if (err) {
              console.log(JSON.stringify(err));
              res.writeHead(err.code)
              res.end(null);
            } else {
              res.write(JSON.stringify(data) || null)
              res.end();
            }
          });
          break;
        }
    }
  });

  //指定服务器错误事件响应
  server.on("error", function (error) {
    console.log(error); //在控制台中输出错误信息
  });

  server.listen(1234, function () {
    //向控制台输出服务启动的信息
    console.log(
      '[WebSvr][Start] running a server in http://127.0.0.1:1234/');

  })
