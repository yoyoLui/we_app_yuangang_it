var server = 'https://yifenshe.top';
//var server = 'https://dev.ejiayou.com';
App({
  //问卷数据源
  questionnaire_data: null,
  //提交成功获取的展示数据
  questionnaire_success_data: null,
  push_id: 0,
  station_id: 0,
  login_data: null,
  app_data: {},
  user_info_data: {},
  getPhoneNum: {
    is_auth: 0
  },
  formData: {
    formId: ''
  },
  onLaunch: function (option) {
    console.log('onlaunch option is ' + JSON.stringify(option));
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
  },
  onShow: function () { },
  onHide: function () { },
  onError: function (res) {
    console.log('app报错' + JSON.stringify(res));
  },
  //接口api
  server_api: (function (protocol) {
    return {
      defaultActivity: protocol + '/activity/experience/service/mini_apps/access_log/add',//埋点
      get_user_info: protocol + "/activity/experience/service/mini_apps/user_info/get",//获取用户信息
      get_mobile: protocol + "/activity/experience/service/mini_apps/mobile/get",//解密接口
      get_sms_code: protocol + "/activity/experience/service/mini_apps/verification_code/get",//获取验证码
      sms_code_check: protocol + "/activity/experience/service/mini_apps/verification_code/check",//校验验证码
      init_view: protocol + "/activity/experience/service/mini_apps/view/init",//判断进入页面
      receiveCard: protocol + "/activity/experience/service/mini_apps/user_one/receive",//领取优惠券
      receiveCard2: protocol + "/activity/experience/service/mini_apps/user_two/receive",//在输入手机号页面领取优惠券
      get_app_data: protocol + "/activity/experience_1/service/mini_apps/experience_app/serach",//获取首页信息
      create_app_data: protocol + "/activity/experience_1/service/mini_apps/experience_app/add",//提交申请资料
      behaviour: protocol + "/activity/default",//行为记录
    }
  })(server),

  server_api_2: (function (protocol) {
    return {
      applet_activity: protocol + '/activity/experience/service/mini_apps/applet_activity/add',
      questionnaire_activity: protocol + '/activity/gift/service/mini_apps/comment_info/get',
      questionnaire_activity_submit: protocol + '/activity/gift/service/mini_apps/comment/submit',
      questionnaire_activity_get_phone: protocol + '/activity/gift/service/mini_apps/user_info/get',
      questionnaire_activity_add_push: protocol + '/activity/gift/service/mini_apps/applet_activity/add'
    }
  })(server),
  //4、元岗私家车送电影票
  server_api_4: (function (protocol) {
    return {
      // defaultActivity: protocol + '/activity/experience/service/mini_apps/access_log/add',//埋点
      get_user_info: protocol + "/activity/experience_2/service/mini_apps/user_info/get",//获取用户信息
      init_view: protocol + '/activity/experience_2/service/mini_apps/view/init',//初始化视图
      get_mobile: protocol + '/activity/experience_2/service/mini_apps/mobile/get',//解密授权手机号
      get_codeCheck: protocol + '/activity/experience_2/service/mini_apps/verification_code/get',//获取手机号验证码
      check_codeAndMobile: protocol + '/activity/experience_2/service/mini_apps/verification_code/check',//校验验证码
      received_1: protocol + '/activity/experience_2/service/mini_apps/user/receive_one',//一键授权，立即领取
      received_2: protocol + '/activity/experience_2/service/mini_apps/user/receive_two',//手动输入手机号，立即领取
      received_11: protocol + '/activity/experience_2/service/mini_apps/user/gain_one',//被邀请人，一键授权，立即领取
      received_12: protocol + '/activity/experience_2/service/mini_apps/user/gain_two',//被邀请人，输入手机号，立即领取
      receivedResultsList: protocol + '/activity/experience_2/service/mini_apps/invite_record/get',//领取列表
    }
  })(server),
  //**************************************首页*********************************//
  //检查登录code是否过期
  checkSession: function (fn) {
    var that = this;
    wx.checkSession({
      success: function () {
        //session 未过期，并且在本生命周期一直有效
        if (fn) {
          fn()
        }
      },
      fail: function () {
        //登录态过期
        wx.login({
          success: function (login_data) {
            that.login_data.code = login_data.code;
            if (fn) {
              fn();
            }
          }
        });
      }
    })
  },
  //************************************小程序分割线2*************************************** */
  //埋点
  defaultActivity_3: function (channel_no) {
    var that = this;
    console.log('掉起埋点 channel_no is ' + channel_no + "," + that.server_api_3.defaultActivity);
    wx.request({
      method: "GET",
      url: that.server_api_3.defaultActivity,
      data: {
        channel_no: channel_no,
        openid: that.user_info_data.union_id,
      },
      success: function (res) {
        console.log('埋点成功 ');
      },
      fail: function (res) {
        console.log('埋点失败' + JSON.stringify(res));
      }
    })
  },
  
  //自定义toast  
  showToast: function (text, o, count) {
    text = String(text);
    // text = text.replace("\"", "").replace("\"", "").replace("\'", "").replace("\'", "");
    var _this = o; count = parseInt(count) ? parseInt(count) : 3000;
    _this.setData({ toastText: text, isShowToast: true, });
    setTimeout(function () {
      _this.setData({ isShowToast: false });
    }, count);
  },
  // 上传车牌，手机号
  uploadCarNum: function (e, carNum, formId, mobile, is_auth) {
    var that = this;
    if (e) {
      var code = that.login_data.code;
      var iv = e.detail.iv;
      var encrypt_data = e.detail.encryptedData;
    } else {
      var code = that.login_data.code;
      var iv = "";
      var encrypt_data = "";
    }
    console.log(code + "=" + iv + "=" + encrypt_data + "=" + formId + "=" + carNum + "=" + that.user_info_data.open_id + "=" + that.user_info_data.union_id + "=" + mobile + "=" + is_auth + "=" + that.station_id);
    wx.request({
      url: that.server_api_2.questionnaire_activity_add_push,
      data: {
        // 这三个是允许授权获取到的
        code: code,
        iv: iv,
        encrypt_data: encrypt_data,
        form_id: formId,
        car_num: carNum,
        open_id: that.user_info_data.open_id,
        union_id: that.user_info_data.union_id,
        mobile: mobile,
        station_id: that.station_id,
        is_auth: is_auth
      },
      success: function (res) {
        console.log("发送推送任务接口↓↓↓");
        console.log(res.data.msg);
        if (res && res.data.ret == 0) {
          var reg_id = res.data.data.reg_id;
          console.log("reg_id↓↓↓")
          console.log(reg_id)
          that.sendPush(reg_id, mobile, carNum)
        } else {
          wx.hideLoading();
          wx.showToast({
            title: res.data.msg,
            image: '',
            duration: 1000
          })
        }
      },
      fail: function (res) {
        wx.hideLoading();
        console.log('获取手机号，车牌号失败');
        console.log(res);
      }
    })
  },
  //发送推送(暂时未用，参数不全)
  sendPush: function (reg_id, mobile, carNum) {
    var txt = mobile + ":" + carNum;
    wx.request({
      method: "POST",
      url: 'https://api.ejiayou.com/activity/api/app/push_msg/send',
      data: {
        regIds: reg_id,
        msgContent: txt,
        contentType: 'ejiayou://stationList',
        msgType: '2',
        type: '2',
        carNum: '',
        isVip: '1'
      },
      success: function (res) {
        wx.hideLoading();
        console.log("发送推送结果↓↓↓")
        console.log(res)
        wx.reLaunch({
          url: '../two_success/two_success',
        })
      },
      fail: function (res) {
        wx.hideLoading();
        console.log("发送推送失败↓↓↓")
        console.log(res)
      }
    })
  },

  //******************************************4、私家车送电影票********************** */





})

