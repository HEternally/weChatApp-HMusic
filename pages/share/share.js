const app = getApp();
Page({
  data: {},
  onLoad: function(options) {
    wx.hideLoading();
    app.globalData.backgroundAudioManager.onPlay(() => {
      var that = this;
      that.updateTime(that);
      this.setData({
        isPlay: true
      });
      app.globalData.isPlay = true;
    });
    app.globalData.backgroundAudioManager.onError((res) => {
      if (res.errCode == '10001') {
        wx.showToast({
          icon: 'none',
          title: '由于系统错误导致歌曲播放失败',
        })
      } else if (res.errCode == '10002') {
        wx.showToast({
          icon: 'none',
          title: '由于网络错误导致歌曲播放失败',
        })
      } else if (res.errCode == '10003') {
        wx.showToast({
          icon: 'none',
          title: '哎呀！播放文件错误',
        })
      } else if (res.errCode == '10004') {
        wx.showToast({
          icon: 'none',
          title: '哎呀！播放格式错误',
        })
      } else if (res.errCode == '-1') {
        wx.showToast({
          icon: 'none',
          title: '哎呀！数据出错了，别急，程序猿正在加急修改中',
        })
      }
    });
    app.globalData.backgroundAudioManager.onEnded(() => {
      // var id = wx.getStorageSync('share_id');
      // var this_id = id[0];
      var background = wx.getStorageSync('backgrond');
      app.globalData.backgroundAudioManager.title = background.title;
      app.globalData.backgroundAudioManager.singer = background.singer;
      app.globalData.backgroundAudioManager.src = background.src;
      app.globalData.backgroundAudioManager.coverImgUrl = background.coverImgUrl;
      app.globalData.backgroundAudioManager.play();
      this.setData({
        musicTime: 1,
        toView: 'A0',
        isPlay: true
      });
      app.globalData.isPlay = true;
      wx.setStorage({
        key: 'current',
        data: {
          toView: 'A0',
          musicTime: 1
        },
      });
      var that = this;
      that.updateTime(that);
      // this.music_fcg(this_id);
    });
    app.globalData.backgroundAudioManager.onPause(() => {
      this.setData({
        isPlay: false
      })
      app.globalData.isPlay = false;
    });
    app.globalData.backgroundAudioManager.onStop(() => {
      app.globalData.startTime = 0;
      wx.setStorage({
        key: 'current',
        data: {
          toView: 'A0',
          musicTime: 1
        },
      });
      this.setData({
        isPlay: false
      });
      wx.setStorage({
        key: 'share_id',
        data: '[]',
      });
      app.globalData.isPlay = false;
    });
  },
  onShow() {
    this.setData({
      isPlay: app.globalData.isPlay
    })
    var startTime = app.globalData.startTime;
    app.globalData.shouldPlay = false;
    // console.log(startTime, app.globalData.changeMusic,this.data.isPlay);
    if (startTime > 0) {
      var background = wx.getStorageSync('backgrond'),
        // msg = wx.getStorageSync('msg'),
        msg = app.globalData.musicMsg,
        current = wx.getStorageSync('current'),
        changeMusic = app.globalData.changeMusic;
      if (changeMusic) {
        var song_id = wx.getStorageSync('share_id'),
          music_name = wx.getStorageSync('share_name'),
          this_id = song_id[0],
          sid = wx.getStorageSync('song_id'),
          mName = wx.getStorageSync('music_name'),
          num = wx.getStorageSync('num');
        if (sid) {
          var index = sid.indexOf(this_id);
          if (index == -1) {
            sid.splice(parseInt(num + 1), 0, this_id);
            mName.splice(parseInt(num + 1), 0, music_name[0]);
            wx.setStorage({
              key: 'num',
              data: parseInt(num + 1),
            })
          } else {
            wx.setStorage({
              key: 'num',
              data: index,
            })
          }
          wx.setStorage({
            key: 'song_id',
            data: sid,
          });
          wx.setStorage({
            key: 'music_name',
            data: mName,
          })

        } else {
          wx.setStorage({
            key: 'song_id',
            data: song_id,
          });
          wx.setStorage({
            key: 'music_name',
            data: music_name,
          });
          wx.setStorage({
            key: 'num',
            data: 0,
          })
        }
        this.music_fcg(this_id);
        this.setData({
          haveMusicStorage: true,
          MusicName: music_name,
          isPlay: true,
          toView: 'A0',
          musicTime: 1,
          time: 0
        });
        app.globalData.isPlay = true;
        wx.setStorage({
          key: 'current',
          data: {
            toView: 'A0',
            musicTime: 1
          },
        })
      } else {
        if (current.toView) {
          this.setData({
            toView: current.toView,
            musicTime: current.musicTime
          });
        }
        this.setData({
          lyrics: app.globalData.lyrics,
          haveMusicStorage: true,
          audioSrc: background.src,
          time: startTime,
          track_info: msg.track_info,
          singer: msg.singer
        });
        if (!this.data.isPlay) {
          app.globalData.backgroundAudioManager.title = background.title;
          app.globalData.backgroundAudioManager.singer = background.singer;
          app.globalData.backgroundAudioManager.src = background.src;
          app.globalData.backgroundAudioManager.startTime = startTime;
          app.globalData.backgroundAudioManager.coverImgUrl = background.coverImgUrl;
          app.globalData.backgroundAudioManager.play();
          app.globalData.isPlay = true;
          this.setData({
            isPlay: true
          })
        } else {
          this.updateTime(this);
        }
      }
    } else {
      if (wx.getStorageSync('share_id').length == 0) {
        wx.showModal({
          title: '提示',
          content: '暂时无法获取分享的歌曲，请移步推荐页哟',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
              wx.switchTab({
                url: '../index/index',
              })
            }
          }
        });
        this.setData({
          haveMusicStorage: false
        });
      } else {
        // var id = app.globalData.labelid,
        //   rid = app.globalData.radioId,
        //   radioid = wx.getStorageSync('labelid'),
        //   shouldPlay = app.globalData.shouldPlay,
        //   index = wx.getStorageSync('num');
        // if (shouldPlay) {
        var music_name = wx.getStorageSync('share_name');
        var song_id = wx.getStorageSync('share_id'),
          this_id = song_id[0],
          sid = wx.getStorageSync('song_id'),
          mName = wx.getStorageSync('music_name'),
          num = wx.getStorageSync('num');
        if (sid) {
          var index = sid.indexOf(this_id);
          if (index == -1) {
            sid.splice(parseInt(num + 1), 0, this_id);
            mName.splice(parseInt(num + 1), 0, music_name[0]);
            wx.setStorage({
              key: 'num',
              data: parseInt(num + 1),
            })
          } else {
            wx.setStorage({
              key: 'num',
              data: index,
            })
          }
          wx.setStorage({
            key: 'song_id',
            data: sid,
          });
          wx.setStorage({
            key: 'music_name',
            data: mName,
          });

        } else {
          wx.setStorage({
            key: 'song_id',
            data: song_id,
          });
          wx.setStorage({
            key: 'music_name',
            data: music_name,
          });
          wx.setStorage({
            key: 'num',
            data: 0,
          })
        }
        this.music_fcg(this_id);
        // this.setData({
        //   num: index
        // })
        // app.globalData.labelid = radioid;
        // app.globalData.shouldPlay = false;
        // } else {
        //   if (rid.indexOf(radioid) == -1) {
        //     if (radioid != id) {
        //       var song_id = wx.getStorageSync('share_id'),
        //         this_id = song_id[0];
        //       this.music_fcg(this_id);
        //       this.setData({
        //         num: 0
        //       })
        //       app.globalData.labelid = radioid;
        //     }
        //   }
        // }
        this.setData({
          haveMusicStorage: true,
          MusicName: music_name
        });
      }
    }

  },
  music_fcg: function(this_id) {
    wx.showLoading({
      title: '加载中',
    })
    var musicu = this.data.musicu;
    musicu.detail.param.song_id = this_id;
    musicu.simsongs.param.songid = this_id;
    musicu.gedan.param.song_id = this_id;
    typeof this_id == 'string' ? musicu.video.param.songid = this_id.toString() : musicu.video.param.songid = this_id;

    //歌曲相关信息
    wx.request({
      url: '歌曲API',
      method: 'POST',
      data: JSON.stringify(musicu),
      success: res => {
        var detail = res.data.detail,
          gedan = res.data.gedan,
          simsongs = res.data.simsongs,
          songmid = detail.data.track_info.mid,
          info = detail.data.info,
          video = res.data.video.data.list,
          vids = [],
          lyric,
          mediaArray = [],
          haveLyric = false;
        //将歌词字符串转为数组，并去掉前五组数据
        for (var i = 0; i < info.length; i++) {
          if (info[i].title == '歌词') {
            lyric = info[i].content[0].value.split('\n').slice(5);
            haveLyric = true;
          }
        }
        for (var i = 0; i < video.length; i++) {
          vids.push(video[i].vid);
        }
        if (vids.length > 0) {
          this.getVideoSrc(vids);
        }
        //将时间跟歌词分开
        if (haveLyric) {
          for (var j = 0; j < lyric.length; j++) {
            var t = lyric[j].substring(lyric[j].indexOf('[') + 1, lyric[j].indexOf(']')),
              c = lyric[j].substring(lyric[j].indexOf("]") + 1, lyric[j].length);
            if (c != '') {
              mediaArray.push({
                t: (parseInt(t.split(":")[0] * 60) + parseFloat(t.split(":")[1])).toFixed(1),
                c: c,
                id: 'A' + j
              })
            }
          }
        }
        this.setData({
          track_info: detail.data.track_info,
          gedan: gedan.data.vec_gedan,
          simsongs: simsongs.data.songInfoList,
          singer: detail.data.track_info.singer,
          songmid: songmid,
          lyrics: mediaArray,
          video: video
        });
        app.globalData.musicMsg = {
          track_info: detail.data.track_info,
          gedan: gedan.data.vec_gedan,
          simsongs: simsongs.data.songInfoList,
          singer: detail.data.track_info.singer,
          songmid: songmid,
          video: video
        }
        // wx.setStorage({
        //   key: 'msg',
        //   data: {
        //     track_info: detail.data.track_info,
        //     singer: detail.data.track_info.singer
        //   },
        // })
        app.globalData.lyrics = mediaArray;
        var songUrl = this.data.pUrl,
          mid = songmid;
        songUrl.req_0.param.songmid.splice(0, 1, mid);
        //获取歌曲链接
        wx.request({
          url: '歌曲API',
          method: 'post',
          data: JSON.stringify(songUrl),
          success: res => {
            wx.hideLoading();
            var pUrl = res.data.req_0.data.midurlinfo[0].purl;
            if (pUrl == '') {
              app.globalData.backgroundAudioManager.pause();
              var that = this;
              that.setData({
                audioSrc: ''
              });
              wx.showModal({
                title: '提示',
                content: '很抱歉，该歌曲暂不支持播放哦，咱们听下一首歌吧',
                success: function(res) {
                  if (res.confirm) {
                    that.nextAudio();
                  }
                }
              })
            } else if (this.data.time == 0) {
              wx.setStorage({
                key: 'backgrond',
                data: {
                  title: detail.data.track_info.name,
                  singer: detail.data.track_info.singer[0].name,
                  src: pUrl,
                  coverImgUrl: 'https://y.gtimg.cn/music/photo_new/T002R300x300M000' + detail.data.track_info.album.mid + '.jpg?max_age=2592000'
                },
              });
              app.globalData.backgroundAudioManager.title = detail.data.track_info.name;
              app.globalData.backgroundAudioManager.singer = detail.data.track_info.singer[0].name;
              app.globalData.backgroundAudioManager.src = pUrl;
              app.globalData.backgroundAudioManager.coverImgUrl = 'https://y.gtimg.cn/music/photo_new/T002R300x300M000' + detail.data.track_info.album.mid + '.jpg?max_age=2592000'
              app.globalData.backgroundAudioManager.play();
              this.setData({
                audioSrc: pUrl,
                isPlay: true
              });
              app.globalData.isPlay = true;
              app.globalData.musicMsg.audioSrc = pUrl;
            }
          },
          error: req => {
            wx.showToast({
              icon: 'none',
              title: '哎呀！数据出错了，别急，程序猿正在加急修改中',
            })
          }
        });
      },
      error: req => {
        wx.showToast({
          icon: 'none',
          title: '哎呀！数据出错了，别急，程序猿正在加急修改中',
        })
      }
    });

    //精彩评论
    wx.request({
      url: '评论API',
      data: {},
      success: res => {
        var commentlist = res.data.hot_comment.commentlist,
          list = [];
        if (commentlist) {
          if (commentlist.length > 4) {
            list.push(commentlist[1]);
            list.push(commentlist[2]);
            list.push(commentlist[3]);
          } else {
            for (var i = 0; i < commentlist.length; i++) {
              list.push(commentlist[i]);
            }
          }
          for (var i = 0; i < list.length; i++) {
            list[i].time = app.timestampToTime(list[i].time);
          }
          this.setData({
            commentlist: list,
            haveCommentlist: true
          });
          app.globalData.musicMsg.commentlist = list;
          app.globalData.musicMsg.haveCommentlist = true;
        } else {
          this.setData({
            haveCommentlist: false
          });
          app.globalData.musicMsg.haveCommentlist = false;
          app.globalData.musicMsg.commentlist = '';
        }

      },
      error: req => {
        wx.showToast({
          icon: 'none',
          title: '哎呀！数据出错了，别急，程序猿正在加急修改中',
        })
      }
    });
  },
  audioPlay() {
    //音乐播放暂停
    var isPlay = this.data.isPlay,
      src = this.data.audioSrc;
    if (isPlay) {
      app.globalData.backgroundAudioManager.pause();
      this.setData({
        isPlay: false
      })
      app.globalData.isPlay = false;
    } else if (isPlay == false && src != '') {
      app.globalData.backgroundAudioManager.play();
      this.setData({
        isPlay: true
      });
      app.globalData.isPlay = true;
    } else {
      var that = this;
      wx.showModal({
        title: '提示',
        content: '很抱歉，该歌曲需要vip哦，咱们听下一首歌吧',
        success: function(res) {
          if (res.confirm) {
            that.nextAudio();
          }
        }
      })
    }
  },
  updateTime: function(that) {
    //播放时更新时间
    app.globalData.backgroundAudioManager.onTimeUpdate((res) => {
      var duration = app.globalData.backgroundAudioManager.duration,
        currentTime = app.globalData.backgroundAudioManager.currentTime.toFixed(1),
        time = this.data.lyrics,
        musicTime = this.data.musicTime;
      app.globalData.startTime = app.globalData.backgroundAudioManager.currentTime;
      for (var i = musicTime; i < time.length; i++) {
        if (parseInt(currentTime) > parseInt(time[i].t)) {
          if (this.data.toView != time[i].id) {
            this.setData({
              toView: time[i].id,
              musicTime: musicTime + 1
            });
            wx.setStorage({
              key: 'current',
              data: {
                toView: time[i].id,
                musicTime: musicTime + 1
              },
            })
          }
          return;
        }
      }
    })
  },
  goIndex(){
    wx.switchTab({
      url: '../../pages/index/index',
    })
  }
})