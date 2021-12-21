import request from "../../utils/request"
let timer = null //给防抖使用
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: '', 
    hotList: [],
    searchInput: '',
    searchList: null,
    timer: null,
    historyList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInitData()
  },
  // 初始化数据
  async getInitData() {
    let placeholderContent = await request('/search/default')
    let hotList = await request('/search/hot/detail')
    this.setData({
      placeholderContent: placeholderContent.data.showKeyword,
      hotList: hotList.data
    })
    // 获取历史搜索记录
    this.getSearchHistory()
  },
  // 模糊搜索
  async getSearchList(keywords) {
    // 非空才发送
    if(keywords) {
      let searchListData = await request('/search',{keywords: keywords,limit: 10})
      this.setData({
        searchList: searchListData.result.songs
      })

      // 添加历史记录
      let {searchInput, historyList} = this.data
      if(historyList.indexOf(searchInput) !== -1) {
        historyList.splice(historyList.indexOf(searchInput),1)
      }
      historyList.unshift(searchInput)
      this.setData({
        historyList
      })
      wx.setStorageSync('searchHistory', historyList)
    }else{
      this.setData({
        searchList: null
      })
    }
  },
  // 处理输入框输入事件
  handleInput(event) {
    let searchInput = event.detail.value.trim()
    this.setData({
      searchInput
    })
    // 加上防抖
    clearTimeout(timer)
    timer = setTimeout(() => {
      this.getSearchList(searchInput)
      console.log('防抖测验')
    }, 300)
  },
  // 获取本地搜索历史记录
  getSearchHistory() {
    let historyList = wx.getStorageSync('searchHistory')
    if(historyList) {
      this.setData({
        historyList
      })
    }
  },
  // 点击取消删除文本框内容
  cancel() {
    if(this.data.searchList) {
      this.setData({
        searchInput: '',
        searchList: null
      })
    }
  },
  // 删除历史记录的回调
  deleteHistory() {
    wx.showModal({
      content: '是否删除历史记录?',
      success: (res) =>{
        if(res.confirm) {
          this.setData({
            historyList: []
          })
          wx.removeStorageSync('searchHistory')
        }
      }
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