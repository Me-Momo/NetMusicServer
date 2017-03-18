"use strict";
var request = require('superagent');
var zlib = require('zlib');
var fs = require('fs');
var audioModel = require('./audioModel');
var ablumModel = require('./ablumModel');

var customHeaders = {
  'Accept': '*/*',
  'Accept-Encoding': 'gzip,deflate',
  'Accept-Language': 'zh-CN,zh;q=0.8,gl;q=0.6,zh-TW;q=0.4',
  'Connection': 'keep-alive',
  'Content-Type': 'application/x-www-form-urlencoded',
  'Host': 'music.163.com',
  'Referer': 'http://music.163.com/search',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.152 Safari/537.36'
}

var DEFAULTLIMIT = 20;

//操作和node的不一样

var httpRequest = function (method, url, data, callback) {
  var ret;
  if (method == 'post') {
    ret = request.post(url)
      .send(data)
      .set(customHeaders)
      .end(function (err, res) {
        if (err) {
          callback(err);
        } else {
          callback(null, res);
        }
      })
  } else {
    request.get(url)
      .query(data)
      .set(customHeaders)
      .end(function (err, res) {
        if (err) {
          callback(err);
        } else {
          callback(null, res);
        }
      })
  }
}



var baseUrl = baseUrl + "";

var api = {
  radio: function (callback) {
    var that = this;
    var url = baseUrl + 'radio/get';
    httpRequest('get', url, null, function (err, res) {
      if (err) {
        callback({
          msg: '[songLyric]http error ' + err,
          code: 404
        });
        return;
      }
      var doc = JSON.parse(res.text);
      if (doc.code != 200) callback({
        msg: '[radio]http code ',
        code: doc.code
      });
      else {
        var data = doc.data[0];

        callback(null, {
          audio: that.transfer(data)
        })
      }
    });
  },
  // 根据 songId 获取歌曲歌词
  songDetail: function (id, callback) {
    var url = baseUrl + "song/detail";
    var that = this;
    httpRequest('get', url, {
      id: id,
      ids: '[' + id + ']'
    }, function (err, res) {
      if (err) {
        callback({
          msg: '[songDetail]http error ' + err,
          code: 404
        });
        return;
      }
      var doc = JSON.parse(res.text);
      if (doc.code != 200) callback({
        msg: '[songDetail]http code ' + doc.code,
        type: 1
      });
      else {
        var data = doc.songs[0];
        callback(null, {
          song: that.transfer(data)
        });
      }
    })
  },
  songLyric: function (id, callback) {
    var url = baseUrl + "song/lyric";
    httpRequest('get', url, {
      os: 'android',
      id: id,
      lv: -1,
      tv: -1
    }, function (err, res) {
      if (err) {
        callback({
          msg: '[songLyric]http error ' + err,
          code: 404
        });
        return;
      }
      var doc = JSON.parse(res.text);
      if (doc.lrc) {
        callback(null, {
          lyric: doc.lrc.lyric
        });
      } else {
        callback({
          msg: '[songLyric]lrc do not exist',
          code: 404
        });
      }
    });
  },
  playlistDetail: function (id, callback) {
    var that = this;
    var url = baseUrl + 'playlist/detail';
    var data = {
      "id": id || "422995334"
    }
    var that = this;
    httpRequest('get', url, data, function (err, res) {
      if (err) callback({
        msg: '[playlistDetail]http timeout',
        code: 404
      });
      else if (res.body.code != 200) callback({
        msg: '[playlistDetail]http code ',
        code: data.code
      });
      else {
        var datas = res.body.result.tracks;

        var songList = datas.map(function (item) {
          return that.transfer(item);
        });
        callback(null, songList);
      }
    });
  },
  transfer: function (data) {
    var album = data.album;
    var newAlbum = new ablumModel(album.id, album.name,
      album.blurPicUrl);
    var artists = data.artists.map(item => {
      var name = item.name;
      var id = item.id;
      return {
        name: name,
        id: id
      };
    });
    var newAudio = new audioModel(data.id, data.name,
      data.mp3Url,
      album.blurPicUrl,
      data.popularity, data.duration, artists, newAlbum);
    return newAudio;
  },
  search: function () {
    //s, stype, offset, total, limit,callback;
    var argv = [].slice.call(arguments);
    var callback = argv.pop();
    var s = argv[0];
    var stype = argv[1] || 1;
    var offset = argv[2] || 0;
    var total = 'true';
    var limit = argv[3] || DEFAULTLIMIT;
    var url = baseUrl + 'search/get/web';
    var data = {
      's': s,
      'type': stype,
      'offset': offset,
      'total': total,
      'limit': limit
    }
    var that = this;
    httpRequest('post', url, data, function (err, res) {
      if (err) {
        callback({
          msg: '[search]http error ' + err,
          code: 404
        });
        return;
      }
      var doc = JSON.parse(res.text);
      if (doc.code != 200) callback({
        msg: '[search]http code ',
        code: doc.code
      })
      else if (doc.result.songCount === 0) callback({
        msg: '[search]no songs ',
        code: 404
      })
      else {
        var results = doc.result.songs;
        // callback(null, results);

        var songList = results.map(item => {
          return that.transfer(item);
        })
        callback(null, songList);
      }
    });
  }
}

module.exports = api;
