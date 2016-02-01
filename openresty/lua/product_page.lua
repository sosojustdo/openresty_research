local common = require "common"
local json = require "json_common"
local template = require "resty.template"
--关闭模板缓存
template.caching(false)

local ngx_log = ngx.log
local ngx_ERR = ngx.ERR
local args = ngx.req.get_uri_args()

--校验请求参数
local flag = common.check_params(args)
if not flag then
	return ngx.redirect("http://k.dangdang.com", ngx.HTTP_MOVED_TEMPORARILY)
end

--登录token
local token = common.getToken()
--公共参数tab
local params_tab = common.common_tab
--销售主体id
local saleId = params_tab["saleId"]
--单品id
local mediaId = params_tab["mediaId"]
--单品类型
local mediaType = params_tab["mediaType"]

--getMedia http interface params table
local getMediaTable = {action="getMedia",
	deviceSerialNo = "html5",
	macAddr = "html5",
	channelType = "html5",
	clientVersionNo = "5.0.0",
	platformSource = "DDDS-P",
	fromPlatform = "106",
	deviceType = "pconline",
	saleId = saleId
}
if token then
	getMediaTable["token"] = token
end


--getMediaCategorySaleTopn http interface params table
local getMediaCategorySaleTopnTable = {action="getMediaCategorySaleTopn",
	num = "4",
	deviceSerialNo = "html5",
	macAddr = "html5",
	channelType = "html5",
	clientVersionNo = "5.0.0",
	platformSource = "DDDS-P",
	fromPlatform = "106",
	deviceType = "pconline",
	mediaType = mediaType,
	mediaId = mediaId
}
if token then
	getMediaCategorySaleTopnTable["token"] = token
end


--getViewAlsoView http interface params table
local getViewAlsoViewTable = {action="getViewAlsoView",
	start = "0",
	needPrice = "1",
	deviceSerialNo = "html5",
	macAddr = "html5",
	channelType = "html5",
	clientVersionNo = "5.0.0",
	platformSource = "DDDS-P",
	fromPlatform = "106",
	deviceType = "pconline",
	mediaId = mediaId
}
getViewAlsoViewTable["end"] = "3"
if token then
	getViewAlsoViewTable["token"] = token
end


--hotChannel http interface params table
local hotChannelTable = {action="hotChannel",
	start = "0",
	deviceSerialNo = "html5",
	macAddr = "html5",
	channelType = "html5",
	clientVersionNo = "5.0.0",
	platformSource = "DDDS-P",
	fromPlatform = "106",
	deviceType = "pconline",
	mediaId = mediaId
}
hotChannelTable["end"] = "1"
if token then
	hotChannelTable["token"] = token
end


--getBuyAlsoBuy http interface params table
local getBuyAlsoBuyTable = {action="getBuyAlsoBuy",
	start = "0",
	needPrice = "1",
	deviceSerialNo = "html5",
	macAddr = "html5",
	channelType = "html5",
	clientVersionNo = "5.0.0",
	platformSource = "DDDS-P",
	fromPlatform = "106",
	deviceType = "pconline",
	mediaId = mediaId
}
getBuyAlsoBuyTable["end"] = "5"
if token then
	getBuyAlsoBuyTable["token"] = token
end


--queryArticleListV2 http interface params table
local queryArticleListV2Table = {action="queryArticleListV2",
	deviceSerialNo = "html5",
	macAddr = "html5",
	channelType = "html5",
	clientVersionNo = "5.0.0",
	platformSource = "DDDS-P",
	fromPlatform = "106",
	deviceType = "pconline",
	objectId = mediaId
}
if token then
	queryArticleListV2Table["token"] = token
end


--getPublishedContents http interface params table
local getPublishedContentsTable = {action="getPublishedContents",
	deviceSerialNo = "html5",
	macAddr = "html5",
	channelType = "html5",
	clientVersionNo = "5.0.0",
	platformSource = "DDDS-P",
	fromPlatform = "106",
	deviceType = "pconline",
	mediaId = mediaId
}
if token then
	getPublishedContentsTable["token"] = token
end


local res1, res2, res3, res4, res5, res6, res7 = ngx.location.capture_multi{
	{ "/getMedia", {args = getMediaTable} },
	{ "/getMediaCategorySaleTopn", {args = getMediaCategorySaleTopnTable} },
	{ "/getViewAlsoView", {args = getViewAlsoViewTable} },
	{ "/hotChannel", {args = hotChannelTable} },
	{ "/getBuyAlsoBuy", {args = getBuyAlsoBuyTable} },
	{ "/queryArticleListV2", {args = queryArticleListV2Table} },
	{ "/getPublishedContents", {args = getPublishedContentsTable} },
	{ "/header" },
 }

local model_tab = {}

--ngx.say("</br>".."-------------------------------------------- getMedia: ----------------------------------------------------".."</br>")
if res1.status == ngx.HTTP_OK then
	--ngx.say(res1.body)

	local media_obj = json.decode(res1.body)

	local http_status = media_obj.status.code

	if http_status ~= 0 then
		local error_message = media_obj.status.message
		ngx_log(ngx_ERR, "getMedia interface http code:"..http_status.." message:"..error_message)
		media_obj = nil
	end
	model_tab["media_model"] = media_obj
else
	ngx_log(ngx_ERR, "getMedia http response unnormal status is:"..res1.status)
end

--ngx.say("</br>".."-------------------------------------------- getMediaCategorySaleTopn: ----------------------------------------------------".."</br>")
if res2.status == ngx.HTTP_OK then
	--ngx.say(res2.body)

	local media_category_sale_top_obj = json.decode(res2.body)

	local http_status = media_category_sale_top_obj.status.code

	if http_status ~= 0 then
		local error_message = media_category_sale_top_obj.status.message
		ngx_log(ngx_ERR, "getMediaCategorySaleTopn interface http code:"..http_status.." message:"..error_message)
		media_category_sale_top_obj = nil
	end
	model_tab["media_category_sale_top_model"] = media_category_sale_top_obj
else
	ngx_log(ngx_ERR, "getMediaCategorySaleTopn http response unnormal status is:"..res2.status)
end

--ngx.say("</br>".."-------------------------------------------- getViewAlsoView: ----------------------------------------------------".."</br>")
if res3.status == ngx.HTTP_OK then
	--ngx.say(res3.body)

	local view_also_view_obj = json.decode(res3.body)

	local http_status = view_also_view_obj.status.code

	if http_status ~= 0 then
		local error_message = view_also_view_obj.status.message
		ngx_log(ngx_ERR, "getViewAlsoView interface http code:"..http_status.." message:"..error_message)
		view_also_view_obj = nil
	end
	model_tab["view_also_view_model"] = view_also_view_obj
else
	ngx_log(ngx_ERR, "getViewAlsoView http response unnormal status is:"..res3.status)
end

--ngx.say("</br>".."-------------------------------------------- hotChannel: ----------------------------------------------------".."</br>")
if res4.status == ngx.HTTP_OK then
	--ngx.say(res4.body)

	local hot_channel_obj = json.decode(res4.body)

	local http_status = hot_channel_obj.status.code

	if http_status ~= 0 then
		local error_message = hot_channel_obj.status.message
		ngx_log(ngx_ERR, "hotChannel interface http code:"..http_status.." message:"..error_message)
		hot_channel_obj = nil
	end
	model_tab["hot_channel_model"] = hot_channel_obj
else
	ngx_log(ngx_ERR, "hotChannel http response unnormal status is:"..res4.status)
end

--ngx.say("</br>".."-------------------------------------------- getBuyAlsoBuy: ----------------------------------------------------".."</br>")
if res5.status == ngx.HTTP_OK then
	--ngx.say(res5.body)

	local buy_also_buy_obj = json.decode(res5.body)

	local http_status = buy_also_buy_obj.status.code

	if http_status ~= 0 then
		local error_message = buy_also_buy_obj.status.message
		ngx_log(ngx_ERR, "getBuyAlsoBuy interface http code:"..http_status.." message:"..error_message)
		buy_also_buy_obj = nil
	end
	model_tab["buy_also_buy_model"] = buy_also_buy_obj
else
	ngx_log(ngx_ERR, "getBuyAlsoBuy http response unnormal status is:"..res5.status)
end

--ngx.say("</br>".."-------------------------------------------- queryArticleListV2: ----------------------------------------------------".."</br>")
if res6.status == ngx.HTTP_OK then
	--ngx.say(res6.body)

	local article_obj = json.decode(res6.body)

	local http_status = article_obj.status.code

	if http_status ~= 0 then
		local error_message = article_obj.status.message
		ngx_log(ngx_ERR, "getBuyAlsoBuy interface http code:"..http_status.." message:"..error_message)
		article_obj = nil
	end
	model_tab["article_model"] = article_obj
else
	ngx_log(ngx_ERR, "queryArticleListV2 http response unnormal status is:"..res6.status)
end

--ngx.say("</br>".."-------------------------------------------- getPublishedContents: ----------------------------------------------------".."</br>")
if res7.status == ngx.HTTP_OK then
	--ngx.say(res7.body)

	local publish_content_obj = json.decode(res7.body)

	local http_status = publish_content_obj.status.code

	if http_status ~= 0 then
		local error_message = publish_content_obj.status.message
		ngx_log(ngx_ERR, "getPublishedContents interface http code:"..http_status.." message:"..error_message)
		publish_content_obj = nil
	end
	model_tab["publish_content_model"] = publish_content_obj
else
	ngx_log(ngx_ERR, "getPublishedContents http response unnormal status is:"..res7.status)
end

--render html
template.render("product_page.html", model_tab)




