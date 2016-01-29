local template = require "resty.template"
--¹Ø±ÕÄ£°å»º´æ
template.caching(false)

--render html
template.render("header.html", {})

