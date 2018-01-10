var app = getApp();
var utilPlugins = require('../../utils/utilPlugins');
var miniapp4_fun = require('../../utils/initPage_fun/four_sendCinemaTicket');
var weApi = require('../../utils/weApi');
// pages/four_changeCinemaTicket/index.js
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
    wx.showLoading({
      title: '加载中',
    })
    if (options) {
      if (!options.ticket_id) {
        options.ticket_id = 0;
      }
      this.toChangeCinemaTicket(options.from_type, options.join_record_id, options.ticket_id);
    }
  },
  //4、私家车拉新送电影票
  toChangeCinemaTicket: function (from_type, join_record_id, ticket_id) {
    weApi.getCodeAndIV(function (code, en, iv) {
      miniapp4_fun.getUserInfo_4(code, en, iv, function (union_id, open_id) {
        miniapp4_fun.init_view_4(union_id, open_id, from_type, ticket_id, function (res_data) {
          //1、邀请人输入车牌号页面 2、邀请人领取成功页面 3、被邀请人点击领取页面 4、被邀请人领取成功页面
          //from_type=0输入车牌号页面,from_type=1点击领取，链接有join_record
          var data = res_data.data;
          if (res_data.type == 1) {
            wx.redirectTo({
              url: 'inputPlate?mobile=' + data.mobile + '&_k=' + data._k + '&open_id=' + open_id + '&union_id=' + union_id,
            })
          }
          if (res_data.type == 2) {
            wx.redirectTo({
              url: 'exchangeResults?mobile=' + data.mobile + '&_k=' + data._k + '&open_id=' + open_id + '&union_id=' + union_id + '&join_record_id=' + data.join_record_id + '&from_index=1',
            })
          }
          if (res_data.type == 3) {
            wx.redirectTo({
              url: 'receive?mobile=' + data.mobile + '&_k=' + data._k + '&open_id=' + open_id + '&union_id=' + union_id + '&join_record_id=' + join_record_id + '&ticket_id=' + ticket_id,
            })
          }
          if (res_data.type == 4) {
            wx.redirectTo({
              url: 'getTicket?join_record_id=' + join_record_id + '&from_index=1',
            })
          }
          if (res_data.type == 5) {

            wx.redirectTo({
              url: 'receive2?msg=' + res_data.msg,
            })
          }
          if (res_data.type == 6) {

            wx.redirectTo({
              url: 'success_input?join_record_id=' + data.join_record_id +'&msg=您已领取过，抢下别的好礼呗~',
            })
          }
        })
      });
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