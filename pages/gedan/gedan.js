const app = getApp()
Page({
  data:{},
  onLoad: function (option) {
    wx.showLoading({
      title: '加载中',
    })
    let disstid = option.disstid;
    this.setData({
      disstid:disstid
    });
    this.getGeDan(disstid, 0);
    wx.showShareMenu();
  },
  getGeDan(disstid,begin) {
    //获取歌单歌曲信息，disstid为歌单id，begin为开始号码
    wx.request({
      url: '歌单API',
      data: {},
      success: res => {
        wx.hideLoading();
        var dataList = this.data.list,
            data = res.data.cdlist[0],
            songids = data.songids.split(','),
            songlist = data.songlist;
        if (data.cur_song_num < 15) {
          this.setData({
            havaMusic:false
          })
        } else {
          this.setData({
            havaMusic: true
          })
        }
        if (dataList.songlist) {
          dataList.songlist = dataList.songlist.concat(songlist);
        } else {
          dataList = data;
        }
        data.desc = data.desc.replace(/&#160;/g,'&nbsp;');
        data.desc = data.desc.replace(/&#180;/g,"'");
        data.desc = data.desc.replace(/<br>/g, "\n");
        for(var i = 0;i<songids.length;i++) {
          songids[i] = parseInt(songids[i]);
        }
        this.setData({
          list: dataList,
          songids:songids,
          begin:begin
        });
        this.MusicFcg(begin);
      },
      error: req => {
        wx.showToast({
          icon: 'none',
          title: '哎呀！数据出错了，别急，程序猿正在加急修改中',
        });
      }
    })
  },
  MusicFcg(begin) {
    var data = this.data.MusicFcg;
    var len = this.data.songids.length;
    if (len - begin > 15) {
      data.req_0.param.ids = this.data.songids.slice(begin, parseInt(begin + 15));
      data.req_0.param.types = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    } else {
      var ll = len - begin;
      data.req_0.param.types = [];
      data.req_0.param.ids = this.data.songids.slice(begin);
      for (var i = 0;i<ll;i ++) {
        data.req_0.param.types.push(0);
      }
    }
    wx.request({
      url: '歌曲信息API',
      method:'post',
      data:JSON.stringify(data),
      success:res=> {
        var tricks = res.data.req_0.data.tracks,
            songmid = [];
        for (var i =0;i<tricks.length;i++) {
          songmid.push(tricks[i].mid);
        }
        this.setData({
          songmid:songmid
        });
        var reqData = this.data.req_0;
        reqData.req_0.param.songmid = songmid;
        wx.request({
          url: 'API',
          method:'post',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: JSON.stringify(reqData),
          success:res=> {
            // console.log(res);
            var data= res.data.req_0.data,
                midurlinfo = data.midurlinfo,
                pix = data.sip[0],
                // musicUrl1 = [],
                mUrl = this.data.musicUrl;
            for (var i=0;i<midurlinfo.length;i++) {
              var url = pix + midurlinfo[i].purl;
              mUrl.push(url);
            }
            this.setData({
              musicUrl:mUrl
            })
            // console.log(this.data.musicUrl);
          },
          error:req=> {
            wx.showToast({
              icon: 'none',
              title: '哎呀！数据出错了，别急，程序猿正在加急修改中',
            });
          }
        })
      },
      error:req=> {
        wx.showToast({
          icon: 'none',
          title: '哎呀！数据出错了，别急，程序猿正在加急修改中',
        });
      }
    })
  },
  getMoreMusic:function(){
    var disstid = this.data.disstid,
        begin = this.data.begin;
    begin = begin + 15;
    this.getGeDan(disstid,begin);
  },
  playAll() {
    var id = this.data.disstid;
    app.gePlay(id,0);
    wx.setStorage({
      key: 'share_id',
      data: [],
    })
  },
  musicPlay(e){
    var num = e.currentTarget.dataset.num,
        id = this.data.disstid;
    wx.showLoading({
      title: '加载中',
    })
    app.gePlay(id,num);
    app.globalData.shouldPlay = true;
    // app.globalData.unload = true;
  }
})