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
define('publish_carousel_module',["jquery"],function($){
	var $dom = $('.carousel_module'),
		len = $dom.find('img[data-index]').length,
		carouselIndex = 0,tid;
	var initEvent = function(){
		$dom.find('img[data-index]').bind('click',function(){
			clearInterval(tid);
			display($(this).attr('data-index'),$(this).attr('data-href'));
			timer();
		})
	}
	var display = function(index,href){
		if (typeof index === 'undefined') carouselIndex ++;
		else carouselIndex = index;
		if (carouselIndex >= len) carouselIndex = 0;
		$dom.find('.shadow').css('top',(15 + 113 * carouselIndex + 'px'));
		var target = $dom.find('[data-index = '+carouselIndex+']');
		var src = target.attr('src');
		if(typeof href === 'undefined') href = target.attr('data-href');
		$dom.find('.zoom a').attr('href',href);
		$dom.find('.zoom img').attr('src',src);
	}
	var timer = function(){
		tid = setInterval(function(){
			display();
		},3000);
	}
	return {
		init:function(){
			timer();
			initEvent();
		}
	}
	
});
define('lazyloadForHover',['jquery'],function($){
	var lazyloadForHover = {};
	lazyloadForHover.init = function(options){
		var self = this;
		self.el = options.el;//外面的元素
		self.tabChange(self.el)
	}

	lazyloadForHover.tabChange = function(obj){
		var parent = $(obj);
		parent.each(function(){
				var tab = $(this).find(".list_title li");
				var content =$(this).find(".list_content");
				var cover= content.find(".nopic");
				content.eq(0).removeClass("hide").children(":first").addClass("current").end().siblings("list_content").addClass("hide");
				var thisImg = content.eq(0).children().eq(0).find('.cover img');
				var dataUrl = thisImg.data("hover");
				thisImg.eq(0).attr('src',dataUrl);
				thisImg.data('status',"1");
				if(tab.length==3){
					tab.hover(function(){
						$(this).addClass("selected").siblings().removeClass("selected");

						switch ($(this).index()){
							case 0:
								content.eq(0).show().siblings(".list_content").hide();
								content.eq(0).children().removeClass("current").eq(0).addClass("current");
								var thisImg = content.eq(0).children().eq(0).find('.cover img');
								var dataUrl = thisImg.data("hover");
								thisImg.eq(0).attr('src',dataUrl);
								thisImg.data('status',"1");
								break;
							case 1:
								content.eq(2).show().siblings(".list_content").hide();
								content.eq(2).children().removeClass("current").eq(0).addClass("current");
								var thisImg = content.eq(2).children().eq(0).find('.cover img');
								var dataUrl = thisImg.data("hover");
								thisImg.eq(0).attr('src',dataUrl);
								thisImg.data('status',"1");
								break;
							case 2:
								content.eq(1).show().siblings(".list_content").hide();
								content.eq(1).children().removeClass("current").eq(0).addClass("current");
								var thisImg = content.eq(1).children().eq(0).find('.cover img');
								var dataUrl = thisImg.data("hover");
								thisImg.eq(0).attr('src',dataUrl);
								thisImg.data('status',"1");					
						}
					})
				}
				if (tab.length!==3){
					tab.hover(function(){
						$(this).addClass("selected").siblings().removeClass("selected");
						var index=$(this).index();
						content.eq(index).show().siblings(".list_content").hide();
						content.eq(index).children().removeClass("current").eq(0).addClass("current");
						var thisImg = content.eq(index).children().eq(0).find('.cover img');
								var dataUrl = thisImg.data("hover");
								thisImg.eq(0).attr('src',dataUrl);
								thisImg.data('status',"1");	
					})
				}
				
				cover.hover(function(){
					$(this).addClass("current").siblings().removeClass("current");
					var thisImg = $(this).find('.cover img');
					var dataUrl = thisImg.data("hover");
					thisImg.eq(0).attr('src',dataUrl);
					thisImg.data('status',"1");	
				})
			})
	}
	return lazyloadForHover;
});
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
define('publishLimitedTemplate',["jquery","underscore","backbone",'ddbase'],function ($,_,Backbone,ddbase) {
    var publishLimitedTemplate = '<% if(data.length>0){%>'+
    '<div class="index_subnav_module">'+
        '<ul class="nav clearfix">'+
            '<li class="first on">'+
                '<a href="morelist_page.html?columnType=pub_limited_free&title=今日限时" target="_blank">今日限时</a>'+
                '<div class="index_time_module"><span class="time">00</span>天<span class="time">00</span>时<span class="time">00</span>分<span class="time">00</span>秒</div>'+
            '</li>'+
        '</ul>'+
        '<div class="bar"></div>'+
        '<ul class="more">'+
            '<li><a href="morelist_page.html?columnType=pub_limited_free&title=今日限时" target="_blank">查看更多</a></li>'+
        '</ul>'+
    '</div>'+
    '<div class="book_wrapper clearfix padding_top_10">'+
       '<%data.each(function(item,i){%>'+
            '<%if(i<6){%>'+
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
    return publishLimitedTemplate;
});
require(['ddbase','publish_carousel_module','lazyloadForHover',"publicTabModule","publicSideCodeModule","limitedFreeModule","add_more","publicMethod","dealPrice","publishLimitedTemplate","lazyload"], function (ddbase,carousel,lazyloadForHover,publicTabModule,publicSideCodeModule,limitedFreeModule,addMore,publicMethod,dealPrice,publishLimitedTemplate,lazyload) {
	
	$(function(){
		//lazyload
	     $(".publish_index img[data-original]").lazyload({
	         effect  : "fadeIn" //加载图片使用的效果(淡入)
	    });
	     $(window).scroll();
	})
	

	publicMethod.init();
	//分类
	publicTabModule.slideTab($('.index_subnav_module'),'only_one','click',$('.index_story .content'));

	$(".public_totop_module").click(function(){
        publicSideCodeModule.toTop();
    })
    $(".public_sideecode_module .close").click(function(){
        publicSideCodeModule.closeCode();
    })
    var host='';
    //限时免费
	var limitedfree = new limitedFreeModule.view({template:publishLimitedTemplate,el:"#limitedFree" ,dataUrl:'/media/api.go?action=freeforlimited&columnType=pub_limited_free&channelType=all&start=0&end=7'});

	carousel.init();
	lazyloadForHover.init({el:".publish_seller_list"});

	var addMoreChannel=new addMore();

	addMoreChannel.init({
		template:"#topic_list",
		container:"#publish_topic_list",
		startNumber:0,
		endNumber:4,
		gapNumber:10,
		distance:100,
		dealMethod:{dealPrice:dealPrice},
		url:"/media/api2.go?action=specialtopichistory"+"&deviceType=DDDS_All"+ddbase.setBaseApiParams(),
		endCallback:function(){
			$("#publish_topic_list").append("<div class='go_for_more' style='clear:both'><a href='javascript:void(0)'>加载完毕</a></div>");
		}
	});

	var hotChannel=new addMore();

	hotChannel.init({
		template:"#hot_channel_temp",
		container:"#hot_channel_list_wrap",
		startNumber:0,
		endNumber:3,
		gapNumber:8,
		distance:100,
		eventName:"scroll",
		url:"/media/api.go?action=hotChannel"+"&deviceType=DDDS_All"+ddbase.setBaseApiParams()
	})

	

	$(window).scroll(function(){
		addMoreChannel.render();
		hotChannel.render();
	})

	
});
define("publish_index", function(){});

