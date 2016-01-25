local common = require "common"
local redis = require "redis_common"

local ngx_log = ngx.log
local ngx_INFO = ngx.INFO


local r_red = redis.get_r_redis()

local args = ngx.req.get_uri_args()
local key = args["action"]..":"..args["mediaId"]

local getBuyAlsoBuy_value = redis.get_redis(r_red, key)
if getBuyAlsoBuy_value == '' then
	ngx_log(ngx_INFO, "getBuyAlsoBuy cache value empty!")

	--����http�ӿ�
	common.read_http(args)
	local common_tab = common.common_tab
	getBuyAlsoBuy_value = common_tab["http_body"]

	if getBuyAlsoBuy_value ~= nil or getBuyAlsoBuy_value ~= ngx.null then
		local w_red = redis.get_w_redis()
		redis.set_redis(w_red, key, getBuyAlsoBuy_value)
		redis.expire_redis(w_red, key)
		redis.close_redis(w_red)
	end
else
	redis.close_redis(r_red)
end

ngx.say(getBuyAlsoBuy_value)


