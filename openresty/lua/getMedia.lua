local common = require "common"

--�漰�������ղ����û�״̬, ֱ�ӵ���http�ӿ�
local args = ngx.req.get_uri_args()
common.read_http(args)

local common_tab = common.common_tab
local getMedia_value = common_tab["http_body"]

ngx.say(getMedia_value)









