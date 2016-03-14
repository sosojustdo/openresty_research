local common = require "common"

--书籍章节直接调用http接口
--[[
local args = ngx.req.get_uri_args()
common.read_http(args)

local common_tab = common.common_tab
local getPublishedContents_value = common_tab["http_body"]

ngx.say(getPublishedContents_value)
]]

local args = ngx.req.get_uri_args()
local v = common.share_dict_get("getPublishedContents:"..tostring(args["id"]))
if v == nil then
	common.read_http(args)
	local common_tab = common.common_tab
	v = common_tab["http_body"]
	if v ~= nil then
		common.share_dict_set("getPublishedContents:"..tostring(args["id"]), v, 600)
	end
end
ngx.say(v)
