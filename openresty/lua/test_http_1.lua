local http = require("resty.http")  
--创建http客户端实例  
local httpc = http.new()  
  
local resp, err = httpc:request_uri("http://k.dangdang.com", {  
    method = "GET",  
    path = "/media/api2.go?action=getMedia&saleId=1900098227&deviceType=pconline&platformSource=DDDS-P&token=5d8a5630f83759643eeaad6569984efd&clientVersionNo=5.0.0&channelType=html5&macAddr=html5&fromPlatform=106&deviceSerialNo=html5"
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
