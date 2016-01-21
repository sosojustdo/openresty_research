local common = require "common"

local args = ngx.req.get_uri_args()
common.read_http(args)
