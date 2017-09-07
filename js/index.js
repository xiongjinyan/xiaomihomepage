//导航栏
$.ajax({
    url: 'http://127.0.0.1:9900/api/nav',
    success: function (data) {
        // console.log(data);
        $('.nav-list>ul').html(template('template-list', data));
        $('.nav-list>ul>li').mouseenter(function () {
            if ($(this).attr('type')) {
                $.ajax({
                    url: 'http://127.0.0.1:9900/api/nav',
                    data: {
                        type: $(this).attr('type')
                    },
                    dataType: 'json',
                    success: function (data) {
                        $('.careful-list').html(template('template-more', data));
                        $('.nav-buttom').stop().slideDown();
                        $('.nav-list').mouseleave(function(){
                            $('.nav-buttom').stop().slideUp();
                        });
                        $('.nav-buttom').hover(function(){
                            $(this).stop(true).slideDown();
                        },function(){
                            $(this).stop(true).slideUp();
                        })
                    }
                })
            }else{
                $('.nav-buttom').stop().slideUp();
            }
        })
    },
    dataType: 'json'
})

//搜索框失去显示隐藏
$('.nav-find input').focus(function () {
    $('.down-list').css('display', 'block');
    $('.nav-find').css('border-color', 'darkorange');
    $('.look').css('border-color', 'darkorange');

})
$('.nav-find input').blur(function () {
    $('.down-list').css('display', 'none');
    $('.nav-find').css('border-color', '#ccc');
    $('.look').css('border-color', '#ccc');
})

//侧栏列表请求数据
$.ajax({
    url:'http://127.0.0.1:9900/api/items',
    dataType:'json',
    success:function(data){
        // console.log(data);
        $('.line-list>ul').html(template('template-line-list',data));
        $('.line-list>ul>li').mouseenter(function(){
            $('.row-list').html('');
            var $this=$(this);
            $.ajax({
                url:'http://127.0.0.1:9900/api/items',
                data:{
                    type:$this.attr('type')
                },
                dataType:'json',
                success:function(data){
                    // console.log(data);
                    var index = Math.ceil(data.length/6);               
                    for(var i=0;i<index;i++){                       
                        var uls = document.createElement("ul");
                        $('.row-list').append(uls);
                    }
                    for (var j = 0; j < data.length; j++) {
                        var idex= Math.floor(j/6);
                        $('.row-list>ul').eq(idex).append(template('template-row-list',data[j]));                        
                    }
                }
            })
           $('.row-list').css('display','block');
        })
        $('.list').mouseleave(function(){
            $('.row-list').css('display','none');
        })       
    }    
})

//轮播图
$.ajax({
    url:'http://127.0.0.1:9900/api/lunbo',
    dataType:'json',
    success:function(data){
        // console.log(data);
        $('.lunbo-list>ul').html(template('template-lunbo-list',data));
        var picIndex = 0;
        var opacity = 0;
        var $lis = $('.ul-list').children();
        // console.log($lis);
        $('.arrows-right').click(function(){            
              right();  
        })
        function right(){
            for(var j=0; j<$lis.length; j++){
                    $lis.eq(j).css('display','none');          
                }
                if(picIndex>$lis.length-1){
                    picIndex=0;
                }
                $lis.eq(picIndex).css('display','block');
                $lis.eq(picIndex).css('opacity','0');
                $lis.eq(picIndex).animate({
                    'opacity':1
                },300,'linear')
                picIndex++;
        }
        $('.arrows-left').click(function(){
             for(var j=0;j<$lis.length;j++){
                    $lis.eq(j).css('display','none');               
                }
                if(picIndex<0){
                    picIndex=$lis.length-1;
                }
                $lis.eq(picIndex).css('display','block');
                $lis.eq(picIndex).css('opacity','0');
                $lis.eq(picIndex).animate({
                    'opacity':1
                },300,'linear')
                picIndex--; 
        })       
        setInterval(function(){
            right();
        },3000);        
    }
})

//智能硬件
$.ajax({
    url:'http://127.0.0.1:9900/api/hardware',
    dataType:'json',
    success:function(data){
        // console.log(data);
        $('.hardware-list-right').html(template('template-hardware',data));
    }
})

//周边
function product(toptitle,chooser){
    $.ajax({
    url:'http://127.0.0.1:9900/api/product',
    data:{
        toptitle:toptitle
    },
    dataType:'json',
    success:function(data){
        // console.log(data);
        $(chooser).html(template('template-match-list',data));
        $(chooser+' .match-top>ul>li').eq(0).find('a').addClass('active');
        $(chooser+' .match-top>ul>li').mouseenter(function(){
            $(chooser+' .match-top>ul>li').find('a').removeClass('active'); 
            $(this).find('a').addClass('active');            
            $.ajax({
                url:'http://127.0.0.1:9900/api/product',
                data:{
                    key:$(this).attr('key')
                },
                dataType:'json',
                success:function(data){
                    // console.log(data);
                   $(chooser+' .match-nav-right').html(template('template-other',data)); 
                }
            })
        })
    }
})
}
product('match','.match-list');
product('accessories','.accessories-list');
product('around','.ambitus-list');

//为你推荐
var flagIndex=1;
    $.ajax({
        url:'http://127.0.0.1:9900/api/recommend',
        data:{
            page:1
        },
        dataType:'json',
        success:function(data){
            // console.log(data);
            $('.recommend-list').append(template('template-recommend-list',data));
            var $picIndex = 1;
            $('.recommend-right').click(function(){
                if($('.arrows span').eq(1).hasClass('active')){
                    return;
                }
                $picIndex++;
                flagIndex++;
                if(flagIndex<5){
                    $.ajax({
                        url:'http://127.0.0.1:9900/api/recommend',
                        data:{
                            page:$picIndex
                        },
                        dataType:'json',
                        success:function(data){
                            // console.log(data);
                            
                            $('.recommend-list').append(template('template-recommend-list',data));                        

                            var offsetX = -($picIndex-1)*$('.recommend-buttom').width();
                            $('.recommend-list').animate({
                                'left':offsetX
                            },500)
                        }
                    })
                }else{
                     var offsetX = -($picIndex-1)*$('.recommend-buttom').width();
                     $('.recommend-list').animate({
                        'left':offsetX
                    },500)
                }
                if($picIndex==4){
                     $('.arrows span').eq(1).addClass('active'); 
                 }else{
                     $('.arrows span').eq(0).removeClass('active'); 
                 }
            })
            $('.recommend-left').click(function(){
                if($('.arrows span').eq(0).hasClass('active')){
                    return;
                }
                $picIndex--;
                // $.ajax({
                //     url:'http://127.0.0.1:9900/api/recommend',
                //     data:{
                //         page:$picIndex
                //     },
                //     dataType:'json',
                //     success:function(data){
                //         console.log(data);
                //         $('.recommend-list').html(template('template-recommend-list',data));                   
                //     } 
                // })
                var offsetX = -($picIndex-1)*$('.recommend-buttom').width();
                $('.recommend-list').animate({
                    'left':offsetX
                },500)
                if($picIndex ==1){
                    $('.arrows span').eq(0).addClass('active');
                }else{
                    $('.arrows span').eq(1).removeClass('active');
                }
            })
        }
    })

//热评产品
$.ajax({
    url:'http://127.0.0.1:9900/api/hotcomment',
    dataType:'json',
    success:function(data){
        // console.log(data);
        $('.hotproduct-list').html(template('template-hotproduct',data));
    }
})

//内容
$.ajax({
    url:'http://127.0.0.1:9900/api/content',
    dataType:'json',
    success:function(data){
        console.log(data);
        $('.content-list-outer').html(template('template-content-list',data));
        var moveWidth = $('.content-Amove').width(); 
        for(var i=0;i<$('.content-list-outer>li').length;i++){
            $('.content-list-outer>li').eq(i).find('.content-right').on('click',function(){
                var index = +$(this).parent().attr('liIndex');
                if(index<3){
                    index++;
                    $(this).parent().attr('liIndex',index);
                    $(this).parent().find('.content-list-loop').children().removeClass('active');
                    $(this).parent().find('.content-list-loop').children().eq(index).addClass('active');
                    $(this).parent().find('.content-list-move').animate({
                        'left':-index*moveWidth
                    },500);
                }
            })
        }
        for(var i=0;i<$('.content-list-outer>li').length;i++){
            $('.content-list-outer>li').eq(i).find('.content-left').on('click',function(){
                var index = +$(this).parent().attr('liIndex');
                if(index>0){
                    index--;
                    $(this).parent().attr('liIndex',index);
                    $(this).parent().find('.content-list-loop').children().removeClass('active');
                    $(this).parent().find('.content-list-loop').children().eq(index).addClass('active');
                    $(this).parent().find('.content-list-move').animate({
                        'left':-index*moveWidth
                    },500);
                }
            })
        }


    }
})









//视频
$.ajax({
    url:'http://127.0.0.1:9900/api/video',
    dataType:'json',
    success:function(data){
        // console.log(data);
        $('.video-ul').html(template('video-template',data));
    }
})

// $('.content-right').click(function(){
        //     picIndex++;
        //     $('.content-list-move').animate({
        //         'left':moveLeft
        //     },500);
        // })