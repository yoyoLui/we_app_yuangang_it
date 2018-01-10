// pages/four_changeCinemaTicket/inputPlate.js
var utilPlugins = require('../../utils/utilPlugins');
var miniapp4_fun = require('../../utils/initPage_fun/four_sendCinemaTicket');
var app = getApp();
var opt;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    opt = options;
    if (options) {
      miniapp4_fun.get_nick_name(options.join_record_id, function (res_data) {
        that.setData({
          avatar_url: res_data.avatar_url,
          nick_name: res_data.nick_name,
        });
      })
      if (options.msg) {
        utilPlugins.showToast(options.msg, that, 2000);
      }
    }

  },

  click: function () {
    miniapp4_fun.get_more(opt.join_record_id, function (res) {
      wx.redirectTo({
        url: 'exchangeResults?join_record_id=' + opt.join_record_id,
      })
    });
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