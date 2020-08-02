// miniprogram/pages/3.1/index.js
import loginWithCallback from '../../lib/login'

// 模拟一个
Promise.any = (arr)=>{
  let numTotal = arr.length
  let numSettled = 0
  let resolved = false 
  return new Promise((resolve, reject)=>{
    for(let j=0;j<numTotal;j++){
      let p = arr[j]
      p.then(res=>{
        resolved = true 
        resolve(res)
      },err=>{
        console.log('any err', err);
      }).finally((res)=>{
        numSettled++
        if (numSettled >= numTotal && !resolved) reject('all failed')
      })
    }
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  // 3.4 any
  any(e){
    const app = getApp()
    let promise1 = app.wxp.request({url: 'http://localhost:3000/'}),
        promise2 = app.wxp.request({url: 'http://localhost:3000/hi'}),
        promise3 = app.wxp.request({url: 'http://localhost:3000/user/home'});
    let promise = Promise.any([promise1,promise2,promise3])
    promise.then(res=>{
      console.log('any promise res', res);
    },err=>{
      console.log('any promise err', err);
    })
  },

  all(e){
    const app = getApp()
    let promise1 = app.wxp.request({url: 'http://localhost:3000/'}),
        promise2 = app.wxp.request({url: 'http://localhost:3000/hi'}),
        promise3 = app.wxp.request({url: 'http://localhost:3000/user/home'});
    let promise = Promise.all([promise1,promise2,promise3])
    promise.then(res=>{
      console.log('all promise res', res);
    },err=>{
      console.log('all promise err', err);
    })
  },

  race(e){
    const app = getApp()
    let promise1 = app.wxp.request({url: 'http://localhost:3000/'}),
        promise2 = app.wxp.request({url: 'http://localhost:3000/hi'}),
        promise3 = app.wxp.request({url: 'http://localhost:3000/user/home'});
    let promise = Promise.race([promise1,promise2,promise3])
    promise.then(res=>{
      console.log('race promise res', res);
    },err=>{
      console.log('race promise err', err);
    })
  },

  // 3.1 测试一个网络请求，及返回
  startOneRequest() {
    // 正常
    wx.request({
      url: 'http://localhost:3000/hi',
      success(res) {
        if (res.errMsg === "request:ok") console.log("res1", res)
      },
      fail(err) {
        if (err.errMsg === "request:fail") console.log("err1", err)
      },
      complete(resOrErr) {
        console.log("resOrErr1", resOrErr)
      }
    })

    // 错误
    wx.request({
      url: 'http://localhost:3000/err',
      success(res) {
        if (res.errMsg === "request:ok") console.log("res2", res)
      },
      fail(err) {
        if (err.errMsg === "request:fail") console.log("err2", err)
      },
      complete(resOrErr) {
        console.log("resOrErr2", resOrErr)
      }
    })

    // 取消
    let reqTask = wx.request({
      url: 'http://localhost:3000/err',
      success(res) {
        if (res.errMsg === "request:ok") console.log("res3", res)
      },
      fail(err) {
        if (err.errMsg === "request:fail") console.log("err3", err)
      },
      complete(resOrErr) {
        // 被取消时，也会被调用
        console.log("resOrErr3", resOrErr)
      }
    })
    const headersReceivedCallback = function (headers) {
      // "use strict"
      reqTask.offHeadersReceived(headersReceivedCallback)
      console.log('headers', headers);
      // Protected resource = 18 chars
      // 能拿到这个长度，可能数据已经返回了，可以基于其它逻辑实施abort
      if (~~headers.header['Content-Length'] < 19) reqTask.abort()
    }
    reqTask.onHeadersReceived(headersReceivedCallback)
    // reqTask.abort()
  },

  // 在登陆之后，发起网络请求
  startLoginAndRequest(e) {
    // 调用user/home接口
    const requestUserHome = (token) => {
      wx.request({
        url: 'http://localhost:3000/user/home',
        header: {
          'Authorization': `Bearer ${token}`
        },
        success(res) {
          if (res.errMsg === "request:ok") console.log("/user/home res", res)
        },
        fail(err) {
          if (err.errMsg === "request:fail") console.log("/user/home err", err)
        },
        complete(resOrErr) {
          console.log("/user/home resOrErr", resOrErr)
        }
      })
    }

    let {
      userInfo,
      encryptedData,
      iv
    } = e.detail
    console.log('userInfo', userInfo);

    const requestLoginApi = (code) => {
      //发起网络请求
      wx.request({
        url: 'http://localhost:3000/user/wexin-login2',
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        data: {
          code: code,
          userInfo,
          encryptedData,
          iv
        },
        success(res) {
          console.log('请求成功', res.data)
          let token = res.data.data.authorizationToken
          wx.setStorageSync('token', token)
          onUserLogin(token)
          console.log('authorization', token)
        },
        fail(err) {
          console.log('请求异常', err)
        }
      })
    }

    const onUserLogin = (token) => {
      getApp().globalData.token = token
      wx.showToast({
        title: '登陆成功了',
      })
      requestUserHome(token)
    }

    const login = () => {
      wx.login({
        success(res0) {
          if (res0.code) {
            requestLoginApi(res0.code)
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    }

    wx.checkSession({
      success() {
        let token = wx.getStorageSync('token')
        if (token) {
          onUserLogin(token)
        } else {
          // session会重复，需要处理
          login()
        }
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        login()
      }
    })
  },

  // 在登陆之后，发起网络请求
  startLoginAndRequest2(e) {
    // 调用user/home接口
    const requestUserHome = (token) => {
      wx.request({
        url: 'http://localhost:3000/user/home',
        header: {
          'Authorization': `Bearer ${token}`
        },
        success(res) {
          if (res.errMsg === "request:ok") console.log("/user/home res", res)
        },
        fail(err) {
          if (err.errMsg === "request:fail") console.log("/user/home err", err)
        },
        complete(resOrErr) {
          console.log("/user/home resOrErr", resOrErr)
        }
      })
    }

    // 先判断
    if (wx.getStorageSync('token')) {
      let token = wx.getStorageSync('token')
      requestUserHome(token)
      return
    }

    let {
      userInfo,
      encryptedData,
      iv
    } = e.detail
    console.log('userInfo', userInfo);

    const requestLoginApi = (code) => {
      //发起网络请求
      wx.request({
        url: 'http://localhost:3000/user/wexin-login2',
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        data: {
          code: code,
          userInfo,
          encryptedData,
          iv
        },
        success(res) {
          console.log('请求成功', res.data)
          let token = res.data.data.authorizationToken
          wx.setStorageSync('token', token)
          onUserLogin(token)
          console.log('authorization', token)
        },
        fail(err) {
          console.log('请求异常', err)
        }
      })
    }

    const onUserLogin = (token) => {
      getApp().globalData.token = token
      wx.showToast({
        title: '登陆成功了',
      })
      requestUserHome(token)
    }

    const login = () => {
      wx.login({
        success(res0) {
          if (res0.code) {
            requestLoginApi(res0.code)
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    }

    wx.checkSession({
      success() {
        let token = wx.getStorageSync('token')
        if (token) {
          onUserLogin(token)
        } else {
          // session会重复，需要处理
          login()
        }
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        login()
      }
    })
  },

  // 在登陆之后，发起网络请求
  startLoginAndRequest3(e) {
    // 调用user/home接口
    const requestUserHome = (token) => {
      wx.request({
        url: 'http://localhost:3000/user/home',
        header: {
          'Authorization': `Bearer ${token}`
        },
        success(res) {
          if (res.errMsg === "request:ok") console.log("/user/home res", res)
        },
        fail(err) {
          if (err.errMsg === "request:fail") console.log("/user/home err", err)
        },
        complete(resOrErr) {
          console.log("/user/home resOrErr", resOrErr)
        }
      })
    }

    this.loginWithCallback(e, (token) => {
      requestUserHome(token)
    })
  },

  startLoginAndRequestOther(e) {
    // 调用user/home接口
    const requestUserHome = (token) => {
      wx.request({
        url: 'http://localhost:3000/user/home?name=ly',
        header: {
          'Authorization': `Bearer ${token}`
        },
        success(res) {
          if (res.errMsg === "request:ok") console.log("/user/home res", res)
        },
        fail(err) {
          if (err.errMsg === "request:fail") console.log("/user/home err", err)
        },
        complete(resOrErr) {
          console.log("/user/home resOrErr", resOrErr)
        }
      })
    }

    this.loginWithCallback(e, (token) => {
      requestUserHome(token)
    })
  },

  startLoginAndRequest4(e) {
    // 调用user/home接口
    const requestUserHome = (token) => {
      wx.request({
        url: 'http://localhost:3000/user/home',
        header: {
          'Authorization': `Bearer ${token}`
        },
        success(res) {
          if (res.errMsg === "request:ok") console.log("/user/home res", res)
        },
        fail(err) {
          if (err.errMsg === "request:fail") console.log("/user/home err", err)
        },
        complete(resOrErr) {
          console.log("/user/home resOrErr", resOrErr)
        }
      })
    }

    loginWithCallback(e, (token) => {
      requestUserHome(token)
    })
  },

  // 带有回调的登陆方法
  loginWithCallback(e, cb) {
    let {
      userInfo,
      encryptedData,
      iv
    } = e.detail
    // console.log('userInfo', userInfo);

    const requestLoginApi = (code) => {
      //发起网络请求
      wx.request({
        url: 'http://localhost:3000/user/wexin-login2',
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        data: {
          code: code,
          userInfo,
          encryptedData,
          iv
        },
        success(res) {
          console.log('请求成功', res.data)
          let token = res.data.data.authorizationToken
          wx.setStorageSync('token', token)
          onUserLogin(token)
          console.log('authorization', token)
        },
        fail(err) {
          console.log('请求异常', err)
        }
      })
    }

    const onUserLogin = (token) => {
      getApp().globalData.token = token
      wx.showToast({
        title: '登陆成功了',
      })
      if (cb && typeof cb === 'function') cb(token)
    }

    const login = () => {
      wx.login({
        success(res0) {
          if (res0.code) {
            requestLoginApi(res0.code)
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    }

    wx.checkSession({
      success() {
        let token = wx.getStorageSync('token')
        if (token) {
          onUserLogin(token)
        } else {
          // session会重复，需要处理
          login()
        }
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        login()
      }
    })
  },

  async requestHomeApi(e) {
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
    if (res3) console.log('res3', res3)

    let res4 = await app.wxp.request3({
      url: 'http://localhost:3000/user/home',
    })
    if (res4) console.log('res4', res4)
  },

  showLoginPanel(e) {
    this.setData({
      showLoginPanel: true
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