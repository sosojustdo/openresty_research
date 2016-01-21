local template = require("resty.template") 
template.caching(false)
template.render("view.html", { message = "Hello, World! 问题解决" })
