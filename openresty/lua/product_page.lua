local common = require "common"

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


local res1, res2, res3, res4, res5, res6 = ngx.location.capture_multi{
	{ "/getMedia", {args = getMediaTable} },
	{ "/getMediaCategorySaleTopn", {args = getMediaCategorySaleTopnTable} },
	{ "/getViewAlsoView", {args = getViewAlsoViewTable} },
	{ "/hotChannel", {args = hotChannelTable} },
	{ "/getBuyAlsoBuy", {args = getBuyAlsoBuyTable} },
	{ "/queryArticleListV2", {args = queryArticleListV2Table} },
 }

ngx.say("</br>".."-------------------------------------------- getMedia: ----------------------------------------------------".."</br>")
if res1.status == ngx.HTTP_OK then
	ngx.say(res1.body)
end

ngx.say("</br>".."-------------------------------------------- getMediaCategorySaleTopn: ----------------------------------------------------".."</br>")
if res2.status == ngx.HTTP_OK then
	ngx.say(res2.body)
end

ngx.say("</br>".."-------------------------------------------- getViewAlsoView: ----------------------------------------------------".."</br>")
if res3.status == ngx.HTTP_OK then
	ngx.say(res3.body)
end

ngx.say("</br>".."-------------------------------------------- hotChannel: ----------------------------------------------------".."</br>")
if res4.status == ngx.HTTP_OK then
	ngx.say(res4.body)
end

ngx.say("</br>".."-------------------------------------------- getBuyAlsoBuy: ----------------------------------------------------".."</br>")
if res5.status == ngx.HTTP_OK then
	ngx.say(res5.body)
end

ngx.say("</br>".."-------------------------------------------- queryArticleListV2: ----------------------------------------------------".."</br>")
if res6.status == ngx.HTTP_OK then
	ngx.say(res6.body)
end





