// pages/four_changeCinemaTicket/getTicket.js
var utilPlugins = require('../../utils/utilPlugins');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show_tip: false,
    add_class: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('被邀请人领取成功页 options=' + JSON.stringify(options));
    if (options.from_index) {
      utilPlugins.showToast('您已领取过啦，赶紧去油站兑换吧~', this, 2000);
    }
  },

  click1: function () {
    this.setData({
      show_tip: true
    });
  },

  click2: function () {
    this.setData({
      show_tip: false
    });
  },

  navToStation: function () {
    this.setData({
      add_class: 'click',
    });
    wx.openLocation({
      latitude: 23.1843084698,
      longitude: 113.3601822785,
      name: '元岗加油站',
      address: '天河区天源路961号（晨悦酒店旁）',
      scale: 10
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