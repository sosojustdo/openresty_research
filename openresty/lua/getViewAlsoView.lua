local common = require "common"
local redis = require "redis_common"

local ngx_log = ngx.log
local ngx_INFO = ngx.INFO


local r_red = redis.get_r_redis()

local args = ngx.req.get_uri_args()
local key = args["action"]..":"..args["mediaId"]

local getViewAlsoView_value = redis.get_redis(r_red, key)
if getViewAlsoView_value == '' then
	ngx_log(ngx_INFO, "getViewAlsoView cache value empty!")

	--调用http接口
	common.read_http(args)
	local common_tab = common.common_tab
	getViewAlsoView_value = common_tab["http_body"]

	if getViewAlsoView_value ~= nil or getViewAlsoView_value ~= ngx.null then
		local w_red = redis.get_w_redis()
		redis.set_redis(w_red, key, getViewAlsoView_value)
		redis.expire_redis(w_red, key)
		redis.close_redis(w_red)
	end
else
	redis.close_redis(r_red)
end

ngx.say(getViewAlsoView_value)


