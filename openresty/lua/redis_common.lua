local redis = require "resty.redis"

local ngx_log = ngx.log
local ngx_ERR = ngx.ERR

--redis key默认过期时长
local default_expire_time = 3600

--主redis连接信息
local w_ip = "10.255.223.155"
local w_port = 6379

--从redis连接信息
local r_ip = "10.255.223.156"
local r_port = 6380

--获取主redis实例
local function get_w_redis()
	local w_red = redis:new()

	w_red:set_timeout(1000)

	local ok, err = w_red:connect(w_ip, w_port)
	if not ok then
		ngx_log(ngx_ERR, "connect to write redis error:"..err)
		if w_red ~= nil then
			return close_redis(w_red)
		end
	end

	return w_red
end

--获取从redis实例
local function get_r_redis()
	local r_red = redis:new()

	r_red:set_timeout(1000)

	local ok, err = r_red:connect(r_ip, r_port)
	if not ok then
		ngx_log(ngx_ERR, "connect to read redis error"..err)
		if r_red ~= nil then
			return close_redis(r_red)
		end
	end

	return r_red
end

--关闭redis连接
local function close_redis(red)
    if not red then
        return
    end
	if red == nil then
		return
	end
    local ok, err = red:close()
    if not ok then
		ngx_log(ngx_ERR, "close redis error:"..err)
        return
    end
end


--设置key过期时间
local function expire_redis(red, key)
	local ok, err = red:expire(key, default_expire_time)
	if not ok then
		ngx_log(ngx_ERR, "redis expire error:"..err)
		if red ~= nil then
			return close_redis(red)
		end
	end
end


--redis hset
local function hset_redis(red, key, filed, value)
	local ok, err = red:hset(key, filed, value)
	if not ok then
		ngx_log(ngx_ERR, "redis hset error:"..err)
		if red ~= nil then
			return close_redis(red)
		end
	end
end


--redis hget
local function hget_redis(red, key, filed)
	local resp, err = red:hget(key, filed)
	if not resp then
		ngx_log(ngx_ERR, "redis hget error:"..err)
		if red ~= nil then
			return close_redis(red)
		end
	end

	if resp == ngx.null then
		resp = ''
	end

	if resp == nil then
		resp = ''
	end
	return resp
end


--redis set
local function set_redis(red, key, value)
	local ok, err = red:set(key, value)
	if not ok then
		ngx_log(ngx_ERR, "set redis error:"..err)
		if red ~= nil then
			return close_redis(red)
		end
	end
end


--redis get
local function get_redis(red, key)
	local resp, err = red:get(key)
	if not resp then
		ngx_log(ngx_ERR, "redis get error:"..err)
		if red ~= nil then
			return close_redis(red)
		end
	end

	if resp == ngx.null then
		resp = ''
	end

	if resp == nil then
		resp = ''
	end
	return resp
end


local _M = {
    expire_redis = expire_redis,
	hget_redis = hget_redis,
	hset_redis = hset_redis,
	close_redis = close_redis,
	get_r_redis = get_r_redis,
	get_w_redis = get_w_redis,
	set_redis = set_redis,
	get_redis = get_redis,
	default_expire_time = default_expire_time
}

return _M





