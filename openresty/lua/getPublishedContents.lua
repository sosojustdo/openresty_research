local common = require "common"

--�鼮�½�ֱ�ӵ���http�ӿ�
local args = ngx.req.get_uri_args()
common.read_http(args)

local common_tab = common.common_tab
local getPublishedContents_value = common_tab["http_body"]

ngx.say(getPublishedContents_value)
