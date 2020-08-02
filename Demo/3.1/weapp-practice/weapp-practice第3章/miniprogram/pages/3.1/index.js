// miniprogram/pages/3.1/index.js



Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoginPanel:false
  },

  // 3.1 测试一个网络请求，及返回
  startOneRequest(){
    // 正常
    wx.request({
      url:'http://localhost:3000/hi',
      success(res) {
        if (res.errMsg === "request:ok") console.log("res1",res)
      },
      fail(err) {
        if (err.errMsg === "request:fail") console.log("err1",err)
      },
      complete(resOrErr) {
        console.log("resOrErr1",resOrErr)
      }
    })

    // 错误
    wx.request({
      url:'http://localhost:3000/err',
      success(res) {
        if (res.errMsg === "request:ok") console.log("res2",res)
      },
      fail(err) {
        if (err.errMsg === "request:fail") console.log("err2",err)
      },
      complete(resOrErr) {
        console.log("resOrErr2",resOrErr)
      }
    })

    // 取消
    let reqTask = wx.request({
      url:'http://localhost:3000/err',
      success(res) {
        if (res.errMsg === "request:ok") console.log("res3",res)
      },
      fail(err) {
        if (err.errMsg === "request:fail") console.log("err3",err)
      },
      complete(resOrErr) {
        // 被取消时，也会被调用
        console.log("resOrErr3",resOrErr)
      }
    })
    const headersReceivedCallback = function(headers){
      // "use strict"
      reqTask.offHeadersReceived(headersReceivedCallback)
      console.log('headers',headers);
      // Protected resource = 18 chars
      // 能拿到这个长度，可能数据已经返回了，可以基于其它逻辑实施abort
      if (~~headers.header['Content-Length']<19) reqTask.abort()
    }
    reqTask.onHeadersReceived(headersReceivedCallback)
    // reqTask.abort()
  },

  async requestHomeApi(e){
    const app = getApp()
    // 三个异步操作
    // const app = getApp()

  

    let res1 = await app.wxp.getSystemInfo()
    if (res1) console.log(res1)

    // Uncaught (in promise) thirdScriptError
    let res2 = await app.wxp.request2({
      url: 'http://localhost:3000/hi',
    })
    if (res2) console.log(res2)

    let res3 = await app.wxp.request2({
      url: 'http://localhost:3000/user/home',
    })
    if (res3) console.log('res3',res3)

    let res4 = await app.wxp.request3({
      url: 'http://localhost:3000/user/home',
    })
    if (res4) console.log('res4',res4)
  },

  showLoginPanel(e){
    this.setData({
      showLoginPanel:true
    })
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