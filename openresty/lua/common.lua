local ngx_log = ngx.log
local ngx_ERR = ngx.ERR
local ngx_INFO = ngx.INFO
local common_tab = {}
local http_uri = "http://k.dangdang.com"


local function read_http(args)
	local http = require("resty.http")
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
	ngx.say(resp.body)

	httpc:close()
end


--[[
@params args data type is table
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
	local ck = require "resty.cookie"
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



local _M = {
    read_http = read_http,
	check_params = check_params,
	getToken = getToken,
	common_tab = common_tab
}

return _M

