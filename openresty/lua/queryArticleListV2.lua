local common = require "common"
--[[
local redis = require "redis_common"
local json = require "json_common"

local ngx_log = ngx.log
local ngx_ERR = ngx.ERR
local ngx_INFO = ngx.INFO


local r_red = redis.get_r_redis()

local args = ngx.req.get_uri_args()
local key = args["action"]..":"..args["objectId"]

local queryArticleListV2_value = redis.get_redis(r_red, key)
if queryArticleListV2_value == '' then
	ngx_log(ngx_INFO, "queryArticleListV2 cache value empty!")

	common.read_http(args)
	local common_tab = common.common_tab
	queryArticleListV2_value = common_tab["http_body"]

	if queryArticleListV2_value ~= nil or queryArticleListV2_value ~= ngx.null then
		local queryArticleListV2_obj = json.decode(queryArticleListV2_value)
		local http_status = queryArticleListV2_obj.status.code

		if http_status == 0 then
			local w_red = redis.get_w_redis()
			redis.set_redis(w_red, key, queryArticleListV2_value)
			redis.expire_redis(w_red, key)
			redis.close_redis(w_red)
		else
			local error_message = queryArticleListV2_obj.status.message
			ngx_log(ngx_ERR, "queryArticleListV2 interface http code:"..http_status.." message:"..error_message)
		end
	end
else
	redis.close_redis(r_red)
end
]]

local args = ngx.req.get_uri_args()
common.read_http(args)

local common_tab = common.common_tab
local queryArticleListV2_value = common_tab["http_body"]

ngx.say(queryArticleListV2_value)


