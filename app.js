//app.js
App({
  onLaunch: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.globalData.system = res;
      },
    })
  },
  onShow(options){
      // console.log(options)
      this.globalData.scene = options.scene;
      if (options.query.songid) {
        var songid = [],
          name = [],
          shareId = wx.getStorageSync('share_id');
        songid.push(parseInt(options.query.songid));
        name.push(options.query.name);
        if (shareId) {
          // console.log(songid[0], shareId[0])
          if (songid[0] != shareId[0]) {
            this.globalData.changeMusic = true;
          } else {
            this.globalData.changeMusic = false;
          }
        }
        wx.setStorage({
          key: 'share_id',
          data: songid,
        });
        wx.setStorage({
          key: 'share_name',
          data: name,
        });
      }
  },
  onHide(){
    // console.log('hide')
  },
  globalData: {},
  timestampToTime:function(time) {
    //将时间戳转为日期格式
    var date = new Date(time * 1000);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y+M+D+h+m+s;
  },
  gePlay:function(id,num) {
    //播放歌单的全部歌曲
    wx.setStorageSync('labelid', id);//将最新歌单id存入缓存
    wx.request({
      url: '歌单API',
      data: {},
      success: res => {
        var Data = res.data,
          code = Data.code;
        if (code == 0) {
          var id = Data.songids.split(','),
              songlist = Data.songlist,
              music_name = [];
          for (var i = 0; i < id.length; i++) {
            id[i] = parseInt(id[i]);
            music_name.push(songlist[i].songname);
          }
          // for(var i =0;i<songlist.length;i++) {
          //   music_name.push(songlist[i].songname);
          // }
          wx.setStorageSync('song_id', id);//将电台随机生成的歌曲id存入缓存
          wx.setStorageSync('num', num);//当前要播放歌曲的序号
          wx.setStorageSync('music_name', music_name);//对应歌曲id的歌曲名称
          wx.switchTab({
            url: '../playSong/playSong',
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '哎呀！数据出错了，别急，程序猿正在加急修改中',
          })
        }
      },
      error: req => {
        wx.showToast({
          icon: 'none',
          title: '哎呀！数据出错了，别急，程序猿正在加急修改中',
        })
      }
    })
  }
})