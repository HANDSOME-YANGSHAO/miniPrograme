// pages/personal/personal.js
import request from "../../utils/request"

let startY = 0
let moveY = 0
let moveDistance = 0

Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: "translateY(0)",
    coverTransition: "",
    userInfo: {},
    recentPlayList: []
  },
  handTouchStart(event) {
    // cover部分每次点击的时候，获取当时点击事件的具体位置
    startY = event.touches[0].clientY
    // 每当触摸滑动结束的时候，会先设置一个transition属性里面的transform过渡效果，让回弹效果平滑一点
    // 不过要注意到第二次触摸滑动start的时候得先去关闭那个过渡效果,不然整个move过程都是不太顺滑得
    this.setData({
      coverTransition: ""
    })
  },
  handTouchMove(event) {
    moveY = event.touches[0].clientY
    moveDistance = moveY - startY
    // 这里用css3的translateY控制元素的移动（内联样式
    if(moveDistance <= 0) return
    if(moveDistance > 80) moveDistance = 80
    this.setData({
      coverTransform: `translateY(${moveDistance}rpx)`
    })
  },
  handTouchEnd() {
    this.setData({
      coverTransition: "transform 0.3s linear",
      coverTransform: "translateY(0)"
    })
  },
  toLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },
  // 根据用户id去获取相关的播放记录
  async getRecentPlayList(userId) {
    let data = await request('/user/record', {uid:userId, type:0})
    // 给数据加工，让其每一项拥有自己的标志
    let index = 0
    let res = data.allData.map(item => {
      item.id = index++
      return item
    })
    this.setData({
      recentPlayList: res
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 如果有缓存则说明已经登陆认证成功，有相关的用户信息了~
    if(wx.getStorageSync('userInfo')) {
      let userInfo = JSON.parse(wx.getStorageSync('userInfo'))
      this.setData({
        userInfo
      })
      // 在上述获得用户信息基础上，根据userInfo内的userId去获取用户最近播放的相关信息
      this.getRecentPlayList(this.data.userInfo.userId)
    }
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