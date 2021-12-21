// pages/recommendSong/recommendSong.js
import request from "../../utils/request"
import PubSub from 'pubsub-js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: '',
    month: '',
    recommendList: [],
    index: ''//当前点击播放歌曲的下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 每日推荐歌曲下面的推荐歌曲接口要求必须携带cookie，
    // 故先判断是否是登陆，没登录就没有cookie，就跳到登陆界面
    let userInfo = wx.getStorageSync('cookies')
    if(!userInfo) {
      wx.showToast({
        title: '请先登陆！',
        icon: 'none',
        success: () => {
          wx.reLaunch({
            url: '/pages/login/login'
          })
        }
      })
    }

    // 若有cookies请求推荐歌曲数据
    this.getRecommendLsitData()

    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1 //这里加1是因为这个函数取出来的月份是按照0到11计算的
    })

    // 推荐页面订阅事件(绑定事件回调先)
    PubSub.subscribe('switchType', (msg, type) => {
      let index = this.data.index
      let length = this.data.recommendList.length
      if(type === 'pre'){
        // 边界判断
        if(index === 0) {
          index = length - 1
        }else{
          index -= 1
        }
      }else{
        // 边界条件
        if(index === length-1){
          index = 0
        }else{
          index += 1
        }
      }
      // 发布事件（触发事件）：发送上一首/下一首的音乐id过去
      let musciId = this.data.recommendList[index].id
      PubSub.publish('musicId', musciId)
      this.setData({
        index
      })
    })
  },
  // 获取推荐歌曲数据
  async getRecommendLsitData() {
    let recommendLsitData = await request('/recommend/songs')
    this.setData({
      recommendList: recommendLsitData.recommend
    })
  },
  // 跳转到歌曲详情界面
  toSongDeatil(event) {
    // 获取相应的每一首歌曲的ID
    let songId = event.currentTarget.dataset.song.id
    // 点击当前歌曲时记录当前歌曲在日推得下标，方便切歌得时候用
    let index = event.currentTarget.dataset.index
    this.setData({
      index
    })
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?songId=' +  songId
    })
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