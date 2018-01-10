var app = getApp();
var utilPlugins = require('../../../utils/utilPlugins');
var miniapp_fun = require('../../../utils/initPage_fun/five_20RMB_ticket');
var options;
Page({
  data: {
    code_disabled: "true",//true为禁止点击“获取验证码”，‘’为允许点击“获取验证码”
    button_disabled: 'true',//true为禁止点击“确定”，‘’为允许点击“确定”
    codeable: false,
    code_success: '',
    mobile: "",
    car_type_3: "",
    car_type_13: "",
    login_code: "获取验证码",
    sms_code: "",
    car_type: 0,
    isRightCode: false,
    button_text: '立即领取',
    isRightPhone: false,
    hasSendCode: false,
    input_disabled: '',//可输入手机号,验证码,
    code_focus: false,
  },

  onShow: function () {
    wx.hideShareMenu();
    wx.hideLoading();
    wx.hideNavigationBarLoading();

  },
  //页面加载
  onLoad: function (opt) {
    console.log('输入手机号页面 opt=' + JSON.stringify(opt));

    options = opt;
    var that = this;
    wx.showNavigationBarLoading();
    that.setData(that.data);
  },
  formSubmit: function (e) {
    this.login(e.detail.formId);
  },
  //获取验证码
  sendCode: function () {
    var that = this;
    var time = 60;
    if ((/^1[0-9][0-9]\d{8}$/.test(that.data.mobile) && that.data.code_disabled == '')) {
      that.setData({
        button_disabled: 'true',
        hasSendCode: false,
        code_success: ''
      })

      //发送验证码
      miniapp_fun.get_codeCheck(that.data.mobile, function (res) {
        console.log('获取验证码返回res=' + JSON.stringify(res));
        if (res.ret == 0) {
          //发送成功
          that.setData({ hasSendCode: true, code_success: '' });
        } else {
          utilPlugins.showErrorMsg(res);
          that.setData({ hasSendCode: false });
          time = 60;
          that.setData({ login_code: "重新发送" })
          if ((/^1[0-9][0-9]\d{8}$/.test(that.data.mobile))) {
            that.setData({ code_disabled: "", });
          }
          clearInterval(that.data.timer);
        }

      });
      //初始化60秒后重发
      that.setData({
        login_code: time + "秒后重发",
        code_disabled: "true",
      })
      //定时器
      that.setData({
        timer: setInterval(function () {
          time--;
          if (time == 0) {//倒计时时间到了
            that.setData({ login_code: "重新发送", code_success: '', hasSendCode: false })
            if ((/^1[0-9][0-9]\d{8}$/.test(that.data.mobile))) {
              that.setData({ code_disabled: "", });
            }
            clearInterval(that.data.timer);
          } else {
            that.setData({
              login_code: time + "秒后重发",
              code_disabled: "true",
            })
          }

        }, 1000)

      });

    }
  },

  //输入手机
  bindPhoneInput: function (e) {
    var that = this;
    that.data.mobile = e.detail.value.trim();
    var isRightPhone = (/^1[0-9][0-9]\d{8}$/.test(that.data.mobile));
    if (isRightPhone && !that.data.hasSendCode) {//正确的手机号码，并且没有发送过验证码，则将“获取验证码”置灰
      this.setData({ code_disabled: "", isRightPhone: true });
    } else {
      this.setData({ code_disabled: "true" });
    }

  },

  //输入验证码
  bindCodeInput: function (e) {
    var that = this;
    var sms_code = e.detail.value.trim();
    if (sms_code.length >= 6 && that.data.isRightPhone && that.data.hasSendCode) {

      //校验验证码
      miniapp_fun.check_codeAndMobile(that.data.mobile, sms_code, function (res) {
        if (res.ret != 0) {//验证失败
          that.setData({ button_disabled: 'true', input_disabled: '' });
          wx.showToast({
            title: '验证码错误',
          })
          return;
        }
        else {//验证成功,禁止输入，禁止获取
          that.data.sms_code = sms_code;
          that.setData({
            button_disabled: '',
            code_success: '验证成功',
            input_disabled: 'true',
            code_focus: false,
            login_code: "",
            code_disabled: 'true'
          });
          clearInterval(that.data.timer);

        }

      });
    }

  },
  //点击确定
  login: function (formid) {
    var that = this;
    if (that.data.button_disabled == 'true') {
      return;
    }
    if (that.data.button_disabled == '') {//如果按钮激活
      miniapp_fun.received_2(formid, that.data.mobile, that.data.sms_code, options.union_id, options.open_id,  function (res_2) {
        if (res_2.ret == 0) {
          wx.redirectTo({
            url: '../2_receive_success/2_receive_success?mobile=' + that.data.mobile,
          })
        }
        else if (res_2.ret == 8) {
          wx.redirectTo({
            url: '../3_fail/3_fail',
          })
        }
        else {
          wx.hideLoading();
          utilPlugins.showErrorMsg(res_2);
          // utilPlugins.showToast('领取失败', that, 2000);
        }
         
      });
    }
  },

  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
    this.onLoad();
  },
  onReachBottom: function () {

  },
  onShow: function () {
    wx.hideLoading();
    wx.hideShareMenu()
    utilPlugins.showToast('获取不到您的手机号，请手动输入', this, 2000);

  }
})


