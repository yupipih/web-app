RongIMClient.init("k51hidwqk4epb");//这是初始化，需要填参数就是你的APPKEY。这个不难理解。
var token = "/00wpplCK1zl3wrDvuliRkCIoqF13GxvgjCNVdBjSI+L21qDsZ2u3bWCR7QaIn3Bhvhyo5DJ1+TsvY/Pslen0A==";
RongIMLib.RongIMEmoji.init();

/**
 * 融云连接状态监听
 */
RongIMClient.setConnectionStatusListener({
    onChanged: function(status) {
        switch (status) {
            case RongIMLib.ConnectionStatus.CONNECTED:
                //判断是否有GetQueryString().firmIm逻辑处理
                if (
                    GetQueryString().firmIm &&
                    GetQueryString().firmIm != undefined
                ) {
                    that.targetId = GetQueryString().firmIm;
                    that.sendHello(that);
                } else {
                    that.targetId = list[that.activeIndex].targetId;
                    that.getConversationList(that);
                }
                that.getUnreadCount();
                that.getTotalUnreadCount();
                break;
            case RongIMLib.ConnectionStatus.CONNECTING:
                console.log("正在链接");
                break;
            case RongIMLib.ConnectionStatus.DISCONNECTED:
                console.log("断开连接");
                break;
            case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                console.log("其他设备登录");
                break;
            case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
                console.log("域名不正确");
                break;
            case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                console.log("网络不可用");
                break;
        }
    }
});

// 消息监听器
RongIMClient.setOnReceiveMessageListener({
    // 接收到的消息
    onReceived: function(message) {
        // that.getConversationList(that)
        // 判断消息类型
        // if (that.$route.name == "消息提醒") {
        // if (message.senderUserId == GetQueryString().firmIm) {
        console.log(message.content.content);
        if (message.content.content != "") {
            that.scrollListDown();
            switch (message.messageType) {
                case RongIMClient.MessageType.TextMessage:
                    that.$notify({
                        message: message.senderUserId + "发来一条文字信息",
                        type: "success"
                    });
                    var off = false;
                    for (let n = 0; n < that.chatList.length; n++) {
                        if (that.chatList[n].targetId == message.senderUserId) {
                            off = true;
                            message.sentTime = timeFormatNotime(message.sentTime);
                            message.content.content = RongIMLib.RongIMEmoji.emojiToHTML(
                                RongIMLib.RongIMEmoji.symbolToEmoji(message.content.content)
                            );
                            var record = that.chatList[n];
                            record.record.push(message);
                            that.$set(that.chatList, n, record);
                        }
                    }
                    if (!off) {
                        that.targetId = message.senderUserId;
                        that.getHistroyMessage(that);
                    }
                    that.scrollTop();
                    // that.text = "收到消息";
                    that.text = "";
                    // alert(1);
                    // message.content.content => 消息内容
                    break;
                case RongIMClient.MessageType.VoiceMessage:
                    // 对声音进行预加载
                    // message.content.content 格式为 AMR 格式的 base64 码
                    break;
                case RongIMClient.MessageType.ImageMessage:
                    that.$notify({
                        message: message.senderUserId + "发来一条图片信息",
                        type: "success"
                    });
                    for (let n = 0; n < that.chatList.length; n++) {
                        if (that.chatList[n].targetId == message.senderUserId) {
                            message.sentTime = timeFormatNotime(message.sentTime);
                            var record = that.chatList[n];
                            record.record.push(message);
                            // that.chatList[n].record.push(message);
                            that.$set(that.chatList, n, record);
                        }
                    }
                    // setTimeout(function(){
                    that.scrollTop();
                    // },1000)

                    // message.content.content => 图片缩略图 base64。
                    // message.content.imageUri => 原图 URL。
                    break;
                case RongIMClient.MessageType.DiscussionNotificationMessage:
                    // message.content.extension => 讨论组中的人员。
                    break;
                case RongIMClient.MessageType.LocationMessage:
                    // message.content.latiude => 纬度。
                    // message.content.longitude => 经度。
                    // message.content.content => 位置图片 base64。
                    break;
                case RongIMClient.MessageType.RichContentMessage:
                    // message.content.content => 文本消息内容。
                    // message.content.imageUri => 图片 base64。
                    // message.content.url => 原图 URL。
                    break;
                case RongIMClient.MessageType.InformationNotificationMessage:
                    // do something...
                    break;
                case RongIMClient.MessageType.ContactNotificationMessage:
                    // do something...
                    break;
                case RongIMClient.MessageType.ProfileNotificationMessage:
                    // do something...
                    break;
                case RongIMClient.MessageType.CommandNotificationMessage:
                    // do something...
                    break;
                case RongIMClient.MessageType.CommandMessage:
                    // do something...
                    break;
                case RongIMClient.MessageType.UnknownMessage:
                    // do something...
                    break;
                default:
                // do something...
            }
        } else {
            that.getConversationList(that);
            that.scrollListTop();
        }
    }
    // } else {
    //   that.$notify({
    //     title: "提示",
    //     message: "你有新的消息,请前往聊天室查看",
    //     type: "success"
    //   });
    // }
    // }
});
/**
 *连接融云,连接融云必须写在init()方法之后，而在链接融云前，必须写监听事件
 */
RongIMClient.connect(
    that.token,
    {
        onSuccess: function(userId) {
            that.userId = userId;
            that.ryName = localStorage["ryName"];
            that.$store.commit({
                type: "get_rcloud_userId",
                userid: userId
            });
        },
        onTokenIncorrect: function() {
            that.reset(that);
        },
        onError: function(errorCode) {
            var info = "";
            switch (errorCode) {
                case RongIMLib.ErrorCode.TIMEOUT:
                    info = "超时";
                    break;
                case RongIMLib.ConnectionState.UNACCEPTABLE_PAROTOCOL_VERSION:
                    info = "不可接受的协议版本";
                    break;
                case RongIMLib.ConnectionState.IDENTIFIER_REJECTED:
                    info = "appkey不正确";
                    break;
                case RongIMLib.ConnectionState.SERVER_UNAVAILABLE:
                    info = "服务器不可用";
                    break;
            }
            console.log(errorCode);
        }
    }
);

