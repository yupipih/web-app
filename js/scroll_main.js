
$(function () {
    //创建MeScroll对象
    var mescroll = new MeScroll("mescroll", {
        down: {
            auto: false, //是否在初始化完毕之后自动执行下拉回调callback; 默认true
            callback: downCallback //下拉刷新的回调
        },
        up: {
            auto: true, //是否在初始化时以上拉加载的方式自动加载第一页数据; 默认false
            callback: upCallback //上拉回调,此处可简写; 相当于 callback: function (page) { upCallback(page); }
        }
    });

    /*下拉刷新的回调 */
    function downCallback() {
        //联网加载数据
        getListDataFromNet(0, 1, function (data) {
            //联网成功的回调,隐藏下拉刷新的状态
            mescroll.endSuccess();
            //设置列表数据
            setListData(data, false);
        }, function () {
            //联网失败的回调,隐藏下拉刷新的状态
            mescroll.endErr();
        });
    }

    /*上拉加载的回调 page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
    function upCallback(page) {
        //联网加载数据
        console.log("page.num=" + page.num);
        getListDataFromNet(page.num, page.size, function (data) {
            //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
            mescroll.endSuccess(data.length); //传参:数据的总数; mescroll会自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
            //设置列表数据
            // setListData(data, true);
        }, function () {
            //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
            mescroll.endErr();
        });
    }

    /*设置列表数据*/
    function setListData(data, isAppend) {
        var listDom = document.getElementById("newsList");
        var conversationType = RongIMLib.ConversationType.GROUP; //单聊,其他会话选择相应的消息类型即可。
        var targetId = "1"; // 想获取自己和谁的历史消息，targetId 赋值为对方的 Id。
        var timestrap = null; // 默认传 null，若从头开始获取历史消息，请赋值为 0 ,timestrap = 0;
        var count = 10; // 每次获取的历史消息条数，范围 0-20 条，可以多次获取。

        RongIMLib.RongIMClient.getInstance().getHistoryMessages(conversationType, targetId, timestrap, count, {
            onSuccess: function (list, hasMsg) {
                // list => Message 数组。
                // hasMsg => 是否还有历史消息可以获取。
                // console.log(list);
                //  console.log(hasMsg);
                for (var i = list.length-1; i>0; i--) {
                    var newObj = list[i];
                    console.log(newObj);
                    var liDom = document.createElement("li");
                    if (newObj.senderUserId == 02) { //判断是否为账号id
                        var str = '<div class="question">' + '<div class="heard_img right"><img src="img/dglvyou.jpg"></div>' + '<div class="question_text clear"><p>' + Emoji.trans(newObj.content.content) + '</p><i></i>' + '</div></div>';
                    } else {
                        var str = '<div class="answer"><div class="heard_img left"><img src="img/2.jpg"></div>' + '<div class="answer_text"><p>' + Emoji.trans(newObj.content.content) + '</p>' + '<i></i>' + '</div></div>';
                    }
                    liDom.innerHTML = str;

                    if (isAppend) {
                        // listDom.appendChild(liDom); //加在列表的后面,上拉加载
                    } else {
                        listDom.insertBefore(liDom, listDom.firstChild); //加在列表的前面,下拉刷新
                    }

                }

            },
            onError: function (error) {
                console.log("GetHistoryMessages,errorcode:" + error);
            }

        });
    }

    /*联网加载列表数据*/
    var downIndex = 0;

    function getListDataFromNet(pageNum, pageSize, successCallback, errorCallback) {
        //延时一秒,模拟联网
        setTimeout(function () {
            try {
                var newArr = [];
                if (pageNum == 0) {
                    // //此处模拟下拉刷新返回的数据
                    // downIndex++;
                    // var newObj = {
                    //     title: "【新增新闻" + downIndex + "】 新增新闻的标题",
                    //     content: "新增新闻的内容"
                    // };
                    // newArr.push(newObj);
                } else {
                    //此处模拟上拉加载返回的数据
                    // for (var i = 0; i < pageSize; i++) {
                    //     var upIndex = (pageNum - 1) * pageSize + i + 1;
                    //     var newObj = {
                    //         title: "【新闻" + upIndex + "】 标题标题标题标题标题标题",
                    //         content: "内容内容内容内容内容内容内容内容内容内容"
                    //     };
                    //     newArr.push(newObj);
                    // }
                }
                //联网成功的回调
                successCallback && successCallback(newArr);
            } catch (e) {
                //联网失败的回调
                errorCallback && errorCallback();
            }
        }, 1000)
    }

    //禁止PC浏览器拖拽图片,避免与下拉刷新冲突;如果仅在移动端使用,可删除此代码
    document.ondragstart = function () {
        return false;
    }
});