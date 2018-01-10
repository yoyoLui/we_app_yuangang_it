var app = getApp();
var utilPlugins = require('../../../utils/utilPlugins');
var miniapp_fun = require('../../../utils/initPage_fun/five_20RMB_ticket');
var weApi = require('../../../utils/weApi');
var options;
var params;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled_button: 'disabled',
    content: '最高立减20元！',
    show: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    var that = this;
    options = opt;

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.toRedirect();
  },
  toRedirect: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    weApi.getCodeAndIV(function (code, en, iv) {
      miniapp_fun.getUserInfo(code, en, iv, function (union_id, open_id) {
        if (options && options.channel_no) {
          miniapp_fun.defaultActivity(options.channel_no, union_id);
        }
        miniapp_fun.init_view(union_id, open_id, function (res_data) {
          wx.hideLoading();
          var data = res_data.data;
          if (res_data.type == 1) {
            //判断按钮样式
            if (that.canShowGetPhoneButton(data.mobile)) {
              console.log('授权按钮');
              that.setData({
                is_open_getPhoneNumber: true,
                disabled_button: '',
                content: data.content,
                show: true
              });
            } else {
              console.log('普通按钮');
              that.setData({
                is_open_getPhoneNumber: false,
                disabled_button: '',
                content: data.content,
                show: true
              });
            }
            params = {
              union_id: union_id,
              open_id: open_id,
              mobile: data.mobile,
              _k: data._k
            };
          }
          if (res_data.type == 2) {
            wx.redirectTo({
              url: '../2_receive_success/2_receive_success?msgFlag=1&&mobile=' + data.mobile,
            })

          }
          if (res_data.type == 3) {
            wx.redirectTo({
              url: '../3_fail/3_fail?mobile=' + data.mobile + '&_k=' + data._k + '&open_id=' + open_id + '&union_id=' + union_id,
            })
          }
        })
      });
    });
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

    miniapp_fun.received_1(e.detail.formId, params._k, params.union_id, params.open_id, function (res) {
      if (res.ret == 0) {
        that.redirectToSuccess(params.mobile)
      }
      else if (res.ret == 6) {
        wx.redirectTo({
          url: '../3_fail/3_fail',
        })
      }
      else {
        wx.hideLoading();
        utilPlugins.showErrorMsg(res);
        utilPlugins.showToast('领取失败', that, 2000);
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
          miniapp_fun.get_mobile(res_login_data.code, e.detail.encryptedData, e.detail.iv, function (res_getMobile) {
            if (res_getMobile.ret == 0) { //解密手机号成功
              var data = res_getMobile.data;
              //更新过缓存，调用领取接口
              miniapp_fun.received_1(that.data.formId, data._k, params.union_id, params.open_id, function (res) {
                if (res.ret == 0) {
                  that.redirectToSuccess(data.mobile)
                }
                else if (res.ret == 6) {
                  wx.redirectTo({
                    url: '../3_fail/3_fail',
                  })
                }
                else {
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
      url: '../phoneInput/phoneInput?union_id=' + params.union_id + '&open_id=' + params.open_id,
    })
  },
  redirectToSuccess: function (mobile) {
    wx.redirectTo({
      url: '../2_receive_success/2_receive_success?mobile=' + mobile,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideLoading()
    wx.hideShareMenu({

    })
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