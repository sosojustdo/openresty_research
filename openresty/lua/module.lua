local count = 0
local function hello()
   count = count + 1
   ngx.say("count : ", count)
end

local t = {}
t["a"] = 1
t["b"] = 2
t["c"] = 3



local _M = {
   hello = hello,
   t = t
}

return _M
