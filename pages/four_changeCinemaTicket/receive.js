// pages/four_changeCinemaTicket/inputPlate.js
var utilPlugins = require('../../utils/utilPlugins');
var miniapp4_fun = require('../../utils/initPage_fun/four_sendCinemaTicket');
var weApi = require('../../utils/weApi');
var app = getApp();
var options;
var latude;
var longtude;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nick_name: '',
    avatar_url: '',
    isCinemaEnter: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    options = opt;
    var that = this;
    wx.getLocation({
      success: function (res) {
          latude = res.latitude;
        longtude = res.longitude;
      },
      fail:function(){
        weApi.openSettingSuccess_location(function () {
          wx.getLocation({//首先跟微信拿user_info_data,然后decryptedData跟后端获取用户完整信息
            success: function (res) {
              debugger;
              latude = res.latitude;
              longtude = res.longitude;
            },
          });
        });
      }
    })
    console.log('进入被邀请人页面 options=' + JSON.stringify(opt));
    //判断按钮样式
    if (that.canShowGetPhoneButton(options.mobile)) {
      console.log('授权按钮');
      that.setData({
        is_open_getPhoneNumber: true
      });
    } else {
      console.log('普通按钮');
      that.setData({
        is_open_getPhoneNumber: false
      });
    }
    // 判断是电影票还是邀请链接进入
    if (opt.join_record_id == 0 || !opt.join_record_id) {
      that.setData({
        isCinemaEnter: true
      });
    } else {
      miniapp4_fun.get_nick_name(opt.join_record_id, function (res_data) {
        that.setData({
          nick_name: res_data.nick_name,
          avatar_url: res_data.avatar_url
        });
      });
    }

  },
  //判断使用什么button
  canShowGetPhoneButton: function (mobile) {
    //bindgetphonenumber 从1.2.0 开始支持，但是在1.5.3以下版本中无法使用wx.canIUse进行检测，建议使用基础库版本进行判断。
    var SystemInfo = wx.getSystemInfoSync();
    if (!utilPlugins.compareVersion('1.2.0', SystemInfo.SDKVersion)) {
      if (mobile == '' || mobile == undefined) {
        return true;
      }
    }
    return false;
  },

  //普通button-领取
  //点击form事件
  buttonClick: function (e) { //普通按钮
    var that = this;
    console.log('普通button获取formId=' + e.detail.formId);
    //埋点-点击领取按钮人数  Gr6sD6
    miniapp4_fun.defaultActivity('Gr6sD6');
    miniapp4_fun.received_11(e.detail.formId, options._k, options.union_id, options.open_id, options.join_record_id, options.ticket_id, latude,longtude, function (res) {
      if (res.ret == 0) {
        wx.redirectTo({
          url: 'getTicket?join_record_id=' + options.join_record_id,
        })
      } else {
        wx.hideLoading();
        utilPlugins.showErrorMsg(res);
      }
    });
  },

  //授权butttn-点击form提交事件
  getFormId: function (e) {
    console.log('授权button获取formId=' + e.detail.formId);

    this.data.formId = e.detail.formId;
  },
  //授权butttn-点击领取按钮
  getPhoneNumber: function (e) { //没有手机号
    var that = this;
    if (e.detail.encryptedData && e.detail.iv) { //用户授权
      wx.showLoading({
        title: '授权中',
      })
      //重新获取code
      wx.login({
        success: function (res_login_data) {
          miniapp4_fun.get_mobile(res_login_data.code, e.detail.encryptedData, e.detail.iv, function (res_getMobile) {
            if (res_getMobile.ret == 0) { //解密手机号成功
              var data = res_getMobile.data;
              //埋点-点击领取按钮人数  Gr6sD6
              miniapp4_fun.defaultActivity('Gr6sD6');
              //更新过缓存，调用领取接口
              miniapp4_fun.received_11(that.data.formId, data._k, options.union_id, options.open_id, options.join_record_id, options.ticket_id, latude, longtude, function (res) {
                if (res.ret == 0) {
                  wx.redirectTo({
                    url: 'getTicket?join_record_id=' + options.join_record_id,
                  })
                } else {
                  wx.hideLoading();
                  utilPlugins.showErrorMsg(res);
                  utilPlugins.showToast('领取失败', that, 2000);
                }
              });
            } else { //解密失败
              utilPlugins.showToast('解密手机号失败，请重试', that, 2000);
            }
          });
        }
      });


    } else { //没有授权,用户需要手动登录
      that.rediretInputPhone();

    }
  },
  rediretInputPhone: function () {
    var that = this;
    wx.redirectTo({
      url: 'phoneInput?union_id=' + options.union_id + '&open_id=' + options.open_id + '&join_record_id=' + options.join_record_id + '&latude=' + latude + '&longtude=' + longtude,
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
    wx.hideLoading();
    wx.hideShareMenu();
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