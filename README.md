NetMusicApiServer

## 音乐播放器API服务器

搭建自己的音乐服务器 - 需要构造服务器来提供音乐API

### 用法

```
git clone 'repository url'
npm i 
npm start
```
然后访问一下链接,即可查看到对应的数据
- http://localhost:1234/radio
- http://localhost:1234/songLyric?id={songId}
- http://localhost:1234/song?id={soneId}
- http://localhost:1234/playlist?id=${playlistId}
- http://localhost:1234/search?q=${searchInfo}
根据这些可以应用到你的音乐服务器中的API请求中～～