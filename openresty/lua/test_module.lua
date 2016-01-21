local module1 = require("module")

module1.hello()

ngx.say("</br>")

local t1 = module1.t
 for key, val in pairs(t1) do
             if type(val) == "table" then
                 ngx.say(key, ": ", table.concat(val, ", "))
             else
                 ngx.say(key, ": ", val)
             end
         end

ngx.say("</br>"..t1["a"])



local getMediaTable = {action="getMedia",
        deviceSerialNo = "html5",
        macAddr = "html5",
        channelType = "html5",
        clientVersionNo = "5.0.0",
        platformSource = "DDDS-P",
        fromPlatform = "106",
        deviceType = "pconline",
        saleId = saleId
}


getMediaTable["token"]=123

--ngx.say("reqs table is:"..table.nums(getMediaTable))

local http_args = "?"
for key, val in pairs(getMediaTable) do
    http_args = http_args..key.."="..val.."&"
end

ngx.say("http_args:"..http_args)
