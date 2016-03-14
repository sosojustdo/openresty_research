local http = require "resty.http"
local ck = require "resty.cookie"

local ngx_log = ngx.log
local ngx_ERR = ngx.ERR
local ngx_INFO = ngx.INFO
local common_tab = {}
local http_uri = "http://10.4.36.37"
local config = ngx.shared.config



local function read_http(args)
	--创建http客户端实例
	local httpc = http.new()

	local http_args = "?"
	for key, val in pairs(args) do
		http_args = http_args..key.."="..val.."&"
	end

	local resp, err = httpc:request_uri(http_uri, {
		method = "GET",
		path = "/media/api2.go"..http_args
	})

	if not resp then
		ngx.say("request error :", err)
		return
	end

	--获取状态码
	ngx.status = resp.status

	--获取响应头
	for k, v in pairs(resp.headers) do
		if k ~= "Transfer-Encoding" and k ~= "Connection" then
			ngx.header[k] = v
		end
	end

	--响应体
	common_tab["http_body"] = resp.body
	ngx.say(resp.body)

	httpc:close()
end


--[[
@params args data type is table
@Deprecated product detail page url changed, example:http://e.dangdang.com/123456.html
--]]
local function check_params(args)
	if type(args) == "table" then
		--table size
		local args_size = 0
		for k,v in pairs(args) do
			args_size = args_size + 1
		end

		if args_size == 0 then
			ngx_log(ngx_ERR, "request params is empty!")
			return false
		else
			--校验mediaType
			if args["mediaType"] then
				--mediaType: 1 or 2
				if args["mediaType"] == "1" or args["mediaType"] == "2" then
					common_tab["mediaType"] = args["mediaType"]
				else
					ngx_log(ngx_ERR, "request param for mediaType:".. args["mediaType"] .." value is invalid!")
					return false
				end
			else
				ngx_log(ngx_ERR, "request param for mediaType is empty!")
				return false
			end

			--校验mediaId
			if args["mediaId"] then
				local mediaId_num = tonumber(args["mediaId"])
				if mediaId_num then
					common_tab["mediaId"] = args["mediaId"]
				else
					ngx_log(ngx_ERR, "request param for mediaId is not be to number!")
					return false
				end
			else
				ngx_log(ngx_ERR, "request param for mediaId is empty!")
				return false
			end

			--校验saleId
			if args["id"] then
				local saleId_num = tonumber(args["id"])
				if saleId_num then
					common_tab["saleId"] = args["id"]
				else
					ngx_log(ngx_ERR, "request param for mediaId is not be to number!")
					return false
				end
			else
				ngx_log(ngx_ERR, "request param for id is empty!")
				return false
			end


		end
	else
		ngx_log(ngx_ERR, "params is:"..args.." type invalid with table data struct!")
		return false
	end
	--print params detail info
	ngx_log(ngx_INFO, "check params successful, request params detail mediaId:["..args["mediaId"].."]; saleId:["..args["id"].."]; mediaType:["..args["mediaType"].."]")
	return true
end

-- get Token
local function getToken()
	local cookie, err = ck:new()
	if not cookie then
		ngx_log(ngx_ERR, "cookie object instance is empty, err:"..err)
		return nil
	end

	-- get single cookie
	local field, err = cookie:get("sessionID")
	if not field then
		ngx_log(ngx_INFO, "cookie with key sessionID value is empty")
		return nil
	end
	ngx_log(ngx_INFO, "cookie with key sessionID value is==>"..field)
	return field
end

--split string
local function lua_string_split(str, split_char)
	if str == nil or split_char == nil then
		return nil
	end
    local sub_str_tab = {};
    while (true) do
        local pos = string.find(str, split_char);
        if (not pos) then
            sub_str_tab[#sub_str_tab + 1] = str;
            break;
        end
        local sub_str = string.sub(str, 1, pos - 1);
        sub_str_tab[#sub_str_tab + 1] = sub_str;
        str = string.sub(str, pos + 1, #str);
    end

    return sub_str_tab;
end

--sub string
local function sub_utf8_string(s, n)
  local dropping = string.byte(s, n+1)
  if not dropping then return s end
  if dropping >= 128 and dropping < 192 then
    return sub_utf8_string(s, n-1)
  end
  return string.sub(s, 1, n)
end

-- share dict set
local function share_dict_set(k, v, expire)
	if k == nil or v == nil or config == nil then
		return false
	end
	if type(k) ~= "string" then
		return false
	end
	if expire ~= nil then 
		config:set(k, v, expire)
	else
		config:set(k, v)
	end	
	
end

-- share dict get
local function share_dict_get(k)
	if k == nil or config == nil then
		return false
	end
	if type(k) ~= "string" then
		return false
	end
	local value, flags = config:get(k)
	return value
end


local _M = {
    read_http = read_http,
	check_params = check_params,
	getToken = getToken,
	lua_string_split = lua_string_split,
	sub_utf8_string = sub_utf8_string,
	share_dict_set = share_dict_set,
	share_dict_get = share_dict_get,
	common_tab = common_tab
}

return _M

