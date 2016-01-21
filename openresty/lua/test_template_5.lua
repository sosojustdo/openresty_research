local template = require "resty.template"
template.caching(true)
local func     = template.compile("view.html")
local world    = func{ message = "Hello, World!" }
local universe = func{ message = "Hello, Universe!" }
print(world, universe)
