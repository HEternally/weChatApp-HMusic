const app = getApp()
Page({
  data: {},
  onLoad: function () {
    wx.showShareMenu();
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: '首页信息API',
      data:{},
      success:res=> {
        let data = res.data;
        var that = this;
        if (data.code == 0) {
          var slider = data.data.slider,
              radioList = data.data.radioList,
              songList = data.data.songList,
              radioId = []
          for (var i = 0; i < radioList.length; i++) {
            radioId.push(radioList[i].radioid);
          }
          that.setData({
            banner: slider,
            radioList: radioList,
            songList: songList,
            loading:true
          });
          app.globalData.radioId = radioId;
          wx.hideLoading();
        }
      },
      fail:req=> {
        wx.showToast({
          icon:'none',
          title: '哎呀！数据出错了，别急，程序猿正在加急修改中',
        })
      }
    })
  },
  go_radio:function(e) {
    wx.showLoading({
      title: '加载中',
    });
    var labelid = e.currentTarget.dataset.id;
    wx.request({
      url: '电台API',
      method:'get',
      data:{},
      success:res=>{
        var Data = res.data,
            code = Data.code;
        if (code == 0) {
          var radioData = Data.data,
              id = [],
              music_name = [];
          for (var i=0;i<radioData.length;i++) {
            id.push(radioData[i].id);
            music_name.push(radioData[i].name);
          }
          wx.setStorageSync('song_id', id);//将电台随机生成的歌曲id存入缓存
          wx.setStorageSync('music_name', music_name);//将随机生成的歌曲信息存入缓存
          wx.setStorageSync('num', 0);//播放第一首歌
          wx.setStorageSync('labelid', labelid);//写入新的广播id
          app.globalData.shouldPlay = true;//重新请求音乐接口，因为每次获取到的广播歌曲都是不同的
          // app.globalData.unload = true;
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
      error:req=> {
        wx.showToast({
          icon: 'none',
          title: '哎呀！数据出错了，别急，程序猿正在加急修改中',
        })
      }
    })
  },
  selectHot:function(e) {
    let id = e.currentTarget.dataset.id;
    wx.showLoading({
      title: '加载中',
    });
    app.gePlay(id,0);
  },
  go_search(){//跳到搜索页
    wx.navigateTo({
      url: '../search/search',
    })
  },
  getGedan(e){//跳到歌单详情页
    let id = e.currentTarget.dataset.id;
    //跳转到歌单页面
    wx.navigateTo({
      url: '../gedan/gedan?disstid=' + id,
    })
  }
})
