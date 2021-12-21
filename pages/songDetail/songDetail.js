import request from "../../utils/request"
// 订阅发布事件库
import PubSub from 'pubsub-js'
// 时间转换格式
import moment from "moment";
// 引入App全局实例
const appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,
    song: {},
    songId: '',
    currentTime: '00:00',
    durationTime: '00:00',
    currentWidth: 0
  },
  // 根据歌曲id发送请求
  async getSongDetailData(ids) {
    let songData = await request('/song/detail', {ids: ids})
    let durationTime = moment(songData.songs[0].dt).format('mm:ss')
    this.setData({
      song: songData.songs[0],
      durationTime
    })
    // 动态设置当前页面的标题, 离开之后就没有了
    wx.setNavigationBarTitle({
      title: this.data.song.name
    })

    this.startPlay(ids)
  },
  // 音乐播放/暂停的 功能函数
  async musicControl(isPlay) {
    if(isPlay) {
      // 根据歌曲id获取歌曲播放地址
      let musicPlayData = await request('/song/url',{id:this.data.songId})
      this.backgroundAudioManager.title = this.data.song.name
      this.backgroundAudioManager.src = musicPlayData.data[0].url
    }else{
      this.backgroundAudioManager.pause()
    }
  },
  onLoad: function (options) {
    // 当初这里考虑是否把整个歌曲对象拿过来的，但发现url传入的query长度有限，不能传完整的JSON对象过来
    // 所以这里只是选择把当前歌曲id传过来，让后再去根据id请求相关歌曲信息
    let {songId} = options
    this.setData({
      songId
    })
    this.getSongDetailData(songId)
  },
  // 点击播放和暂停的回调
  handleMusicPlay() {
    let isPlay = !this.data.isPlay
    // 这里可以省略，因为改变了isPlay状态后，会在下面的功能函数里面去让全局
    // 背景音乐实例播放或者暂停，实例又监听了播放和暂停回去设置Data里面的isPlay
    // 的值，这里就可以不去设置了~
    // this.setData({
    //   isPlay
    // })
    // 音乐播放/暂停
    this.musicControl(isPlay)
  },
  // 全局背景音频初始化
  backgroundAudioManagerInit(songId){
    // 问题：后台播放只能让背景音乐实例播放/暂停，但界面的isPlay状态没有改变
    // 解决方案：监听背景音乐实例对象的播放/暂停/结束（结束就是直接叉掉）
    this.backgroundAudioManager = wx.getBackgroundAudioManager()
    this.backgroundAudioManager.onPlay(() => {
      this.changePlayState(true)
      appInstance.songId = songId
    })
    this.backgroundAudioManager.onPause(() => {
      this.changePlayState(false)
    })
    this.backgroundAudioManager.onStop(() => {
      this.changePlayState(false)
    })
    this.backgroundAudioManager.onTimeUpdate(() => {
      let currentTime = this.backgroundAudioManager.currentTime
      currentTime = moment(currentTime * 1000).format('mm:ss')
      let currentWidth = this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration*400
      this.setData({
        currentTime,
        currentWidth
      })
    })
    this.backgroundAudioManager.onEnded(() => {
      // 停止当前这首
      this.backgroundAudioManager.pause()

      // 自动播放下一首
        // 订阅事件（绑定事件）：这里监听日推页面传送musicId得事件
      PubSub.subscribe('musicId', (msg, songId) => {
        this.setData({
          songId
        })
        this.getSongDetailData(songId)
        PubSub.unsubscribe('musicId')
      })
      // 发布事件（触发事件）：这里让推荐页面知道是切上一首还是下一首
      PubSub.publish('switchType', 'next')
      })

      // 进度条归零
      this.setData({
        currentWidth: 0,
        currentTime: '00:00'
      })
      
      this.backgroundAudioManager.play()
  },
  // 改变播状态
  changePlayState(isPlay) {
    this.setData({
      isPlay
    })
    appInstance.isPlay = isPlay 
  },
  startPlay(songId) {
    // 离开当前歌页面又进来当前歌页面的话，更改播放状态
    if(appInstance.isPlay && appInstance.songId === songId) {
      this.setData({
        isPlay: true
      })
    }else{
      // 首次进入歌曲页面 / 离开当前歌曲，又进入到另外一首不同的歌曲
      this.backgroundAudioManagerInit(songId)
      this.handleMusicPlay()
    }
  },
  // 切换音乐
  handleSwitch(event) {
    this.backgroundAudioManager.pause()
    let type = event.currentTarget.id
    // 订阅事件（绑定事件）：这里监听日推页面传送musicId得事件
    PubSub.subscribe('musicId', (msg, songId) => {
      this.setData({
        songId
      })
      this.getSongDetailData(songId)
      PubSub.unsubscribe('musicId')
    })
    // 发布事件（触发事件）：这里让推荐页面知道是切上一首还是下一首
    PubSub.publish('switchType', type)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})