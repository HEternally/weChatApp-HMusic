 - 歌曲来源：[QQ音乐][1]

说明
--

 - 目前只有体验版，如果有兴趣的同学可以私聊我，我帮您加入，名额有限。
 - 因为个人开发者无法发布在线音乐播放小程序，所以开发该小程序目的只为学习小程序开发；
 - 小程序涉及到到所有歌曲资源都来源于QQ音乐，部分API由本人对QQ音乐接口进行了二次封装（我会另外再写一篇文章专门用来分享API，敬请期待）

编辑器效果展示
-------

 - 因为要压缩为GIF格式，所以加快了播放速度并且画质有点差

![](https://user-gold-cdn.xitu.io/2019/2/13/168e4c0fd4267205?w=377&h=600&f=gif&s=3574312)

真机截图
----

[操作视频][3]
 - 推荐页面

![](https://user-gold-cdn.xitu.io/2019/2/13/168e4c185d5627aa?w=750&h=1334&f=jpeg&s=125261)
 - [歌手列表][5]

![](https://user-gold-cdn.xitu.io/2019/2/13/168e4c1c8b9eafec?w=750&h=1334&f=jpeg&s=62395)
 - 各大排行榜

![](https://user-gold-cdn.xitu.io/2019/2/13/168e4c1eca5749cb?w=750&h=1334&f=jpeg&s=97443)
 - 搜索页面

![](https://user-gold-cdn.xitu.io/2019/2/13/168e4c216cb55a4c?w=750&h=1334&f=jpeg&s=74551)
 - 歌手详情页

![](https://user-gold-cdn.xitu.io/2019/2/13/168e4c23d2460e6c?w=750&h=1334&f=jpeg&s=68977)
 - 歌单（排行榜）详情页

![](https://user-gold-cdn.xitu.io/2019/2/13/168e4c267e539b33?w=750&h=1334&f=jpeg&s=77183)
 - 播放器页面

![](https://user-gold-cdn.xitu.io/2019/2/13/168e4c29a7095336?w=750&h=1334&f=jpeg&s=69707)
 - 分享页面

![](https://user-gold-cdn.xitu.io/2019/2/13/168e4c2c83d97702?w=750&h=1334&f=jpeg&s=42039)

## 目前实现的功能 ##

 1. 歌单
 2. 电台
 3. 歌曲播放
 4. MV播放（最近发现QQ音乐的接口不返回MV数据了，所以这个功能暂时无法展示）
 5. [歌手列表][13]
 6. 排行榜
 7. 歌曲歌手搜索（支持模糊查询）
 8. 最近搜索记录
 9. 热门搜索词条
 10. 歌手详情页
 11. 歌单详情页
 12. 歌曲分享
 13. 查看评论
 14. 歌词滚动
 15. 最近播放歌曲

## 接下来准备实现的功能 ##

 1. 用户登录
 2. 私人FM
 3. 增加点赞，评论功能
 4. 歌曲播放方式（随机，单曲，循环）
 5. 收藏
 6. 全局播放器组件

项目目录
----
![图片描述][14]

 1. comment--自定义组件（播放器组件，开发中）
 2. img--存放图片
 3. gedan--歌单页
 4. index--首页
 5. logs--歌手列表页
 6. playSong--播放器页
 7. rank--排行榜页
 8. search--搜索页
 9. share--分享页
 10. singer--歌手详情页
 11. top--歌单详情页
 12. app.js--应用程序逻辑
 13. app.json--应用程序配置
 14. app.wxss--应用程序公共样式


----------

**app.json**
**应用程序配置文件**

```
{
  "pages": [
    "pages/index/index",
    "pages/logs/logs",
    "pages/rank/rank",
    "pages/search/search",
    "pages/gedan/gedan",
    "pages/playSong/playSong",
    "pages/singer/singer",
    "pages/top/top",
    "pages/share/share"
  ],//页面路径列表
  "requiredBackgroundModes": [
    "audio"
  ],//需要在后台使用的能力，这里我们使用到了【音乐播放】
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#fff",
    "navigationBarTitleText": "HMusic",
    "navigationBarTextStyle": "black"
  },//全局到默认窗口表现
  "tabBar": {
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "推荐"
      },
      {
        "pagePath": "pages/logs/logs",
        "text": "歌手"
      },
      {
        "pagePath": "pages/rank/rank",
        "text": "排行榜"
      },
      {
        "pagePath": "pages/playSong/playSong",
        "text": "播放器"
      }
    ],
    "position": "top"
  }//tab栏到表现，默认是放在底部，根据position，我们将其设置为顶部显示
}
```
**每个页面都有各自到配置页面，可以对各自页面进行单独对配置**
[pageName].json用于指定页面工作时，window的设置：

```
{
  // 导航条背景色
  "navigationBarBackgroundColor": "#fff",
  // 导航条前景色（只能是white/black）
  "navigationBarTextStyle": "black",
  // 导航条文本
  "navigationBarTitleText": "HMusic",
  // 窗口背景颜色
  "backgroundColor": "#fff",
  // 窗口前景色
  "backgroundTextStyle": "dark",
  // 是否开启下拉刷新
  "enablePullDownRefresh": false
}
```
**app.js应用程序逻辑**

```
// App函数是一个全局函数，用于创建应用程序对象
App({
  // ========== 全局数据对象（可以整个应用程序共享） ==========
  globalData: { ... },

  // ========== 应用程序全局方法 ==========
  method1 (p1, p2) { ... },
  method2 (p1, p2) { ... },

  // ========== 生命周期方法 ==========
  // 应用程序启动时触发一次
  onLaunch () { ... },

  // 当应用程序进入前台显示状态时触发
  onShow () { ... },

  // 当应用程序进入后台状态时触发
  onHide () { ... }
})
```
欢迎Star[GitHub][15] [博客][16]


  [1]: https://y.qq.com/
  [3]: https://github.com/HEternally/weChatApp-HMusic/blob/master/img/QQ20190128-110802-HD.gif
  [5]: https://juejin.im/post/5b9880dee51d450e7f52d370
  [13]: https://juejin.im/post/5b9880dee51d450e7f52d370
  [15]: https://github.com/HEternally/weChatApp-HMusic
  [16]: http://heternally.ka94.com/
