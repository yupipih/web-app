var appkey = "k51hidwqk4epb";
RongIMClient.init("appkey"); //这是初始化，需要填参数就是你的APPKEY。这个不难理解。

var token =
    "37nHOcbp9gtJctIMV8L8+mxNFN/Yv405/xJBMg0BFFHnAi8xoPNy0laOheBQtOmzl9ZKyBqri8nbQM5xVZna6g==";
// 连接融云服务器。
RongIMClient.connect(token, {
    onSuccess: function (userId) {
        console.log("Login successfully." + userId);
        //userId是申请token时的填写的id，到时候可以封装在下面的extra中传过去
    },
    onTokenIncorrect: function () {
        console.log('token无效');
    },
    onError: function (errorCode) {
        var info = '';
        switch (errorCode) {
            case RongIMLib.ErrorCode.TIMEOUT:
                info = '超时';
                //链接超时进行重新的链接start
                var callback = {
                    onSuccess: function (userId) {
                        console.log("Reconnect successfully." + userId);
                    },
                    onTokenIncorrect: function () {
                        console.log('token无效');
                    },
                    onError: function (errorCode) {
                        console.log(errorcode);
                    }
                };
                var config = {
                    // 默认 false, true 启用自动重连，启用则为必选参数
                    auto: true,
                    // 重试频率 [100, 1000, 3000, 6000, 10000, 18000] 单位为毫秒，可选
                    url: 'cdn.ronghub.com/RongIMLib-2.2.6.min.js',
                    // 网络嗅探地址 [http(s)://]cdn.ronghub.com/RongIMLib-2.2.6.min.js 可选
                    rate: [100, 1000, 3000, 6000, 10000]
                };
                RongIMClient.reconnect(callback, config);
                //链接超时进行重新链接end
                break;
            case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                info = '未知错误';
                break;
            case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
                info = '不可接受的协议版本';
                break;
            case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
                info = 'appkey不正确';
                break;
            case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
                info = '服务器不可用';
                break;
        }
        console.log(errorCode);
    }
});
// 设置连接监听状态 （ status 标识当前连接状态 ）
// 连接状态监听器
RongIMClient.setConnectionStatusListener({
    onChanged: function (status) {
        switch (status) {
            case RongIMLib.ConnectionStatus.CONNECTED:
                console.log('链接成功');
                break;
            case RongIMLib.ConnectionStatus.CONNECTING:
                console.log('正在链接');
                break;
            case RongIMLib.ConnectionStatus.DISCONNECTED:
                console.log('断开连接');
                break;
            case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                console.log('其他设备登录');
                break;
            case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
                console.log('域名不正确');
                break;
            case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                console.log('网络不可用');
                break;
        }
    }
});
// 重新连接
var callback = {
    onSuccess: function (userId) {
        console.log("Reconnect successfully." + userId);
    },
    onTokenIncorrect: function () {
        console.log('token无效');
    },
    onError: function (errorCode) {
        console.log(errorcode);
    }
};
var config = {
    // 默认 false, true 启用自动重连，启用则为必选参数
    auto: true,
    // 重试频率 [100, 1000, 3000, 6000, 10000, 18000] 单位为毫秒，可选
    url: 'cdn.ronghub.com/RongIMLib-2.3.5.min.js',
    // 网络嗅探地址 [http(s)://]cdn.ronghub.com/RongIMLib-2.3.5.min.js 可选
    rate: [100, 1000, 3000, 6000, 10000]
};
RongIMClient.reconnect(callback, config);


// 消息监听器
RongIMClient.setOnReceiveMessageListener({
    // 接收到的消息
    onReceived: function (message) {
        // 判断消息类型
        switch (message.messageType) {
            case RongIMClient.MessageType.TextMessage:
                // message.content.content => 消息内容
                console.log(message.content.content);
                var string2 = message.content.content;

                var ans =
                    '<div class="answer"><div class="heard_img left"><img src="img/2.jpg"></div>';
                ans += '<div class="answer_text"><p>' + string2 + '</p>' + '<i></i>';
                ans += '</div></div>';
                $('.speak_box').append(ans);
                for_bottom();

                // $(".speak_box").text(message.content.content);

                break;
            case RongIMClient.MessageType.VoiceMessage:
                // 对声音进行预加载                
                // message.content.content 格式为 AMR 格式的 base64 码
                console.log(message.content.content);
                break;
            case RongIMClient.MessageType.ImageMessage:
                // message.content.content => 图片缩略图 base64。
                // message.content.imageUri => 原图 URL。
                console.log(message.content.content);
                break;
            case RongIMClient.MessageType.DiscussionNotificationMessage:
                // message.content.extension => 讨论组中的人员。
                console.log(message.content.extension);
                break;
            case RongIMClient.MessageType.LocationMessage:
                // message.content.latiude => 纬度。
                // message.content.longitude => 经度。
                // message.content.content => 位置图片 base64。
                console.log(message.content.latiude, message.content.longitude);
                break;
            case RongIMClient.MessageType.RichContentMessage:
                // message.content.content => 文本消息内容。
                // message.content.imageUri => 图片 base64。
                // message.content.url => 原图 URL。
                console.log(message.content.content);
                break;
            case RongIMClient.MessageType.InformationNotificationMessage:
                // do something...
                console.log(message.content.content);
                break;
            case RongIMClient.MessageType.ContactNotificationMessage:
                // do something...
                console.log(message.content.content);
                break;
            case RongIMClient.MessageType.ProfileNotificationMessage:
                // do something...
                console.log(message.content.content);
                break;
            case RongIMClient.MessageType.CommandNotificationMessage:
                // do something...
                console.log(message.content.content);
                break;
            case RongIMClient.MessageType.CommandMessage:
                // do something...
                console.log(message.content.content);
                break;
            case RongIMClient.MessageType.UnknownMessage:
                console.log(message.content.content);
                // do something...
                break;
            default:
                console.log(message.content.content);
                // do something...
        }

    }
});

function getMessage() {

    // 定义消息类型,文字消息使用 RongIMLib.TextMessage

    var msg = new RongIMLib.TextMessage({
        content: $("#inputBox").val(),
        extra: "附加要传递的值"
    });


    var string1 = msg.content;
    // console.log(string1);
    //生成聊天内容
    $('.speak_box').append('<div class="question">' + '<div class="heard_img right"><img src="img/dglvyou.jpg"></div>' + '<div class="question_text clear"><p>' + string1 + '</p><i></i>' + '</div></div>');
    autoWidth();
    for_bottom();
    //在页面追加你要生成的内容


    var conversationtype = RongIMLib.ConversationType.GROUP; // 私聊
    var targetId = "1"; // 目标 Id

    RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
        // 发送消息成功
        onSuccess: function (message) {
            console.log(message)
            //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
            console.log("Send successfully");
        },
        onError: function (errorCode, message) {
            var info = '';
            switch (errorCode) {
                case RongIMLib.ErrorCode.TIMEOUT:
                    info = '超时';
                    break;
                case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                    info = '未知错误';
                    break;
                case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                    info = '在黑名单中，无法向对方发送消息';
                    break;
                case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                    info = '不在讨论组中';
                    break;
                case RongIMLib.ErrorCode.NOT_IN_GROUP:
                    info = '不在群组中';
                    break;
                case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                    info = '不在聊天室中';
                    break;
                default:
                    info = "x";
                    break;
            }
            console.log('发送失败:' + info);
        }
    });

}





//     /**
//      * 获取会话列表
//      * @param callback 消息回调参数
//      * @return boolean 是否成功的状态码
//      * @return list 会话列表集合
//      */
//     getSessionList: function (callback) {
//         RongIMClient.getInstance().getConversationList({
//             onSuccess: function (list) {
//                 console.log("会话列表--" + JSON.stringify(list))
//                 callback && callback(true, list);
//             },
//             onError: function (error) {
//                 // do something...r
//                 result = "获取会话列表失败！"
//                 callback && callback(false, result);
//             }
//         }, null);
//     },

//     /**
//      * 获取指定的会话
//      * @param callback 消息回调参数
//      * @return boolean 是否成功的状态码
//      * @return list 会话列表集合
//      */
//     getSessionListBytargetId: function (callback, targetId) {
//         var conversationType = RongIMLib.ConversationType.PRIVATE;
//         RongIMLib.RongIMClient.getInstance().getUnreadCount(conversationType, targetId, {
//             onSuccess: function (count) {
//                 // count => 指定会话的总未读数。
//                 callback && callback(true, count);
//             },
//             onError: function () {
//                 result = "获取会话列表失败！"
//                 callback && callback(false, result);
//             }
//         });
//     },

//     /**
//      * 清空和莫个人的未读消息数
//      * @param callback 消息回调参数
//      * @param targetId 要清楚和谁的会话消息数
//      */
//     cleanMessageCount: function (targetId) {
//         var conversationType = RongIMLib.ConversationType.PRIVATE;
//         RongIMClient.getInstance().clearUnreadCount(conversationType, targetId, {
//             onSuccess: function () {
//                 console.log("清除未读消息数成功！");
//             },
//             onError: function (error) {
//                 console.log("清除未读消息数错误！" + error);
//             }
//         });
//     },

//     /**
//      * 获取自己和莫个人的聊天记录
//      * @param callback 消息回调参数
//      * @param conversationType 私聊,其他会话选择相应的消息类型即可。
//      * @param targetId 想获取自己和谁的历史消息，targetId 赋值为对方的 Id。
//      * @param timestrap  默认传 null，若从头开始获取历史消息，请赋值为 0 ,timestrap = 0;
//      * @param count 每次获取的历史消息条数，范围 0-20 条，可以多次获取。
//      * @return list 聊天数据集合
//      * @return hasMag 是否还有历史记录 有位true
//      */
//     getHistoryById: function (callback, conversationType, targetId, timestrap, count) {
//         RongIMLib.RongIMClient.getInstance().getHistoryMessages(conversationType, targetId, timestrap, count, {
//             onSuccess: function (list, hasMsg) {
//                 // list => Message 数组。
//                 // hasMsg => 是否还有历史消息可以获取。
//                 // console.log("targetId------" + targetId);
//                 // console.log("GetHistoryMessages:list" + JSON.stringify(list));
//                 callback && callback(hasMsg, list);
//             },
//             onError: function (error) {
//                 console.log("获取历史", error);
//                 callback && callback(false, error);
//             }
//         });
//     },

//     sendMessage: function (targetId, content, extra) {
//         var msg = new RongIMLib.TextMessage({
//             content: content,
//             extra: extra
//         });
//         var conversationtype = RongIMLib.ConversationType.PRIVATE; // 单聊,其他会话选择相应的消息类型即可。
//         var targetId = targetId; // 目标 Id
//         RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
//             onSuccess: function (message) {
//                 //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
//                 console.log("Send successfully");
//             },
//             onError: function (errorCode, message) {
//                 var info = '';
//                 switch (errorCode) {
//                     case RongIMLib.ErrorCode.TIMEOUT:
//                         info = '超时';
//                         break;
//                     case RongIMLib.ErrorCode.UNKNOWN_ERROR:
//                         info = '未知错误';
//                         break;
//                     case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
//                         info = '在黑名单中，无法向对方发送消息';
//                         break;
//                     case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
//                         info = '不在讨论组中';
//                         break;
//                     case RongIMLib.ErrorCode.NOT_IN_GROUP:
//                         info = '不在群组中';
//                         break;
//                     case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
//                         info = '不在聊天室中';
//                         break;
//                     default:
//                         info = x;
//                         break;
//                 }
//                 console.log('发送失败:' + info);
//             }
//         });
//     }
// }

// //发送 @ 消息
// // 单聊,其他会话选择相应的消息类型即可。
// var conversationtype = RongIMLib.ConversationType.GROUP;
// // 目标 Id
// var targetId = "groupId";
// // @ 消息对象
// var mentioneds = new RongIMLib.MentionedInfo();
//     // 全部：RongIMLib.MentionedType.ALL；部分：RongIMLib.MentionedType.PART
//     mentioneds.type = RongIMLib.MentionedType.PART;
//     // @ 的人
//     mentioneds.userIdList = [];
// var msg = new RongIMLib.TextMessage({content:"hello RongCloud!",extra:"附加信息",mentionedInfo:mentioneds});
// RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
//             onSuccess: function (message) {
//                 //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
//                 console.log("Send successfully");
//             },
//             onError: function (errorCode,message) {
//                 var info = '';
//                 switch (errorCode) {
//                     case RongIMLib.ErrorCode.TIMEOUT:
//                         info = '超时';
//                         break;
//                     case RongIMLib.ErrorCode.UNKNOWN_ERROR:
//                         info = '未知错误';
//                         break;
//                     case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
//                         info = '在黑名单中，无法向对方发送消息';
//                         break;
//                     case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
//                         info = '不在讨论组中';
//                         break;
//                     case RongIMLib.ErrorCode.NOT_IN_GROUP:
//                         info = '不在群组中';
//                         break;
//                     case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
//                         info = '不在聊天室中';
//                         break;
//                     default :
//                         info = x;
//                         break;
//                 }
//                 console.log('发送失败:' + info);
//             }
//         },true);



$(document).ready(function () {
    // getConversationList示例

    RongIMClient.getInstance().getConversationList({
        onSuccess: function (list) {
            //  console.log(list);

            for (var i = 0; i < list.length; i++) {

                //   console.log(list[i].latestMessage.content);
                //   console.log(list[i].targetId);



            }
        },
        onError: function (error) {
            // do something
        }
    }, null)

    ////获取群聊记录
    var conversationType = RongIMLib.ConversationType.GROUP; //单聊,其他会话选择相应的消息类型即可。
    var targetId = "1"; // 想获取自己和谁的历史消息，targetId 赋值为对方的 Id。
    var timestrap = null; // 默认传 null，若从头开始获取历史消息，请赋值为 0 ,timestrap = 0;
    var count = 20; // 每次获取的历史消息条数，范围 0-20 条，可以多次获取。
    RongIMLib.RongIMClient.getInstance().getHistoryMessages(conversationType, targetId, timestrap, count, {
        onSuccess: function (list, hasMsg) {
            // list => Message 数组。
            // hasMsg => 是否还有历史消息可以获取。
            //  console.log(list);
            //  console.log(hasMsg);
            for (var i = 0; i < list.length; i++) {

                //  console.log(list[i].content.content);



            }
        },
        onError: function (error) {
            console.log("GetHistoryMessages,errorcode:" + error);
        }
    });

});

// $(document).ready(function () {


// });