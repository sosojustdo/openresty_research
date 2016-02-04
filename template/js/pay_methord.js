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
define('getEbookOrderFlowV3',["jquery",'ddbase',"underscore"],function ($,ddbase,underscore) {
	//获取电子书购物车列表
	var getEbookOrderFlowV3 = {};

	getEbookOrderFlowV3.url = '/media/api2.go?action=getEbookOrderFlowV3'+ddbase.setBaseApiParams();

	getEbookOrderFlowV3.init = function(option){
    	var self = this;
    	if(option.productIds){
    		getEbookOrderFlowV3.url = getEbookOrderFlowV3.url +'&productIds='+option.productIds;
    	}
    	$.ajax({
	        method:'POST',
	        url:getEbookOrderFlowV3.url,
	        success:function(response){
		    	if(parseInt(response.status.code) == 0){
		    		//ddbase.setCookie('MDD_ebookcartId',response.data.cartId,8760);
		    		if(option.el && option.template){
		    			$(option.el).html(_.template(option.template)({data:response.data.paymentProductList}));
		    		}
		    		if(option.callback){
		    			var productIds = [];
		    			if(response.data.paymentProductList.length > 0){
		    				_.each(response.data.paymentProductList,function(product){
			    				productIds.push(product.productId);
			    			})
		    			}else{
		    				if(option.productIds){
		    					productIds.push(option.productIds);
		    				}
		    			}
		    			option.callback(response.data.rechargeAmount,productIds.join(','));
		    		}
		    	}else{
		    		if(option.el){
		    			$(option.el).html(_.template(option.template)({data:''}));
		    		}
		    	}
	        }
        })
    }
	 
	return getEbookOrderFlowV3;
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
define('payMethordModuleTemplate',["jquery","underscore","backbone"],function ($,_,Backbone) {
    var payMethordModuleTemplate = '<div class="pay_methord_module">'+
    '<h4 class="module_title">请选择支付方式</h4>'+
    '<div class="payment_list">'+
    '<%var account = data.getAccount.data.account;%>'+
    '<%var accountMoney = parseInt(account.attachAccountMoney)+parseInt(account.masterAccountMoney);%>'+
    '<%var payable = parseFloat(data.getEbookOrderFlowV2.data.payable);%>'+
        '<ul>'+
            '<li>'+
                '<div class="sum_line">'+
                    '<span class="left"><input type="radio" name="payment" checked="checked" data-role="account"><i class="icon bell_icon"></i><label for="payment">铃铛</label></span><span class="right">余额：<%=accountMoney%>铃铛</span>'+
                '</div>'+
            '</li>'+
            '<%var ddMoney = data.getDdMoneyList.data;%>'+
            '<%if(ddMoney.moneyList && ddMoney.moneyList.length > 0){%>'+
            '<li>'+
                '<div class="sum_line">'+
                    '<span class="left"><input type="radio" name="payment" data-role="ddMoney"><i class="icon card_icon"></i><label for="payment">礼品卡</label></span><span class="right">余额：￥<%=parseFloat(ddMoney.remainingSumRMB).toFixed(2)%></span>'+
                '</div>'+
            '</li>'+
            '<%}%>'+
            '<%var validCoupon = data.getValidCoupon.data.result;%>'+
            '<%if(validCoupon && validCoupon.length > 0){%>'+
            '<%var couponMoney = 0;%>'+
            '<%for(var i = 0,ii = validCoupon.length;i<ii;i++){%>'+
            '<%var coupon = validCoupon[i];%>'+
            '<%if(parseFloat(coupon.couponMoney)*100 >= payable){%>'+
            '<%couponMoney += parseFloat(coupon.couponMoney);%>'+
            '<%}%>'+
            '<%}%>'+
            '<%}%>'+
            '<%if(couponMoney > 0){%>'+
            '<li>'+
                '<div class="sum_line">'+
                    '<span class="left"><input type="radio" name="payment" data-role="couponMoney"><i class="icon liquan_icon"></i><label for="payment">礼券</label></span><span class="right"><span class="money">余额：￥<%=parseFloat(couponMoney).toFixed(2)%></span><span class="time"><%=data.getValidCoupon.data.currentDate.split(" ")[0]%><i class="down"></i></span></span>'+
                '</div>'+
                '<div class="detail_list">'+
                '<%for(var i = 0,ii = validCoupon.length;i<ii;i++){%>'+
                '<%var coupon = validCoupon[i];%>'+
                '<%if(parseFloat(coupon.couponMoney)*100 >= payable){%>'+
                    '<p><span class="left"><input type="radio" name="validCoupon" data-role="<%=coupon.couponCode%>"><label for="payment"><%=coupon.endDate.split(" ")[0]%></label></span><span class="right">￥<%=coupon.couponMoney%></span></p>'+
                '<%}%>'+
                '<%}%>'+
                '</div>'+
            '</li>'+
            '<%}%>'+
        '</ul>'+
    '</div>'+
    '<div class="button_line">'+
    '<%if(accountMoney < payable){%>'+
        '<span class="buy_btn rechargeBtn">充值并购买</span>'+
    '<%}else{%>'+
        '<span class="buy_btn">购买</span>'+
    '<%}%>'+
    '</div>'+
'</div>';
    
   return payMethordModuleTemplate;
});
define('bindPermission',["jquery","underscore","ddbase"],function ($,_,ddbase) {
	//绑定权限
	var bindPermission = function(option){
		var currentTime = new Date();

		//支付
		$.ajax({
	        method:'POST',
	        url:'/media/api2.go?action=bindPermissionV2&sign=html5&productIds='+option.productIds+'&orderNo='+option.orderNo+'&timestamp='+currentTime.getTime()+'&referType=bookCity&cartId='+ddbase.setBaseApiParams().replace('fromPlatform=106','fromPlatform='+option.fromPlatform),
	        success:function(response){
	        	var status = parseInt(response.status.code);
		    	if(status == 0){
		    		//绑定权限成功
		    		window.location.href = 'cart_result_page.html?payValue='+option.payValue;
		    	}
		    	else{
		    		if(option.callback){
		    			option.callback();
		    		}
		    		//绑定权限失败
				    alert('绑定权限失败！');
	        	}
	        }
        })
	}
	return bindPermission;
});
define('purchaseEbookVirtualPaymentForPC',["jquery","underscore","ddbase","bindPermission"],function ($,_,ddbase,bindPermission) {

	//虚拟币购买:铃铛
	var purchaseEbookVirtualPaymentForPC = function(option){
		var currentTime = new Date();
		var products = option.products;
		var cId = option.cId;
		var productString = new Array();
		var productArray = ddbase.getCookie('MDD_productArray');
		if(products == null || products == '') return;
		productIds = products.split(',');

		//处理product详细信息start
		if(productArray != null){
			productArray = JSON.parse(unescape(productArray));
		}
		_.each(productIds,function(productId){
			if(productArray != null){
				var productDetail = _.find(productArray, function(product){ 
					product = JSON.parse(product);
					return  product.productId == productId;
				});
				if(productDetail != undefined){
					productString.push(productDetail);
				}else{
					var temp = '{"productId":"'+productId+'","saleId":"'+productId+'","cId":"'+cId+'"}';
					productString.push(temp);
				}
			}else{
				var temp = '{"productId":"'+productId+'","saleId":"'+productId+'","cId":"'+cId+'"}';
				productString.push(temp);
			}
		})
		//处理product详细信息end
		productString = JSON.stringify(productString);
		productString = productString.replace(/\"\{/ig,"{").replace(/\}\"/ig,"}").replace(/\\/ig,"");

		//支付
		$.ajax({
	        method:'POST',
	        url:'/media/api2.go?action=purchaseEbookVirtualPaymentForPC&productArray='+productString+'&dayNum='+option.dayNum+'&isAppendBorrow='+option.isAppendBorrow+'&timestamp='+currentTime.getTime()+'&sign=html5&referType=buy&orderSource='+option.orderSource+ddbase.setBaseApiParams().replace('fromPlatform=106','fromPlatform='+option.fromPlatform),
	        success:function(response){
	        	var status = parseInt(response.status.code);
		    	if(status == 0){
		    		_.each(productIds,function(productId){
						if(productArray != null){
							productArray = _.filter(productArray, function(product){ 
								return  product.productId != productId;
							});
						}
					})
					ddbase.setCookie('MDD_productArray',JSON.stringify(productArray),8760);
		    		//支付成功
		    		//window.location.href = 'cart_result_page.html';
		    		var payValue = 0;
		    		_.each(response.data.mobileMediaVoList,function(item){
		    			payValue += parseFloat(item.price);
		    		})
		    		bindPermission({productIds:productIds,orderNo:response.data.orderNo,callback:option.callback,payValue:payValue});
		    	}
		    	else{
		    		if(status == 27100){
			    		//虚拟币余额不足，请充值购买 
			    		window.location.href = 'recharge_methord_page.html';
		    		}else{
		    			if(option.callback){
			    			option.callback();
			    		}
		    			if(status == 27122){
				    		//该电子书已不支持借阅
				    		alert('该电子书已不支持借阅');
				    	}else{
				    		//消费失败
				    		alert('消费失败！');
				    	}
		    		}
	        	}
	        }
        })
	}

	return purchaseEbookVirtualPaymentForPC;
});
define('savePayment',["jquery","underscore","ddbase","bindPermission"],function ($,_,ddbase,bindPermission) {
	//使用礼品卡支付成功之后的回调
	var savePayment = function(option){
		var cartId = option.cartId; //楼上购物车id
		var orderSource = option.orderSource;
		var isPaperBook = option.isPaperBook;
		var fromPlatform = option.fromPlatform;
		var isChargeOrder = option.isChargeOrder; //是否是充值订单,0:普通消费订单，1:充值订单
		var productArray = ddbase.getCookie('MDD_productArray');
		var productIds = option.productIds;
		if(productArray != null){
			productArray = JSON.parse(unescape(productArray));
		}

		//支付
		$.ajax({
	        method:'POST',
	        url:'/media/api2.go?action=multiAction&field={"dependActions":[{"action":"savePayment","params":{"cartId":"'+cartId+'","fromPlatform":"'+fromPlatform+'","isPaperBook":"'+isPaperBook+'","orderSource":"'+orderSource+'"}},{"action":"submitOrder","params":{"cartId":"'+cartId+'","fromPlatform":"'+fromPlatform+'","isChargeOrder":"'+isChargeOrder+'","isPaperBook":"'+isPaperBook+'","orderSource":"'+orderSource+'"}}]}'+ddbase.setBaseApiParams().replace('fromPlatform=106','fromPlatform='+fromPlatform),
	        success:function(response){
		    	if(response.data.errors){
		    		if(option.callback){
		    			option.callback();
		    		}
		    		//消费失败
				    alert('消费失败！');
		    	}
		    	else{
		    		_.each(productIds,function(productId){
						if(productArray != null){
							productArray = _.filter(productArray, function(product){ 
								product = JSON.parse(product);
								return  product.productId != productId;
							});
						}
					})

					ddbase.setCookie('MDD_productArray',JSON.stringify(productArray),8760);
					var payResult = response.data.result.submitOrder.data.result;
					bindPermission({productIds:productIds,orderNo:payResult.order_id,payValue:parseFloat(payResult.total)*100,callback:option.callback});
		    		//支付成功
		    		//window.location.href = 'cart_result_page.html';
	        	}
	        }
        })
	}
	return savePayment;
});
define('useCoupon',["jquery","underscore","ddbase","savePayment"],function ($,_,ddbase,savePayment) {
	//使用礼品卡支付
	var useCoupon = function(option){
		var fromPlatform = option.fromPlatform; //订单来源平台
		var oneKeyBuy = option.oneKeyBuy; //是否一键购买
		var orderSource = option.orderSource; //订单来源
		var permanentId = ddbase.getCookie('__permanent_id') || '';
		var productIds = option.products;
		var isPaperBook = option.isPaperBook;

		//支付
		$.ajax({
	        method:'POST',
	        url:'/media/api2.go?action=multiAction&field={"dependActions":[{"action":"appendCart","params":{"fromPlatform":"'+fromPlatform+'","oneKeyBuy":"'+oneKeyBuy+'","orderSource":"'+orderSource+'","permanentId":"'+permanentId+'","productIds":"'+productIds+'","referType":"bookCity"},"parseParams":{"cartId":"cartId"}},{"action":"getOrderFlow","params":{"fromPlatform":"'+fromPlatform+'","isPagerBook":"'+option.isPagerBook+'","orderSource":"'+orderSource+'","permanentId":"'+permanentId+'","productIds":"'+productIds+'"}},{"action":"useCoupon","params":{"barginTotal":"'+option.amount+'","fromPlatform":"'+fromPlatform+'","oneKeyBuy":"'+oneKeyBuy+'","orderSource":"'+orderSource+'","order_sequence_id":"'+option.order_sequence_id+'","couponCode":"'+option.couponCode+'"}},{"action":"getOrderFlow","params":{"fromPlatform":"'+fromPlatform+'","isPagerBook":"'+isPaperBook+'","orderSource":"'+orderSource+'","permanentId":"'+permanentId+'","productIds":"'+productIds+'"}}]}'+ddbase.setBaseApiParams().replace('fromPlatform=106','fromPlatform='+option.fromPlatform),
	        success:function(response){
		    	if(response.data.errors){
		    		if(option.callback){
		    			option.callback();
		    		}
		    		//消费失败
				    alert('消费失败！');
		    	}
		    	else{
		    		savePayment({cartId:response.data.result.getOrderFlow.data.result.cart_id,orderSource:orderSource,isPaperBook:isPaperBook,fromPlatform:fromPlatform,isChargeOrder:0,productIds:productIds,callback:option.callback});
	        	}
	        }
        })
	}
	return useCoupon;
});
define('useDdMoney',["jquery","underscore","ddbase","savePayment"],function ($,_,ddbase,savePayment) {
	//使用礼品卡支付
	var useDdMoney = function(option){
		var fromPlatform = option.fromPlatform; //订单来源平台
		var oneKeyBuy = option.oneKeyBuy; //是否一键购买
		var orderSource = option.orderSource; //订单来源
		var permanentId = ddbase.getCookie('__permanent_id') || '';
		var productIds = option.products;
		var isPaperBook = option.isPaperBook;
		//支付
		$.ajax({
	        method:'POST',
	        url:'/media/api2.go?action=multiAction&field={"dependActions":[{"action":"appendCart","params":{"fromPlatform":"'+fromPlatform+'","oneKeyBuy":"'+oneKeyBuy+'","orderSource":"'+orderSource+'","permanentId":"'+permanentId+'","productIds":"'+productIds+'","referType":"bookCity"},"parseParams":{"cartId":"cartId"}},{"action":"getOrderFlow","params":{"fromPlatform":"'+fromPlatform+'","isPagerBook":"'+option.isPagerBook+'","orderSource":"'+orderSource+'","permanentId":"'+permanentId+'","productIds":"'+productIds+'"}},{"action":"useDdMoney","params":{"amount":"'+option.amount+'","fromPlatform":"'+fromPlatform+'","oneKeyBuy":"'+oneKeyBuy+'","orderSource":"'+orderSource+'","order_sequence_id":"'+option.order_sequence_id+'"}},{"action":"getOrderFlow","params":{"fromPlatform":"'+fromPlatform+'","isPagerBook":"'+isPaperBook+'","orderSource":"'+orderSource+'","permanentId":"'+permanentId+'","productIds":"'+productIds+'"}}]}'+ddbase.setBaseApiParams().replace('fromPlatform=106','fromPlatform='+option.fromPlatform),
	        success:function(response){
		    	if(response.data.errors){
		    		if(option.callback){
		    			option.callback();
		    		}
		    		//消费失败
				    alert('消费失败！');
		    	}
		    	else{
		    		savePayment({cartId:response.data.result.getOrderFlow.data.result.cart_id,orderSource:orderSource,isPaperBook:isPaperBook,fromPlatform:fromPlatform,isChargeOrder:0,productIds:productIds,callback:option.callback});
	        	}
	        }
        })
	}
	return useDdMoney;
});
define('buyMedia',["jquery","ddbase"],function ($,ddbase) {

	//原创整本购买
	var buyMedia = function(option){
		var saleId = option.saleId;
		var mediaId = option.mediaId;
		var cId = option.cId;

		//支付
		$.ajax({
	        method:'POST',
	        url:'/media/api2.go?action=buyMedia&consumeType=1&platform=3&saleId='+saleId+'&deviceVersion=html5&mediaId='+mediaId+'&fromPaltform=ds_pc&cId='+cId+ddbase.setBaseApiParams().replace('fromPlatform=106','fromPlatform='+option.fromPlatform),
	        success:function(response){
	        	var status = parseInt(response.status.code);
		    	if(status == 0){
		    		if(option.callback){
		    			option.callback();
		    		}
		    		ddbase.setMessageTip('购买成功，请去我的书架查看！');
		    	}
		    	else{
		    		if(option.callback){
		    			option.callback();
		    		}
		    		ddbase.setMessageTip('购买失败，请稍后重试！');
	        	}
	        }
        })
	}

	return buyMedia;
});
define('payMethordModule',["jquery","underscore","backbone","ddbase","payMethordModuleTemplate","purchaseEbookVirtualPaymentForPC","useCoupon","useDdMoney","buyMedia"],function ($,_,Backbone,ddbase,payMethordModuleTemplate,purchaseEbookVirtualPaymentForPC,useCoupon,useDdMoney,buyMedia) {

	var payMethordModule = payMethordModule || {};

	payMethordModule.view = Backbone.View.extend({
		events:{
			"click .sum_line .time":"showMore",
			"click .buy_btn":"purchaseBook",
			"click input":'selectPayMethord',
			"click .cancle_btn":"hidePopModule"
		},
		initialize:function(options){
			var self = this;
			self.productIds = options.productIds;
			self.el = options.el;
			self.template = options.template;
			self.price = '';
			self.mediaType = options.mediaType;
			if(options.price){
				self.price = options.price; //原创价格
			}
			if(options.callback){
				self.callback = options.callback;
			}
			if(options.devicetypecodes){
				self.devicetypecodes = options.devicetypecodes;
			}else{
				self.devicetypecodes = null;
			}
			if(options.mediaType && options.mediaType == 1){
				//原创购买
				self.url = '/media/api2.go?action=multiAction&field={"noDependActions":[{"action":"getAccount"}]}';
			}else{
				//出版购买
				self.url = '/media/api2.go?action=multiAction&field={"noDependActions":[{"action":"getEbookOrderFlowV2","params":{"productIds":"'+self.productIds+'"}},{"action":"getAccount"},{"action":"getValidCoupon","params":{"isPaperBook":"false"}},{"action":"getDdMoneyList"}]}';
			}
			self.render();
		},
		render:function(){
			var self = this;
			$.ajax({
		        method:'POST',
		        url:self.url + ddbase.setBaseApiParams(),
		        success:function(response){
			    	if(parseInt(response.status.code) == 0){
			    		if(self.mediaType === 0 && parseInt(response.data.result.getEbookOrderFlowV2.status.code) == 0){
			    			self.payable = response.data.result.getEbookOrderFlowV2.data.payable; //支付铃铛数
			    		}else{
			    			self.payable = 0; //支付铃铛数
			    		}
			    		$(self.el).html(_.template(self.template)({data:response.data.result,deviceTypeCodes:self.devicetypecodes,price:self.price}));
			    		if(self.callback){
			    			self.callback();
			    		}else{
			    			$('.load_module').hide();
        					$('.payment_popUp_module').show();
			    		}
			    	}else{
			    		alert('购买失败，请稍后重试！');
			    	}
		        }
	        })
			
		},
		showMore:function(event){
			//显示更多礼券
			var domEl = $(event.currentTarget);
			var container = domEl.parent().parent().parent();
			if(domEl.find('.down').length > 0){
				domEl.find('.down').addClass('up').removeClass('down');
				container.find('.detail_list').show();
			}else{
				domEl.find('.up').addClass('down').removeClass('up');
				container.find('.detail_list').hide();
			}
		},
		purchaseBook:function(event){
			var domEl = $(event.currentTarget);
			var productIds = ddbase.getQueryString('id');
			var cId = ddbase.getQueryString('cId') || '';
			if(domEl.hasClass('rechargeBtn')){
				//充值并购买
				window.location = 'recharge_methord_page.html?productIds='+productIds+'&cId='+cId;
			}else{
				//购买
				//显示遮罩层
				$('.load_module').show();
				$('body').css({'overflow-y':'hidden'});

				var self = this;
				//购买
				var style = $('input[name="payment"]:checked').attr('data-role');

				//购物车支付
				if(productIds == null){
					//快速支付
					productIds = $('#productIds').val();
				}
				if(style == 'account'){
					//虚拟支付
					if(self.mediaType === 2){
						//出版物
						purchaseEbookVirtualPaymentForPC({products:productIds,dayNum:0,isAppendBorrow:false,orderSource:77000,fromPlatform:307,cId:cId,callback:self.hideLoadMash});
					}
					if(self.mediaType === 1){
						//原创
						var mediaId = ddbase.getQueryString('mediaId');
						var cId = ddbase.getQueryString('cId') || '';
						if(mediaId == null){
							ddbase.setMessageTip('参数错误！');
							return;
						}

						buyMedia({saleId:productIds,mediaId:mediaId,cId:cId,fromPlatform:306,callback:self.hideLoadMash});
					}
				}
				if(style == 'ddMoney'){
					//礼品卡支付
					useDdMoney({products:productIds,orderSource:77000,fromPlatform:307,order_sequence_id:'0_98',amount:(parseInt(self.payable)/100),isPaperBook:false,oneKeyBuy:false,callback:self.hideLoadMash});
				}
				if(style == 'couponMoney'){
					var coupon = $('input[name="validCoupon"]:checked');
					if(coupon.length == 0){
						self.hideLoadMash()
						alert('请选择礼券!');
					}else{
						//礼券支付
						useCoupon({products:productIds,orderSource:77000,fromPlatform:307,oneKeyBuy:false,order_sequence_id:'0_98',couponCode:coupon.attr('data-role'),barginTotal:(parseInt(self.payable)/100),callback:self.hideLoadMash});
					}
				}
			}
		},
		hideLoadMash:function(){
			//隐藏遮罩层
			$('.load_module').hide();
			$('.payment_popUp_module').hide();
			$('body').css({'overflow-y':''});
		},
		selectPayMethord:function(event){
			var domEl = $(event.currentTarget);
			$('input').removeAttr("checked");
			domEl[0].checked = true;
			if(domEl.attr('name') == 'validCoupon'){
				$('input[data-role="couponMoney"]')[0].checked = true;
			}
		},
		hidePopModule:function(event){
			var domEl = $(event.currentTarget);
			domEl.parent().parent().parent().hide();
		}
	})
	return payMethordModule;
});
define('publicGetData',["jquery",'ddbase',"underscore"],function ($,ddbase,underscore) {
	//通用获得数据方法
	var publicGetData = function(option){
    	var self = this;
    	self.url = option.url;
    	self.el = option.el;
    	self.template = option.template;
    	$.ajax({
	        method:'POST',
	        url:self.url + ddbase.setBaseApiParams(),
	        success:function(response){
		    	if(parseInt(response.status.code) == 0){
		    		$(self.el).html(_.template(self.template)({data:response.data}));
		    	}
	        }
        })
    }
	 
	return publicGetData;
});
require(["jquery","ddbase","publicMethod","getEbookOrderFlowV3","getProductTotalCount","loginModule","payMethordModuleTemplate","payMethordModule","publicGetData"],function($,ddbase,publicMethod,getEbookOrderFlowV3,getProductTotalCount,loginModule,payMethordModuleTemplate,payMethordModule,publicGetData){
	//未登录状态
	var sessionId = ddbase.token();
    if(sessionId == ''){
        loginModule();
    }

    //通用方法
    publicMethod.init();

    //图书列表初始化
   //listShoppingCart.init({el:$('.book_list_modlue'),template:$('#bookList_template').html()});
   getEbookOrderFlowV3.init({el:$('.book_list_modlue'),template:$('#bookList_template').html()});
   $('body').delegate('.three_col_books_module .more','click',function(){
      $('.three_col_books_module .books_container').css({'height':'auto'});
   })

   //支付方式
   var productIds = ddbase.getQueryString('productIds');
   var payMethord = new payMethordModule.view({template:payMethordModuleTemplate,el:$('.pay_methord_container'),productIds:productIds,mediaType:2});

   //温馨提示
   var commentTemplate = '<%var jsonFormatString = data.block.replace(/<br \\/>/gi, "::").replace(/<[^>]+>|\\s|\\\\/gi, "");%><%=JSON.parse(jsonFormatString).msg.replace(/::/gi, "<br>")%>';
   publicGetData({url:'/media/api2.go?action=block&code=pay_method_msg',el:$('.recharge_comment .msg'),template:commentTemplate});
});
define("pay_methord", function(){});

