local common = require "common"

--涉及到购买，收藏与用户状态, 直接调用http接口
local args = ngx.req.get_uri_args()

common.read_http(args)

local common_tab = common.common_tab
local getMedia_value = common_tab["http_body"]

ngx.say(getMedia_value)


--[[
local v = common.share_dict_get("media:"..tostring(args["id"]))
if v == nil then
	common.read_http(args)
	local common_tab = common.common_tab
	v = common_tab["http_body"]
	if v ~= nil then
		common.share_dict_set("media:"..tostring(args["id"]), v)
	end
end
ngx.say(v)
]]









