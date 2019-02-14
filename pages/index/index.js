const app = getApp()
Page({
  data: {
    banner: [], //轮播图
    radioList: [], //电台
    songList: [], //歌单
    loading: false, //是否加载完成
  },
  onLoad: function() {
    wx.showShareMenu();
    wx.showLoading({
      title: '加载中',
    });
    // wx.request({
    //   url: '首页信息API',
    //   data:{},
    //   success:res=> {
    //     let data = res.data;
    //     var that = this;
    //     if (data.code == 0) {

    var data = {
      "data": {
        "slider": [{
          "linkUrl": "http://y.qq.com/w/album.html?albummid=004ZGlrw3Me8eI",
          "picUrl": "http://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/1155264.jpg",
          "id": 19857
        }, {
          "linkUrl": "http://y.qq.com/w/album.html?albummid=003vVUT83SaF4l",
          "picUrl": "http://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/1155138.jpg",
          "id": 19858
        }, {
          "linkUrl": "https://y.qq.com/m/digitalbum/gold/index.html?openinqqmusic=1_video=true&id=5447522&g_f=shoujijiaodian",
          "picUrl": "http://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/1155430.jpg",
          "id": 19853
        }, {
          "linkUrl": "http://y.qq.com/w/album.html?albummid=000uoyVq093DIY",
          "picUrl": "http://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/1155139.jpg",
          "id": 19859
        }, {
          "linkUrl": "https://y.qq.com/apg/612/index.html?ADTAG=JDT&openinqqmusic=1",
          "picUrl": "http://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/1155328.jpg",
          "id": 19850
        }],
        "radioList": [{
          "picUrl": "http://y.gtimg.cn/music/photo/radio/track_radio_199_13_1.jpg",
          "Ftitle": "热歌",
          "radioid": 199
        }, {
          "picUrl": "http://y.gtimg.cn/music/photo/radio/track_radio_307_13_1.jpg",
          "Ftitle": "一人一首招牌歌",
          "radioid": 307
        }],
        "songList": [{
          "songListDesc": "催泪大杀器！盘点演唱会经典万人大合唱",
          "picUrl": "http://p.qpic.cn/music_cover/1Fr9IFMhWDPeUzWKVEjn3QTL2eX2QziaJmaL0ZAmsvtW71ic9IDUoYzg/300?n=1",
          "id": "2646688496",
          "accessnum": 9927141,
          "songListAuthor": "金青松",
          "pic_mid": "00333So02drvak",
          "album_pic_mid": ""
        }, {
          "songListDesc": "纳尼？这些华语歌手竟然会唱日语歌！",
          "picUrl": "http://p.qpic.cn/music_cover/z8wAFqicQ1qhImeiajkrgiaR4hYM3pzsUULFnicXshFXdw9uGkm261Ex9g/300?n=1",
          "id": "1144416825",
          "accessnum": 675463,
          "songListAuthor": "风吹草地",
          "pic_mid": "0013j8zs1jRnLQ",
          "album_pic_mid": ""
        }, {
          "songListDesc": "精选内地十大民谣歌手代表作",
          "picUrl": "http://p.qpic.cn/music_cover/hVUsfUFG2DV466URqw7PT7X66OknPIhic2mKDgicawN4qThIR7yhYY1w/300?n=1",
          "id": "2043041547",
          "accessnum": 1295560,
          "songListAuthor": "１'s   ヽ",
          "pic_mid": "004bFmjW2PXSqF",
          "album_pic_mid": "0032YJyg2yF6Dd"
        }, {
          "songListDesc": "2016billboard嘻哈榜",
          "picUrl": "http://p.qpic.cn/music_cover/tkduvk4dwqBxwzZhsNe0nwkwyiaLHVkxtla7REsX0yNkhibOH3Bdb2og/300?n=1",
          "id": "2040362185",
          "accessnum": 1161101,
          "songListAuthor": "CREAMSAUCEONMEBABY",
          "pic_mid": "000cL0xT2csmd7",
          "album_pic_mid": "001iJq1y1Uq3zV"
        }, {
          "songListDesc": "浮光掠影：ACG纯音乐赏析合辑",
          "picUrl": "http://p.qpic.cn/music_cover/XMPAjfs5uwGZdWII3osvAvCRyNWx8Pqy5Yice41OCZlBhLtk0p0icNvg/300?n=1",
          "id": "1723063372",
          "accessnum": 998181,
          "songListAuthor": "黎桐同",
          "pic_mid": "000xFtbN1l8ye8",
          "album_pic_mid": "002egQPg3DWcCS"
        }, {
          "songListDesc": "trip-hop单曲大推荐",
          "picUrl": "http://y.gtimg.cn/music/photo_new/T005R600x600M000002CJKAY1LKpcz.jpg?n=1",
          "id": "3482605622",
          "accessnum": 357712,
          "songListAuthor": "哑忍",
          "pic_mid": "",
          "album_pic_mid": "004aOQhn3PPOpK"
        }]
      }
    },
    slider = data.data.slider,
      radioList = data.data.radioList,
      songList = data.data.songList,
      radioId = []
    for (var i = 0; i < radioList.length; i++) {
      radioId.push(radioList[i].radioid);
    }
    this.setData({
      banner: slider,
      radioList: radioList,
      songList: songList,
      loading: true
    });
    app.globalData.radioId = radioId;
    wx.hideLoading();
    // }
    //   },
    //   fail:req=> {
    //     wx.showToast({
    //       icon:'none',
    //       title: '哎呀！数据出错了，别急，程序猿正在加急修改中',
    //     })
    //   }
    // })
  },
  go_radio: function(e) {
    wx.showLoading({
      title: '加载中',
    });
    var labelid = e.currentTarget.dataset.id;
    wx.request({
      url: '电台API',
      method: 'get',
      data: {},
      success: res => {
        var Data = res.data,
          code = Data.code;
        if (code == 0) {
          var radioData = Data.data,
            id = [],
            music_name = [];
          for (var i = 0; i < radioData.length; i++) {
            id.push(radioData[i].id);
            music_name.push(radioData[i].name);
          }
          wx.setStorageSync('song_id', id); //将电台随机生成的歌曲id存入缓存
          wx.setStorageSync('music_name', music_name); //将随机生成的歌曲信息存入缓存
          wx.setStorageSync('num', 0); //播放第一首歌
          wx.setStorageSync('labelid', labelid); //写入新的广播id
          app.globalData.shouldPlay = true; //重新请求音乐接口，因为每次获取到的广播歌曲都是不同的
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
      error: req => {
        wx.showToast({
          icon: 'none',
          title: '哎呀！数据出错了，别急，程序猿正在加急修改中',
        })
      }
    })
  },
  selectHot: function(e) {
    let id = e.currentTarget.dataset.id;
    wx.showLoading({
      title: '加载中',
    });
    app.gePlay(id, 0);
  },
  go_search() { //跳到搜索页
    wx.navigateTo({
      url: '../search/search',
    })
  },
  getGedan(e) { //跳到歌单详情页
    let id = e.currentTarget.dataset.id;
    //跳转到歌单页面
    wx.navigateTo({
      url: '../gedan/gedan?disstid=' + id,
    })
  }
})