var fs = require('fs');
var api = require("./api.js");

var result = {
  audio: {},
  album: {}
};
var done = false;

api.radio(function (err, data) {
  if (!err) {
    var artists = data.artists.map(item => {
      return item.name;
    });
    var album = data.album;
    result["audio"] = {

      // 歌曲id
      "id": data.id,
      "mp3Url": data.mp3Url,
      "imgUrl": album.blurPicUrl,
      // 获取 欢迎度
      "popularity": data.popularity,
      "playTime": data.duration,
      "artists": artists,
      // 专辑 http://music.163.com/#/album?id=${id}
      "albumId": album.id
    };
    result.album = {
      //专辑名
      "name": album.name,
      "id": album.id,
      //专辑背景
      "imgUrl": album.blurPicUrl
    }
  } else {
    console.log("ERROR")
  }
});

setTimeout(function () {
  //待保存至数据库
  console.log(JSON.stringify(result));
}, 3000);
