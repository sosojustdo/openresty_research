local common = require "common"
--[[
local redis = require "redis_common"
local json = require "json_common"

local ngx_log = ngx.log
local ngx_ERR = ngx.ERR
local ngx_INFO = ngx.INFO


local r_red = redis.get_r_redis()

local args = ngx.req.get_uri_args()
local key = args["action"]..":"..args["mediaId"]

local getBuyAlsoBuy_value = redis.get_redis(r_red, key)
if getBuyAlsoBuy_value == '' then
	ngx_log(ngx_INFO, "getBuyAlsoBuy cache value empty!")

	--调用http接口
	common.read_http(args)
	local common_tab = common.common_tab
	getBuyAlsoBuy_value = common_tab["http_body"]

	if getBuyAlsoBuy_value ~= nil or getBuyAlsoBuy_value ~= ngx.null then
		local getBuyAlsoBuy_obj = json.decode(getBuyAlsoBuy_value)
		local http_status = getBuyAlsoBuy_obj.status.code

		if http_status == 0 then
			local w_red = redis.get_w_redis()
			redis.set_redis(w_red, key, getBuyAlsoBuy_value)
			redis.expire_redis(w_red, key)
			redis.close_redis(w_red)
		else
			local error_message = getBuyAlsoBuy_obj.status.message
			ngx_log(ngx_ERR, "getBuyAlsoBuy interface http code:"..http_status.." message:"..error_message)
		end
	end
else
	redis.close_redis(r_red)
end


local args = ngx.req.get_uri_args()

common.read_http(args)

local common_tab = common.common_tab
local getBuyAlsoBuy_value = common_tab["http_body"]

ngx.say(getBuyAlsoBuy_value)
]]

local args = ngx.req.get_uri_args()
local v = common.share_dict_get("getBuyAlsoBuy:"..tostring(args["id"]))
if v == nil then
	common.read_http(args)
	local common_tab = common.common_tab
	v = common_tab["http_body"]
	if v ~= nil then
		common.share_dict_set("getBuyAlsoBuy:"..tostring(args["id"]), v, 600)
	end
end
ngx.say(v)



