local common = require "common"

--涉及到购买，收藏与用户状态, 直接调用http接口
local args = ngx.req.get_uri_args()
common.read_http(args)

local common_tab = common.common_tab
local getMedia_value = common_tab["http_body"]

ngx.say(getMedia_value)


--[[
local media_obj = json.decode(getMedia_value)
local http_status = media_obj.status.code

if http_status ~= 0 then
	local error_message = media_obj.status.message
	ngx_log(ngx_ERR, "getMedia interface http code:"..http_status.." message:"..error_message)
	media_obj = nil
end
]]









