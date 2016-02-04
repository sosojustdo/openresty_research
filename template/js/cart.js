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
define('listShoppingCart',["jquery",'ddbase',"underscore"],function ($,ddbase,underscore) {
	//获取电子书购物车列表
	var listShoppingCart = {};
	var ebookcartId = ddbase.getCookie('MDD_ebookcartId') || '';

	listShoppingCart.url = '/media/api2.go?action=listShoppingCart&cartId='+ebookcartId+ddbase.setBaseApiParams();

	listShoppingCart.init = function(option){
    	var self = this;
    	self.el = option.el;
    	self.template = option.template;
    	$.ajax({
	        method:'POST',
	        url:listShoppingCart.url,
	        success:function(response){
		    	if(parseInt(response.status.code) == 0){
		    		ddbase.setCookie('MDD_ebookcartId',response.data.cartId,8760);
		    		$(self.el).html(_.template(self.template)({data:response.data.products}));
		    	}
	        }
        })
    }
	 
	return listShoppingCart;
});
define('deleteShoppingCart',["jquery",'ddbase','underscore'],function ($,ddbase,_) {
	var deleteShoppingCart = function(obj){
		var ebookcartId = ddbase.getCookie('MDD_ebookcartId');

		if(ebookcartId == null) return;

		//删除电子书购物车商品
		$.ajax({
	        method:'POST',
	        url:'/media/api2.go?action=deleteShoppingCart&cartId='+ebookcartId+'&orderSource='+obj.orderSource+'&productIds='+obj.productIds+ddbase.setBaseApiParams(),
	        success:function(response){
		    	if(parseInt(response.status.code) == 0){
		    		var MDD_ebookMediaIds = ddbase.getCookie('MDD_ebookMediaIds');
		    		if(MDD_ebookMediaIds != null){
		    			MDD_ebookMediaIds = MDD_ebookMediaIds.split(',')
		    			MDD_ebookMediaIds = _.without(MDD_ebookMediaIds,obj.productIds);
		    			ddbase.setCookie('MDD_ebookMediaIds',MDD_ebookMediaIds.join(','),8760);//记录商品id
	    			}

	    			var productArray = ddbase.getCookie('MDD_productArray');
	    			if(productArray != null){
	    				productArray = JSON.parse(unescape(productArray));
	    				productArray = _.filter(productArray, function(product){ 
	    					product = JSON.parse(product);
		    				return product.productId != obj.productIds; 
		    			});
		    			ddbase.setCookie('MDD_productArray',JSON.stringify(productArray),8760);//记录商品详细信息
	    			}
	    			
	    			alert('删除成功！');
		    		if(obj.callback != undefined){
		    			obj.callback();
		    		}
		    	}
	        }
        }) 
	}
	return deleteShoppingCart;
});
define('appendCartV2',["jquery",'ddbase'],function ($,ddbase) {
	var appendCartV2 = function(obj){

		var cId = obj.cId; //频道id
		var productId = obj.productId;
		var saleId = obj.saleId;
		if(ddbase.token() == "") return;


		//添加电子书购物车
		$.ajax({
	        method:'POST',
	        url:'/media/api2.go?action=appendCartV2&productIds='+productId+'&cId='+cId+ ddbase.setBaseApiParams().replace('fromPlatform=106','fromPlatform=307'),
	        success:function(response){
		    	if(parseInt(response.status.code) == 0){
		    		var productArray = ddbase.getCookie('MDD_productArray');
		    		var product = '{"productId":"'+productId+'","saleId":"'+saleId+'","cId":"'+cId+'"}';
		    		if(productArray == null){
		    			productArray = new Array();
		    		}else{
		    			productArray = JSON.parse(unescape(productArray));
		    		}
		    		var productIndex = _.find(productArray, function(product){ 
						product = JSON.parse(product);
						return  product.productId == productId;
					});
					if(productIndex == undefined){
		    			productArray.push(product);
		    		}
		    		ddbase.setCookie('MDD_productArray',JSON.stringify(productArray),8760); //记录添加到购物车里的单品相关详细信息
		    		if(obj.callback != undefined){
		    			obj.callback();
		    		}
		    		alert('成功加入购物车！');
		    	}else{
		    		alert(response.status.message);
		    	}
	        }
        }) 
	}
	return appendCartV2;
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
define('bookSixColModule',["jquery","underscore","backbone",'ddbase','appendCartV2',"publicMethod","dealPrice"],function ($,_,Backbone,ddbase,appendCartV2,publicMethod,dealPrice) {
	//一行六列模块
	var bookSixColModule = {};

	bookSixColModule.template = '<div class="book_six_col_module">'+
		'<h4 class="module_title"><%=title%>：<span class="more">换一换</span></h4>'+
		'<ul class="clearfix">'+
		'<%for(var i=0,ii=data.length;i<ii;i++){%>'+
			'<%var product = data[i];%>'+
		    '<%var mediaId = product.mediaId;%>'+
		    '<%var saleId = product.saleId;%>'+
		    '<%var mediaType = product.mediaType;%>'+
		    '<%var title = product.title;%>'+
			'<li>'+
				'<a href="<%=getBookUrl({productId:mediaId,saleId:saleId,mediaId:mediaId,mediaType:mediaType})%>">'+
					'<span class="img_area"><img src="<%=product.coverPic%>" alt="<%=title%>" onerror="this.src=\'img/book_def_74_105.png\'"></span>'+
					'<span class="name"><%=title.length>8?(title.substring(0,15)+"..."):title%></span>'+
					'<span class="author"><%=product.authorPenname%><i class="price"><%=dealPrice(product)%></i></span>'+
				'</a>'+
				'<%if(parseInt(mediaType) == 2){%>'+
	            '<span class="add_cart_btn" data-mediaId="<%=mediaId%>" data-saleId="<%=saleId%>" data-mediaType="<%=mediaType%>">加入购物车</span>'+
	            '<%}%>'+
			'</li>'+
			'<%}%>'+
		'</ul>'+
	'</div>';
	bookSixColModule.view = Backbone.View.extend({
		events:{
			'click .more':'showMore',
			'mouseover .book_six_col_module li':'showAddCartBtn',
			'mouseout .book_six_col_module li':'hideAddCartBtn',
			'click .add_cart_btn':'appendCart'
		},
    	initialize:function(options){
			var self = this;
			this.start = 30;
			this.step = 6;
			this.end = 60;
			this.el = options.el;
			self.title = options.title;
			this.url = '/media/api2.go?action=getGuessulike&returnFields=coverPic,authorPenname,title&needPrice=1'+ddbase.setBaseApiParams();
			this.render();
		},
		render:function(){
			var self = this;
			$.ajax({
		        method:'POST',
		        url:self.url+'&start='+this.start+'&end='+(this.start+this.step-1),
		        success:function(response){
			    	if(parseInt(response.status.code) == 0){
			    		$(self.el).html(_.template(bookSixColModule.template)({data:response.data.mediaList,title:self.title,dealPrice:dealPrice.dealPrice2,getBookUrl:ddbase.getBookUrl}));
			    		self.start +=  self.step;
			    		if(self.start >= self.end){
			    			self.start = 30;
			    		}
			    	}
		        }
	        })
		},
		showMore:function(){
			this.render();
		},
		showAddCartBtn:function(event){
			var domEl = $(event.currentTarget);
			if(domEl.find('.add_cart_btn').length > 0){
				domEl.find('.add_cart_btn').css({'display':'block'});
		    	domEl.find('.name').hide();
		    	domEl.find('.author').hide();
			}
		},
		hideAddCartBtn:function(event){
			var domEl = $(event.currentTarget);
			if(domEl.find('.add_cart_btn').length > 0){
				domEl.find('.add_cart_btn').css({'display':'none'});
		    	domEl.find('.name').show();
		    	domEl.find('.author').show();
			}
		},
		appendCart:function(event){
			var self = this;
			var domEl = $(event.currentTarget);
			appendCartV2({productId:domEl.attr('data-mediaid'),saleId:domEl.attr('data-saleid'),cId:''});
		}
	})
	return bookSixColModule;
});
define('getProductTotalCount',["jquery",'ddbase'],function ($,ddbase) {
	var getProductTotalCount = function(callback){
		var ebookcartId = ddbase.getCookie('MDD_ebookcartId');

		if(ebookcartId == null) return;

		//获取购物车中商品数量（包括纸书、电子书）
		$.ajax({
	        method:'POST',
	        url:'/media/api2.go?action=getCartAllProductCnt&cartId='+ebookcartId+ddbase.setBaseApiParams(),
	        success:function(response){
		    	if(parseInt(response.status.code) == 0){
		    		if(callback != undefined){
		    			ddbase.setCookie('MDD_ebookMediaIds',response.data.mediaIds,8760);
		    			callback(response.data.allBooksCount);
		    		}
		    	}
	        }
        }) 
	}
	return getProductTotalCount;
});
require(["jquery","ddbase","publicMethod","listShoppingCart","deleteShoppingCart","bookSixColModule","getProductTotalCount","loginModule"],function($,ddbase,publicMethod,listShoppingCart,deleteShoppingCart,bookSixColModule,getProductTotalCount,loginModule){
    //通用方法
    publicMethod.init();
    //购物车列表初始化
   listShoppingCart.init({el:$('.cart_container'),template:$('#cartList_template').html()});

    $('.cart_container').click(function(event){
        var domEl = $(event.target);
        if(domEl.hasClass('checkbox')){
            //选择单品
            if(domEl.hasClass('selected')){
                domEl.removeClass('selected');
                if(domEl.hasClass('selectAll')){
                    $('.cart_list .checkbox').removeClass('selected');
                }
                $('.cart_list .productsNum').html('('+$('.cart_list .checkbox.selected[data-role]').length+')');
            }else{
                domEl.addClass('selected');
                if(domEl.hasClass('selectAll')){
                    $('.cart_list .checkbox').addClass('selected');
                }
                $('.cart_list .productsNum').html('('+$('.cart_list .checkbox.selected[data-role]').length+')');
            }
        }
        if(domEl.hasClass('del_btn')){
            var productId = domEl.attr('data-role');
            //删除单独某一行
            var row = domEl.parent().parent();
            row.remove();
            deleteShoppingCartCallback(productId);

        }
        if(domEl.hasClass('del_all_btn')){
            var productIds = new Array();
            //删除所有商品
            $('.cart_list .checkbox.selected').each(function(){
                productIds.push($(this).attr('data-role'));
            })
            if(productIds.length <= 0){
                alert('请选择书！');
                return;
            }
            deleteShoppingCartCallback(productIds.join(','));
        }
        if(domEl.hasClass('settlement_btn')){
            //选择支付
            var sessionId = ddbase.token();
            if(sessionId == ''){
                loginModule();
            }
            var productIds = new Array;
            $('.cart_list .checkbox.selected').each(function(){
                var productId = $(this).attr('data-role');
                if(productId != undefined){
                    productIds.push(productId);
                }
            })
            if(productIds.length <= 0){
                alert('请选择待支付的书！');
                return;
            }else{
                window.location.href='pay_methord_page.html?productIds='+productIds.join(',');
            }
        }

    })
    //删除商品回调
    function deleteShoppingCartCallback(productIds){
        deleteShoppingCart({orderSource:'77000',productIds:productIds});
        listShoppingCart.init({el:$('.cart_container'),template:$('#cartList_template').html()});
        //获取购物车中商品数量（包括纸书、电子书）
        getProductTotalCount(publicMethod.setProductTotalCount);
    }

    //猜你喜欢
    var guessulike = new bookSixColModule.view({el:$('.guessulike'),title:'大家都在看'});
    
});
define("cart", function(){});

