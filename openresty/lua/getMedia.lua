local common = require "common"

--涉及到购买，收藏与用户状态, 直接调用http接口
local args = ngx.req.get_uri_args()
common.read_http(args)

local common_tab = common.common_tab
local getMedia_value = common_tab["http_body"]

ngx.say(getMedia_value)









