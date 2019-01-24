//rank.js
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data:{},
  onLoad: function(){
    wx.showLoading({
      title: '加载中',
    });
    wx.showShareMenu();
    wx.request({
      url: '排行榜API',
      data: {},
      success: res => {
        var code = res.data.code,
            data = res.data.data,
            list = data.topList;
          if (code == 0) {
            this.setData({
              rank:list
            });
            wx.hideLoading();
          }
      },
      fail: req => {
        wx.showToast({
          icon:'none',
          title: '哎呀！数据出错了，别急，程序猿正在加急修改中',
        })
      }
    })
  },
  goTonext(e) {
    var id = e.currentTarget.dataset.id;
    //跳转详情榜单页面
    wx.navigateTo({
      url: '../top/top?disstid=' + id,
    })
  }
})