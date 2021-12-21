// pages/index/index.js
import request from "../../utils/request"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图数据
    bannerList: [],
    // 推荐歌曲数据
    recommendList: [],
    // 排行榜数据
    topList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 获取轮播图数据
    let bannerListData = await request('/banner', {type: 2}, 'GET')
    this.setData({
      bannerList: bannerListData.banners
    })
    // 获取推荐歌曲数据
    let recommendListData = await request('/personalized', {limit: 10}, 'GET')
    this.setData({
      recommendList: recommendListData.result
    })
    // 获取排行榜数据
    let index = 0
    let topListArray = []
    while (index < 5) {
      let topListData = await request('/top/list', {idx: index++}, 'GET')
      let topListItem = {name: topListData.playlist.name, tracks: topListData.playlist.tracks.slice(0,3)}
      topListArray.push(topListItem)
      this.setData({
        topList: topListArray
      })
    }
    // 性能和用户体验的一个取舍问题
    // 如果是等五个排行榜的数据都请求完再渲染的话，当用户网速比较慢的时候，就可能会陷入空白，体验不太好，但是优点是性能好一点
    // 只用渲染一次,这里就是一个取舍问题, 把数据更新放在每次请求之后的话,体验会好一点,但是会渲染五次,性本能会差一点
    // this.setData({
    //   topList: topListArray
    // })
  },

  toSongDetail(){
    wx.navigateTo({
      url: '/pages/recommendSong/recommendSong'
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