const app = getApp();
Page({
  data: {},
  onLoad: function(options) {
    wx.hideLoading();
    wx.showShareMenu({
      withShareTicket: true
    });
    this.setData({
      isPlay: app.globalData.isPlay
    })
    app.globalData.backgroundAudioManager.onPlay(() => {
      var that = this;
      that.updateTime(that);
      that.setData({
        isPlay: true,
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
      this.setData({
        isPlay: false
      });
      app.globalData.isPlay = false;
      var id = wx.getStorageSync('song_id'),
        num = this.data.num;
      num++;
      var this_id = id[num];
      this.setData({
        num: num,
        musicTime: 1,
        toView: 'A0'
      });
      wx.setStorage({
        key: 'num',
        data: num,
      })
      wx.setStorage({
        key: 'current',
        data: {
          musicTime: 1,
          toView: 'A0'
        },
      })
      if (num > 0 && num < 19) {
        this.setData({
          haveNext: true,
          havePop: true
        })
      } else {
        this.setData({
          haveNext: false,
          havePop: true
        })
      }
      this.music_fcg(this_id);
    });
    app.globalData.backgroundAudioManager.onPause(() => {
      this.setData({
        isPlay: false
      });
      app.globalData.isPlay = false;
    });
    app.globalData.backgroundAudioManager.onStop(() => {
      app.globalData.shouldPlay = true;
      // app.globalData.unload = true;
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
      })
      app.globalData.isPlay = false;
    });
    app.globalData.backgroundAudioManager.onNext(() => {
      this.nextAudio();
    });
    app.globalData.backgroundAudioManager.onPrev(() => {
      this.popAudio();
    });
  },
  onShow() {
    var startTime = app.globalData.startTime;
    // console.log(startTime, app.globalData.shouldPlay, this.data.time,app.globalData.unload,app.globalData.musicMsg);
    if (wx.getStorageSync('song_id').length == 0) {
      wx.showModal({
        title: '提示',
        content: '您还未选择播放的歌曲，请移步推荐页哟',
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
      var id = app.globalData.labelid,
        rid = app.globalData.radioId,
        radioid = wx.getStorageSync('labelid'),
        shouldPlay = app.globalData.shouldPlay,
        index = wx.getStorageSync('num');
      if (shouldPlay) {
        var song_id = wx.getStorageSync('song_id'),
          this_id = song_id[index],
          unload = app.globalData.unload;
          wx.showLoading({
            title: '加载中',
          })
        if (!unload) {
          this.setData({
            num: index,
            time: 0,
            toView:'A0',
            musicTime:1
          });
          this.music_fcg(this_id);
        } else {
          var current = wx.getStorageSync('current'),
              msg = app.globalData.musicMsg;
          if (current.toView) {
            this.setData({
              toView: current.toView,
              musicTime: current.musicTime
            });
          }
          if (msg.audioSrc) {
            this.setData({
              audioSrc:msg.audioSrc
            })
          }
          if (msg.haveCommentlist) {
            this.setData({
              commentlist: msg.commentlist,
              haveCommentlist: true
            });
          } else {
            this.setData({
              haveCommentlist: false,
              commentlist: msg.commentlist,
            });
          }
          this.setData({
            num: index,
            time: startTime,
            track_info: msg.track_info,
            gedan: msg.gedan,
            simsongs: msg.simsongs,
            singer: msg.singer,
            songmid: msg.songmid,
            video: msg.video,
            lyrics: app.globalData.lyrics,
          });
          app.globalData.unload = false;
          this.updateTime(this);
          wx.hideLoading();
        }
        app.globalData.labelid = radioid;
        app.globalData.shouldPlay = false;
        // wx.setStorage({
        //   key: 'share_id',
        //   data: [],
        // });
        // wx.setStorage({
        //   key: 'share_name',
        //   data: [],
        // });
      } else {
        var share_id = wx.getStorageSync('share_id');
        if (share_id.length != 0) {
          var background = wx.getStorageSync('backgrond'),
            current = wx.getStorageSync('current'),
            index = wx.getStorageSync('num'),
            song_id = wx.getStorageSync('song_id'),
            msg = app.globalData.musicMsg,
            this_id = song_id[index];
          if (current.toView) {
            this.setData({
              toView: current.toView,
              musicTime: current.musicTime
            });
          }
          if (msg.audioSrc) {
            this.setData({
              audioSrc: msg.audioSrc
            })
          }
          if (msg.haveCommentlist) {
            this.setData({
              commentlist: msg.commentlist,
              haveCommentlist: true
            });
          } else {
            this.setData({
              haveCommentlist: false,
              commentlist: msg.commentlist,
            });
          }
          this.setData({
            lyrics: app.globalData.lyrics,
            haveMusicStorage: true,
            audioSrc: background.src,
            time: startTime,
            num: index,
            track_info: msg.track_info,
            gedan: msg.gedan,
            simsongs: msg.simsongs,
            singer: msg.singer,
            songmid: msg.songmid,
            video: msg.video,
          });
          var that = this;
          that.updateTime(that);
          // that.music_fcg(this_id);
        } else if (rid.indexOf(radioid) == -1) {
          if (radioid != id) {
            var song_id = wx.getStorageSync('song_id'),
              this_id = song_id[0];
            this.setData({
              num: 0,
              time: 0,
              toView:'A0',
              musicTime:1
            });
            wx.showLoading({
              title: '加载中',
            })
            this.music_fcg(this_id);
            app.globalData.labelid = radioid;
          }
        }
      }
      var music_name = wx.getStorageSync('music_name');
      this.setData({
        song_id: id,
        haveMusicStorage: true,
        MusicName: music_name
      });
    }
    
  },
  onShareAppMessage: function(options) {
    var that = this,
      song_id = wx.getStorageSync('song_id'),
      music_name = wx.getStorageSync('music_name'),
      num = wx.getStorageSync('num'),
      path = '/pages/share/share?songid=' + song_id[num] + '&name=' + music_name[num];
    // path = '/pages/playSong/playSong';
    app.globalData.clickShare = true;
    return {
      title: '@我，诚意推荐《' + music_name[num] + '》这首歌',
      path: path,
      imageUrl: 'https://y.gtimg.cn/music/photo_new/T002R300x300M000' + that.data.track_info.album.mid + '.jpg?max_age=2592000',
    }
  },
  onUnload() {
    // wx.setStorage({
    //   key: 'share_id',
    //   data: [],
    // });
    // app.globalData.shareMusic = true;
    app.globalData.shouldPlay = true;
    app.globalData.unload = true;
    // console.log('页面卸载');
  },
  onHide() {
    // console.log('页面隐藏');
  },
  music_fcg: function(this_id) {
    var musicu = this.data.musicu;
    musicu.detail.param.song_id = this_id;
    musicu.simsongs.param.songid = this_id;
    musicu.gedan.param.song_id = this_id;
    typeof this_id == 'string' ? musicu.video.param.songid = this_id.toString() : musicu.video.param.songid = this_id;

    //歌曲相关信息
    wx.request({
      url: '歌曲信息API',
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
        app.globalData.lyrics = mediaArray;
        app.globalData.musicMsg = {
          track_info: detail.data.track_info,
          gedan: gedan.data.vec_gedan,
          simsongs: simsongs.data.songInfoList,
          singer: detail.data.track_info.singer,
          songmid: songmid,
          video: video
        }
        var songUrl = this.data.pUrl,
          mid = songmid;
        songUrl.req_0.param.songmid.splice(0, 1, mid);
        //获取歌曲链接
        wx.request({
          url: '歌曲播放API',
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
              wx.setStorage({
                key: 'share_id',
                data: [],
              });
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
      });
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
      // if (parseInt(currentTime) <= parseInt(time[0].t)) {
      //   this.setData({
      //     toView: time[0].id
      //   });
      //   // console.log(this.data.toView);
      // } else {
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
          // console.log(currentTime, time[i].id, time[i].t,musicTime);
          return;
        }
      }
      // }

      // console.log(currentTime);
    })
  },
  nextAudio(e) {
    //下一首
    wx.showLoading({
      title: '加载中',
    });
    var id = wx.getStorageSync('song_id'),
      num = this.data.num,
      len = id.length;
    console.log(num)
    if (num == len - 1) {
      num = 0;
    } else {
      num++;
    }
    var this_id = id[num];
    this.setData({
      num: num,
      musicTime: 1,
      toView: 'A0',
      time: 0
    });
    wx.setStorage({
      key: 'num',
      data: num,
    });
    // wx.setStorage({
    //   key: 'share_id',
    //   data: [],
    // });
    if (num < (len - 1)) {
      this.setData({
        haveNext: true,
        havePop: true
      })
    } else {
      this.setData({
        num: -1
      })
    }
    // this.audioPlay();
    this.music_fcg(this_id);
  },
  popAudio(e) {
    //上一首
    wx.showLoading({
      title: '加载中',
    })
    var id = wx.getStorageSync('song_id'),
      num = this.data.num;
    if (num == 0) {
      num = id.length - 1;
    } else {
      num--;
    }
    var this_id = id[num];
    this.setData({
      num: num,
      musicTime: 1,
      toView: 'A0',
      time: 0
    });
    wx.setStorage({
      key: 'num',
      data: num,
    });
    // wx.setStorage({
    //   key: 'share_id',
    //   data: [],
    // });
    if (num != 0) {
      this.setData({
        havePop: true,
        haveNext: true
      })
    } else {
      this.setData({
        num: 0
      })
    }
    // this.audioPlay();
    this.music_fcg(this_id);
  },
  playVideo(e) {
    //播放视频
    var isPlay = this.data.isPlay,
      id = e.currentTarget.id,
      index = e.target.dataset.index,
      video = this.data.videoisPlay;
    for (var i = 0; i < video.length; i++) {
      var videoContext = wx.createVideoContext('mid' + (i - 1));
      videoContext.pause();
      // video[i] = false;
    }
    video[index] = true;
    this.setData({
      videoisPlay: video
    })
    var videoContext1 = wx.createVideoContext(id);
    videoContext1.play();
    if (isPlay) {
      app.globalData.backgroundAudioManager.pause();
      this.setData({
        isPlay: false
      });
      app.globalData.isPlay = false;
    }
  },
  playVideo1(e) {
    //点击自带的播放按钮
    var isPlay = this.data.isPlay,
      id = e.currentTarget.id,
      index = e.target.dataset.index,
      video = this.data.videoisPlay;
    for (var i = 0; i < video.length; i++) {
      if ('mid' + (i - 1) != id) {
        var videoContext = wx.createVideoContext('mid' + (i - 1));
        videoContext.pause();
      }
    }
    video[index] = true;
    this.setData({
      videoisPlay: video
    })
    if (isPlay) {
      app.globalData.backgroundAudioManager.pause();
      this.setData({
        isPlay: false
      });
      app.globalData.isPlay = false;
    }
  },
  pauseVideo(e) {
    //暂停播放视频
    var isPlay = this.data.isPlay;
    if (isPlay) {
      app.globalData.backgroundAudioManager.pause();
      this.setData({
        isPlay: false
      });
      app.globalData.isPlay = false;
    }
  },
  getVideoSrc(vids) {
    //获取视频链接
    var videoData = this.data.videoSrcData;
    videoData.getMVInfo.param.vidlist = vids;
    videoData.getMVUrl.param.vids = vids;
    wx.request({
      url: 'MVAPI',
      data: {},
      success: res => {
        var data = res.data.getMVUrl.data,
          url = [],
          isPlaying = [];
        for (var i = 0; i < vids.length; i++) {
          var vid = vids[i];
          url.push(data[vid].mp4[1].freeflow_url[0]);
          isPlaying[i] = false;
        }
        this.setData({
          videoSrc: url,
          videoisPlay: isPlaying
        });
      },
      error: req => {
        wx.showToast({
          icon: 'none',
          title: '哎呀！数据出错了，别急，程序猿正在加急修改中',
        })
      }
    })
  },
  getGd(e) {
    //跳转到歌单信息页
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../gedan/gedan?disstid=' + id,
    })
  },
  goSinger(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../singer/singer?disstid=' + id,
    })
  },
  addSong(e) {
    //跳到喜欢的歌曲
    var id = e.currentTarget.dataset.id, //获取到点击歌曲id
      name = e.currentTarget.dataset.name,
      num = this.data.num,
      song_id = wx.getStorageSync('song_id'),
      music_name = wx.getStorageSync('music_name');
    var a = song_id.indexOf(id);
    if (a != -1) {
      id = song_id[a];
      this.setData({
        num: a,
        time: 0
      })
      wx.setStorage({
        key: 'num',
        data: a,
      })
      this.audioPlay();
      this.music_fcg(id);
    } else {
      num++;
      song_id.splice(num, 0, id);
      music_name.splice(num, 0, name);
      wx.setStorageSync('song_id', song_id);
      wx.setStorageSync('music_name', music_name);
      this.setData({
        num: num,
        MusicName: music_name,
        time: 0
      })
      wx.setStorage({
        key: 'num',
        data: num,
      })
      this.audioPlay();
      this.music_fcg(id);
    }
    // wx.setStorage({
    //   key: 'share_id',
    //   data: [],
    // });
  },
  musicChange(e) {
    var index = parseInt(e.detail.value),
      song_id = wx.getStorageSync('song_id'),
      this_id = song_id[index],
      num = wx.getStorageSync('num');
    if (num != index) {
      wx.showLoading({
        title: '切换歌曲中',
      });
      this.setData({
        num: index,
        time: 0,
        musicTime: 1,
        toView: 'A0'
      });
      this.music_fcg(this_id);
      wx.setStorage({
        key: 'num',
        data: index,
      });
      // wx.setStorage({
      //   key: 'share_id',
      //   data: [],
      // });
    }
  },
  musicCancel(e) {
    console.log(e);
  },
  showPlayList(){
    var pix = 750 / app.globalData.system.windowWidth,
        height = 758 / pix;
    const animation = wx.createAnimation({
      durarion: 1000,
      timingFunction: 'ease-in-out',
    })
    this.animation = animation;
    animation.translateY(-height).step();
    this.setData({
      animationData: animation.export(),
      showList: true
    });
  },
  close(e) {
    // this.setData({
    //   showList:false
    // })
    var pix = 750 / app.globalData.system.windowWidth,
      height = 758 / pix;
    const animation = wx.createAnimation({
      durarion: 1000,
      timingFunction: 'ease-in-out',
    })
    this.animation = animation;
    animation.translateY(height).step();
    this.setData({
      animationData: animation.export(),
      showList: false
    });
    
  },
  del(e) {
    var num = e.currentTarget.dataset.num,
        songid = wx.getStorageSync('song_id'),
        musicName = wx.getStorageSync('music_name'),
        index = wx.getStorageSync('num');
    songid.splice(num,1);
    musicName.splice(num,1);
    wx.setStorage({
      key: 'song_id',
      data: songid,
    });
    wx.setStorage({
      key: 'music_name',
      data: musicName,
    });
    wx.showToast({
      icon:'none',
      title: '已删除',
    })
    this.setData({
      MusicName:musicName
    });
    if (num == index) {
      if (index < songid.length) {
        var id = songid[index];
        this.setData({
          num: index,
          time: 0,
          musicTime: 1,
          toView: 'A0'
        });
        this.music_fcg(id);
        wx.setStorage({
          key: 'num',
          data: index,
        });
      } else {
        var id = songid[0];
        this.setData({
          num: 0,
          time: 0,
          musicTime: 1,
          toView: 'A0'
        });
        this.music_fcg(id);
        wx.setStorage({
          key: 'num',
          data: 0,
        });
      }
      
    }
  },
  changeMusic(e) {
    var index = e.currentTarget.dataset.num,
        songid = wx.getStorageSync('song_id'),
        id = songid[index],
        num = wx.getStorageSync('num');
    if (num != index) {
      wx.showLoading({
        title: '切换歌曲中',
      });
      this.setData({
        num: index,
        time: 0,
        musicTime: 1,
        toView: 'A0'
      });
      this.music_fcg(id);
      wx.setStorage({
        key: 'num',
        data: index,
      });
    }
  }
})