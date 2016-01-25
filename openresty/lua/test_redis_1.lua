
local redis = require "redis_common"

local w_red = redis.get_w_redis()

local r_red = redis.get_r_redis()

redis.hset_redis(w_red, "myhash", "1", "myhash 1")
redis.close_redis(w_red)

local value = redis.hget_redis(r_red, "myhash", "1")
redis.close_redis(r_red)
ngx.say("redis hget value is:"..value)
