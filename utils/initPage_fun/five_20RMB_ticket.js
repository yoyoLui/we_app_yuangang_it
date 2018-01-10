
var app = getApp();
var utilPlugins = require('../utilPlugins');
 var server = 'https://yifenshe.top';
//var server = 'https://dev.ejiayou.com';
//4,元岗私家车送电影票
var server_api = {
  defaultActivity: server + '/activity/experience/service/mini_apps/access_log/add',//埋点
  get_user_info: server + "/activity/experience/service/mini_apps/user_info/get",//获取用户信息
  init_view: server + '/activity/experience/service/mini_apps/view/init',//初始化视图
  received_1: server + '/activity/experience/service/mini_apps/user_one/receive',//一键授权，立即领取
  received_2: server + '/activity/experience/service/mini_apps/user_two/receive',//输入手机号
  get_codeCheck: server + '/activity/experience/service/mini_apps/verification_code/get',//获取手机号验证码
  check_codeAndMobile: server + '/activity/experience/service/mini_apps/verification_code/check',//校验验证码
  get_mobile: server + '/activity/experience/service/mini_apps/mobile/get',//解密授权手机号
  defaultActivity: server + '/activity/experience/service/mini_apps/access_log/add',//埋点
};

//埋点
function defaultActivity(channel_no, union_id) {
  var that = this;
  console.log('掉起埋点 channel_no is ' + channel_no + "," + server_api.defaultActivity);
  wx.request({
    method: "POST",
    url: server_api.defaultActivity,
    data: {
      userid:0,
      channel_no: channel_no,
      openid: union_id,
    },
    success: function (res) {
      console.log('埋点成功 ');
    },
    fail: function (res) {
      console.log('埋点失败' + JSON.stringify(res));
    }
  })
}
function init_view(unId, opId, fun) {
  var options = {
    open_id: opId,
    union_id: unId,
  }
  console.log('初始化视图 options=' + JSON.stringify(options));
  wx.request({
    method: "POST",
    url: server_api.init_view,
    data: options,
    success: function (res) {
      res = res.data;
      console.log('初始化视图 res=' + JSON.stringify(res));
      if (res.ret == 0) {

        if (fun) {
          fun(res);
        }
      } else {
        utilPlugins.showErrorMsg(res);
      }
    }
  })
}
//获取open_id
function getUserInfo(code, en, iv, fun) {
  var options = {
    encrypt_data: en,
    code: code,
    iv: iv,
  }
  console.log('解密用户信息 options=' + JSON.stringify(options));
  wx.request({
    method: "POST",
    url: server_api.get_user_info,
    data: options,
    success: function (res) {
      res = res.data;
      console.log('解密用户信息 res=' + JSON.stringify(res));

      if (res.ret == 0) {
        if (fun) {
          fun(res.data.union_id, res.data.open_id);
        }
      } else {
        //重新调用
        wx.request({
          method: "POST",
          url: server_api.get_user_info,
          data: options,
          success: function (res) {
            console.log('解密用户信息 res=' + JSON.stringify(res));
            if (res.ret == 0) {
              if (fun) {
                fun(res.data.union_id, res.data.open_id);
              }
            } else {
              //重新调用
              wx.request({
                method: "POST",
                url: server_api.get_user_info,
                data: options,
                success: function (res) {
                  console.log('解密用户信息 res=' + JSON.stringify(res));
                  if (res.ret == 0) {
                    if (fun) {
                      fun(res.data.union_id, res.data.open_id);
                    }
                  } else {
                    wx.showModal({
                      title: '',
                      content: '解密错误，请刷新重试',
                      showCancel: false
                    })
                    wx.hideLoading();

                  }
                }
              })
            }
          }
        })
      }
    }
  })

};

function received_1(fId, _k, union_id, open_id, fun) {
  wx.showLoading({
    title: '领取中',
  })
  var options = {
    _k: _k,
    union_id: union_id,
    open_id: open_id,
    form_id: fId,
    nick_name: app.user_info_data.userInfo.nickName,
    avatar_url: app.user_info_data.userInfo.avatarUrl,
  };
  console.log('领券1 options=' + JSON.stringify(options));
  wx.request({
    method: "POST",
    url: server_api.received_1,
    data: options,
    success: function (res) {
      wx.hideLoading();
      res = res.data;
      console.log('领券1 res=' + JSON.stringify(res));
      if (fun) {
        fun(res);
      }
    }
  })
}

function received_2(fId, mobile, sms_code, union_id, open_id, fun) {
  wx.showLoading({
    title: '领取中',
  })
  var options = {
    mobile: mobile,
    sms_code: sms_code,
    union_id: union_id,
    open_id: open_id,
    form_id: fId,
    nick_name: app.user_info_data.userInfo.nickName,
    avatar_url: app.user_info_data.userInfo.avatarUrl,
  };
  console.log('领券2 options=' + JSON.stringify(options));
  wx.request({
    method: "POST",
    url: server_api.received_2,
    data: options,
    success: function (res) {
      wx.hideLoading();
      res = res.data;
      console.log('领券2 res=' + JSON.stringify(res));
      if (fun) {
        fun(res);
      }
    }
  })
}

//获取手机验证码
function get_codeCheck(mobile, fun) {

  wx.request({
    method: "POST",
    url: server_api.get_codeCheck,
    data: {
      mobile: mobile,
    },
    success: function (res) {
      res = res.data;
      console.log('获取手机验证码 res=' + JSON.stringify(res));
      if (fun) {
        fun(res);
      }

    }
  })
};
//校验验证码
function check_codeAndMobile(mob, smsCd, fun) {
  wx.showLoading({
    title: '验证中',
  })
  wx.request({
    method: "POST",
    url: server_api.check_codeAndMobile,
    data: {
      mobile: mob,
      sms_code: smsCd
    },
    success: function (res) {
      wx.hideLoading();
      res = res.data;
      console.log('校验验证码 res=' + JSON.stringify(res));
      if (fun) {
        fun(res);
      }

    }
  })
};

function get_mobile(cd, en, iv, fun) {
  var login_code = app.login_data.code;
  wx.request({
    method: "POST",
    url: server_api.get_mobile,
    data: {
      code: cd,
      encrypt_data: en,
      iv: iv,
    },
    success: function (res) {
      res = res.data;
      console.log('解密手机号 res=' + JSON.stringify(res));
      if (fun) {
        fun(res);
      }

    }
  })
};

module.exports = {
  getUserInfo: getUserInfo,
  init_view: init_view,
  received_1: received_1,
  received_2: received_2,
  check_codeAndMobile: check_codeAndMobile,
  get_codeCheck: get_codeCheck,
  get_mobile: get_mobile,
  defaultActivity: defaultActivity
}