local common = require "common"
local json = require "json_common"
local template = require "resty.template"
local ngx_log = ngx.log
local ngx_ERR = ngx.ERR
local model_tab = {}

--request params
local args = ngx.req.get_uri_args()

--close template cache
template.caching(true)

--login token
local token = common.getToken()

-- saleId
local saleId = ngx.var.saleId

if saleId == nil then
	return ngx.redirect("/error_page.html", ngx.HTTP_MOVED_TEMPORARILY)
end

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
if token ~= nil then
	getMediaTable["token"] = token
end

local res = ngx.location.capture_multi{
	{ "/getMedia", {args = getMediaTable} },
 }

if res.status == ngx.HTTP_OK then
	local media_obj = json.decode(res.body)
	if media_obj ~= nil then
		local http_status = media_obj.status.code
		if http_status ~= 0 then
			local error_message = media_obj.status.message
			ngx_log(ngx_ERR, "getMedia interface http code:"..http_status.." message:"..error_message)
			return ngx.redirect("/error_page.html")
		else
			model_tab["media_model"] = media_obj
		end
	else
		ngx_log(ngx_ERR, "decode media object error")
		return ngx.redirect("/error_page.html")
	end
else
	ngx_log(ngx_ERR, "getMedia http response unnormal status is:"..res.status)
	return ngx.redirect("/error_page.html")
end


local media = model_tab["media_model"].data.mediaSale.mediaList[1]
local media_type = media["mediaType"]
local media_id = media["mediaId"]

if media_type == 1 then --original_single_page.html
	--getMediaRewardRecord http interface params table
	local getMediaRewardRecordTable = {action="getMediaRewardRecord",
		count = "7",
		deviceSerialNo = "html5",
		macAddr = "html5",
		channelType = "html5",
		clientVersionNo = "5.0.0",
		platformSource = "DDDS-P",
		fromPlatform = "106",
		deviceType = "pconline",
		mediaType = media_type,
		saleId = saleId
	}
	if token then
		getMediaRewardRecordTable["token"] = token
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
		mediaType = media_type,
		mediaId = media_id,
		id = saleId
	}
	if token then
		getMediaCategorySaleTopnTable["token"] = token
	end


	--getMediasByAuthorExceptThis http interface params table
	local getMediasByAuthorExceptThisTable = {action="getMediasByAuthorExceptThis",
		deviceSerialNo = "html5",
		macAddr = "html5",
		channelType = "html5",
		clientVersionNo = "5.0.0",
		platformSource = "DDDS-P",
		fromPlatform = "106",
		deviceType = "pconline",
		mediaType = media_type,
		id = saleId
	}
	if token then
		getMediasByAuthorExceptThisTable["token"] = token
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
		mediaId = media_id,
		id = saleId
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
		objectId = media_id
	}
	if token then
		queryArticleListV2Table["token"] = token
	end
	
	--getAllChapterByMediaId http interface params table
	local getAllChapterByMediaIdTable = {action="getAllChapterByMediaId",
		deviceSerialNo = "html5",
		macAddr = "html5",
		channelType = "html5",
		clientVersionNo = "5.0.0",
		platformSource = "DDDS-P",
		fromPlatform = "106",
		deviceType = "pconline",
		mediaId = media_id,
		id = saleId
	}
	if token then
		getAllChapterByMediaIdTable["token"] = token
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
		mediaId = media_id,
		id = saleId
	}
	getViewAlsoViewTable["end"] = "7"
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
		isRandom = "1",
		mediaId = media_id,
		id = saleId
	}
	hotChannelTable["end"] = "1"
	if token then
		hotChannelTable["token"] = token
	end

local res2, res3, res4, res5, res6, res7, res8, res9 = ngx.location.capture_multi{
	{ "/getMediaRewardRecord", {args = getMediaRewardRecordTable} },
	{ "/getMediasByAuthorExceptThis", {args = getMediasByAuthorExceptThisTable} },
	{ "/getMediaCategorySaleTopn", {args = getMediaCategorySaleTopnTable} },
	{ "/getBuyAlsoBuy", {args = getBuyAlsoBuyTable} },
	{ "/queryArticleListV2", {args = queryArticleListV2Table} },
	{ "/getAllChapterByMediaId", {args = getAllChapterByMediaIdTable} },
	{ "/hotChannel", {args = hotChannelTable} },
	{ "/getViewAlsoView", {args = getViewAlsoViewTable} },
	{ "/header" },
}


if res2.status == ngx.HTTP_OK then
	local media_reward_record_obj = json.decode(res2.body)
	if media_reward_record_obj ~= nil then
		local http_status = media_reward_record_obj.status.code
		if http_status ~= 0 then
			local error_message = media_reward_record_obj.status.message
			ngx_log(ngx_ERR, "getMediaRewardRecord interface http code:"..http_status.." message:"..error_message)
			media_reward_record_obj = nil
		end
		model_tab["media_reward_record_model"] = media_reward_record_obj
	end
else
	ngx_log(ngx_ERR, "getMediaRewardRecord http response unnormal status is:"..res6.status)
end


if res3.status == ngx.HTTP_OK then
	local media_buy_author_exceptthis_obj = json.decode(res3.body)
	if media_buy_author_exceptthis_obj ~= nil then
		local http_status = media_buy_author_exceptthis_obj.status.code
		if http_status ~= 0 then
			local error_message = media_buy_author_exceptthis_obj.status.message
			ngx_log(ngx_ERR, "getMediasByAuthorExceptThis interface http code:"..http_status.." message:"..error_message)
			media_buy_author_exceptthis_obj = nil
		end
		model_tab["media_buy_author_exceptthis_model"] = media_buy_author_exceptthis_obj
	end
else
	ngx_log(ngx_ERR, "getMediasByAuthorExceptThis http response unnormal status is:"..res3.status)
end


if res4.status == ngx.HTTP_OK then
	local media_category_sale_top_obj = json.decode(res4.body)
	if media_category_sale_top_obj ~= nil then
		local http_status = media_category_sale_top_obj.status.code
		if http_status ~= 0 then
			local error_message = media_category_sale_top_obj.status.message
			ngx_log(ngx_ERR, "getMediaCategorySaleTopn interface http code:"..http_status.." message:"..error_message)
			media_category_sale_top_obj = nil
		end
		model_tab["media_category_sale_top_model"] = media_category_sale_top_obj
	end
else
	ngx_log(ngx_ERR, "getMediaCategorySaleTopn http response unnormal status is:"..res2.status)
end


if res5.status == ngx.HTTP_OK then
	local buy_also_buy_obj = json.decode(res5.body)
	if buy_also_buy_obj ~= nil then
		local http_status = buy_also_buy_obj.status.code
		if http_status ~= 0 then
			local error_message = buy_also_buy_obj.status.message
			ngx_log(ngx_ERR, "getBuyAlsoBuy interface http code:"..http_status.." message:"..error_message)
			buy_also_buy_obj = nil
		end
		model_tab["buy_also_buy_model"] = buy_also_buy_obj
	end
else
	ngx_log(ngx_ERR, "getBuyAlsoBuy http response unnormal status is:"..res5.status)
end


if res6.status == ngx.HTTP_OK then
	local article_obj = json.decode(res6.body)
	if article_obj ~= nil then
		local http_status = article_obj.status.code
		if http_status ~= 0 then
			local error_message = article_obj.status.message
			ngx_log(ngx_ERR, "queryArticleListV2 interface http code:"..http_status.." message:"..error_message)
			article_obj = nil
		end
		model_tab["article_model"] = article_obj
	end
else
	ngx_log(ngx_ERR, "queryArticleListV2 http response unnormal status is:"..res6.status)
end

if res7.status == ngx.HTTP_OK then
	local original_chapter_obj = json.decode(res7.body)
	if original_chapter_obj ~= nil then
		local http_status = original_chapter_obj.status.code
		if http_status ~= 0 then
			local error_message = original_chapter_obj.status.message
			ngx_log(ngx_ERR, "getAllChapterByMediaId interface http code:"..http_status.." message:"..error_message)
			original_chapter_obj = nil
		end
		model_tab["original_chapter_model"] = original_chapter_obj
	end
else
	ngx_log(ngx_ERR, "getAllChapterByMediaId http response unnormal status is:"..res7.status)
end

if res8.status == ngx.HTTP_OK then
	local hot_channel_obj = json.decode(res8.body)
	if hot_channel_obj ~= nil then
		local http_status = hot_channel_obj.status.code
		if http_status ~= 0 then
			local error_message = hot_channel_obj.status.message
			ngx_log(ngx_ERR, "hotChannel interface http code:"..http_status.." message:"..error_message)
			hot_channel_obj = nil
		end
		model_tab["hot_channel_model"] = hot_channel_obj
	end
else
	ngx_log(ngx_ERR, "hotChannel http response unnormal status is:"..res8.status)
end

if res9.status == ngx.HTTP_OK then
	local view_also_view_obj = json.decode(res9.body)
	if view_also_view_obj ~= nil then
		local http_status = view_also_view_obj.status.code
		if http_status ~= 0 then
			local error_message = view_also_view_obj.status.message
			ngx_log(ngx_ERR, "getViewAlsoView interface http code:"..http_status.." message:"..error_message)
			view_also_view_obj = nil
		end
		model_tab["view_also_view_model"] = view_also_view_obj
	end
else
	ngx_log(ngx_ERR, "getViewAlsoView http response unnormal status is:"..res9.status)
end

--render original_single_page_.html
template.render("original_single_page_v.html", model_tab)

elseif media_type == 2 then --product_page.html

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
	mediaType = media_type,
	mediaId = media_id,
	id = saleId
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
	mediaId = media_id,
	id = saleId
}
getViewAlsoViewTable["end"] = "7"
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
	isRandom = "1",
	mediaId = media_id,
	id = saleId
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
	mediaId = media_id,
	id = saleId
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
	objectId = media_id
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
	mediaId = media_id,
	id = saleId
}
if token then
	getPublishedContentsTable["token"] = token
end


local res2, res3, res4, res5, res6, res7 = ngx.location.capture_multi{
	{ "/getMediaCategorySaleTopn", {args = getMediaCategorySaleTopnTable} },
	{ "/getViewAlsoView", {args = getViewAlsoViewTable} },
	{ "/hotChannel", {args = hotChannelTable} },
	{ "/getBuyAlsoBuy", {args = getBuyAlsoBuyTable} },
	{ "/queryArticleListV2", {args = queryArticleListV2Table} },
	{ "/getPublishedContents", {args = getPublishedContentsTable} },
	{ "/header" },
 }


if res2.status == ngx.HTTP_OK then
	local media_category_sale_top_obj = json.decode(res2.body)
	if media_category_sale_top_obj ~= nil then
		local http_status = media_category_sale_top_obj.status.code
		if http_status ~= 0 then
			local error_message = media_category_sale_top_obj.status.message
			ngx_log(ngx_ERR, "getMediaCategorySaleTopn interface http code:"..http_status.." message:"..error_message)
			media_category_sale_top_obj = nil
		end
		model_tab["media_category_sale_top_model"] = media_category_sale_top_obj
	end
else
	ngx_log(ngx_ERR, "getMediaCategorySaleTopn http response unnormal status is:"..res2.status)
end


if res3.status == ngx.HTTP_OK then
	local view_also_view_obj = json.decode(res3.body)
	if view_also_view_obj ~= nil then
		local http_status = view_also_view_obj.status.code
		if http_status ~= 0 then
			local error_message = view_also_view_obj.status.message
			ngx_log(ngx_ERR, "getViewAlsoView interface http code:"..http_status.." message:"..error_message)
			view_also_view_obj = nil
		end
		model_tab["view_also_view_model"] = view_also_view_obj
	end
else
	ngx_log(ngx_ERR, "getViewAlsoView http response unnormal status is:"..res3.status)
end


if res4.status == ngx.HTTP_OK then
	local hot_channel_obj = json.decode(res4.body)
	if hot_channel_obj ~= nil then
		local http_status = hot_channel_obj.status.code
		if http_status ~= 0 then
			local error_message = hot_channel_obj.status.message
			ngx_log(ngx_ERR, "hotChannel interface http code:"..http_status.." message:"..error_message)
			hot_channel_obj = nil
		end
		model_tab["hot_channel_model"] = hot_channel_obj
	end
else
	ngx_log(ngx_ERR, "hotChannel http response unnormal status is:"..res4.status)
end


if res5.status == ngx.HTTP_OK then
	local buy_also_buy_obj = json.decode(res5.body)
	if buy_also_buy_obj ~= nil then
		local http_status = buy_also_buy_obj.status.code
		if http_status ~= 0 then
			local error_message = buy_also_buy_obj.status.message
			ngx_log(ngx_ERR, "getBuyAlsoBuy interface http code:"..http_status.." message:"..error_message)
			buy_also_buy_obj = nil
		end
		model_tab["buy_also_buy_model"] = buy_also_buy_obj
	end
else
	ngx_log(ngx_ERR, "getBuyAlsoBuy http response unnormal status is:"..res5.status)
end


if res6.status == ngx.HTTP_OK then
	local article_obj = json.decode(res6.body)
	if article_obj ~= nil then
		local http_status = article_obj.status.code
		if http_status ~= 0 then
			local error_message = article_obj.status.message
			ngx_log(ngx_ERR, "queryArticleListV2 interface http code:"..http_status.." message:"..error_message)
			article_obj = nil
		end
		model_tab["article_model"] = article_obj
	end
else
	ngx_log(ngx_ERR, "queryArticleListV2 http response unnormal status is:"..res6.status)
end


if res7.status == ngx.HTTP_OK then
	local publish_content_obj = json.decode(res7.body)
	if publish_content_obj ~= nil then
		local http_status = publish_content_obj.status.code
		if http_status ~= 0 then
			local error_message = publish_content_obj.status.message
			ngx_log(ngx_ERR, "getPublishedContents interface http code:"..http_status.." message:"..error_message)
			publish_content_obj = nil
		end
		model_tab["publish_content_model"] = publish_content_obj
	end
else
	ngx_log(ngx_ERR, "getPublishedContents http response unnormal status is:"..res7.status)
end

--render product_page_.html
template.render("product_page_v.html", model_tab)

end









