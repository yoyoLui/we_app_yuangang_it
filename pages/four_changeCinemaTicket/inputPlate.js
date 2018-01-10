// pages/four_changeCinemaTicket/inputPlate.js
var utilPlugins = require('../../utils/utilPlugins');
var miniapp4_fun = require('../../utils/initPage_fun/four_sendCinemaTicket');
var app = getApp();
var options;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formId: '',
    disabled_button: '1',
    carNum: '粤',
    avatar_url: '',
    nick_name: '',
    ticketNum: '10',
    is_open_getPhoneNumber: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (opt) {
    console.log('输入车牌号页面 opt=' + JSON.stringify(opt));
    options = opt;
    var that = this;
    if (opt) {
      that.setData({
        options: opt,
        avatar_url: app.user_info_data.userInfo.avatarUrl,
        nick_name: app.user_info_data.userInfo.nickName,
      });
    }
    if (that.canShowGetPhoneButton(options.mobile)) {
      console.log('授权按钮');
      //授权按钮
      that.setData({
        is_open_getPhoneNumber: true
      });
    } else {
      console.log('普通按钮');
      that.setData({
        is_open_getPhoneNumber: false
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
    //埋点-点击按钮
    miniapp4_fun.defaultActivity('b7TO8L');
    miniapp4_fun.received_1(e.detail.formId, options._k, options.union_id, options.open_id, that.data.carNum, function (res) {
      if (res.ret == 0) {
        wx.redirectTo({
          url: 'success_input?join_record_id=' + res.data.join_record_id,
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

              //埋点-点击按钮
              miniapp4_fun.defaultActivity('b7TO8L');
              //更新过缓存，调用领取接口
              miniapp4_fun.received_1(that.data.formId, data._k, options.union_id, options.open_id, that.data.carNum, function (res) {
                if (res.ret == 0) {
                  wx.redirectTo({
                    url: 'success_input?join_record_id=' + res.data.join_record_id,
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
      url: 'phoneInput?carNum=' + that.data.carNum + '&union_id=' + options.union_id + '&open_id=' + options.open_id,
    })
  },

  //去除空格，非法字符，转换大写
  filterFun: function (str) {
    str = str.replace(/(^\s+)|(\s+$)/g, "");
    str = str.toUpperCase();
    var arr = str.split('');
    var express0 = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领]{1}$/;
    var express1 = /^[A-Z]$/;
    var express2 = /^[A-Z0-9]{1}$/;
    var outStr;
    for (var i = 0; i < arr.length; i++) {

      if (i == 0 && !express0.test(arr[i])) {
        arr[i] = '';
      }
      else if (i == 1 && !express1.test(arr[i])) {
        arr[i] = '';
      }
      else if (i != 0 && i != 1 && !express2.test(arr[i])) {
        arr[i] = '';
      }
    }
    outStr = arr.join('');
    return outStr;
  },
  //输入车牌号码
  inputCarNum: function (e) {
    var that = this;
    var express = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
    var num = e.detail.value;
    if (num.length > 6) {
      num = that.filterFun(num);
      var temp = express.exec(num);
      if (temp) {
        num = temp[0];
        that.setData({
          disabled_button: '',
          carNum: num
        });

      } else {
        utilPlugins.showToast('请输入正确的车牌号', that, 2000);
        that.setData({
          disabled_button: 'disabled',
          carNum: num
        })

      }
    } else {
      that.setData({
        disabled_button: 'disabled'
      })
    }

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
    wx.hideShareMenu()
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