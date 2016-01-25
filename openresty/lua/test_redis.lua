local function close_redis(red)
    if not red then
        return
    end
    local ok, err = red:close()
    if not ok then
        ngx.say("close redis error : ", err)
    end
end

local redis = require("resty.redis")


local red = redis:new()

red:set_timeout(1000)

local ip = "127.0.0.1"
local port = 6660
local ok, err = red:connect(ip, port)
if not ok then
    ngx.say("connect to redis error : ", err)
    return close_redis(red)
end

local ok, err = red:set("msg", "hello world")
if not ok then
    ngx.say("set msg error : ", err)
    return close_redis(red)
end


local resp, err = red:get("msg")
if not resp then
    ngx.say("get msg error : ", err)
    return close_reedis(red)
end

if resp == ngx.null then
    resp = ''
end
ngx.say("msg : ", resp)

close_redis(red)
