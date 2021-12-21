// pages/login/login.js
import request from "../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 收集表单数据
    phone: "19823319896",
    password: "abc1730911960",
  },
  // 这里用一个事件回调处理多个元素元素节点的事件触发，参照了事件委托的原理，类似子组件触发但是靠冒泡只用父组件的回调函数就可以
  // 表单输入框输入数据的事件回调
  handleInput: function (event) {
    let type = event.currentTarget.dataset.name
    this.setData({
      [type]: event.detail.value,
      
    })
  },
  // 登陆事件
  async handleLogin() {
    // 1:前端验证
    
    let {phone, password} = this.data
    if(!phone) {
      wx.showToast({
        title: '手机号不能为空！',
        icon: 'none'
      })
      return
    }
    
    let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/
    if(!phoneReg.test(phone)) {
      wx.showToast({
        title: '手机号格式错误!',
        icon: 'none'
      })
      return
    }

    if(!password) {
      wx.showToast({
        title: '密码不能为空！',
        icon: 'none'
      })
      return
    }
    
    // 2：后端验证
    let res = await request('/login/cellphone', {phone, password, isLogin: true})
    if(res.code === 200) {
      wx.showToast({
        title: '登陆成功！'
      })
      
      // 响应成功，把相关数据存储到本地存储(这里把相关对象数据转换成JSON字符串存储)
      wx.setStorageSync('userInfo', JSON.stringify(res.profile))
      
      // 登陆成功，跳回个人信息页面
      wx.reLaunch({
        url: '/pages/personal/personal'
      })
      return
    }else if(res.code === 400) {
      wx.showToast({
        title: '号码错误！',
        icon: 'none'
      })
      return
    }else if(res.code === 502) {
      wx.showToast({
        title: '密码错误！',
        icon: 'none'
      })
      return
    }else {
      wx.showToast({
        title: '登陆失败，请重新登陆！',
        icon: 'none'
      })
      return
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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