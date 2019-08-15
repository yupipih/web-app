
// $(function () {
//     $.ajax({
//         type: 'get',
//         url: 'http://localhost:4567',
//         dataType: "json",
//         success: function (data) {
//             console.log(data);
//             var timestamp = data.timestamp;
//             var signature = data.signature;
//             console.log(timestamp);
//             console.log(signature);
//             $("#ts").append(timestamp);
//             $("#st").append(signature);

//         }
//     })
// })
    
 // sdk接口注入
      wx.config({
          debug:false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: 'wxbdfb12a3d586f09b', // 必填，公众号的唯一标识
          timestamp: 1552114292, // 必填，生成签名的时间戳
          nonceStr: 'Wm3WZYTPz0w0ccnW', // 必填，生成签名的随机串
          signature: '15d38445142a7097464150a8e001363c6667d28c', // 必填，签名
          jsApiList: [
                        'startRecord',
                        'stopRecord', 
                        'playVoice', 
                        'uploadVoice', 
                        'chooseImage',
                        'uploadImage',
                        'getLocation',
                        'onMenuShareAppMessage',
                        'openEnterpriseChat',
                        'openEnterpriseContact',
                        'onMenuShareTimeline',
                        'onVoiceRecordEnd',
                        'pauseVoice',
                        'stopVoice',
                        'onVoicePlayEnd',
                        'downloadVoice' ,               
                        'previewImage' ,                      
                        'downloadImage',
                        'translateVoice',
                        'getNetworkType',
                        'openLocation' ,                      
                        'hideOptionMenu',
                        'showOptionMenu',
                        'hideMenuItems',
                        'showMenuItems',
                        'hideAllNonBaseMenuItem',
                        'showAllNonBaseMenuItem',
                        'closeWindow',
                        'scanQRCode'
            ] // 必填，需要使用的JS接口列表
      });

  wx.ready(function () {

      //config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
      //按下开始录音
      $('#wenwen').on('touchstart', function (event) {
          event.preventDefault();
          START = new Date().getTime();

          recordTimer = setTimeout(function () {
              wx.startRecord({
                  success: function () {
                      localStorage.rainAllowRecord = 'true';
                  },
                  cancel: function () {
                      alert('用户拒绝授权录音');
                  }
              });
          }, 300);

    
      });
      //松手结束录音
      $('#wenwen').on('touchend', function (event) {
              event.preventDefault();
              END = new Date().getTime();
                 if ((END - START) < 300) {
                     END = 0;
                     START = 0;
                     //小于300ms，不录音
                     clearTimeout(recordTimer);
                    //  mui.toast('录音时长小于1秒不录音', {
                    //      duration: 'short',
                    //      type: 'div'
                    //  });
                    //  var t = setTimeout(function () {
                    //      wx.stopRecord()
                    //  }, 800); //这里设置800毫秒，是因为如果用户录音之后马上松开按钮，会成 wx.stopRecord不起作用的情况，然后会一直录音，所以时间设置长一点
                    //  //clearTimeout(t);
                 } else {
                     wx.stopRecord({
                         success: function (res) {
                             voice.localId = res.localId;
                             //$("#vo").val(res.localId);
                             uploadVoice();
                         },
                         fail: function (res) {
                             alert(JSON.stringify(res));
                         }
                     });
                 }

                 });
  });
    //上传录音
        function uploadVoice() {
        //调用微信的上传录音接口把本地录音先上传到微信的服务器
        //不过，微信只保留3天，而我们需要长期保存，我们需要把资源从微信服务器下载到自己的服务器
        wx.uploadVoice({
            localId: voice.localId, // 需要上传的音频的本地ID，由stopRecord接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res) {
                //把录音在微信服务器上的id（res.serverId）发送到自己的服务器供下载。
                /* var uu = /restsh/uploadVoice/" + res.serverId;
                    $.ajax({//上传到服务器
                    url : uu,
                    async : true,
                    cache : false,
                    dataType : 'json',
                    type : 'GET',
                    data : {},
                    success : function(req) {
                    voice.serverId = res.serverId;
             
                    $.web.RemoveLoading();
                    },
                    error : function(XMLHttpRequest, textStatus, errorThrown) {
                    $.web.RemoveLoading();
                    mui.alert("不好意思，出了点小问题","提示","确定");
                    }
                    });*/
                $.ajax({
                    url: '后端处理上传录音的接口',
                    type: 'post',
                    data: JSON.stringify(res),
                    dataType: "json",
                    success: function (data) {
                        alert('文件已经保存到七牛的服务器'); //这回，我使用七牛存储
                    },
                    error: function (xhr, errorType, error) {
                        console.log(error);
                    }
                });
            }
        });
         //  下载语音
        //  document.querySelector('#downloadVoice').onclick = function () {
        //      if (voice.serverId == '') {
        //          alert('请先使用 uploadVoice 上传声音');
        //          return;
        //      }
        //      wx.downloadVoice({
        //          serverId: voice.serverId,
        //          success: function (res) {
        //              alert('下载语音成功，localId 为' + res.localId);
        //              voice.localId = res.localId;
        //          }
        //      });
        //  };

        // 4.4 监听录音自动停止
        wx.onVoiceRecordEnd({
            success: function (res) {
                voice.localId = res.localId;
                stopWave();
                //uploadVoice();//上传录音到服务器
                alert('录音时间已超过一分钟');
            }

        });

        // 播放语音接口
        wx.playVoice({
            localId: voice.localId // 需要播放的音频的本地ID，由stopRecord接口获得
        });

        // // 暂停播放接口
        // wx.pauseVoice({
        //     localId: '' // 需要暂停的音频的本地ID，由stopRecord接口获得
        // });


        // document.querySelector('#playVoice').onclick = function () {
        //     if (voice.localId == '') {
        //         alert('请先录制一段声音');
        //         //alert('请先使用 startRecord 接口录制一段声音');
        //         return;
        //     }
        //     wx.playVoice({
        //         localId: voice.localId
        //     });


        // };



        // 暂停播放音频
        document.querySelector('#stop_btn').onclick = function () {
            mui('#playVoice').button('reset');
            wx.pauseVoice({
                localId: voice.localId
            });
        };

    }

     ///获取位置
     document.querySelector('#getLocation').onclick = function () {
         wx.getLocation({
             type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
             success: function (res) {
                //  var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                //  var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                //  var speed = res.speed; // 速度，以米/每秒计
                //  var accuracy = res.accuracy; // 位置精度
                //  alert("你所在的位置是：" + longitude + "," + latitude);
                 wx.openLocation({
                     latitude: res.latitude, // 纬度，浮点数，范围为90 ~ -90
                     longitude: res.longitude, // 经度，浮点数，范围为180 ~ -180。
                     name: '我的位置', // 位置名
                     address: '329创业者社区', // 地址详情说明
                     scale: 28, // 地图缩放级别,整形值,范围从1~28。默认为最大
                     infoUrl: 'http://www.gongjuji.net' // 在查看位置界面底部显示的超链接,可点击跳转（测试好像不可用）
                 });
             },
             cancel: function (res) {
                 alert('用户拒绝授权获取地理位置');
             }
         });
     };


    // 5 图片接口
    // 5.1 拍照、本地选图
      var images = {
          localId: [],
          serverId: []
      };
      document.querySelector('#upload_img').onclick = function () {
          wx.chooseImage({
              success: function (res) {
                  images.localId = res.localIds;
                  alert('已选择 ' + res.localIds.length + ' 张图片');
              }
          });
      };

        wx.uploadImage({
            localId: images.localId[i], // 需要上传的图片的本地ID，由chooseImage接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res) {
                // var serverId = res.serverId; // 返回图片的服务器端ID
                 i++;
                 alert('已上传：' + i + '/' + length);
                 images.serverId.push(res.serverId);
                 if (i < length) {
                     upload();
                 }
            },
             fail: function (res) {
                   alert(JSON.stringify(res));
               }
        });
        ///下载图片
        wx.downloadImage({
            serverId: '', // 需要下载的图片的服务器端ID，由uploadImage接口获得
            isShowProgressTips: 1,// 默认为1，显示进度提示
            success: function (res) {
                var localId = res.localId; // 返回图片下载后的本地ID
            }
        });
    // };

    // 5.3 上传图片
    // document.querySelector('#upload_img').onclick = function () {
    //     if (images.localId.length == 0) {
    //         alert('请先选择图片');
    //         return;
    //     }
    //     var i = 0, length = images.localId.length;
    //     images.serverId = [];
    //     function upload() {
    //         wx.uploadImage({
    //             localId: images.localId[i],
    //             success: function (res) {
    //                 i++;
    //                 //alert('已上传：' + i + '/' + length);
    //                 images.serverId.push(res.serverId);
    //                 if (i < length) {
    //                     upload();
    //                 }
    //             },
    //             fail: function (res) {
    //                 alert(JSON.stringify(res));
    //             }
    //         });
    //     }
    //     upload();
    // };

    // 5.4 下载图片
    // document.querySelector('#downloadImage').onclick = function () {
    //     if (images.serverId.length === 0) {
    //         alert('请先使用 uploadImage 上传图片');
    //         return;
    //     }
    //     var i = 0,
    //         length = images.serverId.length;
    //     images.localId = [];

    //     function download() {
    //         wx.downloadImage({
    //             serverId: images.serverId[i],
    //             success: function (res) {
    //                 i++;
    //                 alert('已下载：' + i + '/' + length);
    //                 images.localId.push(res.localId);
    //                 if (i < length) {
    //                     download();
    //                 }
    //             }
    //         });
    //     }
    //     download();
    // };


        //分享
        document.querySelector('#share_btn').onclick = function () {
        wx.onMenuShareAppMessage({
            title: '互联网之子',
            desc: '在长大的过程中，我才慢慢发现，我身边的所有事，别人跟我说的所有事，那些所谓本来如此，注定如此的事，它们其实没有非得如此，事情是可以改变的。更重要的是，有些事既然错了，那就该做出改变。',
            link: 'http://movie.douban.com/subject/25785114/',
            imgUrl: 'http://demo.open.weixin.qq.com/jssdk/images/p2166127561.jpg',
            trigger: function (res) {
                // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                alert('用户点击发送给朋友');
            },
            success: function (res) {
                alert('已分享');
            },
            cancel: function (res) {
                alert('已取消');
            },
            fail: function (res) {
                alert(JSON.stringify(res));
            }
        });
        alert('已注册获取“发送给朋友”状态事件');
        }

 // 使用微信内置地图查看位置接口
  wx.openLocation({
      latitude: 0, // 纬度，浮点数，范围为90 ~ -90
      longitude: 0, // 经度，浮点数，范围为180 ~ -180。
      name: '', // 位置名
      address: '', // 地址详情说明
      scale: 1, // 地图缩放级别,整形值,范围从1~28。默认为最大
      infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
  });


  wx.error(function (res) {

      // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。

  });


  