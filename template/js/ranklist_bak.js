define('bone',['underscore'],function(_){
	return{
		getQueryString : function(name) {
		    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
		    var r = window.location.search.substr(1).match(reg);
		    if (r != null) {
		        return decodeURIComponent(r[2]);
		    }
		    return null;
		},
		template:function(tmpl,data){
			var compile = _.template(tmpl);
			return compile(data);
		},
		getCookie:function(name){
	        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	        if (arr = document.cookie.match(reg)) {
	            return decodeURIComponent(arr[2]);
	        } else {
	            return null;
	        }
	    },
	    setCookie:function(name,value,time){
	        var exp = new Date();
	        exp.setTime(exp.getTime() + time * 60 * 60 * 1000); //有效期1小时    　　
	        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
	    },
	    delCookie:function(name){
	        var self=this;
	        var exp = new Date();
	        exp.setTime(exp.getTime() - 1);
	        var cval = self.getCookie(name);
	        if (cval != null) {
	            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + "; path=/;domain=dangdang.com";
	        }
	    },
		token:function(){
	        var self=this;
	        var token = self.getCookie("MDD_token");
	        if(token === null){
	            token = "";
	        }
	        return token;
	    },
	    dateFormat: function (date,fmt) { 
		    var format = fmt;
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
		},
		dealTime:function(oldtime){//时间处理，当天显示。。前，一天前显示具体时间
	        var oldtime=parseInt(oldtime)
	        var timeDifference=(new Date()).getTime()-oldtime;
	        var oneDay=24*60*60*1000
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
	    },
	    newDealTime:function(oldtime){//今天昨天显示时分，两天前显示具体时间
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
	            if(nowtimems-oldtimems<24*60*60*1000){
	                return "今天 "+numDeal(oldtimeHours)+":"+numDeal(oldtimeMinutes);
	            }else if(nowtimems-oldtimems>24*60*60*1000 && nowtimems-oldtimems<2*24*60*60*1000){
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
	    },
	    baseApiParams: function(){
            var channelId = this.getQueryString('channelId');
            if(channelId == null){
                channelId = 70000;
            }
            var permanentId = this.getCookie('__permanent_id');
            if(permanentId == null){
                permanentId = "";
            }
            return "&permanentId="+ permanentId +"&returnType=json&channelId="+ channelId +"&clientVersionNo=5.0.0&deviceType=DDDS_ALL";
        }
	}
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
require(['jquery','underscore','bone',"publicHeaderNav","publicHeaderChildnavModule","publicHeadersearch"], function ($,_,bone,publicHeaderNav,publicHeaderChildnavModule,publicHeadersearch) {
    //菜单下拉条
    publicHeaderNav.itHover();
    publicHeaderChildnavModule.itHover();
    //搜索
    publicHeadersearch.getCursor();
    publicHeadersearch.searchBtn();
    var loadMap = {
		'publish':[{
			id:'all_ddds_sale',
			type:'all',
			key:'ddds_sale',
			title:'畅销榜'
		},{
			id:'all_ddds_hotcomments',
			key:'ddds_hotcomments',
			type:'all',
			title:'热评榜',
		},{
			id:'all_ddds_new',
			key:'ddds_new',
			type:'all',
			title:'新书榜'
		},{
			id:'all_ddds_fastrise',
			key:'ddds_fastrise',
			type:'all',
			title:'飙升榜'
		},{
			id:'all_ddds_free',
			key:'ddds_free',
			type:'all',
			title:'免费榜'
		},{
			id:'all_ddds_probation',
			key:'ddds_probation',
			type:'all',
			title:'潜力榜'
		}],
		'original':[{
			id:'vp_sale',
			key:'sale',
			type:'vp',
			title:'女生畅销榜'
		},{
			id:'vp_comment_star',
			key:'comment_star',
			type:'vp',
			title:'女生热评榜'
		},{
			id:'vp_update',
			key:'update',
			type:'vp',
			title:'女生更新榜'
		},{
			id:'np_sale',
			key:'sale',
			type:'np',
			title:'男生畅销榜'
		},{
			id:'np_comment_star',
			key:'comment_star',
			type:'np',
			title:'男生热评榜'
		},{
			id:'np_update',
			key:'update',
			type:'np',
			title:'男生更新榜'
		}]
	} 

	var getParamters = function(item){
		return {
			listType: item.key,
			channelType: item.type,
			permanentId:'20151109120332208112113523718686951',
			returnType:'json',
			channelId:'70000',
			clientVersionNo:'5.0.0',
			deviceType:'DDDS_ALL',
			start:0,
			end:9
		}

	}

	var showTitle = function(type,item){
		var html = bone.template($('#rankTemplate').html(),item);
		$('#'+type+'_Container').append(html);
	}

	var showRank = function(type){
		_.each(loadMap[type],function(item){
			showTitle(type,item);
			$.get('/media/api.go?action=mediaRankingList',getParamters(item),function(response){
				var html = bone.template($('#rankItemsTemplate').html(),_.extend(item,response.data))
				$('#' + item.id).append(html);
			})
		})
		
	}

	$('.leftmenu .level1').bind('click',function(){
		if($(this).hasClass('selected')) return;
		var type = $(this).attr('data-type');
		$('.leftmenu .level1').removeClass('selected');
		$(this).addClass('selected');
		$('.navigation_module .focus').html($(this).text());
		$('.ranks').hide();
		if($('#'+type).length === 1){
			$('#'+type).show();
			return;
		}
		$('.right').append($('<div>').attr({
			'id': type + '_Container',
			'class': 'ranks'
		}));
		showRank(type);
	});

	$('.leftmenu .level2').bind('click',function(){
		var listType = $(this).attr('data-listType');
		var channelType = $(this).attr('data-channelType');
		window.location.href="rank_detail_page.html?listType="+listType+"&channelType="+channelType;
	});

	var from = bone.getQueryString('type');
	if(from) $('.leftmenu [data-type='+from+']').click();
	else $('.leftmenu .level1').first().click();
});
define("ranklist_bak", function(){});

