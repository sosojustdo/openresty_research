local common = require "common"

--�漰�������ղ����û�״̬, ֱ�ӵ���http�ӿ�
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









