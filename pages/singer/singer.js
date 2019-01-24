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
    this.getSinger(disstid, 0);
    wx.showShareMenu();
  },
  getSinger(dissitd, begin) {
    wx.request({
      url: '歌手详情API',
      data: {},
      success: (res) => {
        var dataList = this.data.list,
          data = res.data.data,
          songids = this.data.songids,
          songName = this.data.songName,
          list = data.list;
        if (parseInt(data.total - begin)< 15) {
          this.setData({
            havaMusic: false
          })
        } else {
          this.setData({
            havaMusic: true
          })
        }
        if (dataList.list) {
          dataList.list = dataList.list.concat(list);
        } else {
          dataList = data;
        }
        data.SingerDesc = data.SingerDesc.replace(/&#160;/g, '&nbsp;');
        data.SingerDesc = data.SingerDesc.replace(/&#180;/g, "'");
        data.SingerDesc = data.SingerDesc.replace(/<br>/g, "\n");
        for (var i = 0; i < list.length; i++) {
          songids.push(parseInt(list[i].musicData.songid));
          songName.push(list[i].musicData.songname);
        }
        this.setData({
          list: dataList,
          songids: songids,
          songName: songName,
          begin: begin
        });
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
  getMoreMusic: function () {
    var disstid = this.data.disstid,
      begin = this.data.begin;
    begin = begin + 15;
    this.getSinger(disstid, begin);
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
    // app.globalData.unload = false;
    wx.switchTab({
      url: '../playSong/playSong',
    })
  },
  musicPlay(e){
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
    // app.globalData.unload = false;
    wx.switchTab({
      url: '../playSong/playSong',
    })
  }
})