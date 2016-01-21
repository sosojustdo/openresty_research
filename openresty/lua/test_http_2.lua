local resp = ngx.location.capture("/proxy/search", {  
    method = ngx.HTTP_GET,  
    args = {q = "hello"}  
  
})  
if not resp then  
    ngx.say("request error :", err)  
    return  
end  
ngx.log(ngx.ERR, tostring(resp.status))  
  
--获取状态码  
ngx.status = resp.status  
  
--获取响应头  
for k, v in pairs(resp.header) do  
    if k ~= "Transfer-Encoding" and k ~= "Connection" then  
        ngx.header[k] = v  
    end  
end  
--响应体  
if resp.body then  
    ngx.say(resp.body)  
end  
