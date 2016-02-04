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
define('productBookCate',["jquery","underscore","backbone",'ddbase'],function ($,_,Backbone,ddbase) {

	var productBookCate = {};
	
     productBookCate.cateModule = Backbone.Model.extend({
    		defaults:{
    			contents:[]  
    	}
    })
	
    productBookCate.cateCollection = Backbone.Collection.extend({
    	model : productBookCate.cateModule
    })

   productBookCate.cateView = Backbone.View.extend({
    	initialize:function(options){
    		var self = this;
    		self.cateEl = options.cateEl;
    		self.dataCataUrl = options.dataCataUrl+"&mediaId="+ddbase.getQueryString("id")+ddbase.baseApiParams;
    		self.cateCollection = new productBookCate.cateCollection();
    		self.cateTemplateInfo = options.cateTemplateInfo;
    		self.render();
    	},
    	render:function(){
    		var self = this;
	    	self.cateCollection.fetch({
	    		url:self.dataCataUrl,
	    		success:function(collection,response){
	    			if(response.status.code == 0){
	    				self.cateCollection.set(response.data.contents);
	    				$(self.cateEl).html(_.template(self.cateTemplateInfo)({data:self.cateCollection}));
	    			}
	    		},
	    		error:function(){

	    		}
	    	});
    	}

    	
    })
    return productBookCate;

});
define('productBookCatelogTemplate',[],function(){
	var catelogTemplate = 
            '<%if(data.length> 0){%>'+
                '<ul class="catalog_ul">'+
                    '<%data.each(function(item){%>'+
                    '<li class="catalog_li">'+
                        '<h3 class="catalog_h3"><%=item.get("name")%></h3>'+
                        '<div class="catalog_div"><%=item.get("content")%></div>'+
                    '</li>'+
                    '<%})%>'+
                '</ul>'+
            '<%}else{%>'+
                '<div class="no_catalog">此书没有目录，精彩内容尽在阅读中</div>'+
            '<%}%>'
     return catelogTemplate;
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
define('collect',['jquery','underscore','ddbase','loginModule'],function($,_,ddbase,loginModule){
	var setting = {};
	var init = function(){
		var template = '<div class="collection" data-isStore ="<%=isStore %>">'+
							'<i class="icon collect"></i>'+
							'<span class="text"><%= isStore == "1" ? "取消收藏" : "收藏" %></span>'+
						'</div>';

		var html = ddbase.template(template,{isStore:setting.isStore});
		$(setting.el).append(html);
		initEvent();

	}

	var initEvent = function(){
		$(setting.el).delegate('.collection','click',function(){
			if(!ddbase.token()){
				loginModule();
				return;
			};
			var $dom = $(this);

			var url = '/media/api2.go?action=dDReaderStoreUpSave&type=media';
			if(setting.isStore == '1') url = '/media/api2.go?action=dDReaderStoreUpCancel&type=media';
			url = url +'&targetIds='+setting.collectId+ddbase.baseApiParams;
			$.get(url,function(response){
				if(response.status.code != 0){
					ddbase.setMessageTip(response.status.message)
				}else{
					if(setting.isStore === '1'){
						setting.isStore = '0';
						$dom.find('.text').text('收藏')
					}else{
						setting.isStore = '1';
						$dom.find('.text').text('取消收藏')
					}
				}
			})
		})
	}

	return {
		render: function(options){
			if(!options.el || !options.collectId) return;
			options.isStore = options.isStore || '0';
			setting = options;
			init();
		}
	}
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
define('share',['qrcode','underscore'],function($,_){

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

	var initEvent = function(){
		$(setting.module.el).delegate('.shareC','mouseover',function(){
			$(this).addClass('focus');
			$(this).find('.sharelist').show();
		})
		$(setting.module.el).delegate('.shareC','mouseout',function(){
			$(this).removeClass('focus');
			$(this).find('.sharelist').hide();
			$(this).find('.weixinC').hide();
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
			if(!options.el) return;
			var template = '<div class="shareC">'+
							'<i class="icon share"></i>分享'+
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
		}
	}
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
/*
    json2.js
    2015-05-03

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse. This file is provides the ES5 JSON capability to ES3 systems.
    If a project might run on IE8 or earlier, then this file should be included.
    This file does nothing on ES5 systems.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 
                            ? '0' + n 
                            : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date 
                    ? 'Date(' + this[key] + ')' 
                    : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint 
    eval, for, this 
*/

/*property
    JSON, apply, call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== 'object') {
    JSON = {};
}

(function () {
    'use strict';
    
    var rx_one = /^[\],:{}\s]*$/,
        rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
        rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
        rx_four = /(?:^|:|,)(?:\s*\[)+/g,
        rx_escapable = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 
            ? '0' + n 
            : n;
    }
    
    function this_value() {
        return this.valueOf();
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function () {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear() + '-' +
                        f(this.getUTCMonth() + 1) + '-' +
                        f(this.getUTCDate()) + 'T' +
                        f(this.getUTCHours()) + ':' +
                        f(this.getUTCMinutes()) + ':' +
                        f(this.getUTCSeconds()) + 'Z'
                : null;
        };

        Boolean.prototype.toJSON = this_value;
        Number.prototype.toJSON = this_value;
        String.prototype.toJSON = this_value;
    }

    var gap,
        indent,
        meta,
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        rx_escapable.lastIndex = 0;
        return rx_escapable.test(string) 
            ? '"' + string.replace(rx_escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string'
                    ? c
                    : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' 
            : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) 
                ? String(value) 
                : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                        ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                        : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (
                                gap 
                                    ? ': ' 
                                    : ':'
                            ) + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (
                                gap 
                                    ? ': ' 
                                    : ':'
                            ) + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                    ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                    : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        };
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            rx_dangerous.lastIndex = 0;
            if (rx_dangerous.test(text)) {
                text = text.replace(rx_dangerous, function (a) {
                    return '\\u' +
                            ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (
                rx_one.test(
                    text
                        .replace(rx_two, '@')
                        .replace(rx_three, ']')
                        .replace(rx_four, '')
                )
            ) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

define("json2", function(){});

define('renew',['jquery','underscore','ddbase','json2'],function($,_,ddbase){
	var setting = {};
	var init = function(){
		var url = '/media/api.go?action=getEbookAppendBorrowRule'+ddbase.baseApiParams;
        // url = '/media/api2.go?action=getEbookAppendBorrowRule&channelId=10020&clientOs=iPhone%20OS9.1&clientVersionNo=5.1.0&deviceSerialNo=7846F2D6-F97B-40F0-B1E3-550DAB4CD981&deviceType=iphone&fromPlatform=101&macAddr=020000000000&orderSource=30000&permanentId=20151127124411216116807875249950073&platform=2&platformSource=DDDS-P&productId=1900010361&resolution=1242x2208&returnType=json&serverVersionNo=1.0&token=6b3022fe0f46f2d3ba9118b9b2cfb2de';
        $.get(url,{
        	productId:setting.productArray[0].productId
        },
        function(response){
        	if(response.status.code != 0){
        		ddbase.setMessageTip('该书暂时不支持续借');
        		return;
        	}
        	setting.data = response.data;
            var html = ddbase.template($('#renewTemplate').html(),response.data);
            $('body').append(html);
        });
		
		$('body').delegate('.window.renew .close','click',hideWin);
		$('body').delegate('.window.renew li','click',renewBook);
	}

	var getIDs = function(){
		var array = [];
		_.each(setting.productArray,function(item){
			if(item.productId) array.push(item.productId);
		})
		return array.join(',');
	}
	var renewBook = function(evt){
		var needMoney = $(this).attr('data-money');
		var dayNum = $(this).attr('data-dayNum');
		var money = setting.data.account.masterAccountMoney + setting.data.account.attachAccountMoney;
		if( money === 0 || needMoney > money){
			var payValue = money - needMoney;
			 window.location.href= 'recharge_methord_page.html?payValue='+payValue;
			 return;
		}
		var url = '/media/api.go?action=purchaseEbookVirtualPayment'+ddbase.baseApiParams;
        var date = new Date().getTime();
        $.get(url,{
        	sign:setting.data.key+getIDs()+date,
        	timestamp:date,
        	fromPlatform:306,
        	isAppendBorrow: true,
        	dayNum:dayNum,
			orderSource:76000,
			platform:2,
			platformSource:'DDDS-P',
			productArray:JSON.stringify(setting.productArray),
			isAppendBorrow:dayNum == '0' ? false :true
        },
        function(response){
        	if(response.status.code != 0){
        		ddbase.setMessageTip('续借失败');
        		return;
        	} 
        	hideWin();
        	setting.callback({buy:dayNum == '0' ? true :false});
        });
	}
	var showWin = function(){
		$('.shadow.renew').show();
		$('.window.renew').show();
	}
	var hideWin = function(){
		$('body').undelegate('.window.renew .close','click');
		$('.shadow.renew').remove();
		$('.window.renew').remove();
	}
	return {
		show: function(options){
			if(!options.productArray || options.productArray.length === 0) return;
			setting.productArray = options.productArray;
			setting.callback = options.callback || function(){ddbase.setMessageTip('续借成功，您可以尽情享受阅读了~')}
			var win = $('.window.renew');
			if(win.length === 0) hideWin();
			init();
		}
	}
});
define('quickPayMethordModuleTemplate',["jquery","underscore","backbone"],function ($,_,Backbone) {
    var quickPayMethordModuleTemplate = '<%var account = data.getAccount.data.account;%>'+
    '<%var accountMoney = parseInt(account.attachAccountMoney)+parseInt(account.masterAccountMoney);%>'+
    '<%var payable = 0;%>'+
    '<%if(data.getEbookOrderFlowV2){%>'+
    '<%payable = parseFloat(data.getEbookOrderFlowV2.data.payable);%>'+
    '<%}else{%>'+
    '<%payable = price;%>'+
    '<%}%>'+
    '<div class="title"><em>需要支付<i><%=payable%>铃铛</i></em></div>'+
    '<h4 class="module_title">请选择支付方式</h4>'+
    '<div class="payment_list">'+
        '<ul>'+
            '<li>'+
                '<div class="sum_line">'+
                    '<span class="left"><input type="radio" name="payment" checked="checked" data-role="account"><i class="icon bell_icon"></i><label for="payment">铃铛</label></span><span class="right">余额：<%=accountMoney%>铃铛</span>'+
                '</div>'+
            '</li>'+
            '<%if(data.getEbookOrderFlowV2){%>'+
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
            '<%}%>'+
        '</ul>'+
    '</div>'+
    '<div class="button_line">'+
    '<%if(accountMoney < payable){%>'+
        '<span class="buy_btn rechargeBtn">充值并购买</span>'+
    '<%}else{%>'+
        '<span class="buy_btn">购买</span>'+
    '<%}%>'+
    '<span class="cancle_btn">以后再买</span>'+
    '</div>'+
    '<p class="payment_comment cf">'+
            '<span>图书支持设备：</span>'+
            '<%if(deviceTypeCodes){%>'+
            '<%var deviceTypes = deviceTypeCodes.split("|");%>'+
            '<%if(_.indexOf(deviceTypes,"ipad") != -1){%>'+
            '<span><i class="icon deviceType ipad_icon"></i><br/>iPad</span>'+
            '<%}%>'+
            '<%if(_.indexOf(deviceTypes,"pconline") != -1){%>'+
            '<span><i class="icon deviceType pc_icon"></i><br/>PC在线</span>'+
            '<%}%>'+
            '<%if(_.indexOf(deviceTypes,"pcdownload") != -1){%>'+
            '<span><i class="icon deviceType pc_down_icon"></i><br/>PC下载</span>'+
            '<%}%>'+
            '<%if(_.indexOf(deviceTypes,"html5") != -1){%>'+
            '<span><i class="icon deviceType touch_icon"></i><br/>触屏版</span>'+
            '<%}%>'+
            '<%if(_.indexOf(deviceTypes,"android") != -1){%>'+
            '<span><i class="icon deviceType android_icon"></i><br/>Android</span>'+
            '<%}%>'+
            '<%if(_.indexOf(deviceTypes,"iphone") != -1){%>'+
            '<span><i class="icon deviceType iphone_icon"></i><br/>iPhone</span>'+
            '<%}%>'+
            '<%if(_.indexOf(deviceTypes,"eink") != -1){%>'+
            '<span><i class="icon deviceType doukan_icon"></i><br/>阅读器</span>'+
            '<%}%>'+
            '<%if(_.indexOf(deviceTypes,"einkd66") != -1){%>'+
            '<span><i class="icon deviceType dktouch_icon"></i><br/>都看阅读器触屏版</span>'+
            '<%}%>'+
            '<%}%>'+
    '</p>';
    
   return quickPayMethordModuleTemplate;
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
define('productBookDetail',["jquery","underscore","backbone",'ddbase','productBookCate','productBookCatelogTemplate','collect','share','appendCartV2','loginModule',"renew","quickPayMethordModuleTemplate","payMethordModule","loginWindow"],function ($,_,Backbone,ddbase,productBookCate,productBookCatelogTemplate,collect,share,appendCartV2,loginModule,renew,quickPayMethordModuleTemplate,payMethordModule,loginWindow) {

	var productBookDetail = {};
	
	productBookDetail.module = Backbone.Model.extend({
        defaults: {
            authorId: "",
			authorPenname: "",
			canBorrow: "",
			category: "",
			categoryIds: "",
			categorys: "",
			chapterCnt: "",
			coverPic: "",
			descs: "",
			fileSize: "",
			freeBook: "",
			freeFileSize: "",
			isChannelMonth: "",
			isChapterAuthority: "",
			isStore: "",
			isSupportDevice: "",
			isWholeAuthority: "",
			isbn: "",
			mediaId: "",
			mediaType: "",
			paperMediaPrice: "",
			paperMediaProductId: "",
			price: "",
			publishDate: "",
			publisher: "",
			saleId: "",
			score: "",
			shelfStatus: "",
			subTitle: "",
			title: "",
			wordCnt: ""
        }
    });

    productBookDetail.view = Backbone.View.extend({
    	initialize:function(options){
    		var self = this;
    		self.el = options.el;
    		self.infoEl = options.infoEl;
    		self.detailEl = options.detailEl;
    		self.dataUrl = options.dataUrl+"&saleId="+self.data.id+ddbase.baseApiParams;
            self.crumbEl = options.crumbEl;
    		self.infoModel = new productBookDetail.module();
    		self.templateInfo = options.templateInfo;
    		self.templateDetail = options.templateDetail;
            self.templateCrumb = options.templateCrumb;
    		self.render();
    	},
        afterRender: function(){
            //分享
            collect.render({
                el:'#collectC',
                isStore: $('#collectC').attr('data-isStore'),
                collectId: ddbase.getQueryString('id')
            });

            share.render({
                el:'#ShareC'
            })
        },
    	render:function(){
    		var self = this;
	    	self.infoModel.fetch({
	    		url:self.dataUrl,
	    		success:function(collection,response){
	    			if(response.status.code == 0){
	    				self.infoModel.set(response.data.mediaSale.mediaList[0]);
	    				$(self.infoEl).html(_.template(self.templateInfo)({data:self.infoModel,ddbase:ddbase,$:$}));
	    				$(self.detailEl).html(_.template(self.templateDetail)({data:self.infoModel,ddbase:ddbase}));
                        $(self.crumbEl).html(_.template(self.templateCrumb)({data:self.infoModel}));
                        window.productDetailReturn = true;
                        window.productPostsNum();
                        self.afterRender();                      
	    			}
	    		},
	    		error:function(){

	    		}
	    	});
    	},
    	events:{
        	"click .product_infortitle_module li": "tab",
        	"click .bookinfor .btn_line .btn" : "btnFn",
            "click .addShopCartBtn":"addShopCart",
            "click #buy_now_button":"quickPayMethord"
    	},
    	tab : function(ev){
    		var that = $(ev.target).parent();
    		var bar = $(that).parents('.product_infortitle_module').find('.bar');
    		var contents = $(that).parents('.product_bookinfor_module').find(".content");
    		var aLi = that.parent().find('li');
    		var i = that.index();
    		var bBtn = true;
    		var iLeft = that.offset().left-that.parent().offset().left+(that.outerWidth()-bar.outerWidth())/2;
    		aLi.removeClass('on');
    		that.addClass('on');
    		contents.hide();
    		contents.eq(i).show();
    		bar.animate({'left':iLeft+'px'},100);
    		if(i == 1 && bBtn){
    			//目录
				var BookCatelogView = new productBookCate.cateView({cateEl:"#catalogBox",dataCataUrl:"/media/api.go?action=getPublishedContents",cateTemplateInfo:productBookCatelogTemplate});
				bBtn = false;
    		}

    	},
    	url:{
    		freeUrl:"/media/api.go?action=freeObtainMedia",
    		borrowUrl:"/media/api.go?action=addAuthorizeEbook"
    	},
        data:{
            id:ddbase.getQueryString("id")
        },
    	btnFn:function(ev){
    		var self = this;
    		var that = $(ev.target);
    		var btnStatus = that.attr('status');
    		if(btnStatus == 'free'){ //免费获取
    			if(ddbase.token() == ""){
    				//跳转登录
    				loginModule();
    			}
    			//获取免费阅读权限
    			self.ajax("Get",self.url.freeUrl,{"mediaId":self.data.id,"platform":"ds_android"},self.btnSuc,self.error,that)
    		}else if(btnStatus == "try"){ //试读
    			//直接去阅读
        
    		}else if(btnStatus == "borrow"){//借阅
    			if(ddbase.token() == ""){
                    //跳转登录
                    loginModule();
                }
    			var dur = parseInt(that.attr("dur"));
				//获取借阅权限
				self.ajax("Get",self.url.borrowUrl,{"mediaId":self.data.id,"deviceType":"iphone","platformSource":"1002","borrowDuration":dur},self.btnSuc,self.error,that)
    			
    			
    		}else if(btnStatus == "reborrow"){//续借

                //续借

                var productId = self.data.id,saleId = self.data.id;
                renew.show({
                    productArray:[{productId:productId,saleId:saleId,cid:''}],
                    callback:function(data){
                        $(this).html($('#bookTemplate').html(),data);
                    }
                });

    		}else if(btnStatus == "readNow"){ //借阅期限内
    			//直接去阅读
               
    		}
    	},
    	ajax:function(type,url,data,suc,err,btn){
            var self = this;
    		$.ajax({
	            type:type,
	            url:url+ddbase.baseApiParams,
	            data:data, 
	            timeout:10000,
	            success:function(response){
                    suc.call(self,response,btn);
	            },
	            error:function(){
	                err(self);
	            }
	        })

    	},
    	btnSuc:function(response,btn){
    		//跳转阅读页面
    		if(response.status.code == 0){
                btn.text("立即阅读").attr({"href":'http://e.dangdang.com/ebook/read.do?productId='+this.data.id,"target":"_blank","status":"readNow"})

    		}else{
                ddbase.setMessageTip(response.status.message);
            }
    		
    	},
    	error : function(){

    	},
        addShopCart:function(event){
            //添加购物车
            if(ddbase.token() == ""){
                showMsgBox('buy_now_button','','',productBookDetail.appendCart); //第1个：按钮id;第3个：登录完进行的操作（url）;第2个：第3个的参数;第4个非必须，回调函数
                return false;
            }else{
                //添加购物车
                productBookDetail.appendCart();
            }
        },
    	quickPayMethord:function(){
            var self = this;
            //立即购买
            if(ddbase.token() == ""){
                showMsgBox('buy_now_button','','',self.quickPayMethord); //第1个：按钮id;第3个：登录完进行的操作（url）;第2个：第3个的参数;第4个非必须，回调函数
                return false;
            }
            var productIds = ddbase.getQueryString('id');
            var selfEl = $('#buy_now_button');
            $('.load_module').show();
            if(productIds != null){
                var payMethord = new payMethordModule.view({template:quickPayMethordModuleTemplate,el:$('.payment_popUp_module .popUp_detail'),productIds:productIds,callback:productBookDetail.showPopModule,devicetypecodes:selfEl.attr('devicetypecodes'),mediaType:2});
            }else{
                $('.load_module').hide();
                ddbase.setMessageTip('参数错误！')
            }
        }
    })
    productBookDetail.showPopModule = function(){
        $('.load_module').hide();
        $('.payment_popUp_module').show();
    }
    productBookDetail.appendCart = function(){
        var cId = ddbase.getQueryString('cId') || ''; //频道id
        //添加购物车
        appendCartV2({productId:$('#productId').val(),saleId:$('#saleId').val(),cId:cId});

    }
    
    return productBookDetail;

});
define('alsoLookTemplate',["jquery","underscore","backbone",],function ($,_,Backbone) {
	var alsoLookTemplate = 
	'<%if(data.length>0){%>'+
		'<div class="product_rectitle_module">大家还在看</div>'+
		'<%data.each(function(item){%>'+
			'<div class="product_reccell_module clearfix">'+
			'<%var link = ddbase.getBookUrl({saleId:item.get("saleId"),mediaId:item.get("mediaId"),mediaType:item.get("mediaType"),productId:item.get("productId")})%>'+
		        '<div class="bookcover"><a href="<%=link%>" target="_blank"><img onerror = "javascript:nofind(this,\'img/book_def_74_105.png\');" src="<%=item.get("coverPic").replace("_aa_cover","_cc_cover")%>" /></a></div>'+
		        '<div class="bookinfo">'+
		            '<div class="title"><a href="<%=link%>" target="_blank" title="<%=item.get("title")%>"><%=item.get("title")%></a></div>'+
		            '<div class="author"><%=item.get("authorPenname")%></div>'+
		            '<div class="price">'+
		            	'<%var price = dealPrice.dealPrice2(item.toJSON())%>'+
			        		'<span class="now"><%=price%></span>'+

						'<%var originPrice = dealPrice.originPrice(item.toJSON())%>'+
						'<%if(originPrice !=""){%>'+
							'|<span class="ori"><%=originPrice%></span>'+
						'<%}%>'+
			        		
		           '</div>'+
		        '</div>'+
		'</div>'+
		'<%})%>'+
	'<%}%>'
	
	
	return alsoLookTemplate;
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
define('productBooklistModule',["jquery","underscore","backbone","ddbase","dealPrice"],function ($,_,Backbone,ddbase,dealPrice) {
	var bookList = {};
	bookList.module = Backbone.Model.extend({
        defaults: {
            mediaList: [
                {
                  authorPenname: "",
				  coverPic: "",
				   mediaId: "",
				   mediaType: "",
				   saleId: "",
				   subTitle: "",
				   title: ""
                }
            ]
        }
    });
    bookList.collection = Backbone.Collection.extend({
    	model : bookList.module
    });
    bookList.view = Backbone.View.extend({
    	initialize:function(options){
    		var self = this;
    		self.el = options.el;
    		self.dataUrl = options.dataUrl+ddbase.baseApiParams+"&mediaId="+ddbase.getQueryString("id");
    		self.template = options.template;
    		self.collection = new bookList.collection();
            self.dataKey = options.dataKey || 'mediaList';
    		self.render();
    	},
    	render:function(){
    		var self = this;
	    	self.collection.fetch({
	    		url:self.dataUrl,
	    		success:function(collection,response){
	    			if(response.status.code == 0){
	    				self.collection.set(response.data[self.dataKey]);
	    				$(self.el).html(_.template(self.template)({data:self.collection,dealPrice:dealPrice,ddbase:ddbase}));
	    			}
	    		},
	    		error:function(){

	    		}
	    	});
    	}
    })
    return bookList;
});
define('productBarTemplate',["jquery","underscore","backbone"],function ($,_,Backbone) {
	var productBarTemplate = '<div class="header">'+
			'<p><%=data.get("barName")%>书吧</p>'+
			'<div class="bar"></div>'+
		'</div>'+
		'<div class="inner clearfix">'+
			'<div class="pic">'+
		    	'<div class="pic_wrap"><img src="<%=data.get("barImgUrl")%>" alt=""></div>'+
		    	'<div class="name">吧主</div>'+
		    '</div>'+
		    '<div class="desc">'+
		    '<% var link = "bar_detail_page.html?barId="+data.get("barId")%>'+
		    	 '<h1 class="title"><a href="<%=link%>"><%=data.get("barName")%></a></h1>'+
		    	  '<div class="content"><a href="<%=link%>"><%=data.get("barDesc")%></a></div>'+
		    '</div>'+
		    '<div class="fans clearfix">'+
		    	'<div class="fans_num">'+
		    		'<i class="icon icon_size_50"></i>'+
		    		'<p class="num">粉丝<%=data.get("memberNum")%></p>'+
		    	'</div>'+
		    	'<a class="bar_write_btn" href="javascript:;" memberStatus=<%=data.get("memberStatus")%> barId=<%=data.get("barId")%> >发帖</a>'+
		    	'<a class="read_more_post" href="bar_detail_page.html?barId=<%=data.get("barId")%>" target="_blank">查看全部帖子</a>'+
		    '</div>'+
		    '<div class="masks" id="mask"></div>'+
			'<div class="pop_enter_wrap" id="enterBar">'+
				'<div class="opacity_border"></div>'+
				'<div class="pop_enter">'+
					'<img src="img/pop_enter_bar.jpg" alt="">'+
					'<p class="pop_btn_line"><a href="javascript:;" class="no pop_btn" status="0">取消</a><a href="javascript:;" class="yes pop_btn" status="1" barId=<%=data.get("barId")%>>加入</a></p>'+
				'</div>'+
			'</div>'+
		'</div>'
	    return productBarTemplate;
});
define('productBarpostsTemplate',["jquery","underscore","backbone"],function ($,_,Backbone) {
	var productBarpostsTemplate = 
	'<%data.each(function(item,j){%>'+
		'<% var barId = item.get("barId")%>'+
		'<% var digestId = item.get("mediaDigestId")%>'+
		'<%var link="post_detail_page.html?barId="+barId+"&digestId="+digestId;%>'+
		'<%if(j<3){%>'+
			'<div class="product_barposts_module clearfix">'+
			    '<div class="pic">'+
			    	'<img src="<%=item.get("userBaseInfo").custImg%>" alt="">'+
			    	'<div class="name"><%=item.get("userBaseInfo").nickName%></div>'+
			    	'<div class="time"><%=ddbase.dealTime(item.get("createDateLong"))%></div>'+
			    '</div>'+
			    '<div class="desc">'+
			        '<div class="post_con">'+
			            '<h1 class="title"><a href="<%=link%>" target="_blank"><%=item.get("title")%></a></h1>'+
			            '<div class="content">'+
			            	'<div class="brief"> <a href="<%=link%>" class="left" target="_blank"><%=item.get("content")%></a>'+
			            	'</div>'+
			            '</div>'+
			            '<%if(item.imgList&&item.get(imgList).length>0){%>'+
			                '<ul class="pic_list clearfix">'+
			                '<%_.each(data.imgList,function(imgdata,i){%>'+
			                    '<%if(i<3){%>'+
			                    	'<li><a href="<%=link%>" target="_blank"><img src="<%=imgdata%>" alt=""></a></li>'+
			                    '<%}%>'+
			                '<%})%>'+
			                '</ul>'+
			            '<%}%>'+
			 		'</div>'+
			        '<div class="community clearfix">'+
			        	'<a href="javascript:;" class="favor" data-praise="false" digestId=<%=item.get("mediaDigestId")%>>'+
			        		'<i class="icon icon_size_20"></i>'+
			        		'<em class="praise_num"><%=item.get("praiseNum")%></em>'+
			        	'</a>'+
			        	'<a href="<%=link%> target="_blank" class="comment">'+
			        		'<i class="icon icon_size_20"></i>'+
			        		'<em><%=item.get("commentNum")%></em>'+
			        	'</a>'+
			        '</div>'+
			    '</div>'+
			'</div>'+	
		'<%}%>'+
		'<%if(length>3&&j==2){%>'+
			'<div class="product_barmore_module"><a href="bar_detail_page.html?barId=<%=barId%>" target="_blank">去看更多帖子</a></div>'+
		'<%}%>'+
	'<%})%>'
	
	return productBarpostsTemplate

});
define('praise',["jquery","ddbase","loginModule"],function($,ddbase,loginModule){
	var praise = {
		init :function(options){
			var self = this;
			self.getData(options);
			var token=ddbase.token();
            if(token==""){
                loginModule();
            }else{
            	self.prasieStart(token);
            }

		},
		getData:function(options){
			var self = this;
			self.data ={
				url : options.url,
				targetId : options.targetId,
				targetSource : options.targetSource,
				el : options.el
			}
			
			self.data.callback=options.callback || function(){};
			
		},
		prasieStart:function(token){
            var self=this;
            var judgePraise=self.data.el.attr('data-praise');
            if(judgePraise == "true"){
                ddbase.setMessageTip("已经赞过了哦，亲。");

            }else{
                self.ajaxFn("GET",self.data.url,{targetId:self.data.targetId,token:token,targetSource:self.data.targetSource},self.praiseSuc,self.praiseFail,self.data.callback);
            }
        },
		ajaxFn : function(type,url,data,suc,err,callback){
            $.ajax({
                type:type,
                url:url+ddbase.setBaseApiParams(),
                data:data,
                timeout:10000,
                success:function(response){
                    suc(response);
                    if(response.status.code===0){
                    	callback();
                    }
                },
                error:function(){
                    err();
                }
            })
        },
        praiseSuc : function(response){
        	var self = praise;
        	var code=response.status.code;
	            if(code===0){
	            	 ddbase.setMessageTip("点赞成功");

	            	self.data.el.attr("data-praise","true");
	            	self.data.el.addClass("praise_suc");
	            	var num = self.data.el.find('.praise_num');
	                if(num.length>0){
	                	num.text(parseInt(num.text())+1)
	                }
	                
	            }else if(code===40010){
	                ddbase.setMessageTip("已经赞过了哦，亲。");
	            }else{
	                 ddbase.setMessageTip("点赞失败!");
	        }
	    },
	    praiseFail : function(){
	    	 ddbase.setMessageTip("网络出错!"); 
	    }
	}

	return praise;
});
define('enterBar',["jquery","ddbase","loginModule"],function($,ddbase,loginModule){
	var enterBar = {
		init :function(options){
			var self= this;
			var token=ddbase.token();
			self.data = {
			   url : options.url,
			   actionType:options.actionType,
               barId:options.barId,
               btn:options.btn,
               callBack:options.callBack || function(){}
			};
			
            if(token==""){
                loginModule();
            }
            self.enterStart(token);
		},
		enterStart:function(token){
            var self=this;
            self.ajaxFn("GET",self.data.url,{barId:self.data.barId,token:token,actionType:self.data.actionType},self.enterSuc,self.enterFail);
            
        },
		ajaxFn : function(type,url,data,suc,err){
            $.ajax({
                type:type,
                url:url+ddbase.setBaseApiParams(),
                data:data,
                timeout:10000,
                success:function(response){
                    suc(response);
                },
                error:function(){
                    err();
                }
            })
        },
        enterSuc : function(response){
        	var self = enterBar;
        	var code=response.status.code;
	            if(code===0){
	            	ddbase.setMessageTip("加入成功");
	            	$(self.data.btn).attr("memberStatus",1);
                    self.data.callBack(self.data.barId);
	            }else if(code = 25015){
	                ddbase.setMessageTip("已经是吧成员!");
	        	}else{
	        		ddbase.setMessageTip("加入失败!");
	        	}
	        	$('#mask').hide();
                $("#enterBar").hide();

	    },
	    enterFail : function(){
	    	ddbase.setMessageTip("网络出错!");
	    }
	};
	
	return enterBar;
    
});
define('post',['jquery','underscore','ddbase','loginModule'], function ($,_,ddbase,loginModule) {
	var setting = {};
	var getContent = function(){
		var ueditor = document.getElementById('ueditorIframe').contentWindow.document.getElementById('ueditor_0').contentWindow.document.body;
		return content = $(ueditor).html();
	}
	var getcardType = function(content){
		var ueditor = document.getElementById('ueditorIframe').contentWindow.document.getElementById('ueditor_0').contentWindow.document.body;
		var text = $(ueditor).text().length;
		var img = $(ueditor).find('img').length;
		if(text && img) return 1;
		if(text > 0 && img == 0) return 0;
		if(text == 0 && img > 0) return 2;
	}
	var getParams = function(){
		var title = $('#postTitle').val();
		var content = getContent();
		var validTitle = title.replace(/\s+/g,'');
		var validContent = content.replace(/<br>|<p>|<\/p>|\s+|(&nbsp;)+/g,'')
		if(!validTitle || !validContent){
			ddbase.setMessageTip('请填写完整');
			return false;
		}
		return {
			barId:setting.barId,
			mediaDigestId:'',
			title:title,
			content:content,
			cardType:getcardType(content), //卡片类型（0:全文字 1:文字加图片 2:全图）（必填）
			actionType:'1'  // 操作类型（1-发帖；2-修改帖子；）（必填）
		}
	}
	var showWin = function(){
		$('.shadow.post').show();
		$('.window.post').show();
	}
	var hideWin = function(){
		$('.shadow.post').hide();
		$('.window.post').hide();
	}
	var init = function(){
		$('body').delegate('.window.post .submitbtn','click',function(){
			var data = getParams();
			if(!data) return;
			$.ajax({
				url:'/media/api.go?action=publishRtfArticle'+ddbase.baseApiParams,
				type:'post',
				data:data,
				success: function(response){
					if(response.status.code == 10003){
						loginModule();
						return;
					}
					if(response.status.code != 0){
						ddbase.setMessageTip(response.status.message+',发帖失败，请修改后重试！');
						return;
					}
					if(setting.callback) setting.callback();
					hideWin();
				}
			});
		});
		$('body').delegate('.window.post .close','click',function(){
			hideWin();
		})
	}
    return {
    	show: function(options){
    		if(!ddbase.token()){
    			loginModule();
    			return;
    		}
    		if(!options.barId) return;
    		setting = options;  
    		if($('.window.post').length === 1) showWin();
    		else{
    			var html = ddbase.template($('#postModuleTemplate').html());
    			$('body').append(html);
    			init();
    		}
    	}
    }
});
define('productBar',["jquery","underscore","backbone","ddbase","praise","enterBar","loginModule","post"],function ($,_,Backbone,ddbase,praise,enterBar,loginModule,post) {
	var bar = {};
	bar.module = Backbone.Model.extend({
        defaults: {
            
        }
    });
    bar.module2 = Backbone.Model.extend({
        defaults: {
            articleNum: "",
            barDesc: "",
            barId: "",
            barImgUrl: "",
            barName: "",
            barStatus: "",
            barType: "",
            createDate: "",
            isActivity: "",
            lastModifiedDate: "",
            memberNum: "",
            memberStatus: ""
        }
    });
    bar.collection = Backbone.Collection.extend({
    	model : bar.module
    });
    bar.view = Backbone.View.extend({
        events :{
            "click .product_barposts_module .favor":"favor",
            "click #bar .bar_write_btn":"writePosts",
            "click #enterBar .pop_btn":"enterBarFn"
        },
        barId:'',
    	initialize:function(options){
    		var self = this;
            self.el = options.el;
    		self.barEl = options.barEl;
            self.postsEl = options.postsEl;
    		self.dataUrl = options.dataUrl+ddbase.baseApiParams+"&objectId="+ddbase.getQueryString("mediaId");
    		self.barTemplate = options.barTemplate;
            self.postsTemplate = options.postsTemplate;
    		self.barModule = new bar.module2();
            self.postsCollections = new bar.collection();
    		self.render();
    	},
    	render:function(){
    		var self = this;
	    	self.barModule.fetch({
	    		url:self.dataUrl,
	    		success:function(collection,response){
	    			if(response.status.code == 0){
                        if(!response.data.barInfo){
                            window.productComNum = 0;
                            $(self.barEl).addClass('no_bar');
                            $(self.barEl).html(_.template('<p class="tips">这里没找到对应吧，可以在当当读书客户端中创建哦！</p>'));
                        }else{
                            self.barModule.set(response.data.barInfo);
                            self.postsCollections.set(response.data.articleList) 
                            $(self.barEl).html(_.template(self.barTemplate)({data:self.barModule}));
                            $(self.postsEl).html(_.template(self.postsTemplate)({data:self.postsCollections,length:response.data.barInfo.articleNum,ddbase:ddbase}));
                            window.productComNum = response.data.barInfo.articleNum;
                        }
                        window.productBarReturn = true;
                        window.productPostsNum()
	    			}
	    		},
	    		error:function(){

	    		}
	    	});

    	},
        favor : function(ev){
            var that = $(ev.target).parent();
            var digestId = that.attr("digestId");
            praise.init({
                url:"/media/api2.go?action=praiseComment&commentType=1&isAnonymous=1",
                targetId:digestId,
                targetSource:1000,
                el: that
            });
        },
        writePosts:function(ev){
            var self = this;
            var that = $(ev.target);
            barId= that.attr('barId');
            var memberStatus = that.attr('memberStatus')
            if(ddbase.token() ==""){
                loginModule();
            }else{
                if(memberStatus == 4){ //非吧成员
                    $('#mask').show();
                    $("#enterBar").show();
                }else{ //吧成员,弹窗发帖
                    self.popWritePost(barId);
                }
            }
            
           
        },
        enterBarFn:function(ev){
            var self = this;
            var that = $(ev.target);
            var status = that.attr("status");
            if(status == 0){
                $('#mask').hide();
                $("#enterBar").hide();
            }else{
                // actionType – 操作类型（1-加入吧 2-退出吧 3-申请吧主）（必填）
                barId = that.attr('barId');
                enterBar.init({
                    url:"/media/api.go?action=barMember",
                    actionType:1,
                    barId:barId,
                    callBack:self.popWritePost,
                    btn:'#bar .bar_write_btn'
                })
            }
        },
        popWritePost:function(id){
            post.show({barId:id})
        }
    })
   
    return bar;
});
define('productAlsoBuyTemplate',["jquery","underscore","backbone"],function ($,_,Backbone) {
var productAlsoBuyTemplate = '<%if(data.length>0){%>'+
		'<div class="product_rectitle_module">买过这本书的人还买过</div>'+
			'<%data.each(function(item){%>'+
			'<div class="product_alsobuycell_module">'+
				'<%var link = ddbase.getBookUrl({saleId:item.get("saleId"),mediaId:item.get("mediaId"),mediaType:item.get("mediaType"),productId:item.get("productId")})%>'+
			   
			        '<div class="bookcover"><a href="<%=link%>" target="_blank"><img onerror = "javascript:nofind(this,\'img/book_def_74_105.png\');" src="<%=item.get("coverPic").replace("_aa_cover","_cc_cover")%>" /></a></div>'+
			        '<p class="title"><a href="<%=link%>" target="_blank" title="<%=item.get("title")%>"><%=item.get("title")%></a></p>'+
			        '<p class="price">'+
			        	'<%var price = dealPrice.dealPrice2(item.toJSON())%>'+
			        	'<span class="now"><%=price%></span>'+

						'<%var originPrice = dealPrice.originPrice(item.toJSON())%>'+
						
						'<%if(originPrice !=""){%>'+
							'|<span class="ori"><%=originPrice%></span>'+
						'<%}%>'+
					'</p>'+
			'</div>'+
		'<%})%>'+
	'<%}%>'

	return productAlsoBuyTemplate;
});
define('productBookInfoTemplate',[],function () {
	var productBookInfoTemplate = '<div class="product_infortitle_module">'+
		'<ul class="nav clearfix">'+
			'<li class="first on"><a href="javascript:;">作品介绍</a></li>'+
			'<li><a href="javascript:;">目录</a></li>'+
			'<li><a href="javascript:;">更多信息</a></li>'+
		'</ul>'+
		'<div class="bar"></div>'+
	'</div>'+
	'<% var desStr=data.get("descs");var desStr = desStr.split(/\\s{3,9}/).join("</p><p>"); desStr = "<p>"+$.trim(desStr)+"</p>"%>'+
	'<div class="content bookDes"><div class="bookDes_inner"><%=desStr%></div></div>'+
	'<div class="content catalog_box" id="catalogBox" style="display:none;">'+
			'<div class="loading"></div>'+
	'</div>'+
	'<div class="content more" style="display:none;">'+
		'<p><b>出版社：</b><%=data.get("publisher")%></p>'+
        '<p><b>出版时间：</b><%=ddbase.dateFormat(data.get("publishDate"),"yyyy-MM-dd")%></p>'+
        '<p><b>ISBN：</b><%=data.get("isbn")%></p>'+
        '<%var size = data.get("wordCnt");if(size>10000){size = (size/10000).toFixed(1) + "万"}%>'+
        '<p><b>字数：</b><%=size%></p>'+
        '<p><b>大小：</b><%=(data.get("fileSize")/1048576).toFixed(1)%>M</p>'+
	'</div>'

	return productBookInfoTemplate;
});
define('productBookDetailTemplate',[],function () {
	 var productBookDetailTemplate = '<div class="bookcover"><img onerror="this.src=\'img/book_def_180_260.png\'"src="<%=data.get("coverPic")%>"></div>'+
	'<div class="bookinfor">'+
		'<div class="title"><%=data.get("title")%><span class="icon">电子书</span></div>'+
		'<div class="star"><span class="starlevel">'+
			'<%var score = ddbase.dealStar(data.get("score"));%>'+
			'<%if(score!=5){%>'+
				'<%var classname = "starlevel_inner_"+score;%>'+
				'<span class="starlevel_inner <%=classname%>"></span>'+
			'<%}else{%>'+
				'<span class="starlevel_inner"></span>'+
			'<%}%>'+
			'</span><i class="num" id="postNum"></i>'+
		'</div>'+
		'<%var size = data.get("wordCnt");if(size>10000){size = (size/10000).toFixed(1) + "万"}%>'+
		'<ul class="publish_infor">'+
			'<li>作  者 ：<%=data.get("authorPenname")%></li>'+
			'<%if(data.get("wordCnt") != ""){%>'+
				'<li>字  数 ：<%=size%></li>'+

			'<%}%>'+
			'<%if(data.get("publisher") != ""){%>'+
				'<li>出版社： <%=data.get("publisher")%></li>'+
			'<%}%>'+
		'</ul>'+
		'<div class="price_line">'+
			'<%var priceStr = "",bellStr="",paperpriceStr="",discountStr = "";%>'+
			'<%if(data.get("freeBook") == 1){%>'+
				'<%priceStr = "免费";bellStr="免费"%>'+
				'<%if(data.get("paperMediaPrice")){%>'+
					'<%paperpriceStr = "¥"+(data.get("paperMediaPrice")/100).toFixed(2);%>'+
				'<%}%>'+
			'<%}else{%>'+
				'<%if(data.get("mediaType") == 2){%>'+
					'<%priceStr = "¥"+(data.get("price")/100).toFixed(2);bellStr=data.get("price");%>'+
					'<%if(data.get("paperMediaPrice")){%>'+
						'<%paperpriceStr = "¥"+(data.get("paperMediaPrice")/100).toFixed(2);%>'+
						'<%var discountNum = ((data.get("price")/data.get("paperMediaPrice"))*10).toFixed(1);%>'+ 
							'<%if(discountNum<1){%>'+
								'<%discountStr = "低于1折"%>'+
							'<%}else{%>'+
								'<%discountStr = discountNum+"折"%>'+
							'<%}%>'+
					'<%}%>'+    
				'<%}%>'+
			'<%}%>'+
			'<span class="red"><%=priceStr%></span><b>|</b><span class="red"><i class="icon bell"></i><%=bellStr%></span>'+
			'<%if(paperpriceStr != ""){%>'+
				'<b>|</b><span class="paperbook">纸书标价：<%=paperpriceStr%></span>'+
			'<%}%>'+
			'<%if(discountStr != ""){%>'+
				'<b>|</b><span class="red percent_off"><%=discountStr%></span>'+
			'<%}%>'+
		'</div>'+
		'<div class="btn_line">'+
			'<%var link = "http://e.dangdang.com/ebook/read.do?productId="+ddbase.getQueryString("id");%>'+
			'<%if(data.get("freeBook") == 1){%>'+
				'<%if(data.get("isWholeAuthority") == 1 ){%>'+           
					'<a href="<%=link%>" class="btn" status="readNow" target="_blank" id="readNow" dd_name="立即阅读">立即阅读</a>'+
				'<%}else{%>'+
					'<a href="javascript:;" class="btn" status="free" id="freeGet" dd_name="免费获取">免费获取</a>'+
				'<%}%>'+
				
			'<%}else{%>'+
				'<%var borrowEndTime = data.get("borrowEndTime");%>'+
				'<%if(data.get("canBorrow") == 1){%>'+
					'<%var duration = data.get("borrowDuration");%>'+
					'<%durDay = duration/1000/60/60/24%>'+
					'<%if(borrowEndTime == undefined){%>'+
						'<a href="javascript:;" class="btn" status="borrow" dur =<%=duration%> id="borrowBtn" dd_name="免费借阅">免费借阅(<%=durDay%>天)</a>'+
						'<a href="javascript:;" class="btn_orange" status="buy" id="buy_now_button" deviceTypeCodes="<%=data.get("deviceTypeCodes")%>" dd_name="购买">购买</a>'+
						'<a href="##" class="shopping_car addShopCartBtn btn_basic" id="addShopCartBtn" dd_name="加入购物车">加入购物车</a>'+
					'<%}else{%>'+
						'<%if((new Date(borrowEndTime)).getTime() - (new Date()).getTime() > 0){%>'+
							'<a href="<%=link%>" class="btn" status="readNow" target="_blank" id="readNowBtn" dd_name="立即阅读">立即阅读</a>'+
						'<%}else{%>'+
							'<a href="javascript:;" class="btn" status="reborrow" id="reborrowBtn" dd_name="续借" >续借</a>'+
							'<a href="javascript:;" class="btn_orange" status="buy" id="buy_now_button" deviceTypeCodes="<%=data.get("deviceTypeCodes")%>" dd_name="购买">购买</a>'+
							'<a href="##" class="shopping_car addShopCartBtn btn_basic" id="addShopCartBtn" dd_name="加入购物车">加入购物车</a>'+
						'<%}%>'+
					'<%}%>'+
				'<%}else{%>'+
					'<%if(data.get("isWholeAuthority") == 1 ){%>'+           
						'<a href="<%=link%>" class="btn" status="readNow" target="_blank" id="readNowBtn" dd_name="立即阅读">立即阅读</a>'+
					'<%}else{%>'+
						'<a href="<%=link%>" class="btn" status="try" target="_blank" id="tryBtn" dd_name="试读">试读</a>'+
						'<a href="javascript:;" class="btn_orange" status="buy" id="buy_now_button" deviceTypeCodes="<%=data.get("deviceTypeCodes")%>" dd_name="购买">购买</a>'+
						'<a href="##" class="shopping_car addShopCartBtn btn_basic" id="addShopCartBtn" dd_name="加入购物车">加入购物车</a>'+
					'<%}%>'+
				'<%}%>'+
			'<%}%>'+
			'<span class="collectSpan clearfix" id="collectC" data-isStore="<%= data.get("isStore")%>" dd_name="收藏"></span>'+
			'<span class="shareSpan"><div id="ShareC" dd_name="分享"></div></span>'+
			'<a href="javascript:;" class="phone" dd_name="在手机上阅读">'+
				'<span class="phone_inner"><i class="icon"></i>在手机上阅读</span>'+
				'<div class="ecode"><span class="arrow"></span><img src="img/ecode.png" alt=""></div>'+
			'</a>'+
			
		'</div>'+
	'</div>'+
	'<input id="productId" type="hidden" value="<%=data.get("mediaId")%>">'+
	'<input id="saleId" type="hidden" value="<%=data.get("saleId")%>">'

	return productBookDetailTemplate;
})
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
define('hotChannel',["jquery","underscore","backbone","ddbase"],function ($,_,Backbone,ddbase) {
	var hotChannel = {};
	hotChannel.module = Backbone.Model.extend({
        defaults: {
            mediaList: [
                {
                  authorPenname: "",
				  coverPic: "",
				   mediaId: "",
				   mediaType: "",
				   saleId: "",
				   subTitle: "",
				   title: ""
                }
            ]
        }
    });
    hotChannel.collection = Backbone.Collection.extend({
    	model : hotChannel.module
    });
    hotChannel.view = Backbone.View.extend({
    	initialize:function(options){
    		var self = this;
    		self.el = options.el;
    		self.dataUrl = options.dataUrl+ddbase.baseApiParams+"&mediaId="+ddbase.getQueryString("id");
    		self.template = options.template;
    		self.collection = new hotChannel.collection();
    		self.render();
    	},
    	render:function(){
    		var self = this;
	    	self.collection.fetch({
	    		url:self.dataUrl,
	    		success:function(collection,response){
	    			if(response.status.code == 0){
	    				self.collection.set(response.data.channelList);
	    				$(self.el).html(_.template(self.template)({data:self.collection}));
	    			}
	    		},
	    		error:function(){

	    		}
	    	});
    	}
    })
    return hotChannel;
});
define('hotChannelTemplate',[],function(){
	var hotChannelTemplate =
	'<%if(data.length>0){%>'+
		'<div class="product_rectitle_module">热门频道</div>'+
		'<div style="margin-left:10px;">'+
		 '<%data.each(function(item){%>'+
			'<div class="hot_channel_list">'+
				'<a href="channeldetail_page.html?cId=<%=item.get("channelId")%>" target="_blank">'+
					'<img src="<%=item.get("icon")%>" alt="">'+
					'<span><%=item.get("subNumber")%>人订阅</span>'+
					'<div class="grey_bg">'+
						'<h4><%=item.get("title")%></h4>'+
						'<p><%=item.get("description")%></p>'+
					'</div>'+
				'</a>'+
			'</div>	'+
		'<%})%>'+
		'</div>'+
	'<%}%>'
	
	return hotChannelTemplate;
})
	
;
define('recommendTopTemplate',["jquery","underscore","backbone"],function ($,_,Backbone) {
	var recommendTopTemplate = '<%if(data.length>0){%>'+

		'<div class="product_rectitle_module">强力推荐</div>'+
		'<%data.each(function(item){%>'+
			'<%var item_detail = item.get("mediaList")[0];%>'+
			'<div class="product_reccell_module clearfix">'+
			'<%var link = ddbase.getBookUrl({saleId:item_detail.saleId,mediaId:item_detail.mediaId,mediaType:item_detail.mediaType,productId:item_detail.productId})%>'+
		        '<div class="bookcover"><a href="<%=link%>" target="_blank"><img onerror = "javascript:nofind(this,\'img/book_def_74_105.png\');" src="<%=item_detail.coverPic.replace("_aa_cover","_cc_cover")%>" /></a></div>'+
		        '<div class="bookinfo">'+
		            '<div class="title"><a href="<%=link%>" target="_blank"  title="<%=item_detail.title%>"><%=item_detail.title %></a></div>'+
		            '<div class="author"><%=item_detail.authorPenname %></div>'+
		            '<div class="price">'+
		            	'<%var price = dealPrice.init(item.toJSON())%>'+
			        		'<span class="now"><%=price%></span>'+
			        		'<%var originPrice = dealPrice.originPrice(item.toJSON().mediaList[0])%>'+
			        		'<%if(originPrice!=""){%>'+
								'|<span class="ori"><%=originPrice%></span>'+
							'<%}%>'+
			        '</div>'+
		        '</div>'+
		'</div>'+
		'<%})%>'+
	'<%}%>'
	
	
	return recommendTopTemplate;
});
define('productBreadCrumbTemplate',[],function () {
	var breadCrumbTemplate = '<a href="index_page.html">当当读书</a>'+
	'<%if(data.get("categoryIds") != undefined && data.get("categoryIds") != ""){%>'+
		'<a href="classification_list_page.html?category=<%=data.get("categoryIds")%>&dimension=dd_sale"><%=data.get("categorys")%></a>'+
	'<%}%>'+
	'<a class="focus"><%=data.get("title")%></a>'

	return breadCrumbTemplate;
});
require(["jquery","productBookDetail","alsoLookTemplate","productBooklistModule","productBarTemplate","productBarpostsTemplate","productBar","productAlsoBuyTemplate","productBookInfoTemplate","productBookCatelogTemplate","productBookDetailTemplate","publicMethod","hotChannel","hotChannelTemplate","recommendTopTemplate","productBreadCrumbTemplate","underscore","ddbase"],function($,productBookDetail,alsoLookTemplate,bookList,productBarTemplate,productBarpostsTemplate,bar,productAlsoBuyTemplate,productBookInfoTemplate,productBookCatelogTemplate,productBookDetailTemplate,publicMethod,hotChannel,hotChannelTemplate,recommendTopTemplate,breadCrumbTemplate,_,ddbase){
	
    publicMethod.init();
	// 图书信息
	// 作品介绍、目录、更多信息
	var BookDetaiView = new productBookDetail.view({el:".product_content_left",infoEl:"#bookInfo",detailEl:"#productBookDetail",crumbEl:"#crumb",dataUrl:"/media/api2.go?action=getMedia&refAction=browse",templateInfo:productBookInfoTemplate,templateDetail:productBookDetailTemplate,templateCrumb:breadCrumbTemplate});
	
	// 强力推荐
	var BookAlsoLookView = new bookList.view({el:"#recommend",dataUrl:"/media/api.go?action=getMediaCategorySaleTopn&mediaType=2&num=4",template:recommendTopTemplate,dataKey:'saleList'})
	// 大家都在看
	var BookAlsoLookView = new bookList.view({el:"#bookAlsoLook",dataUrl:"/media/api.go?action=getViewAlsoView&returnFields=&start=0&needPrice=1&end=3",template:alsoLookTemplate})
	//热门频道
	var hotChannelView = new hotChannel.view({el:"#hotChannel",dataUrl:"/media/api.go?action=hotChannel&start=0&end=1",template:hotChannelTemplate})

	// 买过此书的人还买过
	var BookAlsoBuyView = new bookList.view({el:"#bookAlsoBuy",dataUrl:"/media/api.go?action=getBuyAlsoBuy&returnFields=&start=0&end=5&needPrice=1",template:productAlsoBuyTemplate})

	//书吧
	var barView = new bar.view({el:"#barModule",barEl:"#bar",postsEl:"#barposts",dataUrl:"/media/api.go?action=queryArticleListV2",barTemplate:productBarTemplate,postsTemplate:productBarpostsTemplate})

	// 支持设备类型
	var deviceTemplate=_.template($("#product_device").html())
	$('.product_device_wrap').html(deviceTemplate({ddbase:ddbase}));
});
define("product", function(){});

