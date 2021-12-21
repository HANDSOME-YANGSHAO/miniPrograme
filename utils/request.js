// 封装一个请求函数，小程序有自己封装好的一个请求函数，类似于axios那样的一个函数（封装了原生的AJAX），这里我们可以自己进行一些配置
// 和封装，让它成为一个公用的低耦合度请求函数，方便我们后续使用
import config from "./config"

export default function (url, data={},method="GET") {
  return new Promise( (resolve, reject) => {
    wx.request({
      url: config.test + url,
      data: data,
      method: method,
      header: {
        // 只有登陆了才会有本地存储cookie，所以这里判断有cookie 的时候再添加到请求头里面
        cookie: wx.getStorageSync('cookies')?wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !== -1):''
      },
      success: function(res){
        // 如果是登陆的请求会携带isLogin属性，根据这个属性来
        // 截取登陆请求响应数据的cookie
        if(data.isLogin) {
          wx.setStorage({
            key:"cookies",
            data: res.cookies
          })
        }
        resolve(res.data)
      },
      fail: function(err) {
        reject(err)
      }
    })
  })
}