import { promisifyAll } from 'miniprogram-api-promise';

const wxp = {}
promisifyAll(wx, wxp)

// compatible usage
// wxp.getSystemInfo({success(res) {console.log(res)}})

// 捕捉错误 3.6
wxp.request2 = function(args){
  let token = wx.getStorageSync('token')
  if (token){
    if (!args.header) args.header = {}
    args.header['Authorization'] = `Bearer ${token}`
  }
  return wxp.request(args).catch(function(reason) {
    console.log('reason',reason);
 })
}

// 3.7
// 整合登录
wxp.request3 = function(args){
  let token = wx.getStorageSync('token')
  if (!token){
    let pages = getCurrentPages()
    let currentPage = pages[pages.length-1]
    // 展示登陆浮窗
    currentPage.setData({
      showLoginPanel:true
    })
    return new Promise((resolve, reject) => {
      getApp().globalEvent.once('loginSuccess',function(e){
        wxp.request2(args).then(function(result){
          resolve(result)
        }).catch(function(reason) {
          console.log('reason',reason);
        })
      })
    })
  }
  return wxp.request2(args).catch(function(reason) {
    console.log('reason',reason);
 })
}

export default wxp