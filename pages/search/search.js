const app = getApp();
Page({
  data: {},
  onLoad: function() {
    wx.hideLoading();
    wx.showShareMenu();
    this.getStorage();
    var key = wx.getStorageSync('hotkey'),
      expirationTime = wx.getStorageSync('expirationTime'), //过期时间一天
      time = Date.parse(new Date());
    if (!expirationTime) {
      expirationTime = time;
    }
    if (expirationTime > time) {
      this.setData({
        list: key
      })
    } else {
      wx.request({
        url: '关键字API',
        data: {},
        success: res => {
          var code = res.data.code,
            data = res.data.data,
            list = data.hotkey;
          if (code == 0) {
            var timestamp = Date.parse(new Date());
            var expiration = timestamp + 86400; //过期时间一天
            this.setData({
              list: list
            });
            wx.setStorage({
              key: 'hotkey',
              data: list,
            });
            wx.setStorage({
              key: 'expirationTime',
              data: expiration,
            })
          }
        },
        fail: req => {
          wx.showToast({
            icon: 'none',
            title: '哎呀！数据出错了，别急，程序猿正在加急修改中',
          })
        }
      })
    }
  },
  getStorage() {
    var logs = wx.getStorageSync('yqq_search_history').split(','); //获取搜索记录缓存
    if (logs[0] == '') {
      this.setData({
        keys: [],
        haveKeys: false
      });
    } else {
      this.setData({
        keys: logs,
        haveKeys: true
      });
    }
  },
  inputFocus(e) {
    //输入框获取焦点
    if (!this.data.havaResult) {
      this.setData({
        isHide: true,
        hotHide: true,
        isCancel: true,
        inputShowed: true
      });
      this.getStorage();
    }
  },
  clearKeys: function() {
    //清空搜索记录
    this.setData({
      keys: [],
      haveKeys: false
    });
    wx.setStorageSync('yqq_search_history', '');
  },
  cancel: function() {
    //取消
    this.setData({
      isHide: false,
      sInput: '',
      isNull: true,
      hotHide: false,
      isCancel: false,
      havaResult: false,
      searchResult: [],
      isLoadAll: false,
      inputShowed: false
    })
  },
  clearKey: function(e) {
    //删除某一个记录
    var key = e.target.dataset.key,
      data = this.data.keys;
    for (var i = 0; i < data.length; i++) {
      if (key == data[i]) {
        data.splice(i, 1);
        this.setData({
          keys: data
        })
      }
    }
    wx.setStorageSync('yqq_search_history', this.data.keys);
  },
  searchKey(e) {
    //点击完成按钮时触发
    var val = e.detail.value;
    // console.log(val.trim().length);
    if (val.trim().length == 0) {
      wx.showToast({
        icon: 'none',
        title: '不能查询空值哦',
      })
    } else {
      this.setData({
        searchResult:[]
      });
      this.searchKeyword(val, 1);
    }
  },
  searchInput(e) {
    //输入的时候触发
    var val = e.detail.value;
    if (val.length == 0) {
      this.setData({
        isNull: true
      })
    } else {
      this.setData({
        isNull: false
      })
    }
  },
  clearInput() {
    //清空输入框
    this.setData({
      sInput: '',
      isNull: true,
      searchResult:[]
    })
  },
  searchThisKey(e) {
    //点击热门搜索值
    var key = e.target.dataset.key.replace(/\s+/g, "");
    this.setData({
      sInput: key,
      hotHide: true,
      isNull: false,
      haveKeys: false,
      havaResult: true,
      isCancel: true,
      inputShowed: true,
      sInput: key,
      searchResult:[]
    })
    this.searchKeyword(key, 1);
  },
  in_array(v, arr) {
    var output = true;
    for (var i in arr) {
      if (v == arr[i]) {
        output = false;
        return output;
      }
    }
    output = true;
    return output;
  },
  searchKeyword: function(key, p) { //调用搜索查询接口
    wx.showLoading({
      title: '加载中',
    });
    var logs = this.data.keys;
    var is_true = this.in_array(key, logs);
    if (is_true) {
      logs.push(key);
      wx.setStorageSync('yqq_search_history', logs.join(','));
    }
    wx.request({
      url: '搜索API',
      dataType: 'json',
      success: res => {
        wx.hideLoading();
        var code = res.data.code,
          subcode = res.data.subcode;
        if (subcode == '-10001') {
          wx.showToast({
            icon: 'none',
            title: '哎呀，接口出错了，暂时不能搜索咯，很抱歉',
          })
        } else {
          var song = res.data.data.song,
            curpage = song.curpage,
            curnum = song.curnum,
            totalnum = song.totalnum,
            list = this.data.searchResult,
            singer = res.data.data.zhida;
          var c = list.concat(song.list);
          if (curpage * curnum >= totalnum) {
            this.setData({
              searchResult: c,
              isLoadAll: true,
              canGetsearch: false,
              isHide: false,
              havaResult: true,
              singer: singer
            })
          } else {
            this.setData({
              searchResult: c,
              isLoadAll: false,
              canGetsearch: true,
              isHide: false,
              havaResult: true,
              singer: singer
            })
          }
        }
      }
    })
  },
  scroll: function(e) {
    var p = this.data.p,
      sInput = this.data.sInput;
    if (this.data.canGetsearch) {
      p = p + 1;
      this.searchKeyword(sInput, p);
      this.setData({
        canGetsearch: false,
        p: p
      })
    }
  },
  goToplay: function(e) {
    //跳到播放页
    var id = e.currentTarget.dataset.id,
      name = e.currentTarget.dataset.name,
      song_id = wx.getStorageSync('song_id');
    // console.log(song_id);
    if (song_id == '') {
      var songid = [],
        mname = [];
      songid.push(id);
      mname.push(name);
      wx.setStorage({
        key: 'song_id',
        data: songid,
      });
      wx.setStorage({
        key: 'music_name',
        data: mname,
      });
      wx.setStorage({
        key: 'num',
        data: 0,
      })
      app.globalData.shouldPlay = true;
      // app.globalData.unload = true;
    } else {
      if (song_id.indexOf(id) != '-1') {
        var num = song_id.indexOf(id);
        wx.setStorage({
          key: 'num',
          data: num,
        });
      } else {
        var num = wx.getStorageSync('num'),
          musicName = wx.getStorageSync('music_name');
        num++;
        song_id.splice(num, 0, id);
        musicName.splice(num, 0, name);
        wx.setStorage({
          key: 'song_id',
          data: song_id,
        });
        wx.setStorage({
          key: 'music_name',
          data: musicName,
        });
        wx.setStorage({
          key: 'num',
          data: num,
        })
        app.globalData.shouldPlay = true;
        // app.globalData.unload = true;
      }
    }

    wx.switchTab({
      url: '../playSong/playSong',
    })
  },
  goToSinger(e) {
    var id = e.currentTarget.dataset.singermid;
    wx.navigateTo({
      url: '../singer/singer?disstid=' + id,
    })
  }
})