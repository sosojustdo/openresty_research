local common = require "common"

--书籍章节直接调用http接口
local args = ngx.req.get_uri_args()
common.read_http(args)

local common_tab = common.common_tab
local getPublishedContents_value = common_tab["http_body"]

ngx.say(getPublishedContents_value)
