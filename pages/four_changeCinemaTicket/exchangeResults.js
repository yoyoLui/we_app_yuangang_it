// pages/four_changeCinemaTicket/exchangeResults.js
var utilPlugins = require('../../utils/utilPlugins');
var miniapp4_fun = require('../../utils/initPage_fun/four_sendCinemaTicket');
var app = getApp();
var options;
Page({
  data: {
    avatar_url: '',
    nick_name: '',
    ticketNum: '',
    invite_records: [],
    is_loaded: false,
    toastData: {
      isShowToast: false,
      toastText: '',
    }
  },

  onLoad: function (opt) {
    options = opt;
    console.log('领取成功页面 opt=' + JSON.stringify(opt));
    if (app.user_info_data) {
      this.setData({
        avatar_url: app.user_info_data.userInfo.avatarUrl,
        nick_name: app.user_info_data.userInfo.nickName,
      });
    }

    this.getList(opt);

  },

  getList: function (opt) {
    var that = this;
    miniapp4_fun.receivedResultsList(opt.join_record_id, function (res_list) {
      if (res_list.ret == 0) {
        if (res_list.data.is_alert==1) {
          utilPlugins.showToast('您已领取过啦~可以继续赠票给好友哦~', that, 2000);
        }
        var data = res_list.data;
        var num = Number(10) - Number(data.invite_records.length);
        num = num > 0 ? num : 1;
        that.setData({
          invite_records: data.invite_records,
          ticketNum: num,
          is_loaded: true
        });
      } else {
        utilPlugins.showErrorMsg(res_list);
      }
    })
  },

  onShareAppMessage: function () {
    var that = this;
    console.log('share join_record_id=' + options.join_record_id);
    //埋点-点击分享按钮人数  xjcVuv
    miniapp4_fun.defaultActivity('xjcVuv');
    return {
      title: '车主' + that.data.nick_name + '花200元得到10张电影票，送给开车的朋友，限量快抢',
      path: '/pages/four_changeCinemaTicket/index?from_type=1&join_record_id=' + options.join_record_id,
      success: function (res) {
        //埋点-成功分享人数   xbOcEB
        miniapp4_fun.defaultActivity('xbOcEB');
        //埋点-总分享人数  k8llAW
        miniapp4_fun.defaultActivity('k8llAW');

        utilPlugins.showToast('恭喜~您的票已送出', that, 2000);
      },
      fail: function (res) {
        // 转发失败
        //埋点-总分享人数  k8llAW
        miniapp4_fun.defaultActivity('k8llAW');
      }
    }
  },
  onReady: function () { },


  onShow: function () {
    wx.hideLoading();
  },


  onHide: function () { },

  onUnload: function () { },

  onPullDownRefresh: function () { },

  onReachBottom: function () { },

})