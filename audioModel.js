"use strict"

class audioModel {
  constructor(id, name, mp3Url, imgUrl, popularity, duration, artists, album) {
    this.id = id,
      this.name = name,
      this.mp3Url = mp3Url,
      this.imgUrl = imgUrl,
      this.popularity = popularity,
      this.duration = duration,
      this.artists = artists,
      this.album = album
  }
}
module.exports = audioModel;
