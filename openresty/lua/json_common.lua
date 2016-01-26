local dkjson = require("resty.dkjson")

local ngx_log = ngx.log
local ngx_ERR = ngx.ERR

--[[
@obj 待转换lua对象
@in_line encode字符是否串缩进成一行
]]
local function encode(obj, in_line)
	local type = type(obj)
	if type ~= "table" then
		ngx_log(ngx_ERR, "json encode with param is not be table data struct!")
		return nil
	end

	if in_line then
		return dkjson.encode(obj, {indent = true})
	else
		return dkjson.encode(obj)
	end
end


local function decode(str)
	local type = type(str)
	if type ~= "string" then
		ngx_log(ngx_ERR, "json decode with param is not be string data struct!")
		return nil
	end
	local obj, pos, err = dkjson.decode(str, 1, nil)
	if err then
		ngx_log(ngx_ERR, "json decode error:"..err)
		return nil
	end
	return obj
end

local _M = {
	encode = encode,
	decode = decode
}

return _M





