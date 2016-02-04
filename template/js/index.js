define('publicTabModule',["jquery"],function ($) {//tab切换
    var publicTabModule ={} 
    publicTabModule = {
        tabChange : function( aElem, aCon, sEvent,className) {
            aCon.hide().eq(0).show();
            aElem.each(function (index){
                $(this).on(sEvent, function(){
                    aElem.removeClass(className);
                    $(this).addClass(className);
                    aCon.hide().eq( index ).show();
                }); 
            });
        },
        slideTab : function(module,className,sEvent,aCon,callBack){
           
            var subnavBar = module.find('.bar')
            aCon.hide().eq(0).show();
            subnavBar.each(function(i){
                var subnavLi = module.eq(i).find('.nav li');
                var iwidth = subnavLi.eq(0).outerWidth();
        
                if($(this).parent().find('li').hasClass(className)){
                    $(this).css('width','246px');
                }else{
                    $(this).css('width',iwidth+'px');
                }
                
               
                subnavLi.on(sEvent,function(){
                    //查看更多
                    var moreLi = $(this).parent().siblings('.more').find('li');
                    var index = $(this).index();
                    var thisWidth = $(this).outerWidth();
                    var iLeft = $(this).offset().left - $(this).parent().offset().left+(thisWidth-iwidth)/2;
                    var thisBar = $(this).parent().siblings('.bar');
                    thisBar.animate({'left':iLeft+'px'},100);
                    subnavLi.removeClass('on');
                    $(this).addClass('on');
                    moreLi.hide();
                    moreLi.eq(index).show();
                    //内容
                    aCon.hide().eq(index).show();
                    $(window).scroll();
                    if(callBack){
                        callBack.apply(this); 
                    }
                   
                })  

            })
          
        },
        lunboTab : function(aCon,leftBtn,rightBtn){
            var iLength = aCon.length;
            var iNow = 0;
            aCon.hide().eq(0).show();
            leftBtn.on('click',function(){
                iNow --
                if(iNow<0){
                    iNow = iLength-1;
                }
                    
                aCon.hide().eq(iNow).fadeIn();
                

            })

            rightBtn.on('click',function(){
                iNow ++;
                if(iNow == iLength){
                    iNow = 0;
                }
                aCon.hide().eq(iNow).fadeIn();
                
            })

        }
    }
    return publicTabModule;
}) 
;
define('indexClassModule',["jquery"],function($){


	var indexClassModule = {};
	indexClassModule ={
		classifyLayer : function(parent,aEles,alayers,className){
			var indexClassTimer
			$(aEles).hover(function(){
				var i = $(this).index()-1;
				clearTimeout(indexClassTimer);
				$(alayers).hide();
				$(aEles).removeClass(className);
				$(this).addClass(className);
				if(i == $(aEles).length-1){
					$(this).addClass("last");
				}
				$(this).parent().siblings(alayers).eq(i).show();
				thisLayer = $(this).parent().siblings(alayers).eq(i);
				var thisTop;
				var layerHeight = thisLayer.outerHeight();
				var menuOffsetTop = parseFloat($(parent).offset().top,10)
				var LiOffsetTop = parseFloat($(this).offset().top,10);
				var LiOffsetH = $(this).outerHeight();
				var windowScrollH = parseFloat($(window).scrollTop(),10);

				if(LiOffsetTop < windowScrollH){
					thisTop = LiOffsetTop - menuOffsetTop;
				}else{

					if(windowScrollH - menuOffsetTop > LiOffsetTop - menuOffsetTop + LiOffsetH - layerHeight ){
							thisTop = windowScrollH - menuOffsetTop;
							
					}else{ 
						thisTop = LiOffsetTop - menuOffsetTop + LiOffsetH - layerHeight;
						
					}

					if(thisTop < 0){
						thisTop = 0
					}

				}

				thisLayer.css('top',thisTop+'px');

				//hover 时取图片src赋值
				var layerImg = thisLayer.find('img');
				layerImg.each(function(i){
					if($(this).data('status') == "0"){
						$(this).attr("src",$(this).data("src"));
						$(this).data("status","1");
					} 
				})
				
			},function(){
				var i = $(this).index()-1;
				if(i == $(aEles).length-1){
					$(this).removeClass("last");
				}
				clearTimeout(indexClassTimer);
				indexClassTimer = setTimeout(function(){
					$(alayers).eq(i).hide();
					$(aEles).eq(i).removeClass(className);
				},100);
			})
			
			$(alayers).hover(function(){
				clearTimeout(indexClassTimer);
			},function(){
				$(alayers).hide();
				$(aEles).removeClass(className);
			})
			

		}
	}
	
	return indexClassModule;

});
define('publicHeaderNav',["jquery"],function ($) {
	var publicHeaderNav={
        itHover:function() {
            var navLi = $(".public_headernav_module .nav li");
            navLi.bind("mouseenter",function () {
                clearTimeout(timer);
                if($(this).hasClass("chubannav") || $(this).hasClass("yuanchuangnav")){
                    $(".chuban").css({"display": "none"});
                    $(".yuanchuang").css({"display": "none"});
                    if ($(this).hasClass("chubannav")) {
                        $(".chuban").css({"display": "block"});
                        $(".public_child_nav").css({"display": "block"});
                    } else if ($(this).hasClass("yuanchuangnav")) {
                        $(".yuanchuang").css({"display": "block"});
                        $(".public_child_nav").css({"display": "block"});
                    }
                }else{

                    $(".chuban").css({"display": "none"});
                    $(".yuanchuang").css({"display": "none"});
                    $(".public_child_nav").css({"display": "none"});
                }
            })
            var timer=null;
            navLi.bind("mouseleave",function () {
                timer=setTimeout(function(){
                $(".chuban").css({"display": "none"});
                $(".yuanchuang").css({"display": "none"});
                $(".public_child_nav").css({"display": "none"});
                },1000)
            })
            var childNav=$(".public_headerchildnav_module");
            childNav.bind("mouseenter",function(){
                clearTimeout(timer);
            });
            childNav.bind("mouseleave",function(){
                $(".chuban").css({"display": "none"});
                $(".yuanchuang").css({"display": "none"});
                $(".public_child_nav").css({"display": "none"});
            })
        }
    };
    return publicHeaderNav;
});
define('publicHeaderChildnavModule',["jquery"],function($){
    var publicHeaderChildnavModule={
        itHover:function(){
            $(".yuanchuang .inner a").bind("mouseenter",function(){
                $(".yuanchuang .inner a i").removeClass("on");
                $(this).find("i").addClass("on");
            })
        }
    };
    return publicHeaderChildnavModule;
});
define('publicSideCodeModule',["jquery"],function($){
	var publicSideCodeModule={
        toTop:function(){
            $(".public_totop_module").on("click",function(){
                $(window).scrollTop(0);
            });
            $(window).bind("scroll",function(){
                if($(window).scrollTop()===0){
                    $(".public_totop_module").hide();
                }else{
                    $(".public_totop_module").show();
                }
            })
        },
        closeCode:function(){
            $(".public_sideecode_module .close").on("click",function(){
                $(".public_sideecode_module").css({"display":"none"});
            })
        }
    }
    return publicSideCodeModule;
});
define('publicHeadersearch',["jquery"],function($){
	var publicHeadersearch={
        getCursor:function(){
            $(".searchtext").on("focus",function(){
                if($(this).val()==="作品、作者、出版社") {
                    $(this).val("");
                }
            });
            $(".searchtext").on("blur",function(){
                if($(this).val()===""){
                    $(this).val("作品、作者、出版社")
                }
            });
        },
        searchBtn:function(){
            $(".searchbtn").on("click",function(){
                if($(".searchtext").val()===""||$(".searchtext").val()==="作品、作者、出版社"){
                }else{
                    window.location="searchresult_page.html?keyword="+$(".searchtext").val();
                }
            });
            document.onkeydown=function(event){
                var e = event || window.event || arguments.callee.caller.arguments[0];
                if(e && e.keyCode==13){ // enter 键
                    if($(".searchtext").val()===""||$(".searchtext").val()==="作品、作者、出版社"){
                    }else{
                        window.location="searchresult_page.html?keyword="+$(".searchtext").val();
                    }
                }
            };
        }
    }
    return publicHeadersearch;
});
define('ddbase',["jquery"],function($){
    var ddbase = ddbase || {};

/**
 * [get cookie]
 * @param  {[type]} name [cookie name]
 * @return {[type]}      [cookie value]
 */
ddbase.getCookie = function(name){
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return decodeURIComponent(escape(arr[2]));
    } else {
        return null;
    }
}

ddbase.token = function(){
    var token = ddbase.getCookie("sessionID");
    if(token === null){
        token = "";
    }
    return token;
}

/**
 * [set cookie]
 * @param {[type]} name  [cookie name]
 * @param {[type]} value [cookie value]
 * @param {[type]} time  [hour]
 */
ddbase.setCookie = function(name,value,time) {
    var exp = new Date();
    exp.setTime(exp.getTime() + time * 60 * 60 * 1000); //有效期1小时    　　
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

/**
 * [delete cookie]
 * @param  {[type]} name [cookie name]
 * @return {[type]}      [description]
 */
ddbase.delCookie = function(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = ddbase.getCookie(name);
    if (cval != null) {
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + "; path=/;domain=dangdang.com";
    }
}

ddbase.setData = function(key,value,time){
    var value=encodeURIComponent(value);
    if(window.localStorage){
        var storage=window.localStorage;
        storage.setItem(key,value);
    }else{
         ddbase.setCookie(key,value,time);
    };
}

ddbase.getData = function(key){
    if(window.localStorage){
        var storage=window.localStorage;
        if(storage.getItem(key)){
            return decodeURIComponent(storage.getItem(key));
        }else{
            return null;
        }
    }else{
        ddbase.getCookie(key);
    };
}

ddbase.delData = function(key){
    if(window.localStorage){
        var storage=window.localStorage;
        storage.removeItem(key);
    }else{
        ddbase.delCookie(key);
    };
}

/**
 * [dateFormat description]
 * @param  {[type]} date [description]
 * @param  {[type]} fmt  [yyyy-MM-dd hh:mm:ss]
 * @return {[type]}      [description]
 */
ddbase.dateFormat = function (time,fmt) { 
    var format = fmt;
    var date = new Date(time);
    var o = {
        "M+" : date.getMonth()+1, //month
        "d+" : date.getDate(), //day
        "h+" : date.getHours(), //hour
        "m+" : date.getMinutes(), //minute
        "s+" : date.getSeconds(), //second
        "q+" : Math.floor((date.getMonth()+3)/3), //quarter
        "S" : date.getMilliseconds() //millisecond
    };
    if(/(y+)/.test(format)) format=format.replace(RegExp.$1,(date.getFullYear()+"").substr(4- RegExp.$1.length));
    for(var k in o){
        if(new RegExp("("+ k +")").test(format)){
            format = format.replace(RegExp.$1,RegExp.$1.length==1? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
        }
    }
    return format;
}

/**
 * [randomNumeric description]
 * @param  {[type]} len [description]
 * @return {[type]}     [description]
 */
ddbase.randomNumeric = function(len){
    var num = '';
    var numLen = len;
    for(var i=0;i<numLen;i++){
       num += Math.floor(Math.random()*10);
    } 
    return num;
}
/**
 * [generateGuid description]
 * @return {[type]} [description]
 */
ddbase.generateGuid = function() {
    var guid = '';
    var time = new Date().getTime();   
    time = time.substring(time.length() - 3, time.length());
    var now = ddbase.dateFormat(new Date(), "yyyyMMddHHmmss");
    guid = now + time + ddbase.randomNumeric(6) + ddbase.randomNumeric(6) + ddbase.randomNumeric(6);
    return guid.toString();
}

/**
 * [getQueryString description]
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
ddbase.getQueryString = function(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    }
    return null;
}



/**
 * [loadJsFiles description]
 * @param  {[type]} container [js添加的容器]
 * @param  {[type]} jsUrl     [jsUrl地址]
 * @return {[type]}           [description]
 */
ddbase.loadJsFiles = function(container,jsUrl){
    var JsTag = document.createElement("script");  
    JsTag.setAttribute("type", "text/javascript");  
    JsTag.setAttribute("src", jsUrl);
    container.append(JsTag);
}



/**
 * [UUID description]
 */
ddbase.UUID = function(){
    this.id = this.createUUID();
}
ddbase.UUID.prototype= {
    valueOf:function() {
        return this.id;
    },
    toString:function() {
        return this.id;
    },
    createUUID:function() {
        //
        // Loose interpretation of the specification DCE 1.1: Remote Procedure Call
        // since JavaScript doesn't allow access to internal systems, the last 48 bits
        // of the node section is made up using a series of random numbers (6 octets long).
        //
        var self = this;
        var dg = new Date(1582, 10, 15, 0, 0, 0, 0);
        var dc = new Date();
        var t = dc.getTime() - dg.getTime();
        var tl = self.getIntegerBits(t, 0, 31);
        var tm = self.getIntegerBits(t, 32, 47);
        var thv = self.getIntegerBits(t, 48, 59) + '1'; // version 1, security version is 2
        var csar = self.getIntegerBits(self.rand(4095), 0, 7);
        var csl = self.getIntegerBits(self.rand(4095), 0, 7);

        // since detection of anything about the machine/browser is far to buggy,
        // include some more random numbers here
        // if NIC or an IP can be obtained reliably, that should be put in
        // here instead.
        var n = self.getIntegerBits(self.rand(8191), 0, 7) +
                self.getIntegerBits(self.rand(8191), 8, 15) +
                self.getIntegerBits(self.rand(8191), 0, 7) +
                self.getIntegerBits(self.rand(8191), 8, 15) +
                self.getIntegerBits(self.rand(8191), 0, 15); // this last number is two octets long
        return tl + tm + thv + csar + csl + n;
    },
    getIntegerBits:function(val, start, end) {
        var base16 = this.returnBase(val, 16);
        var quadArray = new Array();
        var quadString = '';
        var i = 0;
        for (i = 0; i < base16.length; i++) {
            quadArray.push(base16.substring(i, i + 1));
        }
        for (i = Math.floor(start / 4); i <= Math.floor(end / 4); i++) {
            if (!quadArray[i] || quadArray[i] == '') quadString += '0';
            else quadString += quadArray[i];
        }
        return quadString;
    },
    returnBase:function(number, base) {
        return (number).toString(base).toUpperCase();
    },
    rand:function(max) {
        return Math.floor(Math.random() * (max + 1));
    }
};


// username
ddbase.getUserName = function(){
    var username = ddbase.getCookie('MDD_username');
    if(username == null){
        $.ajax({
            method:'GET',
            url:'/media/api2.go?action=getUser&selfType=0&pubId=5&rewardIcon='+ddbase.setBaseApiParams(),
            async:false,
            success:function(response){
                if(parseInt(response.status.code) == 0){
                    var userInfo = response.data.userInfo;
                    ddbase.setCookie('MDD_username',userInfo.nickName,8760);
                    ddbase.setCookie('MDD_custId',userInfo.pubCustId,8760);
                    username = userInfo.nickName;
                }
            }
        })
    }
    return username;
}
ddbase.getCustId=function(){
    // 由于退出登录清除不了custId的cookie，为了防止多账号登陆出现的MDD_custId不能更新的问题，特改为每次刷新页面都重新请求custId
    // var custId= decodeURIComponent(ddbase.getCookie("MDD_custId"));
    // if (!custId || custId==''||custId==null){
    if(ddbase.token() && ddbase.token()!=null){
        $.ajax({
            method:'GET',
            url:'/media/api2.go?action=getUser&selfType=0&pubId=5&rewardIcon='+ddbase.setBaseApiParams(),
            async:false,
            success:function(response){
                if(parseInt(response.status.code) == 0){
                    var userInfo = response.data.userInfo;
                    // ddbase.setCookie('MDD_custId',userInfo.pubCustId,8760);
                    custId = decodeURIComponent(userInfo.pubCustId);
                }
            }
        })
    // }
        return custId;
    }else{
        return false;
    }
        
}
//设置公共参数
ddbase.setBaseApiParams = function(){
            var channelId = ddbase.getQueryString('channelId');
            if(channelId == null){
                channelId = 70000;
            }
            var permanentId = ddbase.getCookie('__permanent_id');
            if(permanentId == null){
                permanentId = "";
            }
            return "&deviceSerialNo=html5&macAddr=html5&channelType=html5&permanentId="+ permanentId +"&returnType=json&channelId="+ channelId +"&clientVersionNo=5.0.0&platformSource=DDDS-P&fromPlatform=106&deviceType=pconline&token="+ddbase.token();
        }
ddbase.baseApiParams = ddbase.setBaseApiParams();

//使用underscore的模板
ddbase.template = function(tmpl,data){
            var compile = _.template(tmpl);
            return compile(data);
        };
//时间处理，当天显示。。前，一天前显示具体时间
ddbase.dealTime = function(oldtime){
            if(oldtime == undefined){
                return '';
            }
            var oldtime=parseInt(oldtime)
            var timeDifference=(new Date()).getTime()-oldtime;
            var oneDay=24*60*60*1000
            if(timeDifference>0){
                if(timeDifference-oneDay>0){
                    var oldtimeFormat=new Date(oldtime);
                    return oldtimeFormat.getFullYear()+"-"+(oldtimeFormat.getMonth()+1)+"-"+oldtimeFormat.getDate();
                }else{
                    var timeDifferenceSecond=(timeDifference)/1000;
                    if(parseInt(timeDifferenceSecond/60)<60){
                        return parseInt(timeDifferenceSecond/60)+"分钟前";
                    }else {
                        var newHours=Math.floor(timeDifferenceSecond / 3600)
                        return newHours + "小时" + parseInt((timeDifferenceSecond-newHours*3600)/60) + "分钟前";
                    };
                };
            }else{
                return '0分钟前';
            }
        };
//今天昨天显示时分，两天前显示具体时间
ddbase.newDealTime = function(oldtime){
            if(!oldtime) return '';
            var oldtimems=parseInt(oldtime);
            var oldtime=new Date(oldtimems);
            var nowtime=new Date();
            var nowtimems=nowtime.getTime();
            var oldtimeYear=oldtime.getFullYear(),nowtimeYear=nowtime.getFullYear();
            var oldtimeMonth=oldtime.getMonth()+1;
            var oldtimeDay=oldtime.getDate();
            var oldtimeHours=oldtime.getHours();
            var oldtimeMinutes=oldtime.getMinutes();
            if(oldtimeYear<nowtimeYear){
                return numDeal(oldtimeYear)+"-"+numDeal(oldtimeMonth)+"-"+numDeal(oldtimeDay);
            }else{
                var current = getCurrentTime();
                if(nowtimems-oldtimems<current){
                    return "今天 "+numDeal(oldtimeHours)+":"+numDeal(oldtimeMinutes);
                }else if(nowtimems-oldtimems>current && nowtimems-oldtimems<(current+24*60*60*1000)){
                    return "昨天"+numDeal(oldtimeHours)+":"+numDeal(oldtimeMinutes);
                }else{
                    return numDeal(oldtimeMonth)+"-"+numDeal(oldtimeDay);
                }
            }
            function numDeal(num){
                if((num+"").length===1){
                    return "0"+num;
                }else{
                    return num;
                }
            };
            function getCurrentTime(){
                var date = new Date();
                var hour = date.getHours();
                var munite = date.getMinutes();
                var second = date.getSeconds();
                return (hour*3600+munite*60+second)*1000;
            }
        }
//返回还剩多长时间
ddbase.leaveTime = function(deadtime){
    var deadtime=parseInt(deadtime);
    if(isNaN(deadtime) || !deadtime ) return 0;
    var leaveTime = deadtime - (new Date()).getTime();
    if(leaveTime <= 0) return 0;
    var day = 24*60*60*1000,hour = 60*60*1000,minute = 60*1000,second = 1000;
    if(leaveTime >= day) return parseInt(leaveTime / day) + '天';
    if(leaveTime >= hour) return parseInt(leaveTime / hour) + '小时';
    if(leaveTime >= minute) return parseInt(leaveTime / minute) + '分钟';
    if(leaveTime >= second) return parseInt(leaveTime / second) + '秒';
};

//获取书的跳转链接
ddbase.getBookUrl = function(options){//options productId,sale,mediaId,mediaType key/value
    var type = options.mediaType || options.bookType;
    if(!type) return null;
    var url = '';
    switch(type){
        case 1:
        case 2:
            if(options.saleId && options.mediaId){
                url = type == 1 ? 'original_single_page.html' : 'product_page.html';
                url = url + '?id='+options.saleId+'&mediaId='+options.mediaId || options.saleId;
            }
            break;
        case 3:
            if(options.productId) url = 'http://product.dangdang.com/'+options.productId+'.html'
            break;
    }
    return url;
}
//加入/退出吧
ddbase.joinBar = function(options){
    $.get('/media/api.go?action=barMember'+ddbase.baseApiParams,{
         actionType:options.actionType || 1,
         barId:options.barId,
         custId:options.custId || ''
    },function(response){
        if(response.status.code != 0 && response.status.code !=10003){
            ddbase.setMessageTip('好像发生了什么事情，稍后再试试吧~');
            return;
        } 
        options.callback(response);
    })
}
//滚动时距离底部px
ddbase.onTime = function(px){//页尾321px
    var scrollTop = $(window).scrollTop();
    var scrollHeight = $(document).height();
    var windowHeight = $(window).height();
    if (scrollTop + windowHeight + px >= scrollHeight) {
        return true;
    }
    return false;
}

ddbase.dealStar = function(statNum){
    return Math.round(statNum);
}

// 用以代替alert作为全局提示tips
ddbase.setMessageTip=function(text){
    var self = this;
    self.msgTip=$(".message-tip");
    clearTimeout(self.msgTipTime);
    self.msgTip.text(text).fadeIn(1000);
    self.msgTipTime = setTimeout(function(){
        self.msgTip.fadeOut(1000);
    },2500)
}

// 用来快速隐藏全局tips，如果没有本方法，tips提示框将在2.5秒后才消失
ddbase.hideMessageTip=function(){
    var self = this;
    self.msgTip=$(".message-tip");
    clearTimeout(self.msgTipTime);
    self.msgTip.hide();
}

window.productPostsNum = function(){
    if(window.productDetailReturn&&window.productBarReturn){
        if($('#postNum').length>0 && $('#postNum').html()==""){
            $('#postNum').html("("+window.productComNum+"人评论)");
        }
    }
};

window.productComNum = 0;
window.productDetailReturn = false;
window.productBarReturn = false;
    return ddbase;
})
window.nofind = function(img,src){
   img.src=src || 'img/book_def_180_260.png';
   img.onerror=null;
}

// 火狐禁止拖动打开页面
document.ondragstart=function() {
    return false;
}


;
define('loginModule',["jquery",'ddbase'],function ($,ddbase) {
	var login_module = function(returnUrl){
		//是否登录的标志
		var sessionId = ddbase.token();
		//已经登录过的用户
		if(sessionId != '') return;
		//调用当当主站登录页面appKey
		var appkey = 8103;
		//当当登录页面
	    //var signinUrl = 'http://login.dangdang.com/signin.php';
	    var signinUrl = 'https://login.dangdang.com/signin.aspx';
	    //从redis中读取session信息验证登录
		var verifyLoginStatusUrl = 'http://redisapi.dangdang.com/verify_login_status.php?result_format=json';
		//清除session
    	var clearSessionUrl = 'http://redisapi.dangdang.com/session clear_session.php?result_format=json';
        //登录完了的回调地址
        var url;
        if(returnUrl != undefined && returnUrl != ''){
            url = returnUrl;
        }else{
            url = window.location.href.toString();
        }
    	window.location.href = signinUrl+'?returnurl='+encodeURIComponent(url);
	}
	return login_module;
});
define('signOutModule',["jquery",'ddbase'],function ($,ddbase) {
	var signOut_module = function(callback){

		//是否登录的标志
		var sessionId = ddbase.token();
		//已经登录过的用户
		if(sessionId == '') return;
        //清除数字阅读token
        var clearTokenUrl = '/media/api2.go?action=loginOutV2'+ddbase.setBaseApiParams();
    	//退出登录
		$.ajax({
	        method:'POST',
	        url:clearTokenUrl,
	        success:function(data){
		    	if(parseInt(data.status.code) == 0){
		    		ddbase.delCookie('sessionID');
		    		ddbase.delCookie('MDD_username');
                    ddbase.delCookie('MDD_custId');
                    ddbase.delCookie('login.dangdang.com');
		    		if(callback != undefined){
		    			callback();
		    		}
		    	}
	        }
        })  
	}
	return signOut_module;
});
define('headerChildNav',["jquery",'ddbase'],function ($,ddbase) {
	var headerChildNav = {
		init:function(options){
			// for( key in options){
			// 	if(options[key] != "#focusPic"){
			// 		$(options[key]).find('.sexContent').hide().eq(0).show();
			// 		$(options[key]).find('.more li').hide().eq(0).show();
			// 		$(options[key]).find('.nav li').hide().eq(0).show();
			// 		$(window).scroll()//初始化滚动加载
			// 	}else{
			// 		$(options[key]).find('.sexContent').css({'opacity':0,'z-index':1}).eq(0).css({'opacity':1,'z-index':10});
			// 	}
			// }
			var self = this;
			//判断现在是哪个页面
			if(self.judgePage() == 'original_index' ){
				if(ddbase.getQueryString('originalSex') == 'man' || ddbase.getQueryString('originalSex') == null){
					self.initPage(options,0);
				}else if(ddbase.getQueryString('originalSex') == 'woman'){
					self.initPage(options,1);
				}
			}
			
			self.change(options);
		},
		change:function(options){
			var self = this;
			if(self.judgePage() == 'original_index' ){
				if(ddbase.getCookie("original_index_sex") == "woman" && ddbase.getQueryString('originalSex') != 'woman'){
			      
			       self.initPage(options,1);
			    }
			}
			
			$('#publicChildMan').click(function(){
				if(self.judgePage() != 'original_index' ){
					ddbase.setCookie("original_index_sex","man");
					window.location.href = 'original_index_page.html?originalSex=man';
				}else{
					self.clickfn(options,0);
				}
			})
				
			$('#publicChildWoman').click(function(){
				if(self.judgePage() != 'original_index' ){
					ddbase.setCookie("original_index_sex","woman");
					window.location.href = 'original_index_page.html?originalSex=woman';
				}else{
					self.clickfn(options,1);
				}
			})

			$('#originLeftMenuMan').click(function(){
					self.clickfn(options,0);
			})
			$('#originLeftMenuWoman').click(function(){
					self.clickfn(options,1);
			})
		},
		clickfn : function(options,i){
			var self = this;
			if( i == 0 ){
				ddbase.setCookie("original_index_sex","man")
			}else{
				ddbase.setCookie("original_index_sex","woman")
			}
			self.initPage(options,i)
		},
		judgePage : function(){
			var name = window.location.pathname
          
            var index = name.lastIndexOf("/");
            name = name.substr(index + 1, name.length - index),
            name = name.split("_page")[0]
            return name;
		},
		initPage:function(options,i){
			for( key in options){
				if(options[key] !="#focusPic"){
					$(options[key]).find('.sexContent').hide().eq(i).show();
					$(options[key]).find('.more li').hide().eq(i).show();
					$(options[key]).find('.nav li').hide().eq(i).show();
					$(window).scroll()//初始化滚动加载
				}else{
					$(options[key]).find('.sexContent').css({'opacity':0,'z-index':1}).eq(i).css({'opacity':1,'z-index':10});
					if(i == 0&&window.originWomanPic&&window.originManPic){
						originWomanPic.timer = setTimeout(function(){
					        window.originWomanPic.stop();
					    },0)
					    
					    window.originManPic.stop();
					    window.originManPic.play();
					   
					    
					}else if(i == 1&&window.originWomanPic&&window.originManPic){
						originManPic.timer=setTimeout(function(){
					        window.originManPic.stop();
					    },0)
					    window.originWomanPic.stop();
					    window.originWomanPic.play();
					   
					}
				}
				
			}
		}

		
	}

	return headerChildNav;
});
define('publicMethod',["jquery","publicHeaderNav","publicHeaderChildnavModule","publicSideCodeModule","publicHeadersearch","loginModule",'signOutModule','ddbase','headerChildNav'],function ($,publicHeaderNav,publicHeaderChildnavModule,publicSideCodeModule,publicHeadersearch,loginModule,signOutModule,ddbase,headerChildNav) {

	var publicMethod={
        init:function(){
            publicHeaderNav.itHover();
            publicSideCodeModule.toTop();
            publicSideCodeModule.closeCode();
            publicHeaderChildnavModule.itHover();
            publicHeadersearch.getCursor();
            publicHeadersearch.searchBtn();
            // 判断进入阅读中心的权限
            this.checkReadingCenterLogin();

            headerChildNav.init({
                el1 : '#originHotArticle',
                el2 : '#originRecommend',
                el3 :'#originLimitedFree',
                el4 :'#originRightRecomend',
                el5 :"#originBigAds",
                el6: "#hotWholeBook",
                el7:"#originalHotTopic",
                el8:"#focusPic"
            });


            //页头登录
            publicMethod.setHeaderImg();
            $('#loginBtn').click(function(){
                loginModule();
            })
            
            //页头退出
            $('#signOutBtn').on('click',function(){
                signOutModule(publicMethod.setLoginHtml());
            })
            //我的订单跳转登录
            $('#headerMyOrder').on('click',function(){
                if (ddbase.token()==""){
                    loginModule();
                }else{
                    window.location = "my_order_page.html";
                }
            })

            //购买需要的cookie
            var channelId = ddbase.getQueryString('channelId');
            if(channelId == null){
                channelId = 70000;
            }
            ddbase.setCookie('MDD_channelId',channelId,8760);
            ddbase.setCookie('MDD_fromPlatform','307',8760); //新PC购物车支付
        },
        setHeaderImg:function(){
            if(ddbase.token() != ''){
                var userName = ddbase.getUserName();
                var nickName = '<img class="header_img" src="img/payment/head_img.png">' + userName;
                $('#loginBtn').html(nickName);
                $('#loginBtn').after('<span id="signOutBtn">[退出]</span>');
                $('#registerBtn').html('');
            }
        },
        setLoginHtml:function(){
            $('#signOutBtn').remove();
            $('#loginBtn').html('你好，请登录');
            $('#registerBtn').html('<a target="_blank" href="https://login.dangdang.com/Register.aspx?returnurl=http://e.dangdang.com/">免费注册</a>|');
        },
        setProductTotalCount:function(num){
            if(parseInt(num) > 0){
                $('.public_headersearch_module .shopcar_num').html('('+num+')');
            }
            if(parseInt(num) == 0){
                $('.public_headersearch_module .shopcar_num').html('');
            }
        },
        checkReadingCenterLogin:function(){
            $('#readingCenterBtn').on('click',function(e){
                e.preventDefault();
                if(ddbase.token() && ddbase.token()!=''){
                    window.location.href="reading_center_page.html"
                }else{
                    loginModule();
                }
            })
        }
    };
    return publicMethod;
});
define('indexFocusone',["jquery"],function($) {

        var Unslider = function() {
            //  Object clone

            var _ = this;
            var f=false;

            //  Set some options
            _.o = {
                speed: 500,     // animation speed, false for no transition (integer or boolean)
                delay: 3000,    // delay between slides, false for no autoplay (integer or boolean)
                init: 0,        // init delay, false for no delay (integer or boolean)
                pause: !false,      // pause on hover (boolean)
                loop: !false,       // infinitely looping (boolean)
                keys: false,        // keyboard shortcuts (boolean)
                dots: false,        // display dots pagination (boolean)
                arrows: false,      // display prev/next arrows (boolean)
                prev: '&larr;', // text or html inside prev button (string)
                next: '&rarr;', // same as for prev option
                fluid: false,       // is it a percentage width? (boolean)
                starting: false,    // invoke before animation (function with argument)
                complete: false,    // invoke after animation (function with argument)
                items: '>ul',   // slides container selector
                item: '>li',    // slidable items selector
                easing: 'swing',// easing function to use for animation
                autoplay: true  // enable autoplay on initialisation
            };

            _.init = function(el, o) {

                //  Check whether we're passing any options in to Unslider
                _.o = $.extend(_.o, o);

                _.el = el;
                _.ul = el.find(_.o.items);
                _.max = [el.outerWidth() | 0, el.outerHeight() | 0];
                _.li = _.ul.find(_.o.item).each(function(index) {
                    var me = $(this),
                        width = me.outerWidth(),
                        height = me.outerHeight();

                    //  Set the max values
                    if (width > _.max[0]) _.max[0] = width;
                    if (height > _.max[1]) _.max[1] = height;
                });


                //  Cached vars
                var o = _.o,
                    ul = _.ul,
                    li = _.li,
                    len = li.length;

                //  Current indeed
                _.i = 0;

                //  Set the main element
                el.css({width: _.max[0], height: li.first().outerHeight(), overflow: 'hidden'});

                //  Set the relative widths
                ul.css({position: 'relative', left: 0, width: (len * 100) + '%'});
                if(o.fluid) {
                    li.css({'float': 'left', width: (100 / len) + '%'});
                } else {
                    li.css({'float': 'left', width: (_.max[0]) + 'px'});
                }

                //  Autoslide
                o.autoplay && setTimeout(function() {
                    if (o.delay | 0) {
                        _.play();

                        if (o.pause) {
                            el.on('mouseover mouseout', function(e) {
                                _.stop();
                                e.type === 'mouseout' && _.play();
                            });
                        };
                    };
                }, o.init | 0);

                //  Keypresses
                if (o.keys) {
                    $(document).keydown(function(e) {
                        switch(e.which) {
                            case 37:
                                _.prev(); // Left
                                break;
                            case 39:
                                _.next(); // Right
                                break;
                            case 27:
                                _.stop(); // Esc
                                break;
                        };
                    });
                };

                //  Dot pagination
                o.dots && nav('dot');

                //  Arrows support
                o.arrows && nav('arrow');

                //  Patch for fluid-width sliders. Screw those guys.
                o.fluid && $(window).resize(function() {
                    _.r && clearTimeout(_.r);

                    _.r = setTimeout(function() {
                        var styl = {height: li.eq(_.i).outerHeight()},
                            width = el.outerWidth();

                        ul.css(styl);
                        styl['width'] = Math.min(Math.round((width / el.parent().width()) * 100), 100) + '%';
                        el.css(styl);
                        li.css({ width: width + 'px' });
                    }, 50);
                }).resize();

                //  Move support
                if ($.event.special['move'] || $.Event('move')) {
                    el.on('movestart', function(e) {
                        if ((e.distX > e.distY && e.distX < -e.distY) || (e.distX < e.distY && e.distX > -e.distY)) {
                            e.preventDefault();
                        }else{
                            el.data("left", _.ul.offset().left / el.width() * 100);
                        }
                    }).on('move', function(e) {
                        var left = 100 * e.distX / el.width();
                        var leftDelta = 100 * e.deltaX / el.width();
                        _.ul[0].style.left = parseInt(_.ul[0].style.left.replace("%", ""))+leftDelta+"%";

                        _.ul.data("left", left);
                    }).on('moveend', function(e) {
                        var left = _.ul.data("left");
                        if (Math.abs(left) > 30){
                            var i = left > 0 ? _.i-1 : _.i+1;
                            if (i < 0 || i >= len) i = _.i;
                            _.to(i);
                        }else{
                            _.to(_.i);
                        }
                    });
                };

                return _;
            };

            //  Move Unslider to a slide index
            _.to = function(index, callback) {
                if (_.t) {
                    _.stop();
                    _.play();
                }
                var o = _.o,
                    el = _.el,
                    ul = _.ul,
                    li = _.li,
                    current = _.i,
                    target = li.eq(index);

                $.isFunction(o.starting) && !callback && o.starting(el, li.eq(current));

                //  To slide or not to slide
                if ((!target.length || index < 0) && o.loop === f) return;

                //  Check if it's out of bounds
                if (!target.length) index = 0;
                if (index < 0) index = li.length - 1;
                target = li.eq(index);

                var speed = callback ? 5 : o.speed | 0,
                    easing = o.easing,
                    obj = {height: target.outerHeight()};

                if (!ul.queue('fx').length) {
                    //  Handle those pesky dots
                    el.find('.dot').eq(index).addClass('active').siblings().removeClass('active');

                    el.animate(obj, speed, easing) && ul.animate($.extend({left: '-' + index + '00%'}, obj), speed, easing, function(data) {
                        _.i = index;

                        $.isFunction(o.complete) && !callback && o.complete(el, target);
                    });
                };
            };

            //  Autoplay functionality
            _.play = function() {
                _.t = setInterval(function() {
                    _.to(_.i + 1);
                }, _.o.delay | 0);
            };

            //  Stop autoplay
            _.stop = function() {
                _.t = clearInterval(_.t);
                return _;
            };

            //  Move to previous/next slide
            _.next = function() {
                return _.stop().to(_.i + 1);
            };

            _.prev = function() {
                return _.stop().to(_.i - 1);
            };

            //  Create dots and arrows
            function nav(name, html) {
                if (name == 'dot') {
                    html = '<ol class="dots" style="position:absolute">';
                    $.each(_.li, function(index) {
                        html += '<li class="' + (index === _.i ? name + ' active' : name) + '"></li>';
                    });
                    html += '</ol>';
                } else {
                    html = '<div class="';
                    html = html + name + 's">' + html + name + ' prev">' + _.o.prev + '</div>' + html + name + ' next">' + _.o.next + '</div></div>';
                };

                _.el.addClass('has-' + name + 's').append(html).find('.' + name).click(function() {
                    var me = $(this);
                    me.hasClass('dot') ? _.stop().to(me.index()) : me.hasClass('prev') ? _.prev() : _.next();
                });
            };
        };
        //  Create a jQuery plugin
         var indexFocusone={
             unslider:function(o,obj) {
                 var len = obj.length;

                  //Enable multiple-slider support
                 // return obj.each(function(index) {
                 //     //  Cache a copy of $(this), so it
                 //     var me = $(this),
                 //         key = 'unslider' + (len > 1 ? '-' + ++index : ''),
                 //         instance = (new Unslider).init(me, o);

                 //     //  Invoke an Unslider instance
                 //     me.data(key, instance).data('key', key);
                 // });
                
                     
                     var me = $(obj),
                         key = 'unslider' + (len > 1 ? '-' + ++index : ''),
                         instance = new Unslider;
                         instance.init(me, o)
                     //  Invoke an Unslider instance
                     me.data(key, instance).data('key', key);
                     return instance;
             }
         };
        Unslider.version = "1.0.0";
    return indexFocusone;
});
define('indexLimitedTemplate',["jquery","underscore","backbone",'ddbase'],function ($,_,Backbone,ddbase) {
    var indexLimitedTemplate = '<% if(data.length>0){%>'+
    '<div class="index_subnav_module">'+
        '<ul class="nav clearfix">'+
            '<li class="first on">'+
                '<a href="morelist_page.html?columnType=rec_limited_free&title=限时免费" target="_blank">限时免费</a>'+
                '<div class="index_time_module"><span class="time">00</span>天<span class="time">00</span>时<span class="time">00</span>分<span class="time">00</span>秒</div>'+
            '</li>'+
        '</ul>'+
        '<div class="bar"></div>'+
        '<ul class="more">'+
            '<li><a href="morelist_page.html?columnType=rec_limited_free&title=限时免费" target="_blank">查看更多</a></li>'+
        '</ul>'+
    '</div>'+
    '<div class="clearfix">'+
       '<%data.each(function(item,i){%>'+
            '<%if(i<8){%>'+
                '<%var item_detail = item.get("mediaList")[0];%>'+
                '<%var item_title = item_detail.title;%>'+
                '<%var item_descs = item_detail.descs;%>'+
                '<div class="index_smallcell_module">'+
                    '<div class="book clearfix">'+
                    '<%var link = ddbase.getBookUrl({mediaType:item_detail.mediaType,saleId:item_detail.saleId,mediaId:item_detail.mediaId})%>'+
                            '<div class="bookcover"><a href="<%=link%>" target="_blank"><img src="" data-original="<%=item_detail.coverPic%>" onerror="this.src=\'img/book_def_180_260.png\'"/></a></div>'+
                            '<div class="bookinfo">'+
                                '<div class="title"><a href="<%=link%>" target="_blank"><%=item_title%></a></div>'+
                                '<div class="author"><%=item_detail.authorPenname%></div>'+
                                '<div class="startie"><div class="star">'+
                                 '<%if(item_detail.avgStarLevel != undefined){%>'+
                                    '<%var starlevel = ddbase.dealStar(item_detail.avgStarLevel)%>'+
                                     '<%for(var i=0;i<starlevel;i++){%>'+
                                        '<span class="has"></span>'+
                                     '<%}%>'+
                                     '<%for(var j=0;j<5-starlevel;j++){%>'+
                                        '<span></span>'+
                                     '<%}%>'+
                                 '<%}%>'+
                                '</div><div class="tienum">(<%=item_detail.commentNumber%>)</div></div>'+
                                '<div class="price"><a href="<%=link%>" target="_blank"><span class="now"><i class="free">免费领取</i></span></a>'+
                                    '<%if(item_detail.paperBookId != undefined ){%>'+
                                        '|<span><%=dealPrice.originPrice(item_detail)%></span>'+
                                    '<%}%>'+
                                '</div>'+
                                '<div class="des"><%=item_descs%></div>'+
                            '</div>'+
                        '</a>'+
                    '</div>'+
                '</div>  '+ 
                
            '<%}%>'+
       '<%})%>'+
    '</div>'+
'<%}%>'
    
    
   return indexLimitedTemplate;
});
define('dealPrice',[],function (){
    var dealPrice={
        init:function (item){
            var priceStr="";
            if(item!=null && item.mediaList && item.mediaList[0]){
                var item_detail = item.mediaList[0];
                if(item_detail.promotionId == 3 || item_detail.freeBook == 1){ //免费
                    priceStr = '免费';
                }else{
                    if(item_detail.mediaType == 2){ //出版物
                        var finalPrice;
                        // 出版物只看 price
                      
                        if( item_detail.price == undefined){
                             priceStr = '';
                        }else if(item_detail.price == 0){
                            priceStr = '免费';
                        }else{
                             priceStr = '￥'+(parseInt(item_detail.price)/100).toFixed(2);
                        }
    
                    }else if(item_detail.mediaType == 1){ //原创
                        if(item.isSupportFullBuy == 1){ //已完结
                            if(item_detail.price == undefined){
                                priceStr = '';
                            }else if(item_detail.price == 0){
                                priceStr = '免费';
                            }else{
                                priceStr = parseInt(item_detail.price)+'铃铛/本';
                            }
                           
                        }else{ //未完结
                            if(item_detail.priceUnit == undefined){
                                priceStr="";
                            }else if(item_detail.priceUnit == 0){
                                priceStr = '免费';
                            }else{
                                priceStr = parseInt(item_detail.priceUnit)+'铃铛/千字';
                            }
                        }
                    }else if(item_detail.mediaType == 3){ //纸书
                        if(item_detail.lowestPrice == 0){
                            priceStr = '免费';
                        }else{
                            priceStr = '￥'+(parseInt(item_detail.lowestPrice*100)/100).toFixed(2);
                        }

                    }
                };
                return priceStr;
            }
        },
        dealPrice2:function(item_detail){
            //mediaList>item>isSupportFullBuy+priceUnit,例如:猜你喜欢
            var priceStr="";
            if(item_detail!=null){
                if(item_detail.promotionId == 3){ //免费
                    priceStr = '免费';
                }else{
                    if(item_detail.mediaType == 2){ //出版物
                        var finalPrice;
                        // 出版物只看 price
                      
                        if( item_detail.price == undefined){
                             priceStr = '';
                        }else if(item_detail.price == 0){
                            priceStr = '免费';
                        }else{
                             priceStr = '￥'+(parseInt(item_detail.price)/100).toFixed(2);
                        }

                    }else if(item_detail.mediaType == 1){ //原创
                        if(item_detail.isSupportFullBuy == 1){ //已完结
                            if(item_detail.price == undefined){
                                priceStr = '';
                            }else if(item_detail.price == 0){
                                priceStr = '免费';
                            }else{
                                priceStr = parseInt(item_detail.price)+'铃铛/本';
                            }
                        }else{ //未完结
                            if(item_detail.priceUnit == undefined){
                                priceStr="";
                            }else if(item_detail.priceUnit == 0){
                                priceStr = '免费';
                            }else{
                                priceStr = parseInt(item_detail.priceUnit)+'铃铛/千字';
                            }
                        }
                    }else if(item_detail.mediaType == 3){ //纸书
                        if(item_detail.lowestPrice == 0){
                            priceStr = '免费';
                        }else{
                            priceStr = '￥'+(parseInt(item_detail.lowestPrice*100)/100).toFixed(2);
                        }

                    }
                };
            }
            return priceStr;
        },
        originPrice:function(item_detail){
            var originPrice="";
            if(item_detail.paperBookId !=undefined &&item_detail.paperBookId !=""){
                originPrice = '￥'+(parseInt(item_detail.paperBookPrice)/100).toFixed(2);
            }

            return originPrice;
        }
    }

    return dealPrice;
})
;
define('limitedFreeModule',["jquery","underscore","backbone",'ddbase',"dealPrice","lazyload"],function ($,_,Backbone,ddbase,dealPrice,lazyload) {
    var limitedFreeModule = {};
    limitedFreeModule.module = Backbone.Model.extend({
        defaults: {
            mediaList: [
                {
                   authorId: '',
                   authorPenname: "",
                   categoryIds: "",
                   categorys: "",
                   coverPic: "",
                   descs: "",
                   isFull: 1,
                   isStore: 0,
                   mediaId: "",
                   mediaType:1,
                   recommandWords: "",
                   saleId: "",
                   title: ""
                }
            ]
        }
    });
    limitedFreeModule.collection = Backbone.Collection.extend({
        model : limitedFreeModule.module
    });
    limitedFreeModule.view = Backbone.View.extend({  
        initialize: function(options){  
            var self = this;
            self.el = options.el;
            self.collections = new limitedFreeModule.collection();
            self.dataUrl = options.dataUrl + ddbase.baseApiParams;
            self.template = options.template;
            self.render();
        },
        render:function(){
            var self = this;
            self.collections.fetch({
                url:self.dataUrl,
                success:function(collection,response){
                    if(response != null){
                        
                        self.collections.set(response.data.saleList);
                        $(self.el).html(_.template(self.template)({data:self.collections,ddbase:ddbase,dealPrice:dealPrice}));
                        //倒计时
                        response.data.overtime&&self.setTime(response.data.overtime);
                       
                            $(".index_limitedfree_module img").lazyload({
                                 effect  : "fadeIn" //加载图片使用的效果(淡入)
                            });
                    }
                 },
                error:function(){
                    
                }
            });
        },
        setTime:function(time){
            var self = this;
            var endTime = new Date(time);
            var showi = $(self.el).find('.index_time_module .time');
            self.sto&&clearInterval(self.sto);
            if(endTime.getTime() - (new Date()).getTime() < 0){
                return;
            }else{
                self.sto = setInterval(function(){
                    var ts = (endTime.getTime() - (new Date()).getTime());
                    if(ts <= 0){
                        clearInterval(self.sto);
                        self.reload();
                        return;
                    }
                    var tt = parseInt(ts / 1000 / 60 / 60 / 24 % 1000, 10);//计算剩余的天  
                    var hh = parseInt(ts / 1000 / 60 / 60 % 24 % 1000, 10);//计算剩余的小时数  
                    var mm = parseInt(ts / 1000 / 60 % 60, 10);//计算剩余的分钟数  
                    var ss = parseInt(ts / 1000 % 60, 10);//计算剩余的秒数
                    var bhh = Math.floor(hh/100);
                    if(tt>0){
                        showi.eq(0).html(tt);
                    }else{
                        showi.eq(0).parent('span').hide();
                    }
                    showi.eq(1).html(hh);
                    showi.eq(2).html(mm);
                    showi.eq(3).html(ss);
                },1000);
            }
        }
    });
    
    return limitedFreeModule;
});
define('add_more',["jquery","underscore","dealPrice"],function($,_,dealPrice){
	var element={};
	element.dealParam=function(obj){
		this.totalNum=0;
		this.templContent=$(obj.template).html();
		this.templ= _.template(this.templContent);
		this.startNumber = obj.startNumber||0;
		this.endNumber=obj.endNumber||3;
		this.gapNumber=obj.gapNumber ||0;
		this.distance=obj.distance|| 100;
		this.eventName=obj.eventName ||"scroll";
		this.flag = obj.flag||false;
		this.url=obj.url;
		this.first=true;
		this.midCallback=obj.midCallback||function(){};
		this.container=obj.container;
		this.gapNumber=obj.gapNumber||'';
		this.otherParam=obj.otherParam || ' ';
		this.endDeal = function(){
				$(this.container).append("<div class='go_for_more' style='clear:both'><a href='#'>去看更多帖子(共"+this.totalNum+"条)</a></div>");
		}
		this.endCallback= obj.endCallback || this.endDeal;
        this.dealMethod=obj.dealMethod||{};
	}

	element.init=function(obj){
		this.dealParam(obj);
		this.first=true;
		if (this.eventName == "scroll"){
			this.getData(this.otherParam);
		}else{
			this.getData(this.otherParam);
			this.first=false;
		}
	}

	element.render=function(obj){
		if (this.eventName == "scroll"){
			var winHeight= $("body").outerHeight();
			var scrollTop = $(window).scrollTop();
			var viewHeight= $(window).height();
			if (scrollTop + viewHeight > winHeight-this.distance && !this.flag ){
				this.flag =true;
				this.first=false;
				this.getData(this.otherParam);
			}
		}else{
			if(obj && obj.otherParam){
				this.otherParam=obj.otherParam || this.otherParam;
			}
			this.first=false;
			this.getData(this.otherParam);
		}
	}

	element.getData=function(url_param){
		if(!this.first){
			this.startNumber=this.endNumber+1;
			this.endNumber=this.startNumber+this.gapNumber-1;
			if(this.startNumber>this.totalNum){
				return false;
			}else if(this.startNumber<=this.totalNum && this.endNumber>=this.totalNum){
				this.endNumber=this.totalNum;
			}
		}

		var dataUrl=this.url+'&start='+this.startNumber+'&end='+this.endNumber

		if(this.first && this.eventName=="click"){
			$(this.container).html('<div class="loading"></div>')
		}
		$(".clickMore").hide();

		var self=this;		
		$.get(dataUrl,url_param,function(data){	
			$(".clickMore").show();
			$(self.container).find(".loading").remove();
			if(data.data.total && data.data.total>0){
				self.totalNum =data.data.total;
			}else if(data.data.totalCount && data.data.totalCount>0){
                self.totalNum =data.data.totalCount;
            }else{
				$(self.container).append('<div class="add_more_end">亲，没有更多内容了</div>')
				$(self.container).find(".loading").remove();

				$(".clickMore").hide();
				return false;
			}

			// 处理模板文件传入js方法的问题，将js方法以参数方式传入模板文件中，
			// 解析模板时就可以自动调用js方法对模板数据进行处理
			var data=data.data;
			//var multiData={data:data,dealPrice:dealPrice};
            var multiData=$.extend({},{data:data},self.dealMethod);

			if(self.first){
				$(self.container).find(".loading").remove();
				$(self.container).html(self.templ(multiData));
				$(".clickMore_wrap").show();
			}else{
				$(".clickMore_wrap").show();
				$(self.container).append(self.templ(multiData));
				if(self.endNumber>=self.totalNum){
					$(self.container).find(".loading").remove();
				}
				self.first=false;
			}
			$(self.container).append('<div class="loading" style="clear:both;"></div>')
            self.midCallback();
			if(self.endNumber>=self.totalNum){
				$(".clickMore_wrap").hide();
				if(self.eventName=="scroll" && !self.first){
					$(self.container).find(".loading").remove();
					self.endCallback();
				}else{
					$(self.container).find(".loading").remove();
				}
			}

			self.flag = false;

		})

	}


	var addMore=function(){}
	addMore.prototype=element;

	return addMore;
});
define('qrcode',['jquery'],function(jQuery){
	(function(r){r.fn.qrcode=function(h){var s;function u(a){this.mode=s;this.data=a}function o(a,c){this.typeNumber=a;this.errorCorrectLevel=c;this.modules=null;this.moduleCount=0;this.dataCache=null;this.dataList=[]}function q(a,c){if(void 0==a.length)throw Error(a.length+"/"+c);for(var d=0;d<a.length&&0==a[d];)d++;this.num=Array(a.length-d+c);for(var b=0;b<a.length-d;b++)this.num[b]=a[b+d]}function p(a,c){this.totalCount=a;this.dataCount=c}function t(){this.buffer=[];this.length=0}u.prototype={getLength:function(){return this.data.length},
write:function(a){for(var c=0;c<this.data.length;c++)a.put(this.data.charCodeAt(c),8)}};o.prototype={addData:function(a){this.dataList.push(new u(a));this.dataCache=null},isDark:function(a,c){if(0>a||this.moduleCount<=a||0>c||this.moduleCount<=c)throw Error(a+","+c);return this.modules[a][c]},getModuleCount:function(){return this.moduleCount},make:function(){if(1>this.typeNumber){for(var a=1,a=1;40>a;a++){for(var c=p.getRSBlocks(a,this.errorCorrectLevel),d=new t,b=0,e=0;e<c.length;e++)b+=c[e].dataCount;
for(e=0;e<this.dataList.length;e++)c=this.dataList[e],d.put(c.mode,4),d.put(c.getLength(),j.getLengthInBits(c.mode,a)),c.write(d);if(d.getLengthInBits()<=8*b)break}this.typeNumber=a}this.makeImpl(!1,this.getBestMaskPattern())},makeImpl:function(a,c){this.moduleCount=4*this.typeNumber+17;this.modules=Array(this.moduleCount);for(var d=0;d<this.moduleCount;d++){this.modules[d]=Array(this.moduleCount);for(var b=0;b<this.moduleCount;b++)this.modules[d][b]=null}this.setupPositionProbePattern(0,0);this.setupPositionProbePattern(this.moduleCount-
7,0);this.setupPositionProbePattern(0,this.moduleCount-7);this.setupPositionAdjustPattern();this.setupTimingPattern();this.setupTypeInfo(a,c);7<=this.typeNumber&&this.setupTypeNumber(a);null==this.dataCache&&(this.dataCache=o.createData(this.typeNumber,this.errorCorrectLevel,this.dataList));this.mapData(this.dataCache,c)},setupPositionProbePattern:function(a,c){for(var d=-1;7>=d;d++)if(!(-1>=a+d||this.moduleCount<=a+d))for(var b=-1;7>=b;b++)-1>=c+b||this.moduleCount<=c+b||(this.modules[a+d][c+b]=
0<=d&&6>=d&&(0==b||6==b)||0<=b&&6>=b&&(0==d||6==d)||2<=d&&4>=d&&2<=b&&4>=b?!0:!1)},getBestMaskPattern:function(){for(var a=0,c=0,d=0;8>d;d++){this.makeImpl(!0,d);var b=j.getLostPoint(this);if(0==d||a>b)a=b,c=d}return c},createMovieClip:function(a,c,d){a=a.createEmptyMovieClip(c,d);this.make();for(c=0;c<this.modules.length;c++)for(var d=1*c,b=0;b<this.modules[c].length;b++){var e=1*b;this.modules[c][b]&&(a.beginFill(0,100),a.moveTo(e,d),a.lineTo(e+1,d),a.lineTo(e+1,d+1),a.lineTo(e,d+1),a.endFill())}return a},
setupTimingPattern:function(){for(var a=8;a<this.moduleCount-8;a++)null==this.modules[a][6]&&(this.modules[a][6]=0==a%2);for(a=8;a<this.moduleCount-8;a++)null==this.modules[6][a]&&(this.modules[6][a]=0==a%2)},setupPositionAdjustPattern:function(){for(var a=j.getPatternPosition(this.typeNumber),c=0;c<a.length;c++)for(var d=0;d<a.length;d++){var b=a[c],e=a[d];if(null==this.modules[b][e])for(var f=-2;2>=f;f++)for(var i=-2;2>=i;i++)this.modules[b+f][e+i]=-2==f||2==f||-2==i||2==i||0==f&&0==i?!0:!1}},setupTypeNumber:function(a){for(var c=
j.getBCHTypeNumber(this.typeNumber),d=0;18>d;d++){var b=!a&&1==(c>>d&1);this.modules[Math.floor(d/3)][d%3+this.moduleCount-8-3]=b}for(d=0;18>d;d++)b=!a&&1==(c>>d&1),this.modules[d%3+this.moduleCount-8-3][Math.floor(d/3)]=b},setupTypeInfo:function(a,c){for(var d=j.getBCHTypeInfo(this.errorCorrectLevel<<3|c),b=0;15>b;b++){var e=!a&&1==(d>>b&1);6>b?this.modules[b][8]=e:8>b?this.modules[b+1][8]=e:this.modules[this.moduleCount-15+b][8]=e}for(b=0;15>b;b++)e=!a&&1==(d>>b&1),8>b?this.modules[8][this.moduleCount-
b-1]=e:9>b?this.modules[8][15-b-1+1]=e:this.modules[8][15-b-1]=e;this.modules[this.moduleCount-8][8]=!a},mapData:function(a,c){for(var d=-1,b=this.moduleCount-1,e=7,f=0,i=this.moduleCount-1;0<i;i-=2)for(6==i&&i--;;){for(var g=0;2>g;g++)if(null==this.modules[b][i-g]){var n=!1;f<a.length&&(n=1==(a[f]>>>e&1));j.getMask(c,b,i-g)&&(n=!n);this.modules[b][i-g]=n;e--; -1==e&&(f++,e=7)}b+=d;if(0>b||this.moduleCount<=b){b-=d;d=-d;break}}}};o.PAD0=236;o.PAD1=17;o.createData=function(a,c,d){for(var c=p.getRSBlocks(a,
c),b=new t,e=0;e<d.length;e++){var f=d[e];b.put(f.mode,4);b.put(f.getLength(),j.getLengthInBits(f.mode,a));f.write(b)}for(e=a=0;e<c.length;e++)a+=c[e].dataCount;if(b.getLengthInBits()>8*a)throw Error("code length overflow. ("+b.getLengthInBits()+">"+8*a+")");for(b.getLengthInBits()+4<=8*a&&b.put(0,4);0!=b.getLengthInBits()%8;)b.putBit(!1);for(;!(b.getLengthInBits()>=8*a);){b.put(o.PAD0,8);if(b.getLengthInBits()>=8*a)break;b.put(o.PAD1,8)}return o.createBytes(b,c)};o.createBytes=function(a,c){for(var d=
0,b=0,e=0,f=Array(c.length),i=Array(c.length),g=0;g<c.length;g++){var n=c[g].dataCount,h=c[g].totalCount-n,b=Math.max(b,n),e=Math.max(e,h);f[g]=Array(n);for(var k=0;k<f[g].length;k++)f[g][k]=255&a.buffer[k+d];d+=n;k=j.getErrorCorrectPolynomial(h);n=(new q(f[g],k.getLength()-1)).mod(k);i[g]=Array(k.getLength()-1);for(k=0;k<i[g].length;k++)h=k+n.getLength()-i[g].length,i[g][k]=0<=h?n.get(h):0}for(k=g=0;k<c.length;k++)g+=c[k].totalCount;d=Array(g);for(k=n=0;k<b;k++)for(g=0;g<c.length;g++)k<f[g].length&&
(d[n++]=f[g][k]);for(k=0;k<e;k++)for(g=0;g<c.length;g++)k<i[g].length&&(d[n++]=i[g][k]);return d};s=4;for(var j={PATTERN_POSITION_TABLE:[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,
78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],G15:1335,G18:7973,G15_MASK:21522,getBCHTypeInfo:function(a){for(var c=a<<10;0<=j.getBCHDigit(c)-j.getBCHDigit(j.G15);)c^=j.G15<<j.getBCHDigit(c)-j.getBCHDigit(j.G15);return(a<<10|c)^j.G15_MASK},getBCHTypeNumber:function(a){for(var c=a<<12;0<=j.getBCHDigit(c)-
j.getBCHDigit(j.G18);)c^=j.G18<<j.getBCHDigit(c)-j.getBCHDigit(j.G18);return a<<12|c},getBCHDigit:function(a){for(var c=0;0!=a;)c++,a>>>=1;return c},getPatternPosition:function(a){return j.PATTERN_POSITION_TABLE[a-1]},getMask:function(a,c,d){switch(a){case 0:return 0==(c+d)%2;case 1:return 0==c%2;case 2:return 0==d%3;case 3:return 0==(c+d)%3;case 4:return 0==(Math.floor(c/2)+Math.floor(d/3))%2;case 5:return 0==c*d%2+c*d%3;case 6:return 0==(c*d%2+c*d%3)%2;case 7:return 0==(c*d%3+(c+d)%2)%2;default:throw Error("bad maskPattern:"+
a);}},getErrorCorrectPolynomial:function(a){for(var c=new q([1],0),d=0;d<a;d++)c=c.multiply(new q([1,l.gexp(d)],0));return c},getLengthInBits:function(a,c){if(1<=c&&10>c)switch(a){case 1:return 10;case 2:return 9;case s:return 8;case 8:return 8;default:throw Error("mode:"+a);}else if(27>c)switch(a){case 1:return 12;case 2:return 11;case s:return 16;case 8:return 10;default:throw Error("mode:"+a);}else if(41>c)switch(a){case 1:return 14;case 2:return 13;case s:return 16;case 8:return 12;default:throw Error("mode:"+
a);}else throw Error("type:"+c);},getLostPoint:function(a){for(var c=a.getModuleCount(),d=0,b=0;b<c;b++)for(var e=0;e<c;e++){for(var f=0,i=a.isDark(b,e),g=-1;1>=g;g++)if(!(0>b+g||c<=b+g))for(var h=-1;1>=h;h++)0>e+h||c<=e+h||0==g&&0==h||i==a.isDark(b+g,e+h)&&f++;5<f&&(d+=3+f-5)}for(b=0;b<c-1;b++)for(e=0;e<c-1;e++)if(f=0,a.isDark(b,e)&&f++,a.isDark(b+1,e)&&f++,a.isDark(b,e+1)&&f++,a.isDark(b+1,e+1)&&f++,0==f||4==f)d+=3;for(b=0;b<c;b++)for(e=0;e<c-6;e++)a.isDark(b,e)&&!a.isDark(b,e+1)&&a.isDark(b,e+
2)&&a.isDark(b,e+3)&&a.isDark(b,e+4)&&!a.isDark(b,e+5)&&a.isDark(b,e+6)&&(d+=40);for(e=0;e<c;e++)for(b=0;b<c-6;b++)a.isDark(b,e)&&!a.isDark(b+1,e)&&a.isDark(b+2,e)&&a.isDark(b+3,e)&&a.isDark(b+4,e)&&!a.isDark(b+5,e)&&a.isDark(b+6,e)&&(d+=40);for(e=f=0;e<c;e++)for(b=0;b<c;b++)a.isDark(b,e)&&f++;a=Math.abs(100*f/c/c-50)/5;return d+10*a}},l={glog:function(a){if(1>a)throw Error("glog("+a+")");return l.LOG_TABLE[a]},gexp:function(a){for(;0>a;)a+=255;for(;256<=a;)a-=255;return l.EXP_TABLE[a]},EXP_TABLE:Array(256),
LOG_TABLE:Array(256)},m=0;8>m;m++)l.EXP_TABLE[m]=1<<m;for(m=8;256>m;m++)l.EXP_TABLE[m]=l.EXP_TABLE[m-4]^l.EXP_TABLE[m-5]^l.EXP_TABLE[m-6]^l.EXP_TABLE[m-8];for(m=0;255>m;m++)l.LOG_TABLE[l.EXP_TABLE[m]]=m;q.prototype={get:function(a){return this.num[a]},getLength:function(){return this.num.length},multiply:function(a){for(var c=Array(this.getLength()+a.getLength()-1),d=0;d<this.getLength();d++)for(var b=0;b<a.getLength();b++)c[d+b]^=l.gexp(l.glog(this.get(d))+l.glog(a.get(b)));return new q(c,0)},mod:function(a){if(0>
this.getLength()-a.getLength())return this;for(var c=l.glog(this.get(0))-l.glog(a.get(0)),d=Array(this.getLength()),b=0;b<this.getLength();b++)d[b]=this.get(b);for(b=0;b<a.getLength();b++)d[b]^=l.gexp(l.glog(a.get(b))+c);return(new q(d,0)).mod(a)}};p.RS_BLOCK_TABLE=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],
[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,
116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,
43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,
3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,
55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,
45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]];p.getRSBlocks=function(a,c){var d=p.getRsBlockTable(a,c);if(void 0==d)throw Error("bad rs block @ typeNumber:"+a+"/errorCorrectLevel:"+c);for(var b=d.length/3,e=[],f=0;f<b;f++)for(var h=d[3*f+0],g=d[3*f+1],j=d[3*f+2],l=0;l<h;l++)e.push(new p(g,j));return e};p.getRsBlockTable=function(a,c){switch(c){case 1:return p.RS_BLOCK_TABLE[4*(a-1)+0];case 0:return p.RS_BLOCK_TABLE[4*(a-1)+1];case 3:return p.RS_BLOCK_TABLE[4*
(a-1)+2];case 2:return p.RS_BLOCK_TABLE[4*(a-1)+3]}};t.prototype={get:function(a){return 1==(this.buffer[Math.floor(a/8)]>>>7-a%8&1)},put:function(a,c){for(var d=0;d<c;d++)this.putBit(1==(a>>>c-d-1&1))},getLengthInBits:function(){return this.length},putBit:function(a){var c=Math.floor(this.length/8);this.buffer.length<=c&&this.buffer.push(0);a&&(this.buffer[c]|=128>>>this.length%8);this.length++}};"string"===typeof h&&(h={text:h});h=r.extend({},{render:"canvas",width:256,height:256,typeNumber:-1,
correctLevel:2,background:"#ffffff",foreground:"#000000"},h);return this.each(function(){var a;if("canvas"==h.render){a=new o(h.typeNumber,h.correctLevel);a.addData(h.text);a.make();var c=document.createElement("canvas");c.width=h.width;c.height=h.height;for(var d=c.getContext("2d"),b=h.width/a.getModuleCount(),e=h.height/a.getModuleCount(),f=0;f<a.getModuleCount();f++)for(var i=0;i<a.getModuleCount();i++){d.fillStyle=a.isDark(f,i)?h.foreground:h.background;var g=Math.ceil((i+1)*b)-Math.floor(i*b),
j=Math.ceil((f+1)*b)-Math.floor(f*b);d.fillRect(Math.round(i*b),Math.round(f*e),g,j)}}else{a=new o(h.typeNumber,h.correctLevel);a.addData(h.text);a.make();c=r("<table></table>").css("width",h.width+"px").css("height",h.height+"px").css("border","0px").css("border-collapse","collapse").css("background-color",h.background);d=h.width/a.getModuleCount();b=h.height/a.getModuleCount();for(e=0;e<a.getModuleCount();e++){f=r("<tr></tr>").css("height",b+"px").appendTo(c);for(i=0;i<a.getModuleCount();i++)r("<td></td>").css("width",
d+"px").css("background-color",a.isDark(e,i)?h.foreground:h.background).appendTo(f)}}a=c;jQuery(a).appendTo(this)})}})(jQuery);
return jQuery;
});
define('share_module',['qrcode','underscore'],function($,_){

	var setData = function(options){
        for(key in options){
            setting.module[key] = options[key];
        }
	}


    var serializeParam = function(paramObj) {
        var aParam = [];
        for (var item in paramObj) {
            if (paramObj.hasOwnProperty(item)) {
                aParam.push(item + '=' + encodeURIComponent(paramObj[item] || ''));
            }
        }
        return aParam.join('&');
    }

    var setting = {
	    	module: {
		        title: "PC书城",
		        desc: "",
		        pic: "http://img62.ddimg.cn/digital/product/42/84/1960064284_ii_cover.jpg?version=9b5b3b6a-6357-4c70-bf01-1f4d37709e26",
		        url: document.location.href
		    },
		    openurl: {
		        'sina': 'http://service.weibo.com/share/share.php?',
		        'qzone':'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?',
		        'qq':'http://connect.qq.com/widget/shareqq/index.html?',
		        'qqweibo': 'http://share.v.t.qq.com/index.php?c=share&a=index&'
		    }
	    };

	var eventStop = function(event){
		  event.stopPropagation();
		  event.preventDefault();  
		  return false;
	}

	var initEvent = function(){
		$(setting.module.el).bind('mouseover',function(evt){
			$(this).find('.sharelist').show();
			  eventStop(evt)
		})
		$(setting.module.el).bind('mouseout',function(evt){
			$(this).find('.sharelist').hide();
			$(this).find('.weixinC').hide();
			eventStop(evt)
		})
         $(setting.module.el).delegate('.icon.clicked','click',function(){
            var type = $(this).attr('data-type');
            window.open(setting.openurl[type] + serializeParam(setting.params[type]));
        });
        $(setting.module.el).delegate('.icon.weixin','mouseover',function(){
        	var type = $(this).attr('data-type');
        	if($(this).find('table,canvas').length === 0){
	            var type = !!document.createElement('canvas').getContext ? 'canvas' : 'table';
	            $(this).find('.weixinC').qrcode({
	                render: type, //table方式
	                width: 100, //宽度
	                height:110, //高度
	                correctLevel:0,
	                text: setting.module.url
	            });
	        }
	        $(this).find('.weixinC').show();
        });
        $(setting.module.el).delegate('.icon.weixin','mouseout',function(){
	        $(this).find('.weixinC').hide();
        });
    };

	var init = function(options){
		setData(options);
        setting.params = {
	            'sina': {
	                url: setting.module.url,
	                title:setting.module.title+"（摘要："+setting.module.desc.substr(0,80)+'...）',
	                pic: setting.module.pic,
	                language: 'zh_cn',
	                searchPic: false,
	                appkey: 1315955721,
	                ralateUid: 1647263235
	            },
	            'qzone': {
	                url: setting.module.url,
	                title:setting.module.title ,
	                pics: setting.module.pic,
	                summary:setting.module.desc.substr(0,200)
	            },
	            'qq':{
	                url:setting.module.url,
	                title:setting.module.title ,
	                pics: setting.module.pic,
	                summary:setting.module.desc.substr(0,200)
	            }
        }
        initEvent();
	}
	return {
		render: function(options){
			if(!options.el || $(options.el).find('.shareC').length > 0) return;
			var template = '<div class="shareC">'+
							'<div class="sharelist clearfix hide">'+
								'<i class="weibo icon clicked" data-type="sina"></i>'+
								'<i class="weixin icon" data-type="weixin">'+
									'<div class="weixinC hide"></div>'+
								'</i>'+
								'<i class="qq icon clicked" data-type="qzone"></i>'+
							'</div>'+
						'</div>';
			$(options.el).append(template);
			init(options);
			$(options.el).mouseover();
		}
	}
});
define('channelInfo',["jquery","underscore","ddbase","loginModule",'share_module'], function ($,_,ddbase,loginModule,share) {
    var channelInfo={
        getData:function(type,url,data,suc,err){
            $.ajax({
                type:type,
                url:url,
                data:data,
                timeout:5000,
                success:function(response){
                    suc.call(this,response);
                },
                error:function(){
                    err.call(this);
                }
            });
        },
        getUrl:{
            channelUrl:"/media/api2.go?action=channel&cId="+ddbase.getQueryString("cId")+ddbase.baseApiParams
        },
        mark:{
            hasBookList:true,
            hasArticalList:true,
            cId:ddbase.getQueryString("cId"),
            custId:ddbase.getCookie("MDD_custId"),
            isBookList:null,
            getDate:false
        },
        channelBook:null,
        introWrapEle:null,
        setIntroCell:function(data){
            var codeStatus=data.status.code;
            if(codeStatus===0){
                var dataObj=data.data;
                channelInfo.mark.hasBookList=!!dataObj.channel.bookList;
                if(channelInfo.mark.hasBookList){
                    channelInfo.mark.isBookList=dataObj.channel.bookList.booklistId;
                    channelInfo.channelBook=dataObj.channel.bookList;
                }
                channelInfo.mark.hasArticalList=!!dataObj.channel.hasArtical;
                channelInfo.mark.getDate=true;

                var channelInfoObj={};
                channelInfoObj.dataObj=dataObj;
                channelInfoObj.getQueryString=ddbase.getQueryString;
                var introCell=channelInfo.introWrapEle;
                var channeldetailIntroTemplate=_.template($("#channeldetail_intro_module").html());
                introCell.append(channeldetailIntroTemplate(channelInfoObj));
            }else{
                //数据接口出错提示
            }
        },
        getErr:function(){
            //请求出错提示
        },
        subScribe:function(ele,cid,custid,nosub,alreadysub,cancelsub){
            var _self=this;
            if(!ddbase.token()){
                loginModule();
            }else{
                var subScribeTxt=ele.text();
                var subScribeUrl="/media/api2.go?action=channelSub";
                function subScribeSuc(){
                    ele.find(".dingbtn").text("已订阅");
                    ele.removeClass().addClass("ding alreadysub")
                }
                function cancelSubScribeSuc(){
                    ele.find(".dingbtn").text("订阅");
                    ele.removeClass().addClass("ding nosub")
                }
                function subScribeErr(){

                }
                function cancelSubScribeErr(){

                }
                switch (subScribeTxt){
                    case "订阅":
                        subScribeUrl+="&op=1"+"&cId="+cid+"&custId="+custid+ddbase.baseApiParams;
                        _self.getData("POST",subScribeUrl,"",subScribeSuc,subScribeErr);
                        break;
                    case "已订阅":
                        ele.find(".dingbtn").text("取消订阅");
                        ele.removeClass().addClass("ding cancelsub")
                        break;
                    case "取消订阅":
                        subScribeUrl+="&op=0"+"&cId="+cid+"&custId="+custid+ddbase.baseApiParams;
                        _self.getData("POST",subScribeUrl,"",cancelSubScribeSuc,cancelSubScribeErr);
                        break;
                }
                
            }
        },
        startGetData:function(ele){
            var _self=this;
            _self.introWrapEle=ele;
            _self.getData("GET",_self.getUrl.channelUrl,"",_self.setIntroCell,_self.getErr);
            $("body").on("click",".ding",function(){
                _self.subScribe($(this),$(this).attr("cid"),$(this).attr("custid"),"nosub","alreadysub","cancelsub")
            });
            $('body').on("click",".share",function(){
                share.render({
                    el:'.share'
                })
            })
        }
    }
    return channelInfo;
});
require(["jquery","lazyload","publicTabModule","indexClassModule","publicMethod","indexFocusone","indexLimitedTemplate","limitedFreeModule","add_more","channelInfo","ddbase"],function($,lazyload,publicTabModule,indexClassModule,publicMethod,indexFocusone,indexLimitedTemplate,limitedFreeModule,addMore,channelInfo,ddbase){

    $(function(){
         //lazyload
         $(".index_content_right img").lazyload({
             effect  : "fadeIn" //加载图片使用的效果(淡入)
        });
         $(".index_content img").lazyload({
             effect  : "fadeIn" //加载图片使用的效果(淡入)
        });

        $(window).scroll();
    })
   

	publicTabModule.tabChange($('.index_righttab_module .header li'),$('.index_righttab_module .content'),'click','active');
	publicTabModule.slideTab($('.index_subnav_module'),'only_one','click',$('.index_story .content'));
	publicTabModule.lunboTab($('.index_e_goods .content'),$('.index_ebookarrow_module .left'),$('.index_ebookarrow_module .right'));
    publicMethod.init();
	indexClassModule.classifyLayer('.index_class_module','.index_class_module dd','.class_hover_layer','hover');
    indexFocusone.unslider({
        dots: true
    },$('.index_focusone_module'));

    $('.index_focusone_module .dots').css('margin-left',-$('.index_focusone_module .dots').width()/2)

    //限时免费
	var limitedfree = new limitedFreeModule.view({template:indexLimitedTemplate,el:"#limitedFree" ,dataUrl:'/media/api.go?action=freeforlimited&columnType=rec_limited_free&channelType=all&start=0&end=7'});

    var addMore1=new addMore();
    addMore1.init({
        template:"#indexPindaoseeModule",
        container:".index_pindao_inner",
        startNumber:0,
        endNumber:21,
        gapNumber:22,
        eventName:'scroll',
        distance:'400',
        url:"/media/api2.go?action=column&columnType=all_aa&isFull=1&isChannel&returnType=json"+ddbase.baseApiParams,
        endCallback:function(){
            $(".index_pindao_inner").append("<div class='go_for_more'><a href='javascript:;'>加载完毕！</a></div>");
        }
    });
    $(window).bind("scroll",function(){ addMore1.render();})
    $("body").on("click",".ding",function(){
        channelInfo.subScribe($(this),$(this).attr("cid"),$(this).attr("custid"),"nosub","alreadysub","cancelsub")
    });

});
define("index", function(){});

