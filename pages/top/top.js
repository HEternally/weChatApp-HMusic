const app = getApp()
Page({
  data: {},
  onLoad: function (option) {
    wx.showLoading({
      title: '加载中',
    })
    let disstid = option.disstid;
    this.setData({
      disstid: disstid
    });
    this.getSinger(disstid);
    wx.showShareMenu();
  },
  getSinger(dissitd) {
    wx.request({
      url: '歌单API',
      data: {},
      success: (res) => {
        var dataList = this.data.list,
          data = res.data,
          songids = this.data.songids,
          songName = this.data.songName,
          list = data.songlist;
          
        data.topinfo.info = data.topinfo.info.replace(/&#160;/g, '&nbsp;');
        data.topinfo.info = data.topinfo.info.replace(/&#180;/g, "'");
        data.topinfo.info = data.topinfo.info.replace(/<br>/g, "\n");
        for (var i = 0; i < list.length; i++) {
          songids.push(parseInt(list[i].data.songid));
          songName.push(list[i].data.songname);
        }
        if (data.day_of_year == '') {
          data.date = data.date.split('_')[1];
        }
        dataList = data;
        this.setData({
          list: dataList,
          songids: songids,
          songName: songName
        });
        // this.MusicFcg();
        wx.hideLoading();
      },
      error: req => {
        wx.showToast({
          icon: 'none',
          title: '哎呀！数据出错了，别急，程序猿正在加急修改中',
        });
      }
    })
  },
  playAll() {
    var songids = this.data.songids,
      songName = this.data.songName;
    wx.showLoading({
      title: '加载中',
    })
    wx.setStorage({
      key: 'song_id',
      data: songids
    });
    wx.setStorage({
      key: 'music_name',
      data: songName,
    });
    wx.setStorage({
      key: 'num',
      data: 0,
    });
    app.globalData.shouldPlay = true;
    // app.globalData.unload = true;
    wx.switchTab({
      url: '../playSong/playSong',
    })
  },
  musicPlay(e) {
    var songids = this.data.songids,
      songName = this.data.songName,
      num = e.currentTarget.dataset.num;
    wx.showLoading({
      title: '加载中',
    })
      wx.setStorage({
        key: 'song_id',
        data: songids
      });
      wx.setStorage({
        key: 'music_name',
        data: songName,
      });
      wx.setStorage({
        key: 'num',
        data: num,
      });
      wx.setStorage({
        key: 'labelid',
        data: '',
      });
      app.globalData.shouldPlay = true;
    // app.globalData.unload = true;
      wx.switchTab({
        url: '../playSong/playSong',
      })
  }
})