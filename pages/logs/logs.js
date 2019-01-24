//logs.js
const util = require('../../utils/util.js')
const app = getApp()
const TITLE_HEIGHT = 30
const ANCHOR_HEIGHT = 18
Page({
  data: {},
  onLoad: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.showShareMenu();
    wx.request({
      url: '歌手API',
      data: {},
      success:res=> {
        var code = res.data.code,
            data = res.data.data,
            list = data.list;
        if (code == 0) {
          that.setData({
            logs: that.normalizeSinger(list)
          })
          that._calculateHeight();
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
  normalizeSinger(list) {
    //歌手列表渲染
    let map = {
      hot: {
        title: this.data.HOT_NAME,
        items: []
      }
    }
    list.forEach((item, index) => {
      if (index < this.data.HOT_SINGER_LEN) {
        map.hot.items.push({
          name: item.Fsinger_name,
          avatar:this.constructor(item.Fsinger_mid),
          mid:item.Fsinger_mid
          })
      }
      const key = item.Findex
      if (!map[key]) {
        map[key] = {
          title: key,
          items: []
        }
      }
      map[key].items.push({
        name: item.Fsinger_name,
        avatar: this.constructor(item.Fsinger_mid),
        mid:item.Fsinger_mid
      })
    })
    // 为了得到有序列表，我们需要处理 map
    let ret = []
    let hot = []
    for (let key in map) {
      let val = map[key]
      if (val.title.match(/[a-zA-Z]/)) {
        ret.push(val)
      } else if (val.title === this.data.HOT_NAME) {
        hot.push(val)
      }
    }
    ret.sort((a, b) => {
      return a.title.charCodeAt(0) - b.title.charCodeAt(0)
    })
    return hot.concat(ret)
  },
  scroll :function(e) {
    var newY = e.detail.scrollTop;
    this.scrollY(newY);
  },
  scrollY(newY) {
    const listHeight = this.data.listHeight
    // 当滚动到顶部，newY>0
    if (newY == 0 || newY < 0) {
      this.setData({
        currentIndex:0,
        fixedTitle:''
      })
      return
    }
    // 在中间部分滚动
    for (let i = 0; i < listHeight.length - 1; i++) {
      let height1 = listHeight[i]
      let height2 = listHeight[i + 1]
      if (newY >= height1 && newY < height2) {
        this.setData({
          currentIndex:i,
          fixedTitle:this.data.logs[i].title
        })
        this.fixedTt(height2 - newY);
        return
      }
    }
    // 当滚动到底部，且-newY大于最后一个元素的上限
    this.setData({
      currentIndex: listHeight.length - 2,
      fixedTitle: this.data.logs[listHeight.length - 2].title
    })
  },
  fixedTt(newVal) {
    let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
    if (this.data.fixedTop === fixedTop) {
      return
    }
    this.setData({
      fixedTop:fixedTop
    })
  },
  _calculateHeight() {
    var lHeight = [],
        that = this;
    let height = 0;
    lHeight.push(height);
      var query = wx.createSelectorQuery();
      query.selectAll('.list-group').boundingClientRect(function(rects){
        var rect = rects,
            len = rect.length;
        for (let i = 0; i < len; i++) {
          height += rect[i].height;
          lHeight.push(height)
        }
        
      }).exec();
    var calHeight = setInterval(function(){
      if (lHeight != [0]) {
        that.setData({
          listHeight: lHeight
        });
        clearInterval(calHeight);
      } 
    },1000)
  },
  constructor:function(id) {
    this.id = id
    this.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`
    return this.avatar;
  },
  scrollToview(e){
    var id = e.target.dataset.id
    if (id == '热') {
      this.setData({
        scrollTop:0
      })
    } else {
      this.setData({
        toSingerNum: id
      })
    }
    
  },
  toSinger(e){
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '../singer/singer?disstid=' + id,
    })
  }
})
