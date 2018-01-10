
var app = getApp();
var utilPlugins = require('../utilPlugins');
var server = 'https://yifenshe.top';
// var server = 'https://dev.ejiayou.com';
//4,元岗私家车送电影票
var server_api_4 = {
  defaultActivity: server + '/activity/experience_2/service/mini_apps/access_log/add',//埋点
  get_user_info: server + "/activity/experience_2/service/mini_apps/user_info/get",//获取用户信息
  init_view: server + '/activity/experience_2/service/mini_apps/view/init',//初始化视图
  get_mobile: server + '/activity/experience_2/service/mini_apps/mobile/get',//解密授权手机号
  get_codeCheck: server + '/activity/experience_2/service/mini_apps/verification_code/get',//获取手机号验证码
  check_codeAndMobile: server + '/activity/experience_2/service/mini_apps/verification_code/check',//校验验证码
  received_1: server + '/activity/experience_2/service/mini_apps/user/receive_one',//一键授权，立即领取
  received_2: server + '/activity/experience_2/service/mini_apps/user/receive_two',//手动输入手机号，立即领取
  received_11: server + '/activity/experience_2/service/mini_apps/user/gain_one',//被邀请人，一键授权，立即领取
  received_12: server + '/activity/experience_2/service/mini_apps/user/gain_two',//被邀请人，输入手机号，立即领取
  receivedResultsList: server + '/activity/experience_2/service/mini_apps/invite_record/get',//领取列表
  getNick_name: server + '/activity/experience_2/service/mini_apps/invite_user_info/get',//获取昵称
  get_more: server +'/activity/experience_2/service/mini_apps/ticket/get_more'//点击抢更多好礼
};

//获取open_id
function getUserInfo_4(code, en, iv, fun) {
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
          url: server_api_4.get_user_info,
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
                url: server_api_4.get_user_info,
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




function init_view_4(unId, opId, frType, tId, fun) {
  var options = {
    ticket_id: tId,
    open_id: opId,
    union_id: unId,
    from_type: frType,
  }
  console.log('初始化视图 options=' + JSON.stringify(options));
  wx.request({
    method: "POST",
    url: server_api_4.init_view,
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
};
function get_mobile(cd, en, iv, fun) {

  var login_code = app.login_data.code;
  wx.request({
    method: "POST",
    url: server_api_4.get_mobile,
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

//获取手机验证码
function get_codeCheck(mobile, fun) {

  wx.request({
    method: "POST",
    url: server_api_4.get_codeCheck,
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
    url: server_api_4.check_codeAndMobile,
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

function received_1(fId, _k, union_id, open_id, car_number, fun) {
  wx.showLoading({
    title: '领取中',
  })
  var options = {
    _k: _k,
    union_id: union_id,
    open_id: open_id,
    car_number: car_number,
    nick_name: app.user_info_data.userInfo.nickName,
    avatar_url: app.user_info_data.userInfo.avatarUrl,
    form_id: fId
  };
  console.log('领券1 options=' + JSON.stringify(options));
  wx.request({
    method: "POST",
    url: server_api_4.received_1,
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

//手动输入手机号，立即领取
function received_2(fId, mob, smsCd, union_id, open_id, carNum, fun) {
  wx.showLoading({
    title: '领取中',
  })
  var options = {
    mobile: mob,
    sms_code: smsCd,
    union_id: union_id,
    open_id: open_id,
    car_number: carNum,
    nick_name: app.user_info_data.userInfo.nickName,
    avatar_url: app.user_info_data.userInfo.avatarUrl,
    form_id: fId
  };
  console.log('领券2 options=' + JSON.stringify(options));
  wx.request({
    method: "POST",
    url: server_api_4.received_2,
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


function received_11(fId, _k, union_id, open_id, join_record_id, tId, latude, longtude, fun) {
  wx.showLoading({
    title: '领取中',
  })
  var options = {
    _k: _k,
    union_id: union_id,
    open_id: open_id,
    join_record_id: join_record_id,
    form_id: fId,
    ticket_id: tId,
    longitude:longtude,
    latitude: latude,
    nick_name: app.user_info_data.userInfo.nickName,
    avatar_url: app.user_info_data.userInfo.avatarUrl
  };
  console.log('领券3 res=' + JSON.stringify(options));
  wx.request({
    method: "POST",
    url: server_api_4.received_11,
    data: options,
    success: function (res) {
      wx.hideLoading();
      res = res.data;
      console.log('领券3 res=' + JSON.stringify(res));
      if (fun) {
        fun(res);
      }
    }
  })
}


function received_12(fId, mob, smsCd, union_id, open_id, jrid, tId, latude, longtude,fun) {
  var options = {
    mobile: mob,
    sms_code: smsCd,
    union_id: union_id,
    open_id: open_id,
    join_record_id: jrid,
    form_id: fId,
    ticket_id: tId,
    longitude: longtude,
    latitude: latude,
    nick_name: app.user_info_data.userInfo.nickName,
    avatar_url: app.user_info_data.userInfo.avatarUrl
  };
  console.log('领券4 options=' + JSON.stringify(options));
  wx.showLoading({
    title: '领取中',
  })
  wx.request({
    method: "POST",
    url: server_api_4.received_12,
    data: options,
    success: function (res) {
      wx.hideLoading();
      res = res.data;
      console.log('领券4 res=' + JSON.stringify(res));
      if (fun) {
        fun(res);
      }
    }
  })
}

//列表
function receivedResultsList(jrId, fun) {
  wx.request({
    method: "POST",
    url: server_api_4.receivedResultsList,
    data: {
      join_record_id: jrId
    },
    success: function (res) {
      res = res.data;
      console.log('getlist'+JSON.stringify(res));
      if (res.ret == 0) {
        fun(res);
      }
    }
  })
}

function get_nick_name(jrId, fun) {
  console.log('jrId' + jrId);
  wx.request({
    method: "POST",
    url: server_api_4.getNick_name,
    data: {
      join_record_id: jrId
    },
    success: function (res) {
      res = res.data;
      console.log('getNickname=' + JSON.stringify(res));
      if (res.ret == 0) {
        if (fun) {
          fun(res.data);
        }
      } else {
        utilPlugins.showErrorMsg(res);
      }
    }
  })
}

//点击抢更多好礼
function get_more(jrId, fun) {
  console.log('jrId' + jrId);
  wx.request({
    method: "POST",
    url: server_api_4.get_more,
    data: {
      join_record_id: jrId
    },
    success: function (res) {
      res = res.data;
      console.log('get_more=' + JSON.stringify(res));
      if (res.ret == 0) {
        if (fun) {
          fun();
        }
      } else {
        utilPlugins.showErrorMsg(res);
      }
    }
  })
}

//埋点
function defaultActivity(channel_no) {
  var that = this;
  console.log('掉起埋点 channel_no is ' + channel_no + "," + server_api_4.defaultActivity);
  wx.request({
    method: "POST",
    url: server_api_4.defaultActivity,
    data: {
      channel_no: channel_no,
      openid: app.user_info_data.userInfo.union_id,
    },
    success: function (res) {
      console.log('埋点成功 ');
    },
    fail: function (res) {
      console.log('埋点失败' + JSON.stringify(res));
    }
  })
}

module.exports = {
  getUserInfo_4: getUserInfo_4,       //获取最新时间
  init_view_4: init_view_4,            //初始化页面
  get_mobile: get_mobile,
  received_1: received_1,
  received_2: received_2,
  received_11: received_11,
  received_12: received_12,
  get_codeCheck: get_codeCheck,
  check_codeAndMobile: check_codeAndMobile,
  receivedResultsList: receivedResultsList,
  get_nick_name: get_nick_name,
  get_more: get_more,
  defaultActivity: defaultActivity

}