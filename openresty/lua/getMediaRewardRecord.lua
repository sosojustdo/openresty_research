local common = require "common"
--[[
local redis = require "redis_common"
local json = require "json_common"

local ngx_log = ngx.log
local ngx_ERR = ngx.ERR
local ngx_INFO = ngx.INFO


local r_red = redis.get_r_redis()

local args = ngx.req.get_uri_args()
local key = args["action"]..":"..args["saleId"]

local getMediaRewardRecord_value = redis.get_redis(r_red, key)
if getMediaRewardRecord_value == '' then
	ngx_log(ngx_INFO, "getMediaRewardRecord cache value empty!")

	--调用http接口
	common.read_http(args)
	local common_tab = common.common_tab
	getMediaRewardRecord_value = common_tab["http_body"]

	if getMediaRewardRecord_value ~= nil or getMediaRewardRecord_value ~= ngx.null then
		local getMediaRewardRecord_obj = json.decode(getMediaRewardRecord_value)
		local http_status = getMediaRewardRecord_obj.status.code

		if http_status == 0 then
			local w_red = redis.get_w_redis()
			redis.set_redis(w_red, key, getMediaRewardRecord_value)
			redis.expire_redis(w_red, key)
			redis.close_redis(w_red)
		else
			local error_message = getMediaRewardRecord_obj.status.message
			ngx_log(ngx_ERR, "getMediaRewardRecord interface http code:"..http_status.." message:"..error_message)
		end
	end
else
	redis.close_redis(r_red)
end
]]

local args = ngx.req.get_uri_args()
common.read_http(args)

local common_tab = common.common_tab
local getMediaRewardRecord_value = common_tab["http_body"]

ngx.say(getMediaRewardRecord_value)


