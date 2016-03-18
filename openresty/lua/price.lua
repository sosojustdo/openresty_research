local ngx_log = ngx.log
local ngx_ERR = ngx.ERR
local ngx_INFO = ngx.INFO

--[[
@obj: for saleList item table value
example:http://k.dangdang.com/media/api.go?action=getMediaCategorySaleTopn&mediaType=2&num=4&deviceSerialNo=html5&macAddr=html5&channelType=html5&permanentId=20151021114523353364825391080178258&returnType=json&channelId=70000&clientVersionNo=5.0.0&platformSource=DDDS-P&fromPlatform=106&deviceType=pconline&token=2fdff3ea70012776eddf4ccfc89fef65&mediaId=1900098227
--]]
local function dealPrice1(obj)
	-- init priceStr default value:""
	local priceStr = ""
	if obj ~= nil and "table" == type(obj) and obj["mediaList"][1] ~= nil then
		local item_detail = obj["mediaList"][1]
		if item_detail["promotionId"] == 3 or item_detail["freeBook"] == 1 then
			priceStr = "免费"
		else
			if item_detail["mediaType"] == 2 then
				if item_detail["promotionPrice"] ~= nil then 					
					priceStr = "￥"..string.format("%.2f", item_detail["promotionPrice"])
				else
					if item_detail["price"] == nil then
						priceStr = ""
					elseif item_detail["price"] == 0 then
						priceStr = "免费"
					else
						priceStr = "￥"..string.format("%.2f", item_detail["price"]/100)
					end
				end				
			elseif item_detail["mediaType"] == 1 then
				if obj["isSupportFullBuy"] == 1 then
					if item_detail["price"] == nil then
						priceStr = ""
					elseif item_detail["price"] == 0 then
						priceStr = "免费"
					else
						priceStr = item_detail["price"].."铃铛/本"
					end
				else
					if item_detail["priceUnit"] == nil then
						priceStr = ""
					elseif item_detail["priceUnit"] == 0 then
						priceStr = "免费"
					else
						priceStr = item_detail["priceUnit"].."铃铛/千字"
					end
				end
			elseif item_detail["mediaType"] == 3 then
				if item_detail["lowestPrice"] ~= nil then
					if item_detail["lowestPrice"] == 0 then
						priceStr = "免费"
					else
						priceStr = "￥"..string.format("%.2f", (item_detail["lowestPrice"]*100)/100)
					end
				else
					priceStr = "免费"
				end	
			end
		end
	end
	return priceStr
end

--[[
@obj: for mediaList item table value
example:http://k.dangdang.com/media/api.go?action=getViewAlsoView&returnFields=&start=0&needPrice=1&end=3&deviceSerialNo=html5&macAddr=html5&channelType=html5&permanentId=20151021114523353364825391080178258&returnType=json&channelId=70000&clientVersionNo=5.0.0&platformSource=DDDS-P&fromPlatform=106&deviceType=pconline&token=2fdff3ea70012776eddf4ccfc89fef65&mediaId=1900098227
--]]
local function dealPrice2(obj)
	local priceStr = ""
	if obj ~= nil and "table" == type(obj) then
		if obj["promotionId"] == 3 then
			priceStr = "免费"
		else
			if obj["mediaType"] == 2 then
				if obj["promotionPrice"] ~= nil then 
					priceStr = "￥"..string.format("%.2f", obj["promotionPrice"])
				else
					if obj["price"] == nil then
						priceStr = ""
					elseif obj["price"] == 0 then
						priceStr = "免费"
					else
						priceStr = "￥"..string.format("%.2f", obj["price"]/100)
					end
				end								
			elseif obj["mediaType"] == 1 then
				if obj["isSupportFullBuy"] == 1 then
					if obj["price"] == nil then
						priceStr = ""
					elseif obj["price"] == 0 then
						priceStr = "免费"
					else
						priceStr = obj["price"].."铃铛/本"
					end
				else
					if obj["priceUnit"] == nil then
						priceStr = ""
					elseif obj["priceUnit"] == 0 then
						priceStr = "免费"
					else
						priceStr = obj["priceUnit"].."铃铛/千字"
					end
				end
			elseif obj["mediaType"] == 3 then
				if obj["lowestPrice"] ~= nil then 
					if obj["lowestPrice"] == 0 then
						priceStr = "免费"
					else
						priceStr = "￥"..string.format("%.2f", (obj["lowestPrice"]*100)/100)
					end
				else
					priceStr = "免费"
				end				
			end
		end
	end
	return priceStr
end

--[[
@obj: for mediaList item table value
example:http://k.dangdang.com/media/api.go?action=getMediaCategorySaleTopn&mediaType=2&num=4&deviceSerialNo=html5&macAddr=html5&channelType=html5&permanentId=20151021114523353364825391080178258&returnType=json&channelId=70000&clientVersionNo=5.0.0&platformSource=DDDS-P&fromPlatform=106&deviceType=pconline&token=2fdff3ea70012776eddf4ccfc89fef65&mediaId=1900098227
--]]
local function originPrice(obj)
	local originPrice = ""
	if obj ~= nil and "table" == type(obj) then
		if obj["paperBookId"] ~= nil and obj["paperBookId"] ~= "" then
			originPrice = "￥"..string.format("%.2f", obj["paperBookPrice"]/100)
		end
	end
	return originPrice
end


local _M = {
    dealPrice1 = dealPrice1,
	dealPrice2 = dealPrice2,
	originPrice = originPrice
}

return _M

