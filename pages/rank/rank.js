//rank.js
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    rank: []
  },
  onLoad: function() {
    wx.showLoading({
      title: '加载中',
    });
    wx.showShareMenu();
    // wx.request({
    //   url: '排行榜API',
    //   data: {},
    //   success: res => {
    var data = {
        "code": 0,
        "subcode": 0,
        "message": "",
        "default": 0,
        "data": {
          "topList": [{
            "id": 4,
            "listenCount": 19800000,
            "picUrl": "http://y.gtimg.cn/music/photo_new/T003R300x300M000002UMwvi2ArZqt.jpg",
            "songList": [{
              "singername": "马良",
              "songname": "往后余生"
            }, {
              "singername": "谭维维",
              "songname": "晚婚"
            }, {
              "singername": "韩寒",
              "songname": "奉献"
            }],
            "topTitle": "巅峰榜·流行指数",
            "type": 0
          }, {
            "id": 26,
            "listenCount": 20000000,
            "picUrl": "http://y.gtimg.cn/music/photo_new/T003R300x300M000000twWI9013HkE.jpg",
            "songList": [{
              "singername": "张学友",
              "songname": "烦恼歌"
            }, {
              "singername": "胡夏/郁可唯",
              "songname": "知否知否"
            }, {
              "singername": "G.E.M. 邓紫棋",
              "songname": "光年之外"
            }],
            "topTitle": "巅峰榜·热歌",
            "type": 0
          }, {
            "id": 27,
            "listenCount": 16000000,
            "picUrl": "http://y.gtimg.cn/music/photo_new/T003R300x300M000001vuHHC1KusDA.jpg",
            "songList": [{
              "singername": "张杰",
              "songname": "时间的远方"
            }, {
              "singername": "杨宗纬",
              "songname": "星"
            }, {
              "singername": "韩寒",
              "songname": "奉献"
            }],
            "topTitle": "巅峰榜·新歌",
            "type": 0
          }, {
            "id": 58,
            "listenCount": 5639020,
            "picUrl": "http://y.gtimg.cn/music/photo_new/T003R300x300M000003V1F2d3cYvdN.jpg",
            "songList": [{
              "singername": "王嘉尔/ICE",
              "songname": "Red"
            }, {
              "singername": "G.E.M. 邓紫棋/艾热",
              "songname": "光年之外 (热爱版)"
            }, {
              "singername": "小青龙",
              "songname": "潇洒每一天"
            }],
            "topTitle": "说唱榜",
            "type": 0
          }, {
            "id": 28,
            "listenCount": 16000000,
            "picUrl": "http://y.gtimg.cn/music/photo_new/T003R300x300M000000JQoDV2XeV9P.jpg",
            "songList": [{
              "singername": "曲肖冰",
              "songname": "天亮以前说再见"
            }, {
              "singername": "花姐",
              "songname": "狂浪"
            }, {
              "singername": "刘珂矣",
              "songname": "半壶纱"
            }],
            "topTitle": "巅峰榜·网络歌曲",
            "type": 0
          }, {
            "id": 5,
            "listenCount": 3485480,
            "picUrl": "http://y.gtimg.cn/music/photo_new/T003R300x300M000001zMoTN4QBVWj.jpg",
            "songList": [{
              "singername": "胡夏/郁可唯",
              "songname": "知否知否"
            }, {
              "singername": "张杰",
              "songname": "时间的远方"
            }, {
              "singername": "郁可唯",
              "songname": "知否知否 (女声版)"
            }],
            "topTitle": "巅峰榜·内地",
            "type": 0
          }, {
            "id": 6,
            "listenCount": 1517820,
            "picUrl": "http://y.gtimg.cn/music/photo_new/T003R300x300M000002UItCc37aNxu.jpg",
            "songList": [{
              "singername": "杨宗纬",
              "songname": "星"
            }, {
              "singername": "阿信",
              "songname": "一半人生"
            }, {
              "singername": "G.E.M. 邓紫棋",
              "songname": "岩石里的花"
            }],
            "topTitle": "巅峰榜·港台",
            "type": 0
          }, {
            "id": 3,
            "listenCount": 9300000,
            "picUrl": "http://y.gtimg.cn/music/photo_new/T003R300x300M000000F1Kaw1UbOri.jpg",
            "songList": [{
              "singername": "Westlife",
              "songname": "Hello My Love"
            }, {
              "singername": "Ariana Grande",
              "songname": "7 rings (Explicit)"
            }, {
              "singername": "Galantis/OneRepublic",
              "songname": "Bones"
            }],
            "topTitle": "巅峰榜·欧美",
            "type": 0
          }, {
            "id": 16,
            "listenCount": 4530780,
            "picUrl": "http://y.gtimg.cn/music/photo_new/T003R300x300M000001Eb9x31z2mOO.jpg",
            "songList": [{
              "singername": "ITZY",
              "songname": "달라달라 (DALLA DALLA)"
            }, {
              "singername": "화사 (华莎)",
              "songname": "멍청이 (TWIT)"
            }, {
              "singername": "로시 (Rothy)",
              "songname": "레인보우 (Rainbow)"
            }],
            "topTitle": "巅峰榜·韩国",
            "type": 0
          }, {
            "id": 29,
            "listenCount": 1960000,
            "picUrl": "http://y.gtimg.cn/music/photo_new/T003R300x300M000000X0tfU105Xa3.jpg",
            "songList": [{
              "singername": "摩登兄弟",
              "songname": "宁愿"
            }, {
              "singername": "韩寒",
              "songname": "奉献"
            }, {
              "singername": "周笔畅",
              "songname": "去流浪"
            }],
            "topTitle": "巅峰榜·影视金曲",
            "type": 0
          }, {
            "id": 17,
            "listenCount": 1495456,
            "picUrl": "http://y.gtimg.cn/music/photo_new/T003R300x300M000000B6izj4I0MD3.jpg",
            "songList": [{
              "singername": "あいみょん",
              "songname": "あした世界が終わるとしても (即便明天世界终结)"
            }, {
              "singername": "女王蜂 (じょおうばち)",
              "songname": "火炎"
            }, {
              "singername": "RADWIMPS (ラッドウィンプス)",
              "songname": "PAPARAZZI (English Version)"
            }],
            "topTitle": "巅峰榜·日本",
            "type": 0
          }, {
            "id": 201,
            "listenCount": 156846,
            "picUrl": "http://y.gtimg.cn/music/photo_new/T003R300x300M000001BJIeN4b2v95.jpg",
            "songList": [{
              "singername": "蔡徐坤",
              "songname": "Wait Wait Wait"
            }, {
              "singername": "周笔畅",
              "songname": "去流浪 (《流浪地球》电影推广曲)"
            }, {
              "singername": "ITZY",
              "songname": "달라달라 (DALLA DALLA)"
            }],
            "topTitle": "巅峰榜·MV",
            "type": 0
          }, {
            "id": 52,
            "listenCount": 867895,
            "picUrl": "http://y.gtimg.cn/music/photo_new/T003R300x300M000000KIAVP3s8Oun.jpg",
            "songList": [{
              "singername": "陈硕子",
              "songname": "你早就该忘了她"
            }, {
              "singername": "一只白",
              "songname": "零食、恋爱和想你"
            }, {
              "singername": "司徒赫伦",
              "songname": "阿里"
            }],
            "topTitle": "巅峰榜·腾讯音乐人原创榜",
            "type": 0
          }, {
            "id": 36,
            "listenCount": 2499300,
            "picUrl": "http://y.gtimg.cn/music/photo_new/T003R300x300M000004bhA5d4QVHL3.jpg",
            "songList": [{
              "singername": "大天使 icey",
              "songname": "知否知否"
            }, {
              "singername": "朴爱源",
              "songname": "不为谁而作的歌"
            }, {
              "singername": "麓七",
              "songname": "光年之外"
            }],
            "topTitle": "巅峰榜·K歌金曲",
            "type": 0
          }]
        }
      },
      code = data.code,
      data = data.data,
      list = data.topList;
    if (code == 0) {
      this.setData({
        rank: list
      });
      wx.hideLoading();
    }
    //   },
    //   fail: req => {
    //     wx.showToast({
    //       icon:'none',
    //       title: '哎呀！数据出错了，别急，程序猿正在加急修改中',
    //     })
    //   }
    // })
  },
  goTonext(e) {
    var id = e.currentTarget.dataset.id;
    //跳转详情榜单页面
    wx.navigateTo({
      url: '../top/top?disstid=' + id,
    })
  }
})