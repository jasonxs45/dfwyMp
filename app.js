import { toast, loading } from './utils/util'
import _login from './api/login'
import { _getUserInfoByUid, _getWXUserInfo } from '/api/getuserinfo'
App({
  shareInfo: {
    title: '我是分享标题'
  },
  globalData: {
    userInfo: null
  },
  toast,
  loading,
  checkAuth () {
    let uid = wx.getStorageSync('uid')
    return new Promise((resolve, reject) => {
      if (uid) {
        resolve(uid)
      } else {
        // 登录获取uid
        wx.login({
          success: r => {
            if (r.code) {
              _login(r.code)
                .then(res => {
                  if (res.data.code === 0) {
                    const { openid, session_key, unionid } = res.data.data
                    if (unionid) {
                      resolve(unionid)
                    } else {
                      reject('登录没有uid')
                    }
                    wx.setStorageSync('openid', openid)
                    wx.setStorageSync('uid', unionid)
                    wx.setStorageSync('s_key', session_key)
                  } else {
                    reject(res.data.msg)
                  }
                })
                .catch(err => {
                  reject(err)
                })
            }
          }
        })
      }
    })
  },
  login () {
    return new Promise((resolve, reject) => {
      wx.login({
        success: r => {
          if (r.code) {
            _login(r.code)
              .then(res => {
                if (res.data.code === 0) {
                  const { openid, session_key, unionid } = res.data.data
                  resolve({ openid, session_key, unionid })
                  wx.setStorageSync('openid', openid)
                  wx.setStorageSync('uid', unionid)
                  wx.setStorageSync('s_key', session_key)
                } else {
                  reject(res.data)
                }
              })
              .catch(err => {
                reject(err)
              })
          }
        }
      })
    })
  },
  getUserInfoByUid (uid) {
    return new Promise((resolve, reject) => {
      _getUserInfoByUid(uid)
        .then(res => {
          if (res.data.code === 0) {
            this.globalData.userInfo = res.data.data
            resolve(res.data.data)
          } else {
            reject(res.data)
          }
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  onGetWXUserInfo (e) {
    const { iv, encryptedData } = e.detail
    return new Promise((resolve, reject) => {
      if (iv) {
        loading('加载中')
        const OpenId = wx.getStorageSync('openid')
        _getWXUserInfo({ OpenId, iv, encryptedData })
          .then(res => {
            wx.hideLoading()
            const { code, data, msg } = res.data
            if (code == 0) {
              const { unionId, avatarUrl, nickName } = data
              unionId && wx.setStorageSync('uid', unionId)
              resolve({ unionId, avatarUrl, nickName })
            } else {
              wx.showModal({
                title: '对不起',
                content: msg,
                showCancel: false
              })
            }
          })
          .catch(err => {
            console.log(err)
            wx.hideLoading()
          })
      } else {
        wx.showModal({
          title: '温馨提示',
          content: '您已拒绝授权',
          showCancel: false
        })
      }
    })
  },
  onLaunch () {}
})