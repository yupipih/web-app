
        function to_write() {
            $('.wenwen_btn img').attr('src', 'img/yy_btn.png');
            $('.wenwen_btn').attr('onclick', 'to_say()');
            $('.write_box,.wenwen_help button').show();
            $('.circle-button').hide();
            $('.write_box input').focus();
            for_bottom();
        }

        function to_say() {
            $('.write_list').remove();
            $('.wenwen_btn img').attr('src', 'img/jp_btn.png');
            $('.wenwen_btn').attr('onclick', 'to_write()');
            $('.write_box').hide();
            $('.circle-button,.wenwen_help button').show();
        }



    // function keyup() {
    //     var footer_height = $('.wenwen-footer').outerHeight(),
    //         text = $('.write_box input').val(),
    //         str = '<div class="write_list">' + text + '</div>';
    //     if (text == '' || text == undefined) {
    //         $('.write_list').remove();
    //     } else {
    //         $('.wenwen-footer').append(str);
    //         $('.write_list').css('bottom', footer_height);
    //     }
    // }

    var wen = document.getElementById('wenwen');

    function _touch_start(event) {
        event.preventDefault();
        $('.wenwen_text').css('background', '#c1c1c1');
        $('.wenwen_text span').css('color', '#fff');
        $('.saying').show();
    }

    function _touch_end(event) {
        event.preventDefault();
        $('.wenwen_text').css('background', '#fff');
        $('.wenwen_text .circle-button').css('color', '#666');
        $('.saying').hide();
        var str = '<div class="question">';
        str += '<div class="heard_img right"><img src="img/dglvyou.jpg"></div>';
        str += '<div class="question_text clear"><p>这是一条语音消息</p><i></i>';
        str += '</div></div>';
        $('#newsList').append(str);
        for_bottom();
        // setTimeout(function () {
        //     var ans = '<div class="answer"><div class="heard_img left"><img src="img/dglvyou.jpg"></div>';
        //     ans += '<div class="answer_text"><p>收到的语音</p><i></i>';
        //     ans += '</div></div>';
        //     $('.speak_box').append(ans);
        //     for_bottom();
        // }, 1000);
    }

    wen.addEventListener("touchstart", _touch_start, false);
    wen.addEventListener("touchend", _touch_end, false);

    function for_bottom() {
    var speak_height = $('#newsList').height();
    $('#newsList,#mescroll').animate({
        scrollTop: speak_height
    }, 500);
    }

    function for_lastest() {
        var speak_height = $('#newsList').height();
        $('#newsList,#mescroll').animate({
            scrollTop: speak_height
        }, 0);
    }

    function autoWidth() {
        $('.question_text').css('max-width', $('.question').width() - 120);
    }
    autoWidth();

     function autoWidth() {
         $('.answer_text').css('max-width', $('.question').width() - 120);
     }
     autoWidth();

    //  function autoWidth() {
    //      $('.question_text p').css('max-width', $('.question').width() - 60);
    //  }
    //  autoWidth();
    // 收缩展开效果
    // $(document).ready(function () {
      

    //     $("#test").click(function () {
    //         $("#text1").animate({
    //             height: 'toggle',
    //             opacity: 'toggle'
    //         }, "slow");
            
    //     });

    //     $("#more").click(function () {
    //         $("#more1").animate({
    //             height: 'toggle',
    //             opacity: 'toggle'
    //         }, "slow");
    //         $("#text1").remove();
    //     });

        
    // }); 



  

    /**
     * 播放音频
     */
    function playVoice() {
        wx.playVoice({
            localId: voice.localId // 需要播放的音频的本地ID，由stopRecord接口获得
        })
    }


     

          