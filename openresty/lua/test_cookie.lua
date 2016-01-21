-- demo for£ºhttps://github.com/cloudflare/lua-resty-cookie
local ck = require "resty.cookie"
local cookie, err = ck:new()
if not cookie then
	ngx.log(ngx.ERR, err)
	return
end

-- get single cookie
local field, err = cookie:get("sessionID")
if not field then
	ngx.log(ngx.ERR, err)
	return
end
ngx.say("sessionID", " => ", field)
